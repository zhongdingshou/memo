let config = require('./config.js')
let cache = require('./cache.js')
//登陆
function login (){
  mpvue.login({
    timeout:4000,
    success(res) {
      if (res.code) {
        let code = res.code
        console.log(code)
        let token = cache.get('token')
        // 发起网络请求
        mpvue.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              mpvue.request({
                url: config.URL + '/user/login',
                method:'POST',
                data: {
                  code: code
                },
                header:{
                  token:token
                },
                success(res) {
                  if (res.data.status===1) {
                    cache.put('token', res.data.token,7200)
                    cache.put('is_set', res.data.is_set,7200)
                  }
                }
              })
            }
          }
        })
      }
    }
  });
}
function getCode(){
  return new Promise((resolve, reject)=>{
    mpvue.login({
      timeout:4000,
      success: function (res) {
        if (res.code) {
          resolve(res.code)
        }
      },
      fail(error) {
        reject(error)
      }
    })
  });
}
export default {
  login,getCode
}

