// components/soldItem/soldItem.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toRoleDetail(e) {
      console.log(e.currentTarget)
      let item = e.currentTarget.dataset.item
      let areaId = item.roleArea
      let gameOrderSn = item.gameOrderSn
      wx.navigateTo({
        url: `/pages/roledetail/roledetail?areaid=${areaId}&gameordersn=${gameOrderSn}`,
      })
    },
    errorImg(e){
      let index = e.currentTarget.dataset.index
      let roleicon = e.currentTarget.dataset.roleicon
      let img = 'list[' + index + '].roleIconUrl'
      this.setData({
        [img]: `https://cbg-xyq.res.netease.com/images/role_icon/small/${roleicon-12}.gif`
      })
    }
  }
})
