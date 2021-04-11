/*
 * @Descripttion: 工具类
 * @Author: 午休
 * @Date: 2021-04-09 16:32:22
 * @LastEditors: 午休
 * @LastEditTime: 2021-04-11 21:56:30
 */

const request = require("./request_https");
//时间格式化
Date.prototype.Format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};

//取随机数 min = 最小值 ； max = 最大值
let getRandom = (min, max) => {
  return parseInt(Math.random() * (max - min + 1) + min);
};

//转码ascii 转 native
let ascii2native = (str) => {
  let asciicode = str.split("\\u");
  let nativeValue = asciicode[0];
  for (let i = 1; i < asciicode.length; i++) {
    let code = asciicode[i];
    nativeValue += String.fromCharCode(parseInt("0x" + code.substring(0, 4)));
    if (code.length > 4) {
      nativeValue += code.substring(4, code.length);
    }
  }
  return nativeValue;
};

const sleep = (timeountMS) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeountMS);
  });

/**
 * server SCKEY
 * @param {*} SCKEY
 */
const sendMessage = (SCKEY, text, desp) => {
  if (!SCKEY) {
    console.log("SCKEY为空");
    return;
  }
  let referer = "http://sc.ftqq.com/?c=code";
  let options = {
    url: "https://sc.ftqq.com/" + SCKEY + ".send",
    type: "GET",
    params: {
      text: text.substr(0, 200) + new Date().Format("yyyy-MM-dd hh:mm:ss"),
      desp: desp + new Date().Format("yyyy-MM-dd hh:mm:ss"),
    },
  };

  new Promise((resolve, reject) => {
    options.callback = (data, _setCookie) => {
      try {
        console.log("data===", data);
        if (data.indexOf("success") != -1) {
          console.log(
            new Date().Format("yyyy-MM-dd hh:mm:ss") + " --- 消息发送成功！"
          );
        } else {
          console.log(
            new Date().Format("yyyy-MM-dd hh:mm:ss") + " --- 消息发送失败！"
          );
        }
      } catch (error) {
        //发邮件
        console.log(
          "发送消息报错",
          new Date().Format("yyyy-MM-dd hh:mm:ss") + " --- 错误内容：",
          error
        );
      } finally {
      }
    };
    request(options, "PHPSESSID=0b3dc8dfd13fbf85b169834a5ec607fc; ", referer);
  });
};

module.exports = {
  getRandom,
  ascii2native,
  sleep,
  sendMessage,
};
