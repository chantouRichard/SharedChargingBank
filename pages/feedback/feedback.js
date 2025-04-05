Page({
  data: {
    feedbackText: "",
  },

  // 监听输入
  onInput(e) {
    this.setData({
      feedbackText: e.detail.value,
    });
  },

  // 提交反馈
  submitFeedback() {
    if (!this.data.feedbackText.trim()) {
      wx.showToast({
        title: "请输入反馈内容",
        icon: "none",
        duration: 2000,
      });
      return;
    }

    wx.showToast({
      title: "提交成功",
      icon: "success",
      duration: 2000,
    });

    // 这里可以添加提交到服务器的代码
    setTimeout(() => {
      wx.navigateBack(); // 提交后返回上一页
    }, 1500);
  },
}); 