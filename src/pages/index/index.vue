<template>
  <div class="home">
    <div v-if="hasData">
      <ul>
        {{items.describe}}
      </ul>
    </div>
    <div v-else>
      <button open-type="getUserInfo" @getuserinfo="getUserInfo">获取用户信息</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  var config = require('../../utils/config.js')
export default {
  data() {
    return {
      hasData:false,
      items: []
    }
  },
  beforeMount() {
    this.operateUserInfo();
    this.getSecret();
  },
  methods:{
    seeSacret(id){
      console.log(id);
    },
    operateUserInfo(){
      mpvue.getUserInfo({
        success: (res)=>{
          var useInfo = res.userInfo;//用户信息
          mpvue.setStorage({//缓存
            key: 'userInfo',
            data: useInfo
          });
          this.hasData = true;
        },
        fail(){
          console.log('获取失败')
        }
      });
    },

    getUserInfo(data){
      if (data.mp.detail.rawData){
        this.operateUserInfo();
        var token = mpvue.getStorageSync('token')||[]
        mpvue.login({
          timeout:4000,
          success(res) {
            if (res.code) {
              var code = res.code
              // 发起网络请求
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
                  this.hasData = true;
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
      }
    },
    getSecret(){
      var token = mpvue.getStorageSync('token') || []
      if (token) {
        mpvue.request({
          url: config.URL + '/secret/getSecret',
          header:{
            token:token
          },
          success(res) {
            if(res.data.status===1)
              this.items =  res.data.data
            console.log(res.data.data)
          }
        })
      } else {
        this.operateUserInfo();
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
