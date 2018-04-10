// pages/stuDetails/stuDetails.js
var app = getApp();
var Url = require("../../utils/Config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: "",
    headerTitleText: ["学生姓名", "所属学校", "属性"],
    headerTitleTextB: ["科目", "成绩"],
    default_type: ["语文", "数学", "英语"],
    addSubject: [],
    addText: "添加",
    submit: "保存",
    deleteText: "删除",
    upDataScore: "上传成绩",
    showOrHide: false,
    newSubject: [],
    // scoreType: [0, 1, 2, 3]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {//参数携带该同学的成绩
    var that = this;
    var localStorage = wx.getStorageSync("edu_safe_login_user");
    that.setData({//stuData中包含成绩
      stuData: JSON.parse(options.stuMsg),
    })
    wx.request({
      url: Url.api + "data/listEnumData",
      method: "POST",
      data: {
        token: localStorage.token
      },
      success: function (res) {
        var arr = res.data.data.enumStudentScoreType;
        var newArr = [];
        for (var i = 0; i < arr.length; i++) {
          newArr.push(arr[i].text);
        }
        that.setData({
          scoreType: newArr
        })
      }
    })
    wx.request({
      url: Url.api + "user/listStudentScore",
      method: "POST",
      data: {
        token: localStorage.token,
        student_name: that.data.stuData.student_name,
        student_no: that.data.stuData.student_no,
        pageSize: 10000
      },
      success: function (res) {
        that.setData({
          scoreList: res.data.data.list.reverse()
        })
      }
    })
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

  //添加科目
  addSubject: function (e) {
    var that = this;
    var text = that.data.addSubject;
    that.setData({
      pickerValue: e.detail.value
    })
    text.push(
      {
        //"scoreName": "scoreName",
        //"subjectName": "subjectName"
        "student_id": that.data.stuData.student_id,
        "semester": that.data.semester,
        "score_type": e.detail.value,
        "score": null
      }
    )

    that.setData({
      addSubject: text,
      showOrHide: true,
    });
  },
  //获取学期值
  getSemester: function (e) {
    var that = this;
    that.setData({
      semester: e.detail.value
    })
    var scoreArr = that.data.addSubject;
    for (var i in scoreArr) {
      scoreArr[i].semester = that.data.semester
    }
    that.setData({
      addSubject: scoreArr
    })
  },
  //获取输入的成绩
  getValue: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.id);
    var scoreArr = [];
    scoreArr = that.data.addSubject;
    scoreArr[index].score = e.detail.value;
    that.setData({
      addSubject: scoreArr
    })
  },
  //删除科目
  delSubject: function (e) {
    var that = this;
    var text = that.data.addSubject;
    var showOrHide;
    if (text.length <= 0) {
      that.setData({
        showOrHide: false
      });
      //i = 3;
    } else {
      text.splice(parseInt(e.currentTarget.id), 1);
      that.setData({
        addSubject: text,
      })
    }
  },
  //保存科目
  submitForm: function (e) {
    var that = this;
    var localStorage = wx.getStorageSync("edu_safe_login_user");
    var score = that.data.addSubject;
    if (score.length != 0) {
      for (var i = 0; i < score.length; i++) {
        if (score[i].semester == "" || score[i].semester == null || typeof (score[i].semester) == undefined) {
          return wx.showToast({
            title: "请填写考试类型",
            image: "../../images/icon/tip.png",
          })
        } else if (score[i].score == "" || score[i].score == null || typeof (score[i].score) == undefined) {
          return wx.showToast({
            title: "请填写成绩",
            image: "../../images/icon/tip.png"
          })
        } else {
          return wx.request({
            url: Url.api + "user/upsertStudentScore",
            method: "POST",
            data: {
              score_list: score,
              token: localStorage.token
            },
            success: function (res) {
              wx.showToast({
                title: res.data.resultMsg,
                success: function () {
                  wx.request({
                    url: Url.api +"user/listStudentScore",
                    method:"POST",
                    data:{
                      token: localStorage.token,
                      student_name: that.data.stuData.student_name,
                      student_no: that.data.stuData.student_no,
                      pageSize:10000
                    },
                    success:function(res2){
                      that.setData({
                        scoreList: res2.data.data.list.reverse()
                      })
                    }
                  })
                }
              })
            },
            fail: function (res) {
              wx.showLoading({
                title: "保存失败",
                duration: 1000,
              })
            }
          })
        }
      }
    } else {
      wx.showToast({
        title: "请填写成绩信息",
        image: "../../images/icon/tip.png",
      })
    }
  },

  //删除成绩
  deleteScore:function(e){
    var that = this;
    var localStorage = wx.getStorageSync("edu_safe_login_user");
    wx.request({
      url: Url.api +"user/delStudentScore",
      method:"POST",
      data:{
        student_score_id:e.currentTarget.dataset.scoreItem.student_score_id,
        token:localStorage.token
      },
      success:function(res){
        wx.showToast({
          title: res.data.resultMsg,
          success:function(){
            wx.request({
              url: Url.api+"user/listStudentScore",
              method:"POST",
              data:{
                token: localStorage.token,
                student_name: that.data.stuData.student_name,
                student_no: that.data.stuData.student_no,
                pageSize: 10000
              },
              success:function(res2){
                that.setData({
                  scoreList: res2.data.data.list.reverse()
                })
              }
            })
          }
        })
      }
    })
  }
})