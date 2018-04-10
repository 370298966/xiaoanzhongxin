// pages/statistics/statistics.js
var app= getApp();
var Url = require("../../utils/Config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderText: "搜索",
    titleText: ["学生照片", "学生姓名", "状态"],
    pageIndex:0,
    pageSize:10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var stuMsg = [];
    var localStorage = wx.getStorageSync("edu_safe_login_user");
    wx.request({
      url: Url.api+"user/listStudent",
      method: "POST",
      data:{
        "school_id":localStorage.school_id,
        "class_id":localStorage.class_id,
        "pageIndex":that.data.pageIndex,
        "pageSize":that.data.pageSize,
        "token":localStorage.token
      },
      success: function (res) {
        that.setData({
          //newData: res.data,//有数据接口的时候使用
          stuMsg: res.data.data.list
        })
      },
      fail: function () {
      }
    })
  },
  //上拉加载
  loadMore: function () {
    var that = this;
    var localStorage = wx.getStorageSync("edu_safe_login_user");
    wx.showToast({
      icon:"loading",
      title: "加载中...",
      duration:500,
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
   * 预览当时进校时采集的图片
   */
  previewImage: function (e) {
    var that = this;
    var id = e.target.id;
    var urls = that.data.stuMsg;
    function myFilter(element, index, array) {
      return element.id == id;
    }
    var newArray = urls.filter(myFilter);
    wx.previewImage({
      urls: [newArray[0].stuPic],//需要预览的图片的http链接
      success: function () { },
      fail: function () {
        wx.showLoading({
          title: "访问失败",
          duration: 2000
        })
        wx.hideLoading();
      }
    })
  },
  goSearchPage: function (e) {
    wx.navigateTo({
      url: "../search/search?pageUrl=" + e.currentTarget.dataset.searchPage,
    })
  },
})