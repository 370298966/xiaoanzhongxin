// pages/details/details.js
var app = getApp();
var Url = require("../../utils/Config.js");
var localStorage = new Object();
localStorage = wx.getStorageSync("edu_safe_login_user");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    noscroll: false,
    showImage: true,
    stuNameTitle: "学生姓名",
    shcoolNameTile: "所属学校",
    pro: "属性",
    parentName: "家长姓名",
    relationship: "关系",
    contactInfo:"联系方式",
    date: "打卡日期",
    inTime: "进校打卡",
    outTime: "出校打卡",
    signIn: "教室签到",
    relationType: ["父亲", "母亲", "爷爷", "奶奶", "外公", "外婆", "其他"],
    noRecord: ["暂无打卡记录", "暂无家长信息"]
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      stuData: JSON.parse(options.stuMsg)
    })

    //获取家长信息
    wx.request({
      url: Url.api + "user/listStudentParents",
      method: "POST",
      data: {
        student_id: that.data.stuData.student_id,
        token: localStorage.token
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          studentParents: res.data.data.list
        })

      },
      fail: function () {
        wx.showToast({
          image: "../../images/all.png",
          title: '网络错误',
          duration: 1000
        })
      }
    })

    //获取打卡信息
    var that = this;
    wx.request({
      url: Url.api + "data/listStudentInOutCheckinGroup",
      method: "POST",
      data: {
        student_id: that.data.stuData.student_id,
        pageIndex: 0,
        pageSize: 10000,
        token: localStorage.token
      },
      success: function (res) {
        var list = res.data.data.list;
        var newList = list.map(function (item) {
          if (item.class_checkin_time) {
            item.class_checkin_list = item.class_checkin_time.split(",").map(function (checkin) {
              return {
                checkin_id: checkin.split("_")[0],
                checkin_time: checkin.split("_")[1]
              }
            })
          }
          if (item.in_checkin_time) {
            item.in_checkin_time = item.in_checkin_time.split(",").map(function (checkin) {
              return {
                checkin_id: checkin.split("_")[0],
                checkin_time: checkin.split("_")[1]
              }
            })
          }
          if (item.out_checkin_time) {
            item.out_checkin_time = item.out_checkin_time.split(",").map(function (checkin) {
              return {
                checkin_id: checkin.split("_")[0],
                checkin_time: checkin.split("_")[1]
              }
            })
          }
          return item;
        })
        that.setData({
          checkinList: newList
        })
      }
    })
  },

  onReady: function () {
    
  },

  // 展示当时进出校图片

  previewImg: function (e) {
    var that = this;
    var imgHttp = Url.CHECKIN_FILE_ROOT;
    wx.request({
      url: Url.api + "data/getPhotoUrlByCheckInId",
      method: "POST",
      data: {
        checkin_id: e.currentTarget.dataset.checkinId
      },
      success: function (res) {
        that.setData({
          imgUrl: imgHttp + res.data.data,
          showImage: !that.data.showImage
        })
      },
      fail: function () { }
    })
  },

  // 控制消息推送界面显示隐藏
  gotoPushPage: function (e) {
    var that = this;
    wx.navigateTo({
      url: "../pushPage/pushPage?parentsInfo=" + JSON.stringify(e.currentTarget.dataset.parentsInfo),
    })
  }
})  