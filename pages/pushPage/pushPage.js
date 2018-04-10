// pages/pushPage/pushPage.js
var app = getApp();
var Url = require("../../utils/Config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textareaValue: "",
    contactInfo: "联系方式",
    enumRole:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      parentInfo: JSON.parse(options.parentsInfo)
    })
  },


  // 获取用户输入数据
  bindInputValue: function (e) {
    this.setData({
      textareaValue: e.detail.value
    })
  },

  //消息推送
  submit: function () {
    var that = this;
    var localStorage = wx.getStorageSync("edu_safe_login_user")
    var newValue = that.data.textareaValue;//获取发送内容
    var phoneNum = [that.data.parentInfo.phone];//获取手机号码
    console.log(phoneNum)
    wx.request({
      url: Url.api + "data/listEnumData",
      method: "POST",
      data: {
        token: localStorage.token
      },
      success: function (res) {
        var data = res.data.data.enumRole.find(function (item) {
          if (item.code == localStorage.role_id) {
            return item
          }
        })
        that.setData({
          enumRole: data
        })
      }
    })
    if (newValue != "") {
      var content = newValue;
      //签名
      content += "\n【" + that.data.enumRole.text + ":" + localStorage.user_name + "】"
      wx.request({
        //短信推送
        url: Url.api + "data/upsertMsssage",
        method: "POST",
        data: {
          content: content,
          phones: phoneNum
        },
        success: function (res) {
          console.log(res);
          wx.showToast({
            title: "推送成功",
            duration: 500,
            success: function () {
              that.setData({
                textareaValue: ""
              })
            }
          });
        },
        fail: function () {
          wx.showLoading({
            title: "发送失败",
            duration: 500,
            success: function () { }
          })
        }
      })
    } else {
      wx.showToast({
        title: "内容不能为空",
        icon: "loading",
        duration: 500
      })
      return false;
    }
  }
})