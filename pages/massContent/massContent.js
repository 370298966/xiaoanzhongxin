// pages/massContent/massContent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"简讯内容"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var msgObj = JSON.parse(options.msgObj);
    var imgUrl = msgObj.imgUrl;
    var that = this;
    that.setData({
      msgItem: msgObj,
      imgUrl: imgUrl,
    })
  },

  //预览图片
  previewImg:function(e){
    
  }
})