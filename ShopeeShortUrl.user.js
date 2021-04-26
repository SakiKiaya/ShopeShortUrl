// ==UserScript==
// @name         Shopee short url
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  Copy the short url from shopee
// @author       SakiKiaya
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
    objMainDiv.style.display = "block";

    // Delay and fadeout
    await delay(time);
    await fadeOut(objMainDiv);
    objMainDiv.style = "";
};

var success_prompt = function(message, time)
{
    prompt(message, 'alert-success', time);
};

function GetKeyword(obj, type)
{
    if (obj === undefined)
    {
        return null
    }
    else
    {
        if (obj.textContent != "")
        {
            return obj.textContent;
        }
        if (obj.href != "")
        {
            return obj.href;
        }
    }
    return null;
};

function FindObjByKeyword(obj, value)
{
   var list = document.querySelectorAll(obj), i;
   var sItem = "", nMatchIndex=-1;
   for (i = 0; i < list.length; ++i) {
       if (GetKeyword(list[i]) == null) continue;
       sItem = GetKeyword(list[i], obj);
       //console.log(list[i]);
       if (sItem.match(value))
       {
           console.log("[Match] " + list[i]);
           nMatchIndex = i;
       }
   }
   return nMatchIndex == -1 ? null: list[nMatchIndex];
};

function FindBottonByKeyword(obj, value)
{
   var list = document.querySelectorAll(obj), i;
   var sItem = "", nMatchIndex=-1;
   for (i = 0; i < list.length; ++i) {
       sItem = list[i].ariaLabel
       if (sItem == null) continue;
       //console.log(sItem);
       if (sItem.match(value))
       {
           console.log("[Match] " + list[i]);
           nMatchIndex = i;
       }
   }
   return nMatchIndex == -1 ? null: list[nMatchIndex];
};

var GetShareDiv = function()
{
    return FindObjByKeyword('div', '分享');
};

var GetAvaterUrl = function()
{
    return FindObjByKeyword('a', 'categoryId');
};

var GetTwitterButton = function()
{
   //var list = document.querySelectorAll('button');
   return FindBottonByKeyword('button', 'Twitter');
};

var GetFooter = function()
{
    return FindObjByKeyword('div', '聯絡媒體');
}
function Processing()
{
    var objUrl, sItemId, sUrl;
    objUrl = new URL(sUrl = GetAvaterUrl().href);

    // Get Item Id
    sItemId = objUrl.searchParams.get('itemId');
    console.log("[sItemId] = " + sItemId);

    // Combine the target url
    sUrl = objUrl.origin + objUrl.pathname + "/" + sItemId

    // Paste to Clipboard
    navigator.clipboard.writeText(sUrl);
    success_prompt("已複製短網址到剪貼簿", 2000);
};

function addBtn(str)
{
    var objMainDiv, objShare, objFooter, objBtn, sAlert, sItem, sFooter;

    // Slect Main Div
    objMainDiv = document.querySelector("div");

    // Add alert Div
    sAlert = '<div id="short_url_alert" class="alert alert-success"></div>';
    objMainDiv.insertAdjacentHTML('afterbegin', sAlert);

    //Select Share block
    objShare = GetTwitterButton();

    // Append item to share block
    sItem = objShare.cloneNode(true);
    sItem.name = "btnSave";
    sItem.style = "background-image:url(https://img.icons8.com/flat_round/50/000000/link--v1.png);";
    sItem.setAttribute('aria-label', 'Copy short URL');
    objShare.parentNode.appendChild(sItem);

    //Select footer block
    objFooter = GetFooter();

    // Append Footer to footer block
    sFooter = objFooter.children[0].cloneNode(true);
    objFooter.children[1].appendChild(sFooter);
    objFooter = objFooter.children[1].children[objFooter.children[1].childElementCount-1];
    objFooter.textContent = "";
    objFooter.insertAdjacentHTML('afterend', "<a href='https://icons8.com/'>The shortcut icon is form icons8</a>");

    // Select button
    objBtn = document.getElementsByName('btnSave').item(0);

    // Add click event
    objBtn.addEventListener('click',function(){
       Processing();
	},false)
};


var objCheckPage = null;
function checkPage()
{
    var item;
    item = GetTwitterButton();
    if (item != null)
    {
        console.log('add');
        clearInterval(objCheckPage);
        addBtn();
    }
}

window.addEventListener('load', (event) => {
    objCheckPage = setInterval(checkPage, 800);
});
