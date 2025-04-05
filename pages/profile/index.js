// 获取应用实例
const app = getApp();

Page({
  data: {
    isLogin: false,
    userInfo: {
      avatarUrl: '/image/default_avatar.png',
      nickName: '未登录'
    },
    // 用户相关选项
    userOptions: [
      { 
        title: '我的订单', 
        icon: '/image/order.png', 
        badge: 0, 
        url: '/pages/index/index'
      },
      { 
        title: '我的钱包', 
        icon: '/image/wallet.png', 
        badge: 0, 
        url: '/pages/index/index' 
      },
      { 
        title: '优惠券', 
        icon: '/image/coupon.png', 
        badge: 2, 
        url: '/pages/index/index' 
      }
    ],
    // 充电宝服务选项
    chargeOptions: [
      { 
        title: '借还记录', 
        icon: '/image/history.png', 
        url: '/pages/index/index' 
      },
      { 
        title: '常用地点', 
        icon: '/image/location.png', 
        url: '/pages/index/index' 
      },
      { 
        title: '会员卡', 
        icon: '/image/vip.png', 
        url: '/pages/index/index' 
      }
    ],
    // 设置选项
    settingOptions: [
      { 
        title: '消费记录', 
        icon: '/image/history.png', 
        url: '/pages/index/index' 
      },
      { 
        title: '问题反馈', 
        icon: '/image/feedback.png', 
        url: '/pages/feedback/feedback' 
      },
      { 
        title: '使用帮助', 
        icon: '/image/help.png', 
        url: '/pages/user/index' 
      },
      { 
        title: '设置', 
        icon: '/image/setting.png', 
        url: '/pages/index/index' 
      }
    ],
    // 添加使用记录数据
    orderHistory: [],
    // 会员积分和信息
    memberInfo: {
      points: 0,
      level: '普通用户',
      discount: '无折扣'
    }
  },

  onLoad() {
    // 检查登录状态（从本地存储）
    this.checkLoginStatus();
    
    // 设置模拟订单数据
    this.setMockOrderData();
  },
  
  onShow() {
    // 每次显示页面时检查登录状态
    this.checkLoginStatus();
  },
  
  // 检查登录状态
  checkLoginStatus() {
    const loginInfo = wx.getStorageSync('loginInfo');
    if (loginInfo) {
      const userInfo = JSON.parse(loginInfo);
      this.setData({
        isLogin: true,
        userInfo: userInfo,
        'memberInfo.points': parseInt(userInfo.balance || 0) * 10, // 根据余额生成积分
        'memberInfo.level': this.getMemberLevel(userInfo.balance || 0)
      });
    }
  },
  
  // 获取会员等级
  getMemberLevel(balance) {
    if (balance >= 500) return '钻石会员';
    if (balance >= 200) return '金卡会员';
    if (balance >= 100) return '银卡会员';
    return '普通用户';
  },
  
  // 设置模拟订单数据
  setMockOrderData() {
    const mockOrders = [
      {
        id: 'order001',
        time: '2023-10-29 14:30:25',
        title: '充电宝借用',
        location: '学生中心A区',
        duration: '1小时20分钟',
        amount: '5.00',
        status: 'completed'
      },
      {
        id: 'order002',
        time: '2023-10-28 09:15:38',
        title: '充电宝借用',
        location: '图书馆北门',
        duration: '45分钟',
        amount: '2.50',
        status: 'completed'
      }
    ];
    
    this.setData({
      orderHistory: mockOrders
    });
  },

  // 模拟登录
  login() {
    // 显示加载状态
    wx.showLoading({
      title: '登录中...',
    });

    // 模拟登录请求延迟
    setTimeout(() => {
      // 生成随机用户信息
      const randomId = Math.floor(Math.random() * 1000);
      const randomBalance = (Math.random() * 300).toFixed(2);
      const mockUserInfo = {
        avatarUrl: 'https://picsum.photos/200', // 随机头像
        nickName: '充电用户' + randomId,
        userId: 'user_' + randomId,
        balance: randomBalance
      };

      // 保存到本地
      wx.setStorageSync('loginInfo', JSON.stringify(mockUserInfo));

      // 更新UI
      this.setData({
        isLogin: true,
        userInfo: mockUserInfo,
        'memberInfo.points': parseInt(randomBalance) * 10,
        'memberInfo.level': this.getMemberLevel(randomBalance)
      });

      wx.hideLoading();
      
      // 使用轻提示而不是toast，体验更好
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500
      });
      
      // 登录成功后，添加模拟数据
      this.setMockOrderData();
    }, 1500);
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      confirmColor: '#ffcc00',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储的登录信息
          wx.removeStorageSync('loginInfo');
          
          // 更新UI
          this.setData({
            isLogin: false,
            userInfo: {
              avatarUrl: '/image/default_avatar.png',
              nickName: '未登录'
            },
            'memberInfo.points': 0,
            'memberInfo.level': '普通用户'
          });
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  // 点击用户选项
  onTapUserOption(e) {
    const index = e.currentTarget.dataset.index;
    const option = this.data.userOptions[index];
    
    if (!this.data.isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    
    // 添加振动反馈
    wx.vibrateShort({
      type: 'light'
    });
    
    wx.navigateTo({
      url: option.url
    });
  },

  // 点击充电宝服务选项
  onTapChargeOption(e) {
    const index = e.currentTarget.dataset.index;
    const option = this.data.chargeOptions[index];
    
    if (!this.data.isLogin && index !== 2) { // 允许非登录用户查看会员卡说明
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    
    // 添加振动反馈
    wx.vibrateShort({
      type: 'light'
    });
    
    wx.navigateTo({
      url: option.url
    });
  },

  // 点击设置选项
  onTapSettingOption(e) {
    const index = e.currentTarget.dataset.index;
    const option = this.data.settingOptions[index];
    
    // 添加振动反馈
    wx.vibrateShort({
      type: 'light'
    });
    
    wx.navigateTo({
      url: option.url
    });
  },
  
  // 分享功能
  onShareAppMessage() {
    return {
      title: '共享充电宝 - 随时随地为您的设备充电',
      path: '/pages/index/index',
      imageUrl: '/image/share_image.png'
    };
  }
}) 