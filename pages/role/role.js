// role.js
const utils = require('../../utils/util.js')
const getPric = require('../../utils/getPric.js')
const schoolName = require("../../data/staticData.js").schoolName
const serverData = require("../../data/staticData.js").serverData
let globalData = getApp().globalData

Page({
  data: {
    timeline:[],
    urlpage:1,
    schoolName: schoolName,
    urlData:{
      areaId: null,
      areaName: null,
      serverId: null,
      serverName:null,
      page: 1,
    },
    coef:globalData.coef
  },

  onLoad() {
    if (!wx.getStorageSync("serverId")){
      wx.showModal({
        content: '请选择区服',
        showCancel: false,
        confirmText: '确定',
        success: function(res) {
          wx.switchTab({
            url: '/pages/index/index',
          })
        },
      }) 
    }
    this.setData({
      'urlData.areaId': wx.getStorageSync('areaId'),
      'urlData.areaName': wx.getStorageSync('areaName'),
      'urlData.serverId':wx.getStorageSync('serverId'),
      'urlData.serverName': wx.getStorageSync('serverName')
    })
    wx.setNavigationBarTitle({
      title: this.data.urlData.areaName + '-' + this.data.urlData.serverName
    })
    console.log(wx.getStorageSync("areaName"))
    console.log(wx.getStorageSync("serverName"))
    console.log('onLoad')
  },
  onShow() {
    if ( utils.pageReload([this.data.timeline]) ) {
      wx.startPullDownRefresh({})
    }
  },
  onPullDownRefresh() {
    this.init()   
    wx.stopPullDownRefresh();
  },
  init(){
    this.getSoldList(true)
    console.log("init")
  }, 
  onReachBottom() {
    this.getSoldList()
  }, 
  getSoldList(reload) {
    wx.request({
      url: "https://recommd.xyq.cbg.163.com/cgi-bin/recommend.py?",
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36' },
      data: {
        'callback': 'Request.JSONP.request_map.request_1',
        '_': (new Date()).getTime(),
        'act': 'recommd_by_role',
        'server_id': this.data.urlData.serverId,
        'areaid': this.data.urlData.areaId,
        'server_name': this.data.urlData.serverName,
        'page': (reload? 1:(this.data.urlpage+1)),
        'kindid': 27,
        'view_loc': 'equip_list',
        'count': 15
      },
      success: (res) => {
        let data = res.data
        let list = JSON.parse(/.*?({.*}).*/.exec(data)[1])['equips']
        let rolelist = []
        for (let i=0;i<list.length;i++){
          let otherinfo = JSON.parse(list[i]['other_info'])
          rolelist.push({
                    roleScho: this.data.schoolName[list[i]['school']],
                    roleLevel: list[i]['level'] +'级',
                    roleArea: list[i]['server_id'],
                    roleSumm: '成就:'+otherinfo['AchPointTotal'] +'总修:'+otherinfo['xiulian']+'总宠修:'+otherinfo['pet_xiulian'],
                    rolePric: list[i]['price'],
                    roleTime: list[i]['time_left'],
                    gameOrderSn: list[i]['game_ordersn'],
                    allSkill: list[i]['all_skills'],
                    roleIcon: otherinfo['iIcon'],
                    roleIconUrl: `https://cbg-xyq.res.netease.com/images/role_icon/small/${otherinfo['iIcon']}.gif`,
                    calcPric: getPric.calcPric(otherinfo,this.data.coef).toFixed(2)
                  })
        }       
        this.setData({
          timeline: reload?rolelist:this.data.timeline.concat(rolelist),
        })
        this.data.urlpage += 1
      },
      fail: () => {
        wx.showToast({
          title: '网路开小差，请稍后再试',
          icon: 'none',
        })
      },
    })
  },
})
