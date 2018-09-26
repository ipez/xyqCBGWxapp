//index.js
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
  },
  onLoad(){
    let timer = setTimeout(() => {
      clearTimeout(timer)
      wx.switchTab({
        url: '/pages/role/role',
      })
    }, 2000)
  }



})
