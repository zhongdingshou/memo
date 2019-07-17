function achieveFunctions(functionsType){
  switch (functionsType) {
    case "command":
      goto('command');
      break;
    case "questions":
      goto('questions');
      break;
    case "mail":
      goto('mail');
      break;
    case "encryption":
      goto('encryption');
      break;
    case "abandon":
      remind();
      break;
    case "about":
      goto('about');
      break;
    default: return ;

  }
}
function goto(where){
  wx.navigateTo({
    url: '../'+where+'/main'
  })
}
function remind(){
  mpvue.showModal({
    title: '提醒！！！',
    content: '是否放弃使用备忘录小程序？（如果是将删除所有数据，请慎重考虑）',
    confirmText:'要放弃',
    confirmColor:'#FD112D',
    success: function (res) {
      if (res.confirm) {
        wx.navigateTo({
          url: '../abandon/main'
        })
      }
    }
  });
}

export default {
  achieveFunctions
}
