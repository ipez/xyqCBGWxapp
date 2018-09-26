// pages/search/search.js
const pricList = require("../../data/staticData.js").pricList
const levelList = require("../../data/staticData.js").levelList
const schoolList = require("../../data/staticData.js").schoolList
let windowHeight = getApp().globalData.systeminfo.windowHeight
let globalData = getApp().globalData

Page({
  /**
   * 页面的初始数据          
   */
  data: {
    scrollHeight: windowHeight, 
    isShowAccBody:{
      coef:true,
      pric:true,
      level:true,
      scho:false,
      roleExpt:true,
      petExpt:true,
    },
    placeholderCoef:globalData.coef,
    formData:{     //存储表单输入
      coef:{
        gold2money:null,
        money2rmb:null,
        xlgmoney:null
      },
      pric: {
        min: null,
        max: null
      },
      level: {
        min: null,
        max: null
      },
      scho:null, //scho ID
      roleExpt:{
        total:null,
        gongji:null,
        fangyu:null,
        fashu:null,
        kangfa:null,
        lieshu:null
      },
      petExpt:{
        total:null,
        gongji: null,
        fangyu: null,
        fashu: null,
        kangfa: null
      }
    },
    formText: { // 作为红色文本在标题右边箭头附近显示选项
      scho:[],
      roleExpt:[],
      petExpt:[]
    },
    optionList:{     //wxml生成所需列表选项
      coef:[
        { id: 0, name: '转换比(现金/储备金)', pinyin: 'gold2money' },
        { id: 1, name: '金价(元/三千万MHB)', pinyin: 'money2rmb' },
        { id: 2, name: '修炼果单价(万MHB)', pinyin: 'xlgmoney' },
      ],
      pric: pricList,  //含checked
      level: levelList,
      scho: schoolList,
      expt: [
        { id: 0, name: '修炼总和', pinyin: 'total' },
        { id: 1, name: '攻击修炼', pinyin: 'gongji' },
        { id: 2, name: '防御修炼', pinyin: 'fangyu' },
        { id: 3, name: '法术修炼', pinyin: 'fashu' },
        { id: 4, name: '抗法修炼', pinyin: 'kangfa' },
        { id: 5, name: '猎术修炼', pinyin: 'lieshu'}
      ]
    },
    toastText:'',
    toastShowTime: 1000,
     
  },

  onLoad(){

    //--------
    //let that = this
    //console.log("testload",this.data.placeholderCoef)
    // let tempphc=this.data.placeholderCoef
    // wx.getStorage({
    //   key: 'coef',
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       'placeholderCoef.gold2money': res.data.gold2money||tempphc.gold2money,
    //       'placeholderCoef.money2rmb': res.data.money2rmb || tempphc.money2rmb,
    //       'placeholderCoef.xlgmoney': res.data.xlgmoney || tempphc.xlgmoney,
    //     })  
    //   },
    //   fail: function () {  //首次使用
    //     console.log('test')
    //     wx.setStorage({
    //       key: 'coef',
    //       data: {
    //         gold2money: that.data.placeholderCoef.gold2money,
    //         money2rmb: that.data.placeholderCoef.money2rmb,
    //         xlgmoney: that.data.placeholderCoef.xlgmoney
    //       },
    //     })
    //   }
    // })  
    

  },
  onReady(){
    this.toast=this.selectComponent('#mytoast')
  },
  onShow(){
    console.log("testshow")
  },

  showAccBody(e){
    let name = e.currentTarget.dataset.name
    console.log(name)
    let temp = this.data.isShowAccBody
    temp[name] = !this.data.isShowAccBody[name]
    this.setData({
      isShowAccBody: temp
    })
  },

  bindInputCoef(e){
    console.log(e)
    let name = e.currentTarget.dataset.name
    let ceil= name=='gold2money'? 1:(name=='money2rmb'?1000:100)
    let path = 'formData.coef.'+name
      if(e.detail.value>ceil){
        this.setData({[path]:ceil})
        return{value:ceil}
      }
    this.setData({ [path]: e.detail.value })
  },

  radioChangePric(e){
    this.radioChange(e,'pric')
  },
  radioChangeLevel(e) {
    this.radioChange(e,'level')
  },
  radioChange(e,name){
    let templist = this.data.optionList
    let tempdata = this.data.formData
    console.log(e.detail.value)
    for (let i = 0; i < templist[name].length; i++) {
      if (i == e.detail.value) {
        templist[name][i].checked = true
        let min = /(\d*)-?(\d*)/.exec(templist[name][i].option)[1]
        let max = /(\d*)-?(\d*)/.exec(templist[name][i].option)[2]
        tempdata[name].min = min
        tempdata[name].max = max
      }
    else { templist[name][i].checked = false }
    }
    this.setData({
      optionList: templist,       //setData 改变对象中的某一个参数：第一种用法。
      formData: tempdata
    })
    console.log(tempdata.scho)
  },
/* ************************************ */
  checkboxChangeScho(e) {
    let arrid=[]
    let arrname = []
    let tempdata = this.data.formData
    let templist = this.data.optionList    
    for(let i in templist.scho){templist.scho[i].checked=false}
    e.detail.value.forEach(id=>{      
      for (let index in templist.scho){
        if (id == templist.scho[index].id) {
          arrid.push(id)
          arrname.push(templist.scho[index].option)
          templist.scho[index].checked=true        
          break
        }
      }
    })
    tempdata.scho=arrid
    console.log('选中',arrname)
    this.setData({
      optionList:templist,        
      formData:tempdata,
      'formText.scho':arrname
      })
  },


  bindInputPricMin(e){
    this.setData({ 'formData.pric.min': e.detail.value }) //setData第二种用法
  },
  bindInputPricMax(e) {
    this.setData({ 'formData.pric.max': e.detail.value })
  },

  bindInputLevelMin(e) {
    this.bindInputLevel(e, 'min')
  }, 
  bindInputLevelMax(e) {
    this.bindInputLevel(e, 'max') 
  }, 
  bindInputLevel(e,name) {
    let path = 'formData.level.' + name
    if (e.detail.value > 175){
      this.setData({ [path]: 175 })   //setData 第三种用法
      return
    }    
    this.setData({ [path]: e.detail.value })
  },

  bindInputRoleExpt(e){
    this.bindInputExpt(e, 'roleExpt')
  },
  bindInputPetExpt(e) {
    this.bindInputExpt(e, 'petExpt')
  }, 
  bindInputExpt(e,name){
    let temp = this.data.optionList.expt
    let tempdata = this.data.formData
    let path = 'formText.' + name
    tempdata[name][temp[e.currentTarget.id].pinyin] = e.detail.value
    let ceil = parseInt(e.currentTarget.id) > 0 ? 25 : (name == 'roleExpt' ? 125 : 100)
    if (e.detail.value > ceil) {
      tempdata[name][temp[e.currentTarget.id].pinyin] = ceil
      this.setData({
        formData: tempdata,
        [path]: this.createFormExpt(tempdata[name])
      })
      return
    }
    this.setData({
      formData: tempdata,
      [path]: this.createFormExpt(tempdata[name])
    }) 
  },

  createFormExpt(obj){
    let arr=[]
    for(let key in obj){
      if(obj[key]){
        for(let value of this.data.optionList.expt){
          if(key==value.pinyin){
            arr.push(value.name+':'+obj[key])
          }
        }
      }
    }
    console.log(arr)
    return arr   
  },



  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let pricMin = e.detail.value.pricMin
    let pricMax = e.detail.value.pricMax
    let levelMin = e.detail.value.levelMin
    let levelMax = e.detail.value.levelMax
    if (parseInt(pricMin) < 60 || parseInt(pricMax) < 60){
      this.setData({ toastText: '价格(元)不能小于60元' }) 
      this.toast.showToast()
    }
    else if (parseInt(pricMin) > parseInt(pricMax)){
      this.setData({ toastText: '价格(元)最小值不能超过最大值' })
      this.toast.showToast()
    }
    else if (parseInt(levelMin) < 69 || parseInt(levelMax) < 69) {
      this.setData({ toastText: '等级不能小于69级' })
      this.toast.showToast()
    }
    else if (parseInt(levelMin) > parseInt(levelMax)) {
      this.setData({ toastText: '等级最小值不能超过最大值' })
      this.toast.showToast()
    }
    else{
      let tempphc= this.data.placeholderCoef
      let tempfdc=this.data.formData.coef
      //let templist=this.data.optionList.coef
      // for(let i in templist){
      //   if (tempcoef[templist[i].pinyin] == null && tempphc[templist[i].pinyin]==null){
      //     this.setData({ toastText: templist[i].name+'不能为空' })
      //     this.toast.showToast()
      //     return
      //   }
      // }
      wx.setStorageSync('coef', {
        gold2money: tempfdc.gold2money || tempphc.gold2money,
        money2rmb: tempfdc.money2rmb || tempphc.money2rmb,
        xlgmoney: tempfdc.xlgmoney || tempphc.xlgmoney
      })
      wx.reLaunch({
        url: '/pages/role/role',
      })
    }

  },

  formReset(e) {   
    
    let templist=this.data.optionList
    for(let key in templist){
      for(let i in templist[key]){
        if (templist[key][i].option) { templist[key][i].checked = false } //reset选择框
      }      
    }

    let temptext=this.data.formText
    for(let key in temptext){temptext[key]=null} //reset红色文本
    
    let tempdata=this.data.formData
    for (let key in tempdata) {            //reset 表单数据（expt表单value路径{{formData.petExpt[item.pinyin]}}在form自动清除时似乎无法识别出处，这里人工清除一下）
      if(tempdata[key]){
        for(let key2 in tempdata[key]){tempdata[key][key2]=null}
      }
      else{
        tempdata[key]=null
      }
      if(key=='coef'){
        tempdata.coef=this.data.placeholderCoef} 
    }
    console.log(tempdata.coef)
    this.setData({
      optionList:templist,
      formText:temptext,
      formData:tempdata
    })
    this.onLoad()  //reset会清空page中的data初始值，引入onload再重新赋值一下。
    console.log('form发生了reset事件',tempdata.coef)
  },
})



