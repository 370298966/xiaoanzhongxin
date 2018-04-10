// pages/sendMsg/sendMsg.js
var app = getApp();
var Url = require("../../utils/Config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    voices: [],//音频数组
    imgUrl: [],//图片信息
    info: "",//输入信息
    time: "",//时间
    flag: true,
    btnText: "确认并发布",
    playVoice: "点击播放语音",
    placeholderText: "您想发布点什么呢...",
    j: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //显示语音按钮
  showVoiceBtn: function () {
    var that = this;
    wx.authorize({
      scope: 'scope.record',
      success: function (res) {
        //if(res.errMsg)
        that.setData({
          flag: false,
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '无权限访问',
          image: "../../images/icon/tip.png",
          success: function () {
            wx.openSetting({})
          }
        })
      }
    })

  },

  //隐藏语音按钮
  bindFocus: function () {
    var that = this;
    that.setData({
      flag: true,
    })
  },

  //开始录音
  startRecord: function () {
    var that = this;
    speaking.call(this);
    that.setData({
      flag: false
    })

    wx.getSetting({
      success: function (res) {
        if (res.authSetting.scope["record"]) {
          wx.startRecord({
            success: function (res) {
              var tempFilePath = res.tempFilePath;
              console.log("tempFilePath:" + tempFilePath);
              var voice = that.data.voices;
              voice.push(tempFilePath);
              console.log(voice);
              that.setData({
                voices: voice
              })
            },
            fail: function () {
              wx.showModal({
                title: "录音失败",
                content: "请重试",
              })
              console.log("接口调用失败");
            }
          })
        }
      }
    })
  },

  //结束录音
  stopRecord: function () {
    var that = this;
    wx.stopRecord();
    that.setData({
      flag: true
    })
    clearInterval(this.timer);
  },

  //播放语音
  playVoice: function (e) {
    var that = this;
    wx.playVoice({
      filePath: that.data.voices[parseInt(e.currentTarget.id)],
      success: function (res) {}
    })
  },

  //删除录音
  deleteVoice: function (e) {
    var that = this;
    var newVoices = that.data.voices;
    wx.showActionSheet({
      itemList: ["删除"],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.showModal({
            title: "是否删除",
            confirmColor: "#00B5E9",
            success: function (res) {
              if (res.confirm) {
                newVoices.splice(parseInt(e.currentTarget.id), 1)
                that.setData({
                  voices: newVoices
                })
              } else if (res.cancel) {}
            }
          })
        }
      }
    })
  },

  //选取照片
  chooseImg: function () {
    var that = this;
    wx.authorize({
      scope: 'scope.camera',
      success: function (res) {},
      fail: function (res){
        wx.showToast({
          title: '无权限访问',
          image: "../../images/icon/tip.png",
          success: function () {
            wx.openSetting({
              success: res2=>{
                res2.authSetting = {
                  "scope.camera": true,
                }
              }
            })
          }
        })
      }
    })
    wx.getSetting({
      success: function (res) {
        if (res.authSetting.scope["camera"]) {
          wx.showActionSheet({
            itemList: ["从相册中选取", "拍照"],
            success: function (res) {
              if (res.tapIndex == 0) {//相册选取照片
                wx.chooseImage({
                  sizeType: ["original"],
                  sourceType: ["album"],
                  success: function (res) {
                    var tempFilePaths = res.tempFilePaths;//保存照片路径
                    that.setData({
                      imgUrl: tempFilePaths,
                    })
                  },
                })
              } else if (res.tapIndex == 1) {//拍照
                wx.chooseImage({
                  sizeType: ["original"],
                  sourceType: ["camera"],
                  success: function (res) {
                    var tempFilePaths = res.tempFilePaths;
                    that.setData({
                      imgUrl: tempFilePaths
                    })
                  },
                })
              }
            }
          })
        }
      }
    })

  },


  //删除图片
  clearImg: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ["删除"],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.showModal({
            title: "是否删除",
            confirmColor: "#00B5E9",
            success: function (res) {
              if (res.confirm) {
                console.log("用户点击确认--图片删除")
                that.setData({
                  imgUrl: []
                })
              } else if (res.cancel) {
                console.log("用户点击取消")
              }
            }
          })
        }
      }
    })
  },

  //监听textarea的value值
  changeTextarea: function (e) {
    var value = e.detail.value,
      that = this;
    that.setData({
      info: value
    })
  },

  /**
   * 发布简讯
   */
  submitForm: function (e) {
    var that = this;
    var localStorage = wx.getStorageSync("edu_safe_login_user");
    var nowDate = new Date();
    var year,//年份
      month,//月份
      date;//日期
    year = nowDate.getFullYear(); //获取完整的年份(4位,1970-????)

    //获取当前月份(0-11,0代表1月)
    if (nowDate.getMonth() < 10) {
      month = "0" + (nowDate.getMonth() + 1);
    } else {
      month = nowDate.getMonth() + 1;
    }

    //获取当前日(1-31)
    if (nowDate.getDate() < 10) {
      date = "0" + nowDate.getDate();
    } else {
      date = nowDate.getDate();
    }

    var nowTime = year + "" + month + "" + date + "";//获取当前时间
    console.log(nowTime);
    var newInfo = that.data.info;//获取用户输入信息
    var newimgUrl = that.data.imgUrl;//获取用户选取的图片信息
    var newVoices = that.data.voices;//获取用户录音音频
    if (newInfo != "" || newimgUrl.length != 0 || newVoices.length != 0) {
      wx.request({//上传数据
        url: Url.api + "data/upsertHomework",
        method: "POST",
        dataType: "json",
        data: {//传入数据
          class_id: localStorage.class_id,
          token: localStorage.token,
          content: newInfo,
          homework_date: nowTime
          // voices: newVoices,
          // imgUrl: newimgUrl,
          // info: newInfo,
          // time: nowTime
        },
        header: {
          "content-type": "application/json"
        },
        success: function (res) {
          var content = newInfo;
          wx.request({
            url: Url.api + "weixin/sendHomeWorkByClass",
            method: "POST",
            data: {
              class_id: localStorage.class_id,
              content: content
            },
            success: function (res2) {
              console.log(res2)
            }
          })
          console.log(res);
          that.setData({//清空文本
            imgUrl: [],
            voices: [],
            info: "",
            time: "",
          })
          wx.showToast({
            title: "发布成功",
            success: function () {

            }
          })
        },
        fail: function () {
          console.log("--fail--")
          wx.showLoading({
            title: "发送失败",
          })
          var timer = setTimeout(function () {
            wx.hideLoading();
          }, 500)
        }
      })
    } else {
      return wx.showToast({
        title: "请输入内容",
        image: "../../images/icon/tip.png",
      })
    }
  }
})
/**
 * 帧动画
 */
function speaking() {
  var that = this;
  //话筒帧动画 
  var i = 0;
  this.timer = setInterval(function () {
    i++;
    console.log(i);
    that.setData({
      j: i
    })
    if (i >= 4) {
      i = 0
    }
  }, 200);
}