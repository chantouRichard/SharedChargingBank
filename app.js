// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    startTime: null, // 记录扫码开始时间
    timer: null, // 计时器
    elapsedTime: 0 // 计时秒数
  },

  finishPayment() {
    this.globalData.startTime = null;
    this.globalData.elapsedTime = 0;
  },

  // 开始计时（扫码后调用）
  startTimer() {
    this.globalData.startTime = Date.now(); // 记录开始时间
    this.globalData.elapsedTime = 0; // 计时归零
    this.globalData.timer = setInterval(() => {
      this.globalData.elapsedTime = Math.floor((Date.now() - this.globalData.startTime) / 1000);
      console.log("已计时:", this.globalData.elapsedTime, "秒");
    }, 1000);
  },

  // 停止计时（支付后调用）
  stopTimer() {
    if (this.globalData.timer) {
      clearInterval(this.globalData.timer);
      this.globalData.timer = null;
      console.log("最终计时时长:", this.globalData.elapsedTime, "秒");
    }
  }
})
