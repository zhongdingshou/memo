<script>
  import login from './utils/login.js'
  import request from './utils/request.js'
  import cache from './utils/cache.js'
  export default {
    beforeMount(){
      this.memoUpdate();
      this.getSetting()
    },
    methods:{
      getSetting(){
        let that = this;
        mpvue.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              that.login()
            }
          }
        })
      },
      async login(){
        let code = await login.getCode();
        let token = await cache.get('token','');
        let data = await request.post('/user/login', {code: code}, token);
        if (data && data.status === 1) {
          cache.put('token', data.token, 7200);
          cache.put('is_set', data.is_set, 0)
        }
      },
      //及时更新小程序
      memoUpdate() {
        const updateManager = mpvue.getUpdateManager();

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
        });
        updateManager.onUpdateFailed(function () {
          // 新版本下载失败
          console.log('新版本下载失败')
        })
      }
  },
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
