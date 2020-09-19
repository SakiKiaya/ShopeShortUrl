// ==UserScript==
// @name         Shopee short url
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Copy the short url from shopee
// @author       You
// @match        http*://shopee.tw/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js
// ==/UserScript==

GM_addStyle(`
    .alert {display: none; position: fixed;top: 50%;left: 50%;min-width: 300px;max-width: 600px;transform: translate(-50%,-50%);z-index: 99999;text-align: center;padding: 15px;border-radius: 3px;}
    .alert-success {color: #3c763d;background-color: #dff0d8;border-color: #d6e9c6;}
`);

function delay(s)
{
    return new Promise(function(resolve,reject)
    {
        setTimeout(resolve,s);
    });
};

async function fadeOut(item)
{
    for(var i = 1.0; i > 0; i -= 0.1)
    {
        await delay(50);//100mS
        item.style.opacity = i;
    }
};

var prompt = async function(message, style, time)
{
    var objMainDiv;
    style = (style === undefined) ? 'alert-success' : style;
    time = (time === undefined) ? 1200 : time;

    // Select alert Div
    objMainDiv = document.querySelector("#short_url_alert");

    // Setting Message
    objMainDiv.innerText = message;

    // Show Div
    objMainDiv.style.opacity = 1;
    objMainDiv.style.display = "block";

    // Delay and fadeout
    await delay(time);
    await fadeOut(objMainDiv);
    objMainDiv.style.display = "";
};

var success_prompt = function(message, time)
{
    prompt(message, 'alert-success', time);
};

function Processing()
{
    var objUrl, sItemId, sUrl;
    objUrl = new URL(sUrl = document.querySelector("#main > div > div.shopee-page-wrapper > div.page-product > div.container > div:nth-child(3) > div._1zBnTu.page-product__shop > div._1Sw6Er > div > div._1jOO4S > a").href);

    // Get Item Id
    sItemId = objUrl.searchParams.get('itemId');
    console.log("[sItemId] = " + sItemId);

    // Combine the target url
    sUrl = objUrl.origin + objUrl.pathname + "/" + sItemId

    // Paste to Clipboard
    var clip_area = document.createElement('textarea');
    clip_area.textContent = sUrl;
    document.body.appendChild(clip_area);
    clip_area.select();
    document.execCommand('copy');
    clip_area.remove();
    success_prompt("已複製短網址到剪貼簿", 2000);
};

function addBtn(str)
{
    var objMainDiv, objShare, objFooter, objBtn, sAlert, sItem, sFooter;

    // Slect Main Div
    objMainDiv = document.querySelector("#main");

    // Add alert Div
    sAlert = '<div id="short_url_alert" class="alert alert-success"></div>';
    objMainDiv.insertAdjacentHTML('afterbegin', sAlert);

    //Select Share block
    objShare = document.querySelector("#main > div > div.shopee-page-wrapper > div.page-product > div.container > div.product-briefing.flex.card._2cRTS4 > div._30iQ1- > div.flex.justify-center.items-center > div.flex.items-center._3yHPog");

    // Append item to share block
    sItem = '<button name="btnSave" style="background-image:url(https://img.icons8.com/flat_round/50/000000/link--v1.png);" class="sprite-product-sharing _1CuuK_"></button>';
    objShare.insertAdjacentHTML('beforeend', sItem);

    //Select footer block
    objFooter = document.querySelector("#main > div > div.shopee-page-wrapper > footer > div > div > div._2F-jVh > div:nth-child(1) > ul");

    // Append Footer to footer block
    sFooter = '<a href=https://icons8.com/ class="_2TLzdl">The shortcut icon is form icons8</a>';
    objFooter.insertAdjacentHTML('beforeend', sFooter);

    // Select buttom
    objBtn = document.querySelector("#main > div > div.shopee-page-wrapper > div.page-product > div.container > div.product-briefing.flex.card._2cRTS4 > div._30iQ1- > div.flex.justify-center.items-center > div.flex.items-center._3yHPog > button:nth-child(7)");

    // Add click event
    objBtn.addEventListener('click',function(){
       Processing();
	},false)
};

var objCheckPage = setInterval(checkPage, 800);
function checkPage()
{
    var item;
    item = document.querySelector("#main > div > div.shopee-page-wrapper > div.page-product > div.container > div:nth-child(3) > div._1zBnTu.page-product__shop > div._1Sw6Er > div > div._1jOO4S");
    if (item != null)
    {
        addBtn();
        clearInterval(objCheckPage);
    }
}
