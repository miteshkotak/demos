"use strict";var pixelDebugHelper=function e(){var t=document.querySelector(".js-test-button"),n=document.querySelector(".js-fb-opt-out"),i=document.querySelector(".js-test-output"),o=function e(){var t="1"===navigator.doNotTrack,n="opt-out"===localStorage.getItem("fb-pixel-status");return t||n},r=function e(t){var n=document.createElement("li");n.innerText=t,i.appendChild(n)},u=function e(){var t=document.querySelector(".js-opt-out-status"),n=o(),i=n?"Pixel ist deaktiviert.":"Pixel ist aktiviert.";t.innerText=i};t.addEventListener("click",function(e){window.hasOwnProperty("fbq")?(fbq("trackCustom","PixelOptOutTest"),r("Event `PixelOptOutTest` abgeschickt.")):r("fbq war nicht definiert. Kein eigenes Event gesendet."),u()}),n.addEventListener("click",function(){r("Opt Out-Link geklickt."),u()})};"complete"===document.readyState?pixelDebugHelper():window.addEventListener("load",function(){pixelDebugHelper()});