var express = require('express');
var router = express.Router();
var shortid = require('shortid')
var productsDb = require('../schema/productsDb');
var ordersDb = require('../schema/ordersDb');
var https = require("https");
var promoCodeModel = require('../schema/promoCodeSchemaDb');
var mailService = require('../services/commonServices');
var emailTemplates = require('./../services/emailTemplates');
const razorPay = require('../razorPay');
const { exception } = require('console');


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.sendFile(path.join(__dirname + '/../views/index.html'));
// });
  var removeEntryFromTempOrder = function(id){
    ordersDb.tempOrderCollection.remove({orderId: id}, function(){})
  }
  var revertSizesInProducts = function(details, i, res) {
    productsDb.productCollection.findOne({ id: details.products[i].productId }, function(err, response) {
      if (err) {
        res.send({ success: false, details: err });
      } else {
        response.sizes[details.products[i].size] = response.sizes[details.products[i].size] + details.products[i].quantity;
        console.log("quantity reverted")
        response.save(function(err, success) {
          if (err) {
            res.send({ success: false, details: err });
          } else {
            //   continue;
          }
        });
      }
    });
  };

router.post('/saveRequestForSize', function(req, res){
    var details = {};
    details.contact = req.body.contact;
    details.productId = req.body.productId;
    details.size = req.body.size;
    var newRequest = new productsDb.requestedProductsCollection(details);

    newRequest.save(function(err, response){
        if(err){
            res.send({success: false, data: err});
        } else{
            res.send({success: true, data: "success"})
        }
    })
})

router.get('/fetchProducts', function(req, res){
  var tags = req.query.tags;
  var pageNumber = req.query.pageNo;
  var itemsPerPage = parseInt(req.query.itemsPerPage)
  var skipProducts = (pageNumber-1)*itemsPerPage;
  if(tags === 'undefined'){
      var tagsArray = [];
  } else{
      var tagsArray = tags.split(',');
  }
  if(tagsArray.length>0){
        productsDb.productCollection.count({'categoryInfo.filters' : {$in: tagsArray}}, function(err, count){
        productsDb.productCollection.find({'categoryInfo.filters' : {$in: tagsArray}}, null, {skip: skipProducts, limit:itemsPerPage, sort:{updatedAt: -1}}, function(err, response){
            if(err){
                res.send({success: false, data: err})
            } else{
                res.send({success: true, products: response, totalCount: count})
            }
        })
    });
} else{
    productsDb.productCollection.count({}, function(err, count){
        productsDb.productCollection.find({}, null, {skip: skipProducts, limit:itemsPerPage, sort:{updatedAt: -1}}, function(err, response){
            if(err){
                res.send({success: false, data: err})
            } else{
                res.send({success: true, products: response, totalCount: count})
            }
        })
    });
}
});
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }
router.get("/getProductDetails", function(req, res){
    var productid = req.query.id;
    productsDb.productCollection.findOne({id: productid}, function(err, response){
        if(err){
            res.send({success: false, data: err});
        } else{
            var currentViews = getRandomInt(0, 15);
            res.send({success: true, productDetails: response, currentViews: currentViews});
        }
    });
    productsDb.productCollection.update({id: productid}, {$inc: {"clicks": 1}}, (err, success)=> {
        // if(err)
        // console.log(err);
        // else console.log(success);
    })
});
router.get('/getOrderDetails', function(req, res){
    var orderId = req.query.orderId;
    ordersDb.placedOrdersCollection.find({orderId: orderId}, function(err, order){
        if(err){
            res.send({success: false, response: err});
        } else{
            res.send({success: true, orderDetails: order});
        }
    })
})
router.post("/fetchAvailableSizes", function(req, res){
    var productidArray = req.body.productIds;
    // mailService.sendMail("contact@orangeclips.com", "subject", "checkout page te aya koi https://www.orangeclips.com/productDetails/"+ productidArray.join(','));
    productsDb.productCollection.find({id: {$in:productidArray}}, 'id sizes',function(err, response){
        if(err){
            res.send({success: false, data: err});
        } else{
            res.send({success: true, result: response, total: response.length});
        }
    });
});
router.post('/saveTempOrder', async function(req, res){
    var details = req.body.details;
    shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_');
    details.orderId = shortid.generate();
    // reduce qauntity of each product
    for (var i = 0; i < details.products.length; i++) {
        (function(i){
            productsDb.productCollection.findOne({id: details.products[i].productId}, function(err, response){
                if(err){
                    res.send({success: false, details: err});
                } else{
                    response.sizes[details.products[i].size] = response.sizes[details.products[i].size] - details.products[i].quantity;
                    response.save(function(err, success) {
                    if (err) {
                        res.send({ success: false, details: err });
                    } else {
                        //   continue;
                    }
                    });
                }
            });
        }(i))
    }
    // razor pay
    var razorPayResponse = null;
    try{
        razorPayResponse = await razorPay.createAnOrderInRazorPay(details.total ,details.orderId);
        if(!razorPayResponse.success){
            throw "failed to store order in razor pay";
        }
    } catch(e) {
        console.log("failed to store order in razor pay", e);
    }

    details.razorPayOrderid = razorPayResponse.order.id;
    // saving ongoing order
    console.log("saving -> ", details);
    var saveIt = ordersDb.tempOrderCollection(details);
    saveIt.save(async function(err, response){
        if (err) {
          res.send({ success: false, response: err });
        } else {
            console.log("tempOrder saved");
            // timeout to remove the temp order if product was not purchased successfully, and restore available count of products
          (function(orderId) {
            setTimeout(function() {
              ordersDb.tempOrderCollection.findOne({ orderId: orderId }, function(err, tempOrder) {
                if (err) {
                } else {
                  var details = tempOrder;
                  if (details !== null) {
                    for (var i = 0; i < details.products.length; i++) {
                      (function(i) {
                        revertSizesInProducts(details, i, res);
                        if (i === details.products.length - 1) {
                          removeEntryFromTempOrder(orderId);
                        }
                      })(i);
                    }
                  }
                }
              });
            }, 1800000);
          })(details.orderId);
          // timeout ends
          res.send({ success: true, response: response });
        }
    });
});
router.post('/placeCodOrder', function(req, response){
    var details = req.body.details;
    shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_');
    details.orderId = shortid.generate();
    var saveIt = ordersDb.placedOrdersCollection(details);
    // reduce quantities
    for (var i = 0; i < details.products.length; i++) {
        (function(i){
            productsDb.productCollection.findOne({id: details.products[i].productId}, function(err, response){
                if(err){
                    res.send({success: false, details: err});
                } else{
                    response.sizes[details.products[i].size] = response.sizes[details.products[i].size] - details.products[i].quantity;
                    response.save(function(err, success) {
                    if (err) {
                        res.send({ success: false, details: err });
                    } else {
                        //   continue;
                    }
                    });
                }
            });
        }(i))
    }
    //
    saveIt.save(function(err, success){
        if(err){
            response.send({success: false, message: "failed to place order"})
        } else{
            var messageBody = "Hi, \nWe know you gonna love our products. Just hold on till we deliver it to you. Total order amount = " + details.amount+".\n You can track your order by clicking below link \n https://orangeclips.com/orderStatus?orderId=" + details.orderId;
            messageBody = encodeURI(messageBody);
            https.get("https://control.msg91.com/api/sendhttp.php?authkey=139030Ag218mR2QtxS59351252&mobiles=" + details.orderedBy.phoneNo + "&message=" + messageBody + "&sender=OCshop&route=4&country=91", function(res) {});
            https.get("https://control.msg91.com/api/sendhttp.php?authkey=139030Ag218mR2QtxS59351252&mobiles=" + '9876665556' + "&message=" + 'Order aa gya 22 oye COD wala' + "&sender=OCshop&route=4&country=91", function(res) {});
            emailTemplates.sendOrderSuccessEmail(success);
            response.send({success: true, message: "order placed successfully", orderid: details.orderId});
        }
    })

})
router.get('/validatePromoCode', function(req, res){
    var promoCode = req.query.promoCode;
    var emailid = req.query.emailId;
    var phoneNo = req.query.phoneNo;
    // mailService.sendMail("contact@orangeclips.com", "subject", promoCode + " promo code v laga lya "+emailid+ " - " +phoneNo +" ne ");
    var totalAmount = parseInt(req.query.totalAmount, 10);
    promoCodeModel.findOne({code: promoCode.toLowerCase()} , (err, result) => {
        if(err){
            res.send({success: false, message: "Error In Finding Promo Code"});
            return;
        }
        if(result){
            if(totalAmount < result.minimumCartAmount){
                var message = "Shop For "+ (result.minimumCartAmount - totalAmount) +" Rs more to use this Promo Code";
                res.send({success: true, codeAccepted: false, message: message});
            } else if(result.reducePriceMethod === "percentage"){
                var updatedAmount  = (totalAmount - (totalAmount * result.reduceAmount)/100 ).toFixed(0);
                res.send({success: true, codeAccepted: true, updatedAmount: updatedAmount, message: "Whoa! You saved "+ (totalAmount - updatedAmount) +" Rs"})
            } else if(result.reducePriceMethod === "amount"){
                var updatedAmount  = (totalAmount - result.reduceAmount).toFixed(0);
                res.send({success: true, codeAccepted: true, updatedAmount: updatedAmount, message: "Whoa! You saved "+ (totalAmount - updatedAmount) +" Rs"})
            }
        } else{
            res.send({success: true, codeAccepted: false, message: "Invalid Promo Code"})
        }
    })
})
module.exports = router;
