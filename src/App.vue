<script>
  var config = require('./utils/config.js')
  export default {
  beforeMount(){
    this.memoUpdate();
    this.login();
  },
  methods:{
    //及时更新小程序
    memoUpdate() {
    const updateManager = mpvue.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          mpvue.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })

    // updateManager.onUpdateFailed(function () {
    //   // 新版本下载失败
    //   console.log('新版本下载失败')
    // })
  },
    // 登录
    login (){
      var token = mpvue.getStorageSync('token')||[]
      mpvue.login({
        timeout:4000,
        success(res) {
          if (res.code) {
            var code = res.code
            // 发起网络请求
            mpvue.getSetting({
              success(res) {
                if (res.authSetting['scope.userInfo']) {
                  mpvue.request({
                    url: config.URL + '/user/login',
                    method:'POST',
                    header:{
                      token:token
                    },
                    data: {
                      code: code
                    },
                    success(res) {
                      if (res.data.status===1) {
                        mpvue.setStorageSync('token', res.data.token)
                        mpvue.setStorageSync('is_set', res.data.is_set)
                      }
                    }
                  })
                }
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        },
        fail(){
          console.log('登录失败！')
        }
      });
    },
  },
  // created () {
  //   // 调用API从本地缓存中获取数据
  //   /*
  //    * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
  //    * 微信：mpvue === wx, mpvuePlatform === 'wx'
  //    * 头条：mpvue === tt, mpvuePlatform === 'tt'
  //    * 百度：mpvue === swan, mpvuePlatform === 'swan'
  //    * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
  //    */
  //
  //   let logs
  //   if (mpvuePlatform === 'my') {
  //     logs = mpvue.getStorageSync({key: 'logs'}).data || []
  //     logs.unshift(Date.now())
  //     mpvue.setStorageSync({
  //       key: 'logs',
  //       data: logs
  //     })
  //   } else {
  //     logs = mpvue.getStorageSync('logs') || []
  //     logs.unshift(Date.now())
  //     mpvue.setStorageSync('logs', logs)
  //   }
  // },
  // log () {
  //   console.log(`log at:${Date.now()}`)
  // }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
