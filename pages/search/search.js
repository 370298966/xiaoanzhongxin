// pages/seach/search.js
var app = getApp();
var Url = require("../../utils/Config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderText: "搜索",
    searchText: "搜索",
    closeSrc: "../../images/icon/close.png",
    showOrHidden: true,
    listHeaderText: [
      "学生照片", "学生姓名", "开通状态", "操作"
    ],
    hasOpened: "已开通",
    notOpened: "未开通",
    text1:"详情",
    text2:"查看成绩"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      pageUrl:options.pageUrl
    })
  },

  input1: function (e) {//输入时 实施调用搜索方法
    this.setData({
      searchString: e.detail.value
    })
    this.search(e.detail.value);
  },

  confirm1: function (e) {//软键盘搜索按钮调用
    this.search(e.detail.value);
  },

  search: function (key) {//搜索方法 key 用户输入的查询字段 
    var that = this;
    var localStorage = wx.getStorageSync("edu_safe_login_user");
    if (that.data.searchString != ""){
      wx.request({
        url: Url.api + "user/listStudent",
        method: "POST",
        data: {
          "school_id": localStorage.school_id,
          "class_id": localStorage.class_id,
          "searchString": that.data.searchString,
          "token": localStorage.token
        },
        success: function (res) {
          if (res.data.data.count == 0) {
            that.setData({
              showOrHidden: true
            })
          }else{
            that.setData({
              searchResult: res.data.data.list,
              showOrHidden: false
            })
          }
        }
      })
    }else{
      that.setData({
        showOrHidden: true,
      })
    }
  },
  goPage:function(e){
    var that = this;
    var pageUrl = that.data.pageUrl
    wx.navigateTo({
      url: "../" + pageUrl + "/" + pageUrl + "?stuMsg=" + JSON.stringify(e.currentTarget.dataset.stuObj),
    })
  }
})