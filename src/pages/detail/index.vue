<template>
  <div class="create">
    <div class="content">
      <form class='search-box' @submit='editSecret'>
        <input class="search-text" hidden name="id" :value="id" type="text">
        <span>描述：<input class="search-text" name="describe" :value="describe" type="text"  placeholder="请输入描述..."></span>
        <span>账号：<input class="search-text" name="account" :value="account" type="text"  placeholder="请输入账号..."></span>
        <span>密码：<input class="search-text" name="password" :value="password" type="text"  placeholder="请输入密码..."></span>
        <button class="search-btn" form-type="submit">更新</button>
        <button class="search-btn" @click="delSecret(id)">删除</button>
    </form>
    </div>
  </div>
</template>

<script>
  import functions from '../../utils/functions.js'
  import cache from '../../utils/cache.js'
  import request from '../../utils/request.js'
    export default {
      data() {
        return {
          id:0,
          describe:'',
          account:'',
          password:''
        }
      },
      beforeMount() {
        let options = functions.getOptions()
        this.getDetail(options.id)
      },
      methods: {
        async delSecret(id){
          if (id){
            let token = await cache.get('token')
            let data = await request.post('/secret/delSecret', {id:id}, token)
            mpvue.showToast({
              title: data.msg,
              icon: 'none',
              duration: 1500,
              mask: true
            })
            if (data&&data.status===1) {
              setTimeout(mpvue.switchTab({
                url: '../index/main'
              }), 3000)
              clearTimeout()
            }
          } else {
            mpvue.showToast({
              title: "请选择需要删除的备忘录",
              icon: 'none',
              duration: 1500,
              mask: true
            })
          }
        },
        async editSecret(e){
          let id = await e.mp.detail.value.id
          let describe = await e.mp.detail.value.describe
          let account = await e.mp.detail.value.account
          let password = await e.mp.detail.value.password
          let token = await cache.get('token')
          let data = await request.post('/secret/editSecret', {
            id:id,
            describe:describe,
            account:account,
            password:password
          }, token)
          mpvue.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        },
        async getDetail(id){
          let token = await cache.get('token')
          let data = await request.post('/secret/getDetail', {id:id}, token)
          if (data&&data.status===1){
            this.id = data.data.id
            this.describe = data.data.describe
            this.account = data.data.account
            this.password = data.data.password
          } else {
            mpvue.showToast({
              title: data.msg,
              icon: 'none',
              duration: 1500,
              mask: true
            })
          }
        }
      }
    }
</script>

<style scoped>

</style>
