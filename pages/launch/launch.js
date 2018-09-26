//index.js
Page({
  data: {
  },
  onLoad(){
    let timer = setTimeout(() => {
      clearTimeout(timer)
      wx.reLaunch({
        url: '/pages/role/role',
      })
    }, 2000)
  }



})
