// pages/MassPage/MassPage.js
var app = getApp();
var nowTime = require("../../utils/util.js");
var Url = require("../../utils/Config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageText: "简讯内容",
    sendText: "发布简讯",
    pageIndex: 0,
    pageSize: 10,
    messageLogs: []//模拟数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var localStorage = wx.getStorageSync("edu_safe_login_user");
    wx.request({
      url: Url.api + "data/listHomework",
      method: "POST",
      data: {
        "class_id": localStorage.class_id,
        "pageIndex": that.data.pageIndex,
        "pageSize": that.data.pageSize,
        "token": localStorage.token
      },
      success: function (res) {
        that.setData({
          messageLogs: res.data.data.list
        })
      },
      fail: function () {
        wx.showLoading({
          title: "网络错误",
          duration: 1000,
        })
      }
    })
  },



  /**
   *页面跳转至详细简讯内容 
   */
  goMassContent: function (e) {
    wx.navigateTo({
      url: "../massContent/massContent?msgObj=" + JSON.stringify(e.currentTarget.dataset.msgObj),
      success: function () {

      },
      fail: function () {
        wx.showLoading({
          title: "请重试",
          duration: 1000,
        })
      }
    })
  },

  //加载更多
  loadMore: function () {
    var that = this;
    var localStorage = wx.getStorageSync("edu_safe_login_user");
    wx.showToast({
      icon:"loading",
      title: "加载中...",
      success: function () {
        wx.request({
          url: Url.api + "data/listHomework",
          method: "POST",
          data: {
            class_id: localStorage.class_id,
            pageIndex: that.data.pageIndex + 1,
            pageSize: that.data.pageSize,
            token: localStorage.token
          },
          success: function (res) {
            that.setData({
              messageLogs: that.data.messageLogs.concat(res.data.data.list),
              pageIndex: ++that.data.pageIndex
            })
            if (res.data.data.list.length == 0) {
              wx.showToast({
                image: "../../images/all.png",
                title: "没有更多了~~",
                duration: 1000
              })
            }
          }
        })
      }
    })
  },
  /**
   * 发布简讯操作
   */
  showMenu: function () {
    wx.navigateTo({
      url: "../sendMsg/sendMsg",
      success: function () {
      }
    })
  },
})