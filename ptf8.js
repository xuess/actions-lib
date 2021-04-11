/*
 * @Descripttion:
 * @Author: 午休
 * @Date: 2021-04-09 18:41:58
 * @LastEditors: 午休
 * @LastEditTime: 2021-04-11 21:01:08
 */

/**
 * tf8
 * xuess<wuniu2010@126.com>
 */

const puppeteer = require("puppeteer");
const { getRandom, sleep, sendMessage } = require("./lib/utils"); //工具类

const myArgs = process.argv.splice(2);

if (!myArgs) {
  console.log("error cookie 参数未取到！！");
  return;
}
const signList = myArgs[0].split("@_@");
console.log("signList--->", signList);

const tf8 = async (hrefUrl, index) => {
  // const browser = await puppeteer.launch({
  //   // headless: false,
  //   slowMo: 100
  // });

  // linux 环境 执行
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    slowMo: 150,
  });

  const page = await browser.newPage();

  // await page.setUserAgent(userAgent)
  await page.setViewport({
    width: 375,
    height: 667,
    isMobile: true,
    hasTouch: true,
  });
  // await page.setCookie(...cookiesData);
  await page.once("load", () => console.log("Page loaded!"));

  try {
    await page.goto(hrefUrl);
    //   await page.tap("#J_search_input");
    //   await page.keyboard.type("Hello World!", { delay: 100 });
    //   await page.click('.J_feed_za');
    //   await page.keyboard.type("World", { delay: 100 });

    // 等待元素出现
    await page.waitForSelector("span[code=weixinsign]");
    // 签到
    await page.tap("span[code=weixinsign]");
  } catch (error) {
    console.log(new Date().Format("yyyy-MM-dd hh:mm:ss") + "tf8 wx 签到报错");
    sendMessage(myArgs[1], "tf8 wx 签到报错~~~", String(error));
  }
  // await page.tap(".click_qd");
  console.log(new Date().Format("yyyy-MM-dd hh:mm:ss") + "tf8 wx 签到成功！");

  await sleep(3000);

  await page.screenshot({
    path: `./screenshot/tf8/${index}-sign-${new Date().Format(
      "yyyy-MM-dd"
    )}.png`,
  });

  await browser.close();

  if (index === signList.length - 1) {
    sendMessage(myArgs[1], "tf8微信签到完成~~~");
  }
};

//延迟执行签到
const setTimeSign = async (openId, index) => {
  await sleep(getRandom(10000, 300000));

  await tf8(
    `http://h51.jiujiangkeli.com/wechat/daily_check?openId=${openId}`,
    index
  );
};

//淘粉吧
for (let i = 0; i < signList.length; i++) {
  setTimeSign(signList[i], i);
}
