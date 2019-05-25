<template>
  <div class="home container">
    <div v-if="hasData" class="main">
      <div class="weui-search-bar">
        <div class="weui-search-bar__form">
          <div class="weui-search-bar__box">
            <icon class="weui-icon-search_in-box" type="search" size="14"></icon>
            <input type="text" class="weui-search-bar__input" placeholder="搜索备忘录..."  v-model.trim="inputVal" :focus="inputShowed" @input="inputTyping" />
            <div class="weui-icon-clear" v-if="inputVal.length > 0" @click="clearInput">
              <icon type="clear" size="14"></icon>
            </div>
          </div>
          <label class="weui-search-bar__label" :hidden="inputShowed" @click="showInput">
            <icon class="weui-icon-search" type="search" size="14"></icon>
            <div class="weui-search-bar__text mind">搜索...</div>
          </label>
        </div>
        <div class="weui-search-bar__cancel-btn" :hidden="!inputShowed" @click="hideInput">取消</div>
      </div>
      <div v-if="items.length>0">
        <div class="list">
          <div class="weui-cells weui-cells_after-title">
            <scroll-view scroll-y >
              <li v-for="item in items" :key="item.id" @click="lookSacret(item.id)" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
                <div class="weui-cell__bd">{{item.describe}}</div>
                <div class="weui-cell__ft weui-cell__ft_in-access"></div>
              </li>
            </scroll-view>
          </div>
        </div>
      </div>
      <div v-else>
        ____暂无数据____
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
  import request from '../../utils/request.js'
export default {
  data() {
    return {
      page: 1,      // 当前页数
      total_page: 0, // 总页数
      inputShowed: false,
      inputVal: "",
      hasData: false,
      items: {}
    }
  },
  beforeMount() {
    this.operateUserInfo();
    if(cache.get('token'))
      this.getSecret();
  },
// 下拉刷新
  onPullDownRefresh () {
    // 初始化页码
    this.page = 1
    this.getSecret()
  },
  // 上拉加载
  onReachBottom () {
    if (this.page >= this.total_page) {
      mpvue.showToast({
        title: "没有数据了",
        icon: 'none',
        duration: 1000,
        mask:true
      })
    } else {
      // 下一页
      this.page = this.page + 1
      this.getSecret()
    }
  },
  methods:{
    //查看详细信息
    async lookSacret(id){
      if (parseFloat(id).toString() !== "NaN"){
        mpvue.navigateTo({
          url:"../checkcommand/main?where=detail&&id=" + id
        })
      } else {
        mpvue.showToast({
          title: '请选择需要查看的备忘录',
          icon: 'none',
          duration: 1500,
          mask:true
        })
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

    async searchSacret(data=''){
      let keywords =functions.trim( await data)
      if (keywords){
        let token = await cache.get('token')
        if (token) {
          let data = await request.post('/secret/searchSecret', {keywords:keywords}, token)
          if (data&&data.status===1)
            this.items =  data.data;
          else{
            this.items =  []
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
          await this.searchSacret()
        }
      } else {
        this.page = 1
        this.getSecret()
      }
    },

    async login(){
      let code = await login.getCode()
      let token = await cache.get('token')
      let data = await request.post('/user/login', {code: code}, token)
      if (data && data.status === 1) {
        cache.put('token', data.token, 7200)
        cache.put('is_set', data.is_set, 0)
      }
    },

    async getUserInfo(data){
      if (data.mp.detail.rawData){
        await this.operateUserInfo();
        this.getSecret()
      }
    },

    async getSecret(){
      let token = await cache.get('token')
      if (token) {
        let data = await request.get('/secret/getSecret',{page:this.page},token)
        mpvue.stopPullDownRefresh()
        if (data&&data.status===1){
          if (this.page === 1) {
            // 数据
            this.items = await data.data;
          } else {
            // 数据追加
            for (let i = 0;i<data.data.length;i++){
              this.items.push(data.data[i])
            }
          }
          // 总页数
          this.total_page = await data.total_page
        }
        else{
          mpvue.showToast({
            title: data.msg,
            icon: 'none',
            duration: 1500,
            mask:true
          })
        }
        return true
      }
      else {
        await this.login()
        await this.getSecret()
      }
    },
    showInput() {
      this.inputShowed = true;
    },
    hideInput() {
      this.inputVal = '';
      this.inputShowed = false
    },
    clearInput() {
      this.inputVal = '';
      this.searchSacret()
    },
    inputTyping(e) {
      this.inputVal = e.mp.detail.value
      this.searchSacret(e.mp.detail.value)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">



</style>
