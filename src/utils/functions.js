
//去掉前后空格
function trim(str) {
  str = str.replace(/^(\s|\u00A0)+/, '');
  for (var i = str.length - 1; i >= 0; i--) {
    if (/\S/.test(str.charAt(i))) {
      str = str.substring(0, i + 1);
      break;
    }
  }
  return str;
}

/*获取当前页url*/
function getCurrentPageUrl(){
  let pages = getCurrentPages()    //获取加载的页面
  let currentPage = pages[pages.length-1]    //获取当前页面的对象
  let nowUrl = currentPage.route    //当前页面url
  return nowUrl
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs(){
  let pages = getCurrentPages()    //获取加载的页面
  let currentPage = pages[pages.length-1]    //获取当前页面的对象
  let url = currentPage.route    //当前页面url
  let options = currentPage.options    //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  let urlWithArgs = url + '?'
  for(let key in options){
    let value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length-1)

  return urlWithArgs
}

function getOptions(){//获取参数对象值
  let pages = getCurrentPages()    //获取加载的页面
  let currentPage = pages[pages.length-1]    //获取当前页面的对象
  let options = currentPage.options    //如果要获取url中所带的参数可以查看options
  return options
}

module.exports = {
  trim: trim,
  getCurrentPageUrl: getCurrentPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs,
  getOptions:getOptions
}
