
// function setRem(){
//   var docEl = document.documentElement,resizeEvt = "orientationchange" in window ? "orientationchange" : "resize", recalc=function(){
//     var clientWidth=docEl.clientWidth;
//     if(!clientWidth){
//       return
//     }
//     docEl.style.fontSize = 100*(clientWidth/375)+"px"
//   };
//   if(!document.addEventListener){
//     return
//   }
//   window.addEventListener(resizeEvt,recalc,false);
//   document.addEventListener("DOMContentLoaded",recalc,false);
//     setTimeout(function(){
//       document.getElementsByTagName("body")[0].style.height=docEl.clientHeight+"px"
//     }, 20)
//   }

//   // 初始化
// setRem();
// // 改变窗口大小时重新设置 rem
// window.onresize = function () {
//     setRem()
// }
(function (window, document) {

  function resize(){
    var ww = window.innerWidth;
    if (ww > window.screen.width) {
      window.requestAnimationFrame(resize);
    }
    else {
      if (ww > 750) ww = 750;
      // 下面代码按照比例为100px = 1rem，此处一定要同pxToRem的转换比例
      document.documentElement.style.fontSize = ww * 100 / 750 + 'px';
    }
  }

  if (document.readyState !== 'loading') {
    resize();
  } else {
    document.addEventListener('DOMContentLoaded', resize);
  }

  window.addEventListener('resize', resize);

})(window, document);