<template>
  <div class="create">
    <div class="content">
      <form class='search-box' @submit='creatSecret'>
        <span>描述：<input class="search-text" name="describe" :value="describe" type="text"  placeholder="请输入描述..."></span>
        <span>账号：<input class="search-text" name="account" :value="account" type="text"  placeholder="请输入账号..."></span>
        <span>密码：<input class="search-text" name="password" :value="password" type="text"  placeholder="请输入密码..."></span>
        <button class="search-btn" form-type="submit">提交</button>
      </form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import functions from '../../utils/functions.js'
  import cache from '../../utils/cache.js'
  import request from '../../utils/request.js'
export default {
  data() {
    return {
      describe:"",
      account:"",
      password:""
    }
  },
  methods: {
    async creatSecret(e) {
      let describe = await e.mp.detail.value.describe
      let account = await e.mp.detail.value.account
      let password = await e.mp.detail.value.password
      if (functions.trim(describe)
      && functions.trim(account)
      &&functions.trim(password)) {
        let token = await cache.get('token')
        let data = await request.post('/secret/creatSecret', {
          describe: describe,
          account: account,
          password: password
        }, token)
        if (data&&data.status===1){
          this.describe = ""
          this.account = ""
          this.password = ""
        }
        mpvue.showToast({
          title: data.msg,
          icon: 'none',
          duration: 2000,
          mask: true
        })
      } else {
        mpvue.showToast({
          title: "所有选项内容不能为空，请检查",
          icon: 'none',
          duration: 2000,
          mask: true
        })
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
