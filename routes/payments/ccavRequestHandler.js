var http = require('http'),
    fs = require('fs'),
    ccav = require('./ccavutil.js'),
    qs = require('querystring');

exports.postReq = function(request,response){
    var body = 'merchant_id=147290&redirect_url=https://www.orangeclips.com/payment/success&cancel_url=https://www.orangeclips.com/payment/failure&',
	workingKey = '43B1F1970CD906CB64390FC1C399385A',	//Put in the 32-Bit key shared by CCAvenues.
	accessCode = 'AVGF72EI98AQ63FGQA',			//Put in the Access Code shared by CCAvenues.
	encRequest = '',
	formbody = '';
				
    request.on('data', function (data) {
	body += data;
    
    var a = data.toString('utf8');
    var JsonRes = JSON.parse('{"' + decodeURI(a).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
    encRequest = ccav.encrypt(body,workingKey); 
    
    formbody =  '<form id="razorpayform" action="http://localhost:3000/payment/success" method="POST">'+
    '<script    '+
    'src="https://checkout.razorpay.com/v1/checkout.js"    '+
    'data-key="rzp_test_gYXTP715OMzTQU" '+
    'data-amount="50000" '+
    'data-currency="INR"   '+ 
    'data-order_id="order_CgmcjRh9ti2lP7"'+ 
    'data-buttontext="Pay with Razorpay"   '+ 
    'data-name="Acme Corp"    '+
    'data-description="Test transaction" '+   
    'data-image="https://example.com/your_logo.jpg" '+   
    'data-prefill.name="Gaurav Kumar"    '+
    'data-prefill.email="gaurav.kumar@example.com" '+   
    'data-prefill.contact="9999999999"    '+
    'data-theme.color="#F37254"></script>'+
    '<input type="hidden" custom="Hidden Element" name="hidden"></form>';
    });
				
    request.on('end', function () {
        response.writeHeader(200, {"Content-Type": "text/html"});
	response.write(formbody);
	response.end();
    });
   return; 
};
