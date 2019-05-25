//小程序本地缓存时效封装
let dtime = '_deadtime';
function put(k, v, t) {
  mpvue.setStorageSync(k, v)
  let seconds = parseInt(t);
  if (seconds > 0) {
    let timestamp = Date.parse(new Date())/1000 + seconds;
    mpvue.setStorageSync(k + dtime, timestamp+'')
  } else {
    mpvue.removeStorageSync(k + dtime)
  }
}

function get(k, def) {
  let deadtime = parseInt(mpvue.getStorageSync(k + dtime))
  if (deadtime) {
    if (parseInt(deadtime) < Date.parse(new Date())/1000) {
      if (def) { return def; } else { return null; }
    }
  }
  let res = mpvue.getStorageSync(k);
  if (res) {
    return res;
  } else {
    if (def) { return def; } else { return null; }
  }
}

function remove(k) {
  mpvue.removeStorageSync(k);
  mpvue.removeStorageSync(k + dtime);
}

function clear() {
  mpvue.clearStorageSync();
}

module.exports = {
  put: put,
  get: get,
  remove: remove,
  clear: clear,
}
