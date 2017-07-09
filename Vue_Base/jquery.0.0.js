/*
    window.onload      页面加载完毕
                   eg:加载：css，html，js，图片等
    domReady          DOM结构加载完毕以后

    DOMContentLoaded   dom结构加载完毕以后
        兼容高级浏览器（IE9，10，chrome，ff）
   IE下想兼容模拟一个：
        document.onreadystatechange     监控资源加载情况
        document.readyState         资源此时情况
        document.readyState=='complete' dom资源加载完毕
            (这个是模拟加载)
*/
'use strict'
function $(fn) {
    if(document.addEventListener){
        document.addEventListener('DOMContentLoaded',function () {
            fn&&fn();
        },false)
    }else{
        document.attachEvent('onreadystatechange',function () {
            if (document.readyState=='complete'){
                fn&&fn();
            }
        })
    }
}