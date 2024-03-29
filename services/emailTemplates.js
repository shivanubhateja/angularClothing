var commonService = require("./commonServices");

exports.sendOrderSuccessEmail = function(JsonRes) {
  var subject = "Order Successfully Placed.";
  var orderId = JsonRes.orderId;
  var products = JsonRes.products;
  var date = JsonRes.date;
  var paymentStatus = JsonRes.paymentStatus;
  var payment_mode = JsonRes.payment_mode;
  var orderedBy = JsonRes.orderedBy;
  var deliveryDetails = JsonRes.deliveryDetails;
  var amount = JsonRes.amount;
  var productsHtml = "";
  for (var i = 0; i < products.length; i++) {
    var sizeToDisplay;
    if((products[i].productDetails.sizeVarientsAvailable===false)){
      sizeToDisplay = "";
    } else{
      sizeToDisplay = products[i].size;
    }
    productsHtml +=
      ` <div>
                    ` +
      products[i].quantity +
      ` . ` +
      products[i].productDetails.name +
      ` . ` +
      `${sizeToDisplay}` +
      `
                    <span class="pull-right"> ` +
      products[i].productDetails.price +
      `</span>
                </div>`;
  }
  var emailTemplate =
    `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
   <head>
      <title>Reset Password</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style type="text/css">
         * {
         -ms-text-size-adjust:100%;
         -webkit-text-size-adjust:none;
         -webkit-text-resize:100%;
         text-resize:100%;
         }
         a{text-decoration: none !important; color:#888;}
         a:hover{text-decoration:none !important;}
         .nav a:hover{text-decoration:underline !important;}
         .title a:hover{text-decoration:underline !important;}
         .title-2 a:hover{text-decoration:underline !important;}
         .btn:hover{opacity:0.8;}
         .btn a:hover{text-decoration:none !important;}
         .btn{
         -webkit-transition:all 0.3s ease;
         -moz-transition:all 0.3s ease;
         -ms-transition:all 0.3s ease;
         transition:all 0.3s ease;
         }
         table td {border-collapse: collapse !important;}
         .ExternalClass, .ExternalClass a, .ExternalClass span, .ExternalClass b, .ExternalClass br, .ExternalClass p, .ExternalClass div{line-height:inherit;}
         @media only screen and (max-width:500px) {
         table[class="flexible"]{width:100% !important;}
         table[class="center"]{
         float:none !important;
         margin:0 auto !important;
         }
         *[class="hide"]{
         display:none !important;
         width:0 !important;
         height:0 !important;
         padding:0 !important;
         font-size:0 !important;
         line-height:0 !important;
         }
         td[class="img-flex"] img{
         width:100% !important;
         height:auto !important;
         }
         td[class="aligncenter"]{text-align:center !important;}
         th[class="flex"]{
         display:block !important;
         width:100% !important;
         }
         td[class="wrapper"]{padding:0 !important;}
         td[class="holder"]{padding:30px 15px 20px !important;}
         td[class="nav"]{
         padding:20px 0 0 !important;
         text-align:center !important;
         }
         td[class="h-auto"]{height:auto !important;}
         td[class="description"]{padding:30px 20px !important;}
         td[class="i-120"] img{
         width:120px !important;
         height:auto !important;
         }
         td[class="footer"]{padding:5px 20px 20px !important;}
         td[class="footer"] td[class="aligncenter"]{
         line-height:25px !important;
         padding:20px 0 0 !important;
         }
         tr[class="table-holder"]{
         display:table !important;
         width:100% !important;
         }
         th[class="thead"]{display:table-header-group !important; width:100% !important;}
         th[class="tfoot"]{display:table-footer-group !important; width:100% !important;}
         }
         .orderStatusParent{
         max-width: 700px;
         margin: 0 auto;
         font-family: Montserrat-Regular;
         font-size: 15px;
         color: #313a44;
         display: table;
         width: 100%;
         }
         .pull-right{
         float: right;
         }
         .orderStatusParent h2{
         padding: 0 30px;
         }
         .orderStatusParent h2 img{
         width: 100px;
         float:right;
         height: 100px;
         }
         .bill{
         padding: 25px;
         width: 100%;
         }
         .bill .heading, .padding_border{
         padding-bottom: 10px;
         border-bottom: 1px solid #313a44;
         }
         .padding_border{
         padding: 15px 0;
         }
         .billWrapper{
         padding: 20px;
         margin: 0 8px;
         box-shadow: 0px -6px 8px rgba(0,0,0,0.2), 0px 1px 0px rgba(0,0,0,0.1) inset;
         }
         .billPart1 img, .billPart2 img{
         width: 100%;
         }
         .no-border{
         border: none;
         }
         .shippingDates{
         padding: 15px 0;
         display: flex;
         }
         .shippingDates div{
         width:50%
         }
         .trackingDetails{
         padding: 15px 0;
         }
      </style>
   </head>
   <body style="margin:0; padding:0;" bgcolor="#eaeced">
      <table style="min-width:320px;" width="100%" cellspacing="0" cellpadding="0" bgcolor="#eaeced">
         <!-- fix for gmail -->
         <tr>
            <td class="hide">
               <table width="600" cellpadding="0" cellspacing="0" style="width:600px !important;">
                  <tr>
                     <td style="min-width:600px; font-size:0; line-height:0;">&nbsp;</td>
                  </tr>
               </table>
            </td>
         </tr>
         <tr>
            <td class="wrapper" style="padding:0 10px;">
               <!-- module 1 -->
               <table data-module="module-1" data-thumb="thumbnails/01.png" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                     <td data-bgcolor="bg-module" bgcolor="#eaeced">
                        <table class="flexible" width="600" align="center" style="margin:0 auto;" cellpadding="0" cellspacing="0">
                           <tr>
                              <td style="padding:29px 0 30px;">
                                 <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                       <th class="flex" width="113" align="left" style="padding:0;">
                                          <table class="center" cellpadding="0" cellspacing="0">
                                             <tr>
                                                <td style="line-height:0;">
                                                   <a target="_blank" style="text-decoration:none; color:#bbb" href="https://www.orangeclips.com">www.orangeclips.com</a>
                                                </td>
                                             </tr>
                                          </table>
                                       </th>
                                       <th class="flex" align="left" style="padding:0;">
                                          <table width="100%" cellpadding="0" cellspacing="0">
                                             <tr>
                                                <td data-color="text" data-size="size navigation" data-min="10" data-max="22" data-link-style="text-decoration:none; color:#888;" class="nav" align="right" style="font:bold 13px/15px Arial, Helvetica, sans-serif; color:#888;"><a target="_blank" style="text-decoration:none; color:#bbb;" href="mailto:contact@orangeclips.com">Contact contact@orangeclips.com</a>
                                                </td>
                                             </tr>
                                          </table>
                                       </th>
                                    </tr>
                                 </table>
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </table>
               <!-- module 6 -->
               <table data-module="module-6" data-thumb="thumbnails/06.png" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                     <td data-bgcolor="bg-module" bgcolor="#eaeced">
                        <table class="flexible" width="600" align="center" style="margin:0 auto;" cellpadding="0" cellspacing="0">
                           <tr>
                              <td data-bgcolor="bg-block" class="holder" style="padding:64px 60px 50px;" bgcolor="#f9f9f9">
                                 <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                       <td data-color="title" data-size="size title" data-min="20" data-max="40" data-link-color="link title color" data-link-style="text-decoration:none; color:#292c34;" class="title" align="center" style="font:30px/33px Arial, Helvetica, sans-serif; color:#292c34; padding:0 0 23px;">
                                          Order Placed
                                       </td>
                                    </tr>
                                    <tr>
                                       <td data-color="text" data-size="size text" data-min="10" data-max="26" data-link-color="link text color" data-link-style="font-weight:bold; text-decoration:underline; color:#40aceb;" align="center" style="font:16px/29px Arial, Helvetica, sans-serif; color:#888; padding:0 0 21px;">
                                          <strong>Hola, </strong>We received your Order. Soon your order will be shipped and you will reveive another email with shipping information. Thanks for shopping with us.<br>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td style="padding:0 0 20px;">
                                          <table width="232" align="center" style="margin:0 auto;" cellpadding="0" cellspacing="0">
                                             <tr>
                                                <td data-bgcolor="bg-button" data-size="size button" data-min="10" data-max="20" class="btn" align="center" style="font:bold 16px/18px Arial, Helvetica, sans-serif; color:#f9f9f9; text-transform:uppercase; mso-padding-alt:22px 10px; border-radius:3px;" bgcolor="#56D0B3">
                                                   <a target="_blank" style="text-decoration:none; color:#f9f9f9; display:block; padding:22px 10px;" href="https://orangeclips.com/orderStatus?orderId=` +
                                                      orderId +
                                                      `">TRACK ORDER</a>
                                                </td>
                                             </tr>
                                          </table>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td>
                                          <div class="row orderStatusParent">
                                          <div class="bill billPart1 no-padding">
                                             <div class="billWrapper" style="background: white; margin: 0 4px;">
                                                <div class="heading">
                                                   <b>JewelleryBrandName</b>
                                                   <span class="pull-right">Order: ` +
                                                   orderId +
                                                   `</span>
                                                </div>
                                                <div class="padding_border">
                                                   <div><b>` +
                                                      orderedBy.name +
                                                      `</b>
                                                   </div>
                                                   <div>` +
                                                      deliveryDetails.address +
                                                      `
                                                   </div>
                                                   <div>` +
                                                      deliveryDetails.city +
                                                      `, ` +
                                                      deliveryDetails.state +
                                                      `,` +
                                                      deliveryDetails.pinCode +
                                                      `
                                                   </div>
                                                   <div>` +
                                                      deliveryDetails.country +
                                                      `
                                                   </div>
                                                </div>
                                                <div class="padding_border">
                                                   ` +
                                                   productsHtml +
                                                   `
                                                </div>
                                                <div class="padding_border no-border">
                                                   ` +
                                                   paymentStatus +
                                                   `
                                                   <div class="pull-right">
                                                      </i> ` +
                                                      amount +
                                                      `
                                                   </div>
                                                </div>
                                             </div>
                                             <img src="https://www.orangeclips.com/images/billBottom.png" alt="">
                                          </div>
                                       </td>
                                    </tr>
                                    <tr>
                                    <td data-color="title" data-size="size title" data-min="20" data-max="40" data-link-color="link title color" data-link-style="text-decoration:none; color:#292c34;" class="title" align="center" style="font:30px/33px Arial, Helvetica, sans-serif; color:#292c34; padding:0 0 23px;">
                                          Check out our posts
                                    </td>
                                    </tr>
                                    <tr>
                                    <td data-color="title" data-size="size title" data-min="20" data-max="40" data-link-color="link title color" data-link-style="text-decoration:none; color:#292c34;" class="title" align="center" style="font:30px/33px Arial, Helvetica, sans-serif; color:#292c34; padding:0 0 23px;">
                                       <a target="_blank" style="text-decoration:none;" href="https://www.instagram.com/orangeclipsofficial/"><img src="https://instagram-brand.com/wp-content/uploads/2016/11/app-icon2.png" border="0" style="font:12px/15px Arial, Helvetica, sans-serif; color:#797c82;padding: 20px" align="left" vspace="0" hspace="0" width="50" height="50" alt="in" /></a>
                                       <a target="_blank" style="text-decoration:none;" href="https://www.facebook.com/orangeclipsofficial/"><img src="https://en.facebookbrand.com/wp-content/uploads/2016/05/FB-fLogo-Blue-broadcast-2.png" border="0" style="font:12px/15px Arial, Helvetica, sans-serif; color:#797c82;padding: 20px" align="left" vspace="0" hspace="0" width="50" height="50" alt="fb" /></a>
                                    </td>
                                    </tr>
                                 </table>
                              </td>
                           </tr>
                           <tr>
                              <td height="28"></td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </table>
               <!-- module 7 -->
               <table data-module="module-7" data-thumb="thumbnails/07.png" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                     <td data-bgcolor="bg-module" bgcolor="#eaeced">
                        <table class="flexible" width="600" align="center" style="margin:0 auto;" cellpadding="0" cellspacing="0">
                           <tr>
                              <td class="footer" style="padding:0 0 10px;">
                                 <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr class="table-holder">
                                       <th class="tfoot" width="400" align="left" style="vertical-align:top; padding:0;">
                                          <table width="100%" cellpadding="0" cellspacing="0">
                                             <tr>
                                                <td data-color="text" data-link-color="link text color" data-link-style="text-decoration:underline; color:#797c82;" class="aligncenter" style="font:12px/16px Arial, Helvetica, sans-serif; color:#797c82; padding:0 0 10px;">
                                                   orangeclips.com, 2017. &nbsp; All Rights Reserved. <!--<a target="_blank" style="text-decoration:underline; color:#797c82;" href="sr_unsubscribe">Unsubscribe.</a>-->
                                                </td>
                                             </tr>
                                          </table>
                                       </th>
                                       <th class="thead" width="200" align="left" style="vertical-align:top; padding:0;">
                                          <table class="center" align="right" cellpadding="0" cellspacing="0">
                                             <tr>
                                                <td class="btn" valign="top" style="line-height:0; padding:3px 0 0;">
                                                   <a target="_blank" style="text-decoration:none;" href="https://www.facebook.com/orangeclipsofficial/"><img src="https://en.facebookbrand.com/wp-content/uploads/2016/05/FB-fLogo-Blue-broadcast-2.png" border="0" style="font:12px/15px Arial, Helvetica, sans-serif; color:#797c82;" align="left" vspace="0" hspace="0" width="20" height="20" alt="fb" /></a>
                                                </td>
                                                <!--<td width="20"></td>
                                                   <td class="btn" valign="top" style="line-height:0; padding:3px 0 0;">
                                                   	<a target="_blank" style="text-decoration:none;" href="https://twitter.com/clordacorp/"><img src="http://www.clorda.com/images/twitter.svg" border="0" style="font:12px/15px Arial, Helvetica, sans-serif; color:#797c82;" align="left" vspace="0" hspace="0" width="20" height="20" alt="tw" /></a>
                                                   </td>
                                                   <td width="19"></td>
                                                   <td class="btn" valign="top" style="line-height:0; padding:3px 0 0;">
                                                   	<a target="_blank" style="text-decoration:none;" href="https://www.youtube.com/watch?v=fyxaSx0tz2Y"><img src="http://www.clorda.com/images/youtube.svg" border="0" style="font:12px/15px Arial, Helvetica, sans-serif; color:#797c82;" align="left" vspace="0" hspace="0" width="20" height="20" alt="yt" /></a>-->
                                                </td>
                                                <td width="20"></td>
                                                <td class="btn" valign="top" style="line-height:0; padding:3px 0 0;">
                                                   <a target="_blank" style="text-decoration:none;" href="https://www.instagram.com/orangeclipsofficial/"><img src="https://instagram-brand.com/wp-content/uploads/2016/11/app-icon2.png" border="0" style="font:12px/15px Arial, Helvetica, sans-serif; color:#797c82;" align="left" vspace="0" hspace="0" width="20" height="20" alt="in" /></a>
                                                </td>
                                             </tr>
                                          </table>
                                       </th>
                                    </tr>
                                 </table>
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </table>
            </td>
         </tr>
         <!-- fix for gmail -->
         <tr>
            <td style="line-height:0;">
               <div style="display:none; white-space:nowrap; font:15px/1px courier;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div>
            </td>
         </tr>
      </table>
   </body>
</html>`;
  commonService.sendMail(orderedBy.emailId, "Hola, "+orderedBy.name +" we received your orders", emailTemplate);
};
