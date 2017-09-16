var http = require("http"),
  fs = require("fs"),
  ccav = require("./ccavutil.js"),
  qs = require("querystring");
  path = require("path");
  ordersDb = require("./../../schema/ordersDb");
  productsDb = require("./../../schema/productsDb");
var https = require('https');

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

  request.on("data", function(data) {
    ccavEncResponse += data;
    ccavPOST = qs.parse(ccavEncResponse);
    var encryption = ccavPOST.encResp;
    ccavResponse = ccav.decrypt(encryption, workingKey);
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
      var messageBody = "Hi, \n We know you gonna love your tees. Just hold on till we deliver it to you. You can track your order at https://orangeclips.com/orderStatus?orderId="+JsonRes.order_id;
      messageBody =  encodeURI(messageBody);
      https.get('https://control.msg91.com/api/sendhttp.php?authkey=139030Ag218mR2QtxS59351252&mobiles=' + JsonRes.billing_tel + '&message=' + messageBody + '&sender=OCshop&route=4&country=91', function (res) {

      })
      ordersDb.tempOrderCollection.findOne({ orderId: JsonRes.order_id }, function(err, successResponse) {
        if (err) {
        } else {
          var tosave = ordersDb.placedOrdersCollection({
            orderId: JsonRes.order_id,
            products: successResponse.products,
            date: new Date(),
            paymentStatus: JsonRes.order_status,
            payment_mode: JsonRes.payment_mode,
            bank_ref_no: JsonRes.bank_ref_no,
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
          tosave.save(function(err, success) {
            if (err) {
            } else {
						  response.cookie('orderId', JsonRes.order_id, { maxAge: 900000});
              response.sendFile(path.join(__dirname + "/../../views/paymentResponseSuccess.html"));
            }
          });
        }
      });

    } else {
      // failure
      // get temp order and increase quantity of product
      ordersDb.tempOrderCollection.findOne({ orderId: JsonRes.order_id }, function(err, tempOrder) {
        if (err) {
        } else {
          var details = tempOrder;
          for (var i = 0; i < details.products.length; i++) {
            // productIdsArray.push(details.products[i].productId);
            (function(i) {
              productsDb.productCollection.findOne({ id: details.products[i].productId }, function(err, response) {
                if (err) {
                  res.send({ success: false, details: err });
                } else {
                  response.sizes[details.products[i].size] = response.sizes[details.products[i].size] + details.products[i].quantity;
                  response.save(function(err, success) {
                    if (err) {
                      res.send({ success: false, details: err });
                    } else {
                      //   continue;
                    }
                  });
                }
              });
            })(i);
          }
          var tosave = ordersDb.placedOrdersCollection({
            orderId: JsonRes.order_id,
            products: tempOrder.products,
            date: new Date(),
            paymentStatus: JsonRes.order_status,
            payment_mode: JsonRes.payment_mode,
            bank_ref_no: JsonRes.bank_ref_no,
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
          tosave.save(function(err, success) {});
        }
      });
      response.sendFile(path.join(__dirname + "/../../views/paymentResponseFailed.html"));
    }
    // response.end();
  });
};
