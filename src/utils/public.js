// 防抖
export const Debounce = (fn, t) => {
  let delay = t || 500;
  let timer;
  console.log(fn);
  console.log(typeof fn);
  return function () {
    let args = arguments;
    if(timer){
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, delay);
  }
};
// 节流
export function Throttle(fn, interval=200) {
  var last;
  var timer;
  return function () {
    var th = this;
    var args = arguments;
    var now = +new Date();
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        last = now;
        fn.apply(th, args);
      }, interval);
    } else {
      last = now;
      fn.apply(th, args);
    }
  }
}
