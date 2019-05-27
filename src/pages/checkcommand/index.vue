<template>
  <div class="create">
    <form class='search-box' @submit='checkCommand'>
      <input class="search-text" name="command" type="number" :value="kouling"  placeholder="请输入口令..." maxlength="4" confirm-type="验证" @confirm="checkCommand" focus='true'>
      <button class="search-btn" form-type="submit">验证</button>
    </form>
  </div>
</template>

<script type="text/ecmascript-6">
  import functions from '../../utils/functions.js'
  import cache from '../../utils/cache.js'
  import request from '../../utils/request.js'
  import login from '../../utils/login.js'
export default {
  data() {
    return{
      kouling:''
    }
  },
  beforeMount() {
  },
  methods: {
    async login(){
      let token = await cache.get('token')
      if (!token) {
        let code = await login.getCode()
        let data = await request.post('/user/login', {code: code}, token)
        if (data && data.status === 1) {
          cache.put('token', data.token, 7200)
          cache.put('is_set', data.is_set, 0)
        }
      }
    },
    async checkCommand(data){
      let command = await data.mp.detail.value.command?await data.mp.detail.value.command:await data;
      if (functions.trim(command)&&parseFloat(command).toString() !== "NaN") {
        let token = await cache.get('token')
        if (token) {
          let data = await request.post('/command/checkCommand', {command:command}, token)
          if (data&&data.status===1){
            let options = functions.getOptions()
            this.goWhere(options.where,options)
          } else {
            this.kouling=''
            mpvue.showToast({
              title: data.msg,
              icon: 'none',
              duration: 1500,
              mask: true
            })
          }
          return true;
        } else {
          this.login().then(this.checkCommand(command))
        }
      } else {
        this.kouling=''
        mpvue.showToast({
          title: "口令为空或者不是数字，请检查",
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
    },
    goWhere(where,options){
      //拼接url的参数
      let data = ''
      for(let key in options){
        let value = options[key]
        data += key + '=' + value + '&'
      }
      data = data.substring(data.indexOf('&',0), data.length-1)
      mpvue.redirectTo({
        url:"../"+where +"/main?" + data
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">


</style>
