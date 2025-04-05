const app = getApp(); // 获取全局 App 实例

Page({
  data: {
    isBorrowed: false, // 是否借用了充电宝
    elapsedTime: 0, // 已使用时间
    scanResult: '',
    showResult: false
  },
  
  onLoad() {
    this.checkTimer();
  },
  
  // 监听计时状态
  checkTimer() {
    if (app.globalData && app.globalData.startTime) {
      this.setData({
        isBorrowed: true,
        elapsedTime: app.globalData.elapsedTime || 0
      });

      this.startInterval();
    }
  },
  
  // 计时器，刷新计时时间
  startInterval() {
    this.timer = setInterval(() => {
      if (app.globalData) {
        this.setData({
          elapsedTime: app.globalData.elapsedTime || 0
        });
      }
    }, 1000);
  },
  
  // 开始扫码
  startScan() {
    const that = this;
    
    this.setData({
      elapsedTime: 0
    });
    
    // 直接使用模拟扫码
    this.simulateScan();
  },
  
  // 处理扫码成功的逻辑
  handleScanSuccess(res) {
    console.log("扫码成功:", res);
    
    // 设置扫码结果
    this.setData({
      scanResult: res.result || '模拟扫码结果: 成功',
      showResult: true
    });
    
    // 启动计时
    if (app.startTimer) {
      app.startTimer();
    } else {
      // 如果app中没有startTimer方法，创建一个简单的计时功能
      if (!app.globalData) app.globalData = {};
      app.globalData.startTime = Date.now();
      app.globalData.elapsedTime = 0;
      
      // 添加计时方法
      app.startTimer = function() {
        this.globalData.startTime = Date.now();
        this.globalData.elapsedTime = 0;
        this.timerInterval = setInterval(() => {
          this.globalData.elapsedTime = Math.floor((Date.now() - this.globalData.startTime) / 1000);
        }, 1000);
      };
      
      // 添加停止计时方法
      app.stopTimer = function() {
        clearInterval(this.timerInterval);
      };
      
      app.startTimer();
    }
    
    this.setData({
      isBorrowed: true
    });
    this.startInterval();
    
    wx.showToast({
      title: '扫码成功',
      icon: 'success'
    });
  },
  
  // 模拟扫码
  simulateScan() {
    const that = this;
    
    // 选择照片模拟扫码
    wx.showActionSheet({
      itemList: ['从相册选择照片', '直接模拟成功'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 从相册选择照片
          wx.chooseImage({
            count: 1,
            sourceType: ['album', 'camera'],
            success: (imageRes) => {
              console.log('选择照片成功', imageRes);
              
              // 模拟识别处理
              wx.showLoading({
                title: '识别中...'
              });
              
              setTimeout(() => {
                wx.hideLoading();
                const mockResult = {
                  result: '模拟二维码: POWERSHARE20231029',
                  scanType: 'QR_CODE',
                  charSet: 'UTF-8',
                  path: imageRes.tempFilePaths[0]
                };
                that.handleScanSuccess(mockResult);
              }, 1500);
            }
          });
        } else {
          // 直接模拟成功
          const mockResult = {
            result: '直接模拟二维码: POWERSHARE20231029',
            scanType: 'QR_CODE',
            charSet: 'UTF-8'
          };
          setTimeout(() => {
            that.handleScanSuccess(mockResult);
          }, 500);
        }
      }
    });
  },
  
  // 归还充电宝
  returnPowerBank() {
    if (app.stopTimer) {
      app.stopTimer(); // 停止计时
    }
    clearInterval(this.timer);

    wx.navigateTo({
      url: '/pages/choose/choose'
    });

    wx.showToast({
      title: `归还成功！使用时间: ${this.data.elapsedTime} 秒`,
      icon: "none",
      duration: 3000
    });

    this.setData({
      isBorrowed: false,
    });
  },
  
  //反馈问题
  feedback() {
    if (app.stopTimer) {
      app.stopTimer(); // 停止计时
    }
    clearInterval(this.timer);

    wx.navigateTo({
      url: '/pages/feedback/feedback',
    });

    this.setData({
      isBorrowed: false,
    });
  },
  
  onUnload() {
    // 页面卸载时清除计时器
    clearInterval(this.timer);
  }
}) 