// components/udToast/udToast.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    toastText:{
      type:String,
      value:''
    },
    showTime:{
      type:Number,
      value:200
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    isToastHidden:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showToast() {      
      let that = this
      that.setData({isToastHidden: false})
      setTimeout(function () {
        that.setData({
          isToastHidden: true
        })
      }, this.data.showTime)
    }
  }
})
