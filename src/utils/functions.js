
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

function getStrLen(str) {
  if (str == null) return 0;
  if (typeof str != "string"){
    str += "";
  }
  return str.replace(/[^\x00-\xff]/g,"01").length;
}

function checkSet(s,w){
  if(!s)return false;
  let arr = s.split(".");
  for (let i=1;i<arr.length-1;i++){
    if(parseInt(arr[i])===w){
      return true
    }
  }
  return false
}

function addSet(s,w){
  if(!s){
    s = '.' + w + '.'
  } else {
    if(!checkSet(s,w)){
      s = s + w + '.'
    }
  }
  return s
}

function delSet(s,w){
  if(s){
    if(checkSet(s,w)){
      let temp = '.';
      let arr = s.split(".");
      for (let i=1;i<arr.length-1;i++){
        if(parseInt(arr[i])!==w){
          temp = temp + arr[i] + '.'
        }
      }
      s = temp
    }
  }
  return s
}


function isEmojiCharacter(substring) {
  for (let i = 0; i < substring.length; i++) {
    let hs = substring.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (substring.length > 1) {
        let ls = substring.charCodeAt(i + 1);
        let uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (substring.length > 1) {
      let ls = substring.charCodeAt(i + 1);
      if (ls === 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= hs && hs <= 0x27ff) {
        return true;
      } else if (0x2B05 <= hs && hs <= 0x2b07) {
        return true;
      } else if (0x2934 <= hs && hs <= 0x2935) {
        return true;
      } else if (0x3297 <= hs && hs <= 0x3299) {
        return true;
      } else if (hs === 0xa9 || hs === 0xae || hs === 0x303d || hs === 0x3030
        || hs === 0x2b55 || hs === 0x2b1c || hs === 0x2b1b
        || hs === 0x2b50) {
        return true;
      }
    }
  }
}


function filterEmoji(substring){
  let regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
  return substring.replace(regStr,"");
}

module.exports = {
  trim: trim,
  getCurrentPageUrl: getCurrentPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs,
  getOptions:getOptions,
  getStrLen:getStrLen,
  checkSet:checkSet,
  addSet:addSet,
  delSet:delSet,
  isEmojiCharacter:isEmojiCharacter,
  filterEmoji:filterEmoji
};
