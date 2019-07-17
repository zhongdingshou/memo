let config = require('./config.js')
function post(postfix, data,token) {
  mpvue.showLoading({
    title: '玩命加载中...',
  })
  return new Promise((resolve, reject) => {
    mpvue.request({
      url: config.URL + postfix,
      data: data,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/json',
        'token':token
      }, // 设置请求的 header
      success(res) {
        // success
        mpvue.hideLoading();
        if(res.statusCode!==200){
          mpvue.showToast({
            title:  "网络出错-_-，稍后再试",
            icon: "none"
          });
          return false;
        }
        resolve(res.data);
      },
      fail(error) {
        // fail
        mpvue.hideLoading();
        reject(error);
      },
      complete() {
        // complete
        mpvue.hideLoading();
      }
    })
  })
}
function get(postfix, data,token) {
  mpvue.showLoading({
    title: '玩命加载中...',//数据请求前loading，提高用户体验
  })
  return new Promise((resolve, reject) => {
    mpvue.request({
      url: config.URL+postfix,
      data: data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/json',
        'token':token
      }, // 设置请求的 header
      success(res) {
        // success
        mpvue.hideLoading();
        if(res.statusCode!==200){
          mpvue.showToast({
            title:  "网络出错-_-，稍后再试",
            icon: "none"
          });
          return false;
        }
        resolve(res.data);
      },
      fail(error) {
        // fail
        mpvue.hideLoading();
        reject(error);//请求失败
      },
      complete() {
        mpvue.hideLoading();
        // complete
      }
    })
  })
}

export default {
  get,post
}
