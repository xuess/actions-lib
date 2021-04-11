/*
 * @Descripttion: 发送请求
 * @Author: 午休
 * @Date: 2021-04-09 16:32:22
 * @LastEditors: 午休
 * @LastEditTime: 2021-04-11 21:08:54
 */
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
module.exports = function(options, cookie='', referer='') {

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


