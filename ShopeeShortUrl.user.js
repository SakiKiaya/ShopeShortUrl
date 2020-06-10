// ==UserScript==
// @name         Shopee short url
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copy the short url from shopee
// @author       You
// @match        http*://shopee.tw/*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js
// ==/UserScript==

GM_addStyle(`
    .alert {display: none;position: fixed;top: 50%;left: 50%;min-width: 300px;max-width: 600px;transform: translate(-50%,-50%);z-index: 99999;text-align: center;padding: 15px;border-radius: 3px;}
    .alert-success {color: #3c763d;background-color: #dff0d8;border-color: #d6e9c6;}
`);

var prompt = function (message, style, time)
{
    style = (style === undefined) ? 'alert-success' : style;
    time = (time === undefined) ? 1200 : time;
    $('<div>')
        .appendTo('body')
        .addClass('alert ' + style)
        .html(message)
        .show()
        .delay(time)
        .fadeOut();
};

var success_prompt = function(message, time)
{
    prompt(message, 'alert-success', time);
};

function addBtn(str)
{
    $('<button name="btnSave" style="margin-left: 10px;">')
        .appendTo("#main > div > div.shopee-page-wrapper > div.page-product > div.container > div.product-briefing.flex.card._2cRTS4 > div._30iQ1- > div.flex.justify-center.items-center > div.flex.items-center._3yHPog")
        .html("縮短網址")
        .show();

    var btn = document.querySelector("#main > div > div.shopee-page-wrapper > div.page-product > div.container > div.product-briefing.flex.card._2cRTS4 > div._30iQ1- > div.flex.justify-center.items-center > div.flex.items-center._3yHPog > button:nth-child(7)");

    btn.addEventListener('click',function(){
        var asConttent, sUrl;
        sUrl =window.location.href;
        asConttent = sUrl.split('.');
        sUrl = document.querySelector("#main > div > div.shopee-page-wrapper > div.page-product > div.container > div:nth-child(3) > div._1zBnTu.page-product__shop > div._1Sw6Er > div > div._1jOO4S > a").href + "/" + asConttent[asConttent.length-1];console.log(sUrl);var clip_area = document.createElement('textarea');
        clip_area.textContent = sUrl;
        document.body.appendChild(clip_area);
        clip_area.select();
        document.execCommand('copy');
        clip_area.remove();
        success_prompt("已複製到剪貼簿", 2000);
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