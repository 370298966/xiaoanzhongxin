//index.js
//获取应用实例
var app = getApp();
var util = require("../../utils/util.js");
var Url = require("../../utils/Config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    homePageImg: "../../images/qw1.jpg",
    logo: "../../images/schoolName.png",
    funLogo: [
      "../../images/1.png",
      "../../images/2.png",
      "../../images/3.png",
      "../../images/4.png"
    ],
    text: [
      "学生信息",
      "学生成绩",
      "简讯推送",
      "学生录入"
    ],
    hello: "老师，您好",
    tableText: ["早晨", "下午", "晚上", "全班人数", "进校", "出校"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取本地缓存数据
    var localStorage = new Object();
        localStorage = wx.getStorageSync("edu_safe_login_user");
    //获取数据
    wx.request({
      url: Url.api + "data/getClass",
      method: "POST",
      data: {
        class_id: localStorage.class_id,
        token: localStorage.token
      },
      success: function (res) {
        that.setData({
          classTotalNum:res.data.data.class_user_count,
          teacherName: res.data.data.charge_teacher_name
        })
      },
      fail:function(){
        wx.showLoading({
          title: "获取数据失败",
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //学生信息
  goStuMsgPage: function () {
    wx.navigateTo({
      url: "../stuMsg/stuMsg",
      success: function () {
      },
      fail: function () {
        wx.showToast({
          title: '网络错误',
        })
      }
    })
  },

  //学生成绩
  goScorePage: function () {
    wx.navigateTo({
      url: "../scorePage/scorePage",
      success: function () {
      },
      fail: function () {
        wx.showToast({
          title: '网络错误',
        })
      }
    })
  },

  //学生录入
  goStuInfo: function () {
    wx.navigateTo({
      url: "../stuInfo/stuInfo",
      success: function () {
      },
      fail: function () {
        wx.showToast({
          title: '网络错误',
        })
      }
    })
  },

  //简讯推送
  goMassPage: function () {
    wx.navigateTo({
      url: "../massPage/massPage",
      success: function () {
      },
      fail: function () {
        wx.showToast({
          title: '网络错误',
        })
      }
    })
  },


  // 具体数据情况预览
  getData: function () {
    wx.navigateTo({
      url: '../statistics/statistics',
      success: function () {
      }
    })
  },

})