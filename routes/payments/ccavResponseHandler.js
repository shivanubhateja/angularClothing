var http = require('http'),
    fs = require('fs'),
    ccav = require('./ccavutil.js'),
    qs = require('querystring');
    path = require('path');

exports.postRes = function(request,response){
	console.log("handle innnn")
    var ccavEncResponse='',
	ccavResponse='',	
	workingKey = '43B1F1970CD906CB64390FC1C399385A',	//Put in the 32-Bit key shared by CCAvenues.
	ccavPOST = '';
	
        request.on('data', function (data) {
			ccavEncResponse += data;
			ccavPOST =  qs.parse(ccavEncResponse);
			var encryption = ccavPOST.encResp;
			ccavResponse = ccav.decrypt(encryption,workingKey);
			console.log("from data->>>"+ccavResponse)
        });

	request.on('end', function () {
	    var pData = '';
	    pData = '<table border=1 cellspacing=2 cellpadding=2><tr><td>'	
	    pData = pData + ccavResponse.replace(/=/gi,'</td><td>')
	    pData = pData.replace(/&/gi,'</td></tr><tr><td>')
	    pData = pData + '</td></tr></table>'
            htmlcode = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body><center><font size="4" color="blue"><b>Response Page</b></font><br>'+ pData +'</center><br></body></html>';
            response.writeHeader(200, {"Content-Type": "text/html"});
	    // response.write(htmlcode);
		response.sendFile(path.join(__dirname + '/views/index.html'));
	    // response.end();
	}); 	
};
