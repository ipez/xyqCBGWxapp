// pages/index/index.js
const serverData = require("../../data/staticData.js").serverData

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight:'',
    letter:[],
    areaListId:[],
    areaList:[],
    hiddenModal: true,
    modalArea:'',
    modalServerList:[],
    areaIdChosen:'',
    serverIdChosen: '',
    areaNameChosen: '',
    serverNameChosen: ''
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ scrollHeight: res.windowHeight })
      },
    })   
    this.toLetterList(serverData)   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  letterTap(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
    this.setData({
      areaListId: item
    })
  },

  areaTap(e) {
    let item = e.currentTarget.dataset.item
    console.log(item[1])
    let templist =[]
    console.log(templist)
    for(let i in item[1]){templist.push(item[1][i])}
    console.log('选中大区：', item[0][0])
    console.log(templist)
    this.setData({
      hiddenModal: false,
      modalArea: item[0][0],
      modalServerList: templist,
      areaIdChosen: item[0][4],
      areaNameChosen: item[0][0]
    })
  },

  modalCancel() {
    this.setData({ 
      hiddenModal: true,
      modalServerList:[],
      areaIdChosen:'',
      serverIdChosen:''
      })
  },

  modalConfirm(){
    if (this.data.areaIdChosen != '' && this.data.serverIdChosen != ''){
      this.setData({hiddenModal: true})
      wx.setStorageSync('areaId', this.data.areaIdChosen)
      wx.setStorageSync('areaName', this.data.areaNameChosen)
      wx.setStorageSync('serverId', this.data.serverIdChosen)
      wx.setStorageSync('serverName', this.data.serverNameChosen)
      console.log(this.data.serverIdChosen)
      wx.reLaunch({
        url: '/pages/role/role',
      })
    }
  },

  radioChange(e) {
    console.log('选中服务器：', e.detail.value) 
    this.setData({ serverIdChosen: /(\d*),(.*?)(?=,).*/.exec(e.detail.value)[1]})
    this.setData({ serverNameChosen: /(\d*),(.*?)(?=,).*/.exec(e.detail.value)[2] })
  },

  /**
   * 处理serverData按字母排列
   */
  toLetterList(rawdata){
    let areaListData=[]
    let letterListData=[]
    for (let i = 'a'.charCodeAt(), end = 'z'.charCodeAt();i<=end;i++){
      let iletter = String.fromCharCode(i)
      let iLETTER = String.fromCharCode(i).toUpperCase()
      let tempdata = []
      for (let key in rawdata) {
        if (rawdata[key][0][3][0] == iletter) {
          tempdata.push(rawdata[key])
        }
      }
      tempdata.sort(compare)
      if(tempdata.length>0){
        areaListData.push({
          letter: iLETTER,
          area: tempdata
        })
        letterListData.push(iLETTER)
      }      
    }
    this.setData({
      letter:letterListData,
      areaList:areaListData
      })
    let compare=(a,b)=>{
      if (a[0][3] < a[0][3]){return -1}else{return 1}
    }
  },
  
})