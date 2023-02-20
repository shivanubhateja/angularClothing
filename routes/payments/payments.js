var express = require('express');
var http = require('http');
var router = express.Router();
var path  = require('path')
var fs = require('fs'),
    path  = require('path')
    ccav = require('./ccavutil'),
    qs = require('querystring'),
    ccavReqHandler = require('./ccavRequestHandler.js'),
    ccavResHandler = require('./ccavResponseHandler');

router.post('/start', function (request, response){
	ccavReqHandler.postReq(request, response);
});
router.post('/ccavResponseHandler', function (request, response){
        ccavResHandler.postRes(request, response);
});
router.post('/success', function (request, response){
        ccavResHandler.postRes(request, response);
});
router.post('/failure', function (request, response){
        ccavResHandler.postRes(request, response);
});

router.post('/razorPaySuccess', function(request, response) {
        ccavResHandler.successResponseFromRazorPay(request, response);
});
module.exports = router;