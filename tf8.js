/*
 * @Descripttion:
 * @Author: 午休
 * @Date: 2021-04-05 10:49:36
 * @LastEditors: 午休
 * @LastEditTime: 2021-04-09 18:01:49
 */
const request = require("./lib/request_https");
const { getRandom } = require("./lib/utils");
const schedule = require("node-schedule");

console.log("淘粉吧签到相关", new Date());
/**
 * 淘粉吧 签到
 * @param {Object} thor
 */
let TF8Sign = (cookie) => {
  let referer = "http://www.taofen8.com/";
  let options = {
    url: "http://www.taofen8.com/userSign",
    type: "POST",
  };

  new Promise((resolve, reject) => {
    options.callback = (data, _setCookie) => {
      try {
        console.log("data===", data);
        if (data.indexOf('success":true') != -1) {
          console.log(
            new Date().Format("yyyy-MM-dd hh:mm:ss") + " --- 淘粉吧签到成功！"
          );
        } else {
          console.log(
            new Date().Format("yyyy-MM-dd hh:mm:ss") + " --- 淘粉吧已经领取！"
          );
          //发邮件
          console.log(
            "taofen8签到报错",
            new Date().Format("yyyy-MM-dd hh:mm:ss") + " --- 错误内容：" + data
          );
        }
      } catch (error) {
        console.log(error);
        //发邮件
        console.log(
          "taofen8签到报错",
          new Date().Format("yyyy-MM-dd hh:mm:ss") + " --- 错误内容：" + error
        );
      } finally {
      }
      //{"message":"签到成功","sign":{"result":true,"num":1,"continuous":null,"isReal":true,"isBt":false,"code":0},"code":"0","success":true}
      //{"message":"已经领取","sign":{"result":false,"num":null,"continuous":null,"isReal":null,"isBt":null,"code":3},"code":"3","success":true}
    };
    request(options, cookie, referer);
  });
};

const myArgs = process.argv.splice(2);
if (!myArgs) {
  console.log("error cookie 参数未取到！！");
  return;
}
const signList = myArgs[0].split("@_@");
console.log("signList--->", signList);

//延迟执行签到
let setTimeSign = (cookieSess) => {
  if (cookieSess) {
    setTimeout(() => {
      //签到
      TF8Sign(cookieSess);
      console.log("签到！！");
    }, getRandom(10000, 200000));
  }
};

// //每天18点10执行 签到
// schedule.scheduleJob('30 10 18 * * *', () => {
// 	for(let i = 0; i < signList.length; i++) {
// 		setTimeSign(signList[i]);
// 	}
// });

//淘粉吧
for (let i = 0; i < signList.length; i++) {
  setTimeSign(signList[i]);
}
