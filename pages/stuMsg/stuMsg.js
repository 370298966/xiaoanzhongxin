// pages/stuMsg/stuMsg.js
var app = getApp();
var Url = require("../../utils/Config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listHeaderText: [
      "学生照片", "学生姓名", "开通状态", "操作"
    ],
    hasOpened:"已开通",
    notOpened:"未开通",
    playceholderText: "搜索",
    detailsText: "详情",
    stuMsg: [],
    pageIndex: 0,
    pageSize:10,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var localStorage = wx.getStorageSync("edu_safe_login_user");
    wx.request({
      url: Url.api + "user/listStudent",
      method: "POST",
      data: {
        school_id: localStorage.school_id,
        class_id: localStorage.class_id,
        pageIndex: that.data.pageIndex,
        pageSize: that.data.pageSize,
        token: localStorage.token
      },
      success: function (res) {
        function compare(a, b) {//根据学生缴费情况进行排序
          var v1 = a.legal_flag;
          var v2 = b.legal_flag;
          if (v1 < v2) {
            return -1;
          } else if (v1 > v2) {
            return 1;
          } else {
            return 0;
          }
        }
        var arr = res.data.data.list.sort(compare);
        that.setData({
          stuMsg: arr
        })
      },
      fail: function () {
        wx.showLoading({
          title: "网络出错",
          duration: 1000,
        })
      }
    })
  },
  onReady: function () {

  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {

  },

  //上拉加载
  loadMore: function () {
    var that = this;
    var localStorage = new Object();
    localStorage = wx.getStorageSync("edu_safe_login_user");
    wx.showLoading({
      title:"加载中...",
      success:function(){
        wx.request({
          url: Url.api + "user/listStudent",
          method: "POST",
          data: {
            school_id: localStorage.school_id,
            class_id: localStorage.class_id,
            pageIndex: that.data.pageIndex + 1,
            pageSize: that.data.pageSize,
            token: localStorage.token
          },
          success: function (res) {
            function compare(a, b) {//根据学生缴费情况进行排序
              var v1 = a.legal_flag;
              var v2 = b.legal_flag;
              if (v1 < v2) {
                return -1;
              } else if (v1 > v2) {
                return 1;
              } else {
                return 0;
              }
            }
            that.setData({
              stuMsg: that.data.stuMsg.concat(res.data.data.list).sort(compare),
              pageIndex: ++that.data.pageIndex
            })
            if(res.data.data.list.length == 0){
              wx.showToast({
                image:"../../images/all.png",
                title: "没有更多了~~",
                duration:1000
              })
            }
          }
        })
      }
    })
    setTimeout(function(){
      wx.hideLoading();
    },500)
  },

  //页面跳转
  goPage: function (e) {
    wx.navigateTo({
      url: '../details/details?stuMsg=' + JSON.stringify(e.currentTarget.dataset.stuObj),
      success: function () {
        
      }
    })
  },
  //
  goSearchPage: function (e) {
    wx.navigateTo({
      url: "../search/search?pageUrl=" + e.currentTarget.dataset.searchPage,
    })
  }
})
