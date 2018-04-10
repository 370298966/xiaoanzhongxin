// pages/scorePage/scorePage.js
var app = getApp();
var Url = require("../../utils/Config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: "上传成绩",
    listText: ["学生照片", "学生姓名", "操作"],
    key: "学生成绩",
    placeholderText: "搜索",
    detailsText: "查看成绩",
    pageIndex:0,
    pageSize:10,
    stuMsg: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var localStorage = wx.getStorageSync("edu_safe_login_user");
    wx.request({
      url: Url.api + "user/listStudent",
      method:"POST",
      data:{
        "school_id":localStorage.school_id,
        "class_id":localStorage.class_id,
        "pageIndex":that.data.pageIndex,
        "pageSize":that.data.pageSize,
        "token":localStorage.token
      },
      success:function(res){
        that.setData({
          stuMsg:res.data.data.list
        })
      },
      fail:function(){
        wx.showToast({
          image:"../../images/all.png",
          title: "请求失败",
        })
      }
    })
  },


  goStuDetails: function (e) {
    wx.navigateTo({
      url: "../stuDetails/stuDetails?stuMsg=" + JSON.stringify(e.currentTarget.dataset.stuObj),
    })
  },
  goSearchPage:function(e){
    wx.navigateTo({
      url: "../search/search?pageUrl=" + e.currentTarget.dataset.searchPage,
    })
  },
  loadMore: function () {
    var that = this;
    var localStorage = wx.getStorageSync("edu_safe_login_user");
    wx.showLoading({
      title: "加载中...",
      success: function () {
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
            that.setData({
              stuMsg: that.data.stuMsg.concat(res.data.data.list),
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
    setTimeout(function () {
      wx.hideLoading();
    }, 500)
  }
})