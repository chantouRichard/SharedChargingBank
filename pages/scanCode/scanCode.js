const app = getApp(); // 获取全局 App 实例

Page({
  data: {
    isBorrowed: false, // 是否借用了充电宝
    elapsedTime: 0, // 已使用时间
  },

  onLoad() {
    this.checkTimer();
  },

  // 监听计时状态
  checkTimer() {
    if (app.globalData.startTime) {
      this.setData({
        isBorrowed: true,
        elapsedTime: app.globalData.elapsedTime
      });

      this.startInterval();
    }
  },

  // 计时器，刷新计时时间
  startInterval() {
    this.timer = setInterval(() => {
      this.setData({
        elapsedTime: app.globalData.elapsedTime
      });
    }, 1000);
  },

  // 模拟扫码
  scanCode() {
    this.setData({
      elapsedTime: 0
    });
    wx.scanCode({
      success: (res) => {
        console.log("扫码成功:", res);
        app.startTimer(); // 启动计时

        this.setData({
          isBorrowed: true
        });
        this.startInterval();
      },
      fail: (err) => {
        console.log("扫码失败:", err);

        app.startTimer(); // 启动计时
        this.setData({
          isBorrowed: true
        });
        this.startInterval();
      }
    });
  },

  // 归还充电宝
  returnPowerBank() {
    app.stopTimer(); // 停止计时
    clearInterval(this.timer);
    wx.navigateTo({
      url: '/pages/choose/choose',
    })

    wx.showToast({
      title: `归还成功！使用时间: ${app.globalData.elapsedTime} 秒`,
      icon: "none",
      duration: 3000
    });

    this.setData({
      isBorrowed: false,
    });
  },

  //反馈问题
  feedback() {
    app.stopTimer(); // 停止计时
    clearInterval(this.timer);

    wx.navigateTo({
      url: '/pages/feedback/feedback',
    })

    this.setData({
      isBorrowed: false,
    });
  }
});