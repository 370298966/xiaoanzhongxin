// pages/stuInfo/stuInfo.js
var app = getApp();
var Url = require("../../utils/Config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    val: "",
    id: "",
    name: "",//姓名
    cardId: "",//身份证号
    period: "",//级届
    sex: "",//性别
    // tempFilePaths: "",//照片
    btnText: "录入",
    picture: "照片",
    photograph: "手机拍照",
    album: "相册选取",
    list: ["姓名", "身份证号", "级届", "性别"],
    preserve: "保存",
    cancel: "取消",
    sexArray: ["男", "女"],
    flag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //手机拍照
  fromCamera: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original"],
      sourceType: ["camera"],
      success: function (res) {
        wx.uploadFile({
          url: Url.api + "upload/uploadfile",
          filePath: res.tempFilePaths[0],
          name: "attachment",
          success: function (res2) {
            console.log(res2.data);
            var data = JSON.parse(res2.data);
            that.setData({
              tempFilePaths: res.tempFilePaths,
              res_id: data.data.res_id
            })
            console.log(that.data.tempFilePaths);
          }
        })
      },
    })
  },

  //相册选取
  fromAlbum: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original"],
      sourceType: ["album"],
      success: function (res) {
        console.log(res);
        wx.uploadFile({
          url: Url.api + "upload/uploadfile",
          filePath: res.tempFilePaths[0],
          name: "attachment",
          success: function (res2) {
            console.log(JSON.parse(res2.data));
            var data = JSON.parse(res2.data);
            that.setData({
              tempFilePaths: res.tempFilePaths,
              res_id: data.data.res_id
            })
            console.log(data.data.res_id);
          }
        })
        // that.setData({
        //   tempFilePaths: res.tempFilePaths
        // })
      },
      fail: function (res) {
        console.log("res")
      }
    })
  },

  toNewStu: function () {
    wx.navigateTo({
      url: "../newStu/newStu",
      success: function () {
        console.log("--newStu--")
      }
    })
  },

  //显示输入区域
  showModal: function (e) {
    var id = e.currentTarget.id;
    var that = this;
    that.setData({
      flag: false,
      id: id
    })
  },
  //监听input的值
  getVal: function (e) {
    var that = this;
    var newVal = e.detail.value;
    that.setData({
      newVal: newVal,
    })
  },
  //getClass
  getClass: function () {
    var that = this;
    var localStorage = wx.getStorageSync("edu_safe_login_user");
    wx.request({
      url: Url.api + "data/getClass",
      method: "POST",
      data: {
        class_id: localStorage.class_id,
        token: localStorage.token
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          class_name: res.data.data.class_name
        })
      },
      fail: function () {
        wx.showToast({
          image: "../../images/all.png",
          title: "获取信息失败",
        })
      }
    })
  },
  //显示输入的信息
  preBtn: function (e) {
    var that = this;
    var newVal = that.data.newVal;
    var idName = that.data.id;
    if (idName == "name") {
      that.setData({
        name: newVal
      })
    } else if (idName == "cardId") {
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!reg.test(newVal)) {
        return wx.showToast({
          title: "身份证号错误",
          image: "../../images/icon/tip.png"
        })
      } else {
        that.setData({
          cardId: newVal
        })
      }
    } else if (idName == "sex") {
      that.setData({
        sex: newVal
      })
    }
    that.setData({
      flag: true,
      val: ""
    })
  },

  //隐藏input组件
  cancelBtn: function () {
    var that = this;
    that.setData({
      flag: true,
      val: "",
    })
  },
  //性别选择
  getSex: function (e) {
    var that = this;
    that.setData({
      sex: parseInt(e.detail.value) + 1
    })
    console.log(that.data.sex)
  },
  //保存信息
  submitForm: function () {
    var that = this;
    var localStorage = wx.getStorageSync("edu_safe_login_user");
    if(!that.data.name){
      return wx.showToast({
        title: "请输入姓名",
        image:"../../images/icon/tip.png"
      })
    }
    if (!that.data.cardId) {
      return wx.showToast({
        title: "请输入身份证号",
        image: "../../images/icon/tip.png"
      })
    }
    if (!that.data.class_name) {
      return wx.showToast({
        title: "请设置级届",
        image: "../../images/icon/tip.png"
      })
    }
    if (!that.data.sex) {
      return wx.showToast({
        title: "请录入性别",
        image: "../../images/icon/tip.png"
      })
    }
    if (!that.data.res_id) {
      return wx.showToast({
        title: "请上传照片",
        image: "../../images/icon/tip.png"
      })
    }
    wx.request({
      url: Url.api + "user/upsertStudent",//上传数据
      method: "POST",
      data: {
        source: 2,
        token: localStorage.token,
        class_id: localStorage.class_id,//班级信息
        student_name: that.data.name,//学生姓名
        idno: that.data.cardId,//身份证号
        class_name: that.data.class_name,//班级
        student_sex: that.data.sex,//性别
        res_id: that.data.res_id,//照片
      },
      success: function (res) {
        if (res.data.resultCode == "0") {
          wx.showToast({
            title: "保存成功",
            icon: "success",
            success: function () {
              that.setData({
                val: "",
                id: "",
                name: "",//姓名
                cardId: "",//身份证号
                class_name: "",//级届
                sex: "",//性别
                tempFilePaths: "",
              })
            }
          })
        } else if (res.data.resultCode == "-1") {
          wx.showToast({
            title: "请检查身份证号",
            image:"../../images/all.png"
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "保存失败",
          icon: "loading",
          success: function () {
            
          }
        })
      }
    })
  }
})