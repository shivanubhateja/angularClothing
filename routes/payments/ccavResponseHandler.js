var http = require("http"),
  fs = require("fs"),
  ccav = require("./ccavutil.js"),
  qs = require("querystring");
path = require("path");
ordersDb = require("./../../schema/ordersDb");
productsDb = require("./../../schema/productsDb");
var https = require("https");
var emailTemplates = require('./../../services/emailTemplates');

//
// emailTemplates.sendOrderSuccessEmail({
//       orderId:"1212",
//       products:  [
//         {
//             "productId" : "e2302f4e-4b02-aece-b804-ecb94df9b31a",
//             "quantity" : 1,
//             "size" : "XS",
//             "productDetails" : {
//                 "_id" : "59b42fb51366a13f098be5df",
//                 "id" : "e2302f4e-4b02-aece-b804-ecb94df9b31a",
//                 "fitDescription" : "Slim Fit: Fits closer to the body, take your regular size. Size up if a looser fit is desired",
//                 "materialDescription" : "<div>100% cotton Pique Prewashed to impart a softer texture </div><span><b>WashCare Instructions</b> Machine wash cold Do not bleach or wash with chlorine based detergent or water Wash/dry inside out Do not iron directly on prints Dry promptly in shade Dry on a flat surface as hanging may cause measurement variations Product color may vary little due to photography Wash with similar clothes. <a href=\"/care\"> Know more</a></span>",
//                 "shippingDescription" : "<span>Free Shipping, COD charges applicable.  All products, are applicable for return. Customers can return their order within 15 days of the order delivery. Refunds for returned products will be transfered to same bank account used for payment.</span>",
//                 "name" : "Long T-shirt - goddess1",
//                 "price" : 1,
//                 "mrp" : 1,
//                 "updatedAt" : "2017-09-06T18:30:00.000Z",
//                 "launchedAt" : "2017-09-07T18:30:00.000Z",
//                 "__v" : 0,
//                 "images" : {
//                     "display" : "https://images.bewakoof.com/t540/goddess-t-shirt-dress-women-s-printed-basic-t-shirt-dress-1504171151.jpg",
//                     "additional" : [
//                         "https://images.bewakoof.com/t540/goddess-t-shirt-dress-women-s-printed-basic-t-shirt-dress-1504171151.jpg",
//                         "https://images.bewakoof.com/t540/goddess-t-shirt-dress-women-s-printed-basic-t-shirt-dress-1504171155.jpg",
//                         "https://images.bewakoof.com/t540/goddess-t-shirt-dress-women-s-printed-basic-t-shirt-dress-1504171157.jpg",
//                         "https://images.bewakoof.com/t540/goddess-t-shirt-dress-women-s-printed-basic-t-shirt-dress-1504171159.jpg"
//                     ]
//                 },
//                 "sizes" : {
//                     "XS" : 10,
//                     "S" : 10,
//                     "M" : 10,
//                     "L" : 10,
//                     "XL" : 10,
//                     "XXL" : 1
//                 },
//                 "categoryInfo" : {
//                     "gender" : "men",
//                     "superCategory" : "top-wear",
//                     "subCategory" : "t-shirt",
//                     "sleeve" : "half",
//                     "filters" : [],
//                     "model" : "-1",
//                     "brand" : "-1",
//                     "fabric" : "100% Supima Cotton Mercerized. Pre-shrunk Reinforced."
//                 },
//                 "limitedEdition" : true,
//                 "fit" : "Fits just right - not too tight, not too loose."
//             },
//             "available" : true
//         }
//     ],
//       date: "ada",
//       paymentStatus: "JsonRes.order_status",
//       payment_mode: "JsonRes.payment_mode",
//       bank_ref_no: "JsonRes.bank_ref_no",
//       orderedBy: {
//         name: "JsonRes.billing_name",
//         emailId: "JsonRes.billing_email",
//         phoneNo: 'JsonRes.billing_tel'
//       },
//       deliveryDetails: {
//         address: "JsonRes.billing_address",
//         city: "JsonRes.billing_city",
//         state: "JsonRes.billing_state",
//         country: "JsonRes.billing_country",
//         pinCode: 'JsonRes.billing_zip'
//       },
//       amount: "JsonRes.amount",
//       tracking_id_payment: "JsonRes.tracking_id"
//     })



    //
function readModuleFile(path, callback) {
  try {
    var filename = require.resolve(path);
    fs.readFile(filename, "utf8", callback);
  } catch (e) {
    callback(e);
  }
}

exports.postRes = function(request, response) {
  var ccavEncResponse = "",
    ccavResponse = "",
    workingKey = "43B1F1970CD906CB64390FC1C399385A", //Put in the 32-Bit key shared by CCAvenues.
    ccavPOST = "";

  var saveOrder = function(JsonRes, successResponse) {
    return ordersDb.placedOrdersCollection({
      orderId: JsonRes.order_id,
      products: successResponse.products,
      date: new Date(),
      paymentStatus: JsonRes.order_status,
      payment_mode: JsonRes.payment_mode,
      bank_ref_no: JsonRes.bank_ref_no,
      promoCode: successResponse.promoCode,
      orderedBy: {
        name: JsonRes.billing_name,
        emailId: JsonRes.billing_email,
        phoneNo: JsonRes.billing_tel
      },
      deliveryDetails: {
        address: JsonRes.billing_address,
        city: JsonRes.billing_city,
        state: JsonRes.billing_state,
        country: JsonRes.billing_country,
        pinCode: JsonRes.billing_zip
      },
      amount: JsonRes.amount,
      tracking_id_payment: JsonRes.tracking_id
    });
  };
  var revertSizesInProducts = function(details, i) {
    productsDb.productCollection.findOne({ id: details.products[i].productId }, function(err, response) {
      if (err) {
        res.send({ success: false, details: err });
      } else {
        response.sizes[details.products[i].size] = response.sizes[details.products[i].size] + details.products[i].quantity;
        response.save(function(err, success) {
          if (err) {

          } else {
            //   continue;
          }
        });
      }
    });
  };
  var removeEntryFromTempOrder = function(id){
    ordersDb.tempOrderCollection.remove({orderId: id}, function(){})
  }
  request.on("data", function(data) {
    ccavEncResponse += data;
    ccavPOST = qs.parse(ccavEncResponse);
    // var encryption = ccavPOST.encResp;
    // ccavResponse = ccav.decrypt(encryption, workingKey);
  });

  request.on("end", function() {
    var JsonRes = JSON.parse(
      '{"' +
        decodeURI(ccavResponse)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}'
    );
    if (JsonRes.order_status === "Success") {

      var messageBody = "Hi, \nWe know you gonna love our products. Just hold on till we deliver it to you. You can track your order by clicking below link \n https://orangeclips.com/orderStatus?orderId=" + JsonRes.order_id;
      messageBody = encodeURI(messageBody);
      https.get("https://control.msg91.com/api/sendhttp.php?authkey=139030Ag218mR2QtxS59351252&mobiles=" + JsonRes.billing_tel + "&message=" + messageBody + "&sender=OCshop&route=4&country=91", function(res) {});
      https.get("https://control.msg91.com/api/sendhttp.php?authkey=139030Ag218mR2QtxS59351252&mobiles=" + '9876665556' + "&message=" + 'Order Aya Order Aya Order Aya' + "&sender=OCshop&route=4&country=91", function(res) {});
      ordersDb.tempOrderCollection.findOne({ orderId: JsonRes.order_id }, function(err, successResponse) {
        if (err) {
        } else {
          var tosave = saveOrder(JsonRes, successResponse);
          tosave.save(function(err, success) {
            if (err) {
            } else {
              emailTemplates.sendOrderSuccessEmail(success);
              removeEntryFromTempOrder(JsonRes.order_id);
              response.cookie("orderId", JsonRes.order_id, { maxAge: 900000 });
              response.sendFile(path.join(__dirname + "/../../views/paymentResponseSuccess.html"));
            }
          });
        }
      });
    } else {
      var messageBody = "Oh Snap!!, \nPayment failed. Dont worry try paying again. If you are unable to pay, write us at contact@orangeclips.com or call us at +91 8076565005";
      messageBody = encodeURI(messageBody);
      https.get("https://control.msg91.com/api/sendhttp.php?authkey=139030Ag218mR2QtxS59351252&mobiles=" + JsonRes.billing_tel + "&message=" + messageBody + "&sender=OCshop&route=4&country=91", function(res) {});
      https.get("https://control.msg91.com/api/sendhttp.php?authkey=139030Ag218mR2QtxS59351252&mobiles=" + '9876665556' + "&message=" + 'Bc payment complete ni kri '+JsonRes.billing_tel +' is ne.' + "&sender=OCshop&route=4&country=91", function(res) {});

      // failure
      // get temp order and increase quantity of product
      ordersDb.tempOrderCollection.findOne({ orderId: JsonRes.order_id }, function(err, tempOrder) {
        if (err) {
        } else {
          var details = tempOrder;
          if (details !== null) {
            for (var i = 0; i < details.products.length; i++) {
              (function(i) {
                revertSizesInProducts(details, i);
                if (i === details.products.length - 1) {
                  removeEntryFromTempOrder(details.orderId);
                }
              })(i);
            }
          } else {
            tempOrder = { products: [] };
          }

          var tosave = saveOrder(JsonRes, tempOrder);
          tosave.save(function(err, success) {});
        }
      });
      response.sendFile(path.join(__dirname + "/../../views/paymentResponseFailed.html"));
    }
    // response.end();
  });
};
