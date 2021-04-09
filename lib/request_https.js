'use strict';
var http = require('https');
var querystring = require('querystring');
var url = require('url');

/**
 * options: {
 * 
 * }
 *     url:  请求地址 必填
 *     type: 默认get 可选
 *     params: {} 请求参数
 *     callback: 请求回调
 *     
 */
module.exports = function(options, cookie, referer) {

    var URL = url.parse(options.url);
    var type = options.type.toUpperCase() || 'GET';
    
    //处理cookie
    cookie = cookie || '';

    //处理请求参数
    var contents = false;
    if(!!options.params) {
        contents = querystring.stringify(options.params);
    }

    //如果是get,把参数跟在url后面
    var path = URL.path;
    if(type === 'GET' && contents) {
        path = path + '?' + contents;
    }

    var requestOptions = {
        host: URL.hostname,
        port: URL.port,
        path: path,
        method: type,
        headers: {
            Cookie: cookie,
            Referer : referer
        }
    };
    
//  requestOptions.headers['Accept'] = '*/*';
//  requestOptions.headers['Accept-Encoding'] = 'gzip, deflate';
//  requestOptions.headers['Accept-Language'] = 'zh-CN,zh;q=0.8,zh-TW;q=0.6,en;q=0.4';
//  requestOptions.headers['Cache-Control'] = 'no-cache';
//  requestOptions.headers['Connection'] = 'keep-alive';
//  requestOptions.headers['Cookie'] = 'sess=' + sess + '; __ckguid=e9S74FeG2I3o5F7H3ns; PHPSESSID=8cq81mt3fb36j3vkb422tt8ro4; __jsluid=df249d654128729adf4ee64aa1b471e7; smzdm_user_view=E8E6B5B6AD0403BB224E6D1D760C63C5; smzdm_user_source=CC6D79BF4429A88E79CFE159BEC0CD57; Hm_lvt_9b7ac3d38f30fe89ff0b8a0546904e58=1497231776; Hm_lpvt_9b7ac3d38f30fe89ff0b8a0546904e58=1499655804; _ga=GA1.2.889336607.1499655675; _gid=GA1.2.1518261697.1499655675';
//  requestOptions.headers['DNT'] = '1';
//  requestOptions.headers['Host'] = 'zhiyou.smzdm.com';
//  requestOptions.headers['Pragma'] = 'no-cache';
//  requestOptions.headers['Referer'] = 'http://vip.jr.jd.com/';
    requestOptions.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';

    if(type ==='POST' && contents) {
        requestOptions.headers['Content-Type'] = 'application/json;charset=UTF-8';
        requestOptions.headers['Content-Length'] = contents.length;
    }
	
//	console.log('requestOptions === ',requestOptions);
    var req = http.request(requestOptions, function(res) {
        res.setEncoding('UTF-8');
        var str = '';
        res.on('data', function(chunk) {
           str = str + chunk;
        });

        res.on('end', function() {
            var setCookie = res.headers['set-cookie'];
            //执行回调
            options.callback && options.callback(str, setCookie);
        });

        res.on('error', function(e) {
            options.callback && options.callback(e);
        });
    });

    req.on('error', function(e) {
         options.callback && options.callback(e);
    });

    //post请求，需要把请求体发送过去
    if(type === 'POST' && contents) {
        req.write(contents);
    }

    req.end();

};


