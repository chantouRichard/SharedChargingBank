// pages/agreement/agreement.js
Page({
  // 用户点击同意
  handleAgree() {
    wx.showToast({
      title: '已确认须知',
      icon: 'success',
      duration: 1500,
      success: () => {
        setTimeout(() => {
          wx.navigateBack(); // 返回上一页
        }, 1500);
      }
    });
  }
});