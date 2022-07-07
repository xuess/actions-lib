/*
 * @Author: 午休
 * @Date: 2022-07-07 09:39:01
 * @LastEditors: 午休
 * @LastEditTime: 2022-07-07 12:04:27
 * @Description: 钉钉通知
 */
const ChatBot = require("dingtalk-robot-sender");
const { getRandom, sleep } = require("./lib/utils");

console.log("钉钉通知", new Date());

const myArgs = process.argv.splice(2);
console.log("myArgs[1]", myArgs[0]);
if (!myArgs) {
  console.log("error cookie 参数未取到！！");
  return;
}
const TOKEN_LIST = myArgs[0].split("@_@");
console.log("signList--->", TOKEN_LIST);

let DoSomeing = async (token) => {

  // 直接使用 webhook
  const robot = new ChatBot({
    webhook: `https://oapi.dingtalk.com/robot/send?access_token=${token}`,
  });

  // 发送钉钉消息
  let textContent = {
    msgtype: "text",
    text: {
      content: "工时登记提醒，每周登记一次，每次登记5天",
    },
    at: {
      isAtAll: true
    },
  };
  robot.send(textContent).then((res) => {
    console.log("res", res)
  });
};

//延迟执行签到
let setTimeSign = async (token, index) => {
  // await sleep(getRandom(1000, 20000));
  if (token) {
    //签到
    await DoSomeing(token);
  }
  // 签到完成 发送消息
  if (index === TOKEN_LIST.length - 1) {
    console.log(myArgs[1], "打完收工！");
  }
};


for (let i = 0; i < TOKEN_LIST.length; i++) {
  setTimeSign(TOKEN_LIST[i], i);
}
