<template>
  <div class="home container">
    <div v-if="hasData" class="main">
      <div class="search">
        <form class='search-box' @submit='searchSacret'>
          <input class="search-text" name="keywords" type="text"  placeholder="搜索备忘录...">
          <button class="search-btn" form-type="submit">搜索</button>
        </form>
      </div>
      <div class="list">
        <ul>
          <li v-for="item in items" :key="item.id" @click="lookSacret(item.id)">{{item.describe}}</li>
        </ul>
      </div>
    </div>
    <div v-else class="obtain">
      <button open-type="getUserInfo" @getuserinfo="getUserInfo">获取用户信息</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import functions from '../../utils/functions.js'
  import cache from '../../utils/cache.js'
  import login from '../../utils/login.js'
  import config from '../../utils/config.js'
  import request from '../../utils/request.js'
export default {
  data() {
    return {
      hasData: false,
      items: []
    }
  },
  beforeMount() {
    this.operateUserInfo();
    if (cache.get('token',''))
      this.getSecret();
  },
  // onShow(){
  //   if (cache.get('token',''))
  //     this.getSecret();
  // },

  methods:{
    //查看详细信息
    lookSacret(id){
      if (!id){
        mpvue.showToast({
          title: '请选择需要查看的备忘录',
          icon: 'none',
          duration: 1500,
          mask:true
        })
      } else {
        let token = cache.get('token')
        if (token) {
          mpvue.request({
            url: config.URL + '/secret/getDetail',
            method: 'POST',
            header: {
              token: token
            },
            data: {
              id: id
            },
            success(res) {
              if (res.data.status === 1)
                mpvue.showToast({
                  title: '描述：'+res.data.data.describe+' | '+'id：'+res.data.data.id+' | '+'账号：'+res.data.data.account+' | '+'密码：'+res.data.data.password,
                  icon: 'none',
                  duration: 5000,
                  mask: true
                })
                //console.log(res)
              else {
                mpvue.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 1500,
                  mask: true
                })
              }
            }
          })
        } else {
          this.hasData = false
        }
      }
    },

    operateUserInfo(){
      let that = this;
      mpvue.getUserInfo({
        success: (res)=>{
          let useInfo = res.userInfo;//用户信息
          mpvue.setStorageSync('userInfo', useInfo)
          that.hasData = true;
        }
      });
    },

    async searchSacret(data){
      let keywords = await data.mp.detail.value.keywords
      if (functions.trim(keywords)){
        let token = await cache.get('token')
        if (token) {
          let data = await request.post('/secret/searchSecret', {keywords:keywords}, token)
          if (data&&data.status===1)
            this.items =  data.data;
          else{
            mpvue.showToast({
              title: data.msg,
              icon: 'none',
              duration: 1500,
              mask:true
            })
          }
        } else {
          mpvue.showToast({
            title: '搜索失败',
            icon: 'none',
            duration: 1500,
            mask:true
          })
          this.hasData = false
        }
      }
      else{
        this.getSecret()
      }
    },

    async login(){
      let code = await login.getCode()
      let token = await cache.get('token')
      let data = await request.post('/user/login', {code: code}, token)
      if (data && data.status === 1) {
        cache.put('token', data.token, 7200)
        cache.put('is_set', data.is_set, 7200)
      }
    },

    async getUserInfo(data){
      if (data.mp.detail.rawData){
        await this.operateUserInfo();
        await this.login()
        await this.getSecret()
      }
    },

    async getSecret(){
      let token = await cache.get('token')
      if (token) {
        let data = await request.get('/secret/getSecret',{},token)
        if (data&&data.status===1)
          this.items =  data.data;
        else{
          mpvue.showToast({
            title: data.msg,
            icon: 'none',
            duration: 1500,
            mask:true
          })
        }
        return true
      } else {
        await this.login()
        await this.getSecret()
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 200rpx 0;
    box-sizing: border-box;
  }
.obtain{

}
</style>
