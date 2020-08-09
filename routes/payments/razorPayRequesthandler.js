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

	formbody = '<form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';
    });
				
    request.on('end', function () {
        response.writeHeader(200, {"Content-Type": "text/html"});
	response.write(formbody);
	response.end();
    });
   return; 
};
