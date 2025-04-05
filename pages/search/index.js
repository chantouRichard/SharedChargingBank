Page({
  data: {
    scanResult: '',
    showResult: false
  },
  
  onLoad: function(options) {
    // 页面加载时执行
  },
  
  // 开始扫码
  startScan: function() {
    const that = this;
    
    wx.scanCode({
      success: (res) => {
        console.log('扫码结果:', res);
        that.setData({
          scanResult: res.result,
          showResult: true
        });
        
        wx.showToast({
          title: '扫码成功',
          icon: 'success'
        });
        
        // 这里可以处理扫码结果，例如跳转到相应页面或调用API
      },
      fail: (err) => {
        console.error('扫码失败:', err);
        if (err.errMsg !== 'scanCode:fail cancel') {
          wx.showToast({
            title: '扫码失败',
            icon: 'none'
          });
        }
      }
    });
  }
}) 