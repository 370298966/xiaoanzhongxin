// pages/login/login.js
var app = getApp();
var encode = require("../common/encode64.js");
var Url = require("../../utils/Config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logoSrc: "../../images/logo.png",
    logoText: "校安中信教师登录",
    codeText: "获取验证码",
    flag: false,
    phoneNum: "",
    messageCode: "",
    formFlag: false,
    iconFlag: true,
    phone_login: "手机号登录",
    user_login: "用户名登录",
    currentTab: 0,
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //  选项卡切换
  swiperCut: function (e) {
    var that = this;
    if (e.currentTarget.id == "user") {
      that.setData({
        currentTab: 0
      })
    } else if (e.currentTarget.id == "phone") {
      that.setData({
        currentTab: 1
      })
    }
  },

  // 滚动切换标签样式
  switchTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    })
  },
  //获取用户名
  getUserNum: function (e) {
    var that = this;
    that.setData({
      account: e.detail.value
    })
  },
  //获取密码
  getPassword: function (e) {
    var that = this;
    that.setData({
      password: e.detail.value
    })
  },
  //用户名登录
  userSubmit: function () {
    var that = this;
    if(!that.data.account){
      return wx.showToast({
        title: "请输入用户名",
        image:"../../images/icon/tip.png"
      })
    }
    if (!that.data.password) {
      return wx.showToast({
        title: "请输入密码",
        image: "../../images/icon/tip.png"
      })
    }
    wx.request({
      url: Url.api + "user/login",
      method: "POST",
      data: {
        account: that.data.account,
        password: that.data.password,
        token: Url.token
      },
      success: function (res) {
        if (res.data.resultCode == "-1") {
          wx.showToast({
            icon: "loading",
            title: res.data.resultMsg,
            duration: 500
          })
        } else if (res.data.resultCode == "0") {
          wx.showToast({
            title: "登录成功",
            duration: 500,
            success: function () {
              wx.setStorage({
                key: "edu_safe_login_user",
                data: res.data.data,
              })
              wx.redirectTo({
                url: '../index/index',
              })
            }
          })
        }
      },
      fail: function () {
        wx.showLoading({
          title: "登录失败",
          duration: 1500
        })
      }
    })
  },

  // 获取手机号码
  getPhoneNum: function (e) {
    var that = this;
    var phoneNum = e.detail.value;
    var checkout = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!checkout.test(phoneNum)) {
      that.setData({
        formFlag: true,
        iconFlag: false,
        flag:true
      })
    } else {
      that.setData({
        phoneNum: phoneNum,
        formFlag: false,
        iconFlag: true,
        flag: false
      })
    }
  },

  // 获取短信验证码
  getCode: function (e) {
    var that = this;
    var _phoneNum = that.data.phoneNum;
    if (!_phoneNum) {
      return wx.showToast({
        title: "请输入手机号码",
        image: "../../images/icon/tip.png"
      })
    }
    wx.showLoading({
      title: "发送验证码",
      success: function () {
        wx.hideLoading();
        wx.request({
          url: Url.api +"user/getCode",//手机短信验证码接口
          method: "POST",
          data:{
            phone: _phoneNum
          },
          success: function (res) {
            var count = 60;//初始化时间
            var timer = setInterval(function () {
              if (count == 0) {
                clearInterval(timer);
                count = 60;
                that.setData({
                  flag: false,
                  codeText: "获取验证码"
                })
              } else {
                count--;
                that.setData({
                  flag: true,
                  codeText: "重新发送" + count + "s"
                })
              }
            }, 1000);
          }
        })
      },
      fail: function () {
        wx.showLoading({
          title: "获取失败",
        })
      }
    })
  },

  

  // 获取用户输入的验证码
  getMessageCode: function (e) {
    var that = this;
    var messageCode = e.detail.value;
    that.setData({
      messageCode: messageCode
    })
  },

  // 手机号登录

  submit: function () {
    var that = this;
    var _phoneNum = that.data.phoneNum;
    var _messageCode = that.data.messageCode;
    if (!_phoneNum) {
      return wx.showToast({
        title: "请输入手机号码",
        image: "../../images/icon/tip.png"
      })
    }
    if (!_messageCode) {
      return wx.showToast({
        title: "请输入验证码",
        image: "../../images/icon/tip.png"
      })
    }
    wx.request({
      url: Url.api + "user/login",
      method: "POST",
      data: {
        phoneNum: _phoneNum,
        messageCode: _messageCode,
      },
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: "登录成功",
          duration: 1000,
          success: function () {
            wx.redirectTo({
              url: "../index/index",
            })
          }
        })
      },
      fail: function () {
        wx.showToast({
          icon: "loadding",
          title: "验证失败",
          duration: 2000,
        })
      }
    })
  }

})