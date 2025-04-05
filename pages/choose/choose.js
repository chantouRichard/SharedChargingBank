// 获取全局 app 实例
const app = getApp();

Page({
  data: {
    showPopup: false,
    popupTitle: "",
    popupMessage: "",
    elapsedTime: 0, // 初始值设为0
    popupAnimation: null
  },

  onLoad() {
    // 确保全局数据存在并设置到页面数据中
    if (app.globalData && typeof app.globalData.elapsedTime !== 'undefined') {
      this.setData({
        elapsedTime: app.globalData.elapsedTime
      });
    } else {
      console.warn('app.globalData.elapsedTime is not defined');
      // 设置默认值
      this.setData({
        elapsedTime: Math.floor(Math.random() * 10) + 5 // 随机5-15秒
      });
    }
  },

  showPayPopup() {
    this.setData({
      showPopup: true,
      popupTitle: "支付提示",
      popupMessage: "即将进入微信支付页面",
    });

    this.setData({
      showPopup: true
    }, () => {
      // 蒙层渐显
      this.animate('.mask', [{
        opacity: 0
      }, {
        opacity: 1
      }], 300)
      // 弹窗从底部滑入
      this.animate('.popup', [{
        translateY: '100%'
      }, {
        translateY: '0%'
      }], 300, () => {
        this.setData({
          'popupAnimation': this.export()
        })
      })
    })
  },

  showFeedbackPopup() {
    wx.navigateTo({
      url: '/pages/feedback/feedback',
    })
  },

  hidePopup() {
    // 1. 弹窗向下滑出动画
    this.animate('.popup', [{
      translateY: '0%'
    }, {
      translateY: '100%'
    }], 300);

    // 2. 蒙层渐隐动画
    this.animate('.mask', [{
      opacity: 1
    }, {
      opacity: 0
    }], 300, () => {
      // 动画完成后隐藏弹窗
      this.setData({
        showPopup: false
      });
    });
  },

  confirmAction() {
    this.hidePopup();
    wx.showToast({
      title: "操作成功",
      icon: "success",
      duration: 2000
    });

    // 跳转到支付或反馈页面
    setTimeout(() => {
      wx.navigateTo({
        url: "/pages/pay/pay"
      });
    }, 1500);
  },

  // 显示支付弹窗
  showPaymentPopup() {
    this.setData({
      showPopup: true
    });

    // 创建弹出动画
    let animation = wx.createAnimation({
      duration: 300,
      timingFunction: "ease-in-out"
    });
    animation.translateY(0).step();
    this.setData({
      animationData: animation.export()
    });
  },

  // 关闭弹窗
  closePopup() {
    let animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-in-out"
    });
    animation.translateY(500).step();
    this.setData({
      animationData: animation.export()
    });

    setTimeout(() => {
      this.setData({
        showPopup: false
      });
    }, 200);
  },

  // 模拟支付
  simulatePayment(e) {
    const method = e.currentTarget.dataset.method;

    // 1. 显示支付中提示（使用微信原生 modal）
    wx.showLoading({
      title: `${method}中...`
    });

    // 2. 2秒后隐藏 loading，显示支付成功 toast，并返回上一页
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: "支付成功",
        icon: "success",
        duration: 1500,
        success: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      });

      if (app.finishPayment) {
        app.finishPayment();
      }
    }, 2000);
  }
}); 