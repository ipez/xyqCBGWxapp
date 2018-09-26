App({
  onLaunch () {
    this.globalData.coef = {
      gold2money: wx.getStorageSync('coef.gold2money') || 0.8,
      money2rmb: wx.getStorageSync('coef.money2rmb') || 270,
      xlgmoney: wx.getStorageSync('coef.xlgmoney') || 64
    }
    wx.setStorageSync('coef', this.globalData.coef)
  },
  globalData: {
    coef: {},
    config: {
      recommdRequestUrl: 'https://recommd.xyq.cbg.163.com/cgi-bin/recommend.py?'
    }
  },
})

/*
*/