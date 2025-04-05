const util = require('../../utils/util.js');

const normalCallout = {
  id: 1,
  latitude: 30.26064905500077,
  longitude: 120.14700833494362,
  width: 40,
  height: 50,
  iconPath: '/image/location.png',
  callout: {
    content: '宝石山',
    color: '#0066FF',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000000',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  },
  label: {
    content: '这里是宝石山',
    fontSize: 10,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
    bgColor: '#fff',
    padding: 5
  }
}
//标注点2
const customCallout1 = {
  id: 2,
  latitude: 30.258747261993033,
  longitude: 120.15197366023278,
  iconPath: '/image/location.png',
  width: 40,
  height: 50,
  callout: {
    content: '断桥残雪',
    color: '#7700BB',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000000',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  },
  label: {
    content: '这里是断桥残雪',
    fontSize: 10,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
    bgColor: '#fff',
    padding: 5
  }
}
//标注点3

const customCallout2 = {
  id: 3,
  latitude: 30.255288366053747,
  longitude: 120.14901183344466,
  iconPath: '/image/location.png',
  width: 40,
  height: 50,
  callout: {
    content: '白堤',
    color: '#7700BB',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000000',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  },
  label: {
    content: '这里是白堤',
    fontSize: 10,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
    bgColor: '#fff',
    padding: 5
  }
}
//标注点4
const customCallout3 = {
  id: 4,
  latitude: 30.25456060231621,
  longitude: 120.1463731200422,
  iconPath: '/image/location.png',
  width: 40,
  height: 50,
  callout: {
    content: '千里湖',
    color: '#FF0000',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000000',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  },
  label: {
    content: '这里是千里湖',
    fontSize: 10,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
    bgColor: '#fff',
    padding: 5
  }
}

const allMarkers = [normalCallout, customCallout1, customCallout2, customCallout3]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 114.31,  // 武汉市中心经度
    latitude: 30.59,    // 武汉市中心纬度
    markers: [],
    chargers: [],
    brandPaths: [],
    scoredBrands: [],
    currentLocation: null,
    currentLocationName: '',
    destinationLocation: null,
    destinationName: '',
    isSearchDone: false,
    currentSortMethod: 'shortestTotalTime',
    ratioUpdateTimer: null,
    useSimulatedLocation: false, // 设为true使用模拟位置，false使用真实位置
    useSimulatedSearch: false, // 设为true使用模拟搜索，false使用真实API
    topRecommendations: [], // 存储推荐结果
    currentBrandDetail: {
      show: false,
      brand: '',
      color: '',
      borrowDistance: 0,
      borrowTime: 0,
      returnDistance: 0,
      returnTime: 0,
      totalTime: 0,
      price: 0,
      borrowRatio: 0,
      returnRatio: 0,
      reputation: 0
    },
    // 悬浮搜索按钮位置
    searchBtnX: 300,
    searchBtnY: 500,
    // 搜索面板显示状态
    showSearchPanel: false,
    // 搜索关键词
    searchKeyword: '',
    // 搜索结果
    searchResults: [],
    // 位置历史记录
    locationHistory: [],
    // 选中的位置信息
    selectedLocation: null,
    // 地点操作面板显示状态
    showLocationAction: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化地图位置（武汉中心位置）
    this.setData({
      longitude: 114.31,  // 武汉市中心经度
      latitude: 30.59,    // 武汉市中心纬度
      markers: []
    });
    
    // 立即获取用户当前位置作为起点
    this.getCurrentLocation();
    
    // 加载搜索按钮位置
    const savedBtnX = wx.getStorageSync('searchBtnX');
    const savedBtnY = wx.getStorageSync('searchBtnY');
    
    if (savedBtnX !== '' && savedBtnY !== '') {
      this.setData({
        searchBtnX: savedBtnX,
        searchBtnY: savedBtnY
      });
    }
    
    // 加载位置历史记录
    this.loadLocationHistory();
  },

  // 获取当前位置
  getCurrentLocation: function() {
    const that = this;
    
    if (this.data.useSimulatedLocation) {
      // 使用模拟位置（改为武汉黄鹤楼附近）
      const simulatedLocation = {
        latitude: 30.5433,
        longitude: 114.3022,
        name: '黄鹤楼'
      };
      
      that.setData({
        currentLocation: {
          latitude: simulatedLocation.latitude,
          longitude: simulatedLocation.longitude
        },
        currentLocationName: simulatedLocation.name,
        latitude: simulatedLocation.latitude,
        longitude: simulatedLocation.longitude
      });
      
      wx.showToast({
        title: '已获取模拟位置',
        icon: 'success'
      });
    } else {
      // 使用真实位置
      wx.showLoading({
        title: '获取位置中...'
      });
      
      wx.getLocation({
        type: 'gcj02',
        success: function(res) {
          wx.hideLoading();
          that.setData({
            currentLocation: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            latitude: res.latitude,
            longitude: res.longitude
          });
          
          // 获取位置名称
          that.getLocationName(res.latitude, res.longitude, 'current');
          
          wx.showToast({
            title: '已获取真实位置',
            icon: 'success'
          });
        },
        fail: function() {
          wx.hideLoading();
          wx.showToast({
            title: '获取位置失败',
            icon: 'none'
          });
        }
      });
    }
  },

  // 获取位置名称
  getLocationName: function(latitude, longitude, type) {
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: latitude + ',' + longitude,
        key: 'TJ4BZ-M2GKQ-ORK5A-4BRHY-PRDSF-FSBP6',
        get_poi: 0
      },
      success: (res) => {
        if (res.data.status === 0) {
          const address = res.data.result.address;
          const name = res.data.result.formatted_addresses?.recommend || address;
          
          if (type === 'current') {
            this.setData({
              currentLocationName: name
            });
          } else {
            this.setData({
              destinationName: name
            });
          }
        } else {
          if (type === 'current') {
            this.setData({
              currentLocationName: '当前位置'
            });
          } else {
            this.setData({
              destinationName: '目的地'
            });
          }
        }
      },
      fail: () => {
        // 获取失败时使用默认值
        if (type === 'current') {
          this.setData({
            currentLocationName: '当前位置'
          });
        } else {
          this.setData({
            destinationName: '目的地'
          });
        }
      }
    });
  },

  // 开始搜索目的地
  startSearch: function() {
    // 直接打开搜索面板
    this.toggleSearchPanel();
  },

  // 生成充电桩站点
  generateChargerStations: function() {
    wx.showLoading({
      title: '计算最佳借还路径',
    });
    
    // 确保起点和终点已设置
    if (!this.data.currentLocation || !this.data.destinationLocation) {
      wx.hideLoading();
      wx.showToast({
        title: '请先设置起点和终点',
        icon: 'none'
      });
      return;
    }
    
    // 生成充电桩数据
    const result = util.generateChargers(
      this.data.currentLocation,
      this.data.destinationLocation
    );
    
    const allChargers = result.allChargers;
    const brandStations = result.brandStations;
    
    // 计算最佳借还路径
    const brandPaths = util.calculateOptimalPaths(
      brandStations,
      this.data.currentLocation,
      this.data.destinationLocation
    );
    
    // 根据当前排序方法计算评分并排序
    const scoredBrands = util.calculateBrandScores(
      brandPaths,
      this.data.currentSortMethod
    );
    
    // 提取前3个作为推荐
    const recommendations = scoredBrands.slice(0, 3);
    
    this.setData({
      chargers: allChargers,
      brandPaths: brandPaths,
      scoredBrands: scoredBrands,
      topRecommendations: recommendations,
      isSearchDone: true
    });
    
    // 显示第一个推荐品牌的路径，但不显示详情窗口
    if (recommendations.length > 0) {
      this.showBrandPathOnMap(recommendations[0].brand);
    }
    
    wx.hideLoading();
  },
  
  // 排序方式变更
  onSortMethodChange: function(e) {
    const method = e.currentTarget.dataset.method;
    
    // 显示加载中提示
    wx.showLoading({
      title: '正在排序...',
    });
    
    console.log('切换排序方法:', method, '当前品牌数量:', Object.keys(this.data.brandPaths).length);
    
    // 重新排序
    const scoredBrands = util.calculateBrandScores(this.data.brandPaths, method);
    
    console.log('排序完成，结果数量:', scoredBrands.length);
    
    // 提取排序后的前3个品牌作为推荐
    const recommendations = scoredBrands.slice(0, 3);
    console.log('推荐品牌:', recommendations.map(item => item.brand));
    
    // 更新数据
    this.setData({
      currentSortMethod: method,
      scoredBrands: scoredBrands,
      topRecommendations: recommendations
    }, () => {
      // 在数据更新完成后隐藏加载提示
      wx.hideLoading();
      
      // 显示地图上标记点，但不自动弹出详情
      if (recommendations.length > 0) {
        this.showBrandPathOnMap(recommendations[0].brand);
      }
      
      // 提示排序完成
      wx.showToast({
        title: '排序完成',
        icon: 'success',
        duration: 500
      });
      
      // 滚动到列表顶部
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    });
  },

  // 选择品牌
  selectBrand: function(e) {
    const brandName = e.currentTarget.dataset.brand;
    
    if (brandName) {
      // 在地图上显示借还点
      this.showBrandPathOnMap(brandName);
      
      // 显示美化的品牌详情
      this.showBeautifiedBrandDetails(brandName);
    }
  },

  // 显示品牌路径
  showBrandPath: function(brandName) {
    const brandPath = this.data.brandPaths[brandName];
    
    if (!brandPath) return;
    
    // 创建地图标记
    const markers = [];
    
    // 起点标记
    markers.push({
      id: 'start',
      latitude: this.data.currentLocation.latitude,
      longitude: this.data.currentLocation.longitude,
      iconPath: '/image/start_point.png',
      width: 30,
      height: 30,
      callout: {
        content: '起点',
        color: '#000000',
        fontSize: 14,
        borderRadius: 5,
        bgColor: '#ffffff',
        padding: 5,
        display: 'ALWAYS'
      }
    });
    
    // 终点标记
    markers.push({
      id: 'end',
      latitude: this.data.destinationLocation.latitude,
      longitude: this.data.destinationLocation.longitude,
      iconPath: '/image/end_point.png',
      width: 30,
      height: 30,
      callout: {
        content: '终点',
        color: '#000000',
        fontSize: 14,
        borderRadius: 5,
        bgColor: '#ffffff',
        padding: 5,
        display: 'ALWAYS'
      }
    });
    
    // 添加借站点标记
    markers.push({
      id: brandPath.borrowStation.id,
      latitude: brandPath.borrowStation.latitude,
      longitude: brandPath.borrowStation.longitude,
      iconPath: '/image/charge.png',
      width: 40,
      height: 40,
      callout: {
        content: `${brandName}(借)`,
        color: brandPath.brand.color,
        fontSize: 14,
        borderRadius: 5,
        bgColor: '#ffffff',
        padding: 5,
        display: 'ALWAYS'
      }
    });
    
    // 添加还站点标记
    markers.push({
      id: brandPath.returnStation.id,
      latitude: brandPath.returnStation.latitude,
      longitude: brandPath.returnStation.longitude,
      iconPath: '/image/charge.png',
      width: 40,
      height: 40,
      callout: {
        content: `${brandName}(还)`,
        color: brandPath.brand.color,
        fontSize: 14,
        borderRadius: 5,
        bgColor: '#ffffff',
        padding: 5,
        display: 'ALWAYS'
      }
    });
    
    this.setData({
      markers: markers
    });
    
    // 显示详情
    this.showBrandDetails(brandName);
  },

  // 显示品牌详情
  showBrandDetails: function(brandName) {
    const brandPath = this.data.brandPaths[brandName];
    
    if (brandPath) {
      wx.showModal({
        title: `${brandName}充电宝详情`,
        content: `
品牌: ${brandName}
价格: ${brandPath.brand.price}元/小时
口碑: ${brandPath.brand.reputation}分

【借出点】
位置: 距起点${brandPath.segments.startToBorrow.distance}米
借还比: ${brandPath.borrowStation.predictedBorrowRatio} (越低越好)
步行时间: ${brandPath.segments.startToBorrow.time}分钟

【归还点】
位置: 距终点${brandPath.segments.returnToEnd.distance}米
借还比: ${brandPath.returnStation.predictedReturnRatio} (越高越好)
步行时间: ${brandPath.segments.returnToEnd.time}分钟

【总体数据】
总距离: ${brandPath.totalDistance}米
总时间: ${brandPath.totalTime}分钟`,
        showCancel: false
      });
    }
  },

  // 导航到借站点
  navigateToBorrowStation: function(e) {
    const brandName = e.currentTarget.dataset.brand;
    const brandPath = this.data.brandPaths[brandName];
    
    if (brandPath) {
      wx.openLocation({
        latitude: brandPath.borrowStation.latitude,
        longitude: brandPath.borrowStation.longitude,
        name: `${brandName}借充点`,
        address: `距您${brandPath.segments.startToBorrow.distance}米，步行约${brandPath.segments.startToBorrow.time}分钟`
      });
    }
    
    // 防止事件冒泡
    return false;
  },

  // 地图标记点击事件
  markertap: function(e) {
    const markerId = e.markerId;
    
    // 如果是充电桩标记点
    if (markerId !== 'start' && markerId !== 'end') {
      const charger = this.data.chargers.find(item => item.id === markerId);
      if (charger) {
        const brandName = charger.brand;
        this.showBrandDetails(brandName);
      }
    }
  },

  // 气泡点击事件
  callouttap: function(e) {
    this.markertap(e);
  },

  // 地图点击事件
  mapBindtap: function(e) {
    // 地图长按时弹出选择菜单
    const latitude = e.detail.latitude;
    const longitude = e.detail.longitude;
    
    wx.showActionSheet({
      itemList: ['设为起点', '设为终点'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 设为起点
          this.setData({
            currentLocation: {
              latitude: latitude,
              longitude: longitude
            },
            currentLocationName: '已标记位置',
            latitude: latitude,
            longitude: longitude
          });
          
          // 更新起点标记
          this.updateLocationMarkers();
          
          wx.showToast({
            title: '已设置起点',
            icon: 'success'
          });
        } else if (res.tapIndex === 1) {
          // 设为终点
          this.setData({
            destinationLocation: {
              latitude: latitude,
              longitude: longitude
            },
            destinationName: '已标记位置',
          });
          
          // 更新终点标记
          this.updateLocationMarkers();
          
          wx.showToast({
            title: '已设置终点',
            icon: 'success'
          });
        }
        
        // 如果起点和终点都已设置，自动生成充电桩
        if (this.data.currentLocation && this.data.destinationLocation) {
          this.generateChargerStations();
        }
      }
    });
  },

  // 更新位置标记
  updateLocationMarkers: function() {
    const markers = [];
    
    // 添加起点标记
    if (this.data.currentLocation) {
      markers.push({
        id: 'start',
        latitude: this.data.currentLocation.latitude,
        longitude: this.data.currentLocation.longitude,
        iconPath: '/image/start_point.png',
        width: 40,
        height: 40,
        callout: {
          content: '起点',
          color: '#07c160',
          fontSize: 14,
          borderRadius: 8,
          bgColor: '#ffffff',
          padding: 8,
          display: 'ALWAYS'
        }
      });
    }
    
    // 添加终点标记
    if (this.data.destinationLocation) {
      markers.push({
        id: 'end',
        latitude: this.data.destinationLocation.latitude,
        longitude: this.data.destinationLocation.longitude,
        iconPath: '/image/end_point.png',
        width: 40,
        height: 40,
        callout: {
          content: '终点',
          color: '#ff4c4f',
          fontSize: 14,
          borderRadius: 8,
          bgColor: '#ffffff',
          padding: 8,
          display: 'ALWAYS'
        }
      });
    }
    
    this.setData({
      markers: markers
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 清除定时器
    if (this.data.ratioUpdateTimer) {
      clearInterval(this.data.ratioUpdateTimer);
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 添加页面跳转方法
  navigateToSearch: function() {
    wx.navigateTo({
      url: '/pages/search/index'
    });
  },

  navigateToMark: function() {
    wx.navigateTo({
      url: '/pages/user/index'
    });
  },

  // 添加新的交互方法
  navigateToCharger: function(e) {
    const id = e.currentTarget.dataset.id;
    const charger = this.data.chargers.find(item => item.id === id);
    
    if (charger) {
      wx.openLocation({
        latitude: charger.latitude,
        longitude: charger.longitude,
        name: charger.brand + '充电宝',
        address: `${charger.nearLocation}附近，距您${charger.distance.fromCurrent}米`
      });
    }
    
    // 防止事件冒泡
    return false;
  },

  showDetails: function(e) {
    const id = e.currentTarget.dataset.id;
    const charger = this.data.chargers.find(item => item.id === id);
    
    if (charger) {
      wx.showModal({
        title: charger.brand + '充电宝详情',
        content: `位置: ${charger.nearLocation}附近
价格: ${charger.price}元/小时
口碑: ${charger.reputation}分
借还比: ${charger.borrowReturnRatio * 100}%
借用距离: ${charger.distance.fromCurrent}米
归还距离: ${charger.distance.toDestination}米
总时间: ${charger.time.total}分钟`,
        showCancel: false
      });
    }
    
    // 防止事件冒泡
    return false;
  },

  // 新增函数：只在地图上显示路径，不弹出详情
  showBrandPathOnMap: function(brandName) {
    const brandPath = this.data.brandPaths[brandName];
    
    if (!brandPath) return;
    
    // 创建地图标记(修正此处)
    const markers = [];
    
    // 添加起点终点标记
    if (this.data.currentLocation) {
      markers.push({
        id: 'start',
        latitude: this.data.currentLocation.latitude,
        longitude: this.data.currentLocation.longitude,
        iconPath: '/image/start_point.png',
        width: 30,
        height: 30,
        callout: {
          content: '起点',
          color: '#000000',
          fontSize: 14,
          borderRadius: 5,
          bgColor: '#ffffff',
          padding: 5,
          display: 'ALWAYS'
        }
      });
    }
    
    if (this.data.destinationLocation) {
      markers.push({
        id: 'end',
        latitude: this.data.destinationLocation.latitude,
        longitude: this.data.destinationLocation.longitude,
        iconPath: '/image/end_point.png',
        width: 30,
        height: 30,
        callout: {
          content: '终点',
          color: '#000000',
          fontSize: 14,
          borderRadius: 5,
          bgColor: '#ffffff',
          padding: 5,
          display: 'ALWAYS'
        }
      });
    }
    
    // 添加借站点标记
    markers.push({
      id: brandPath.borrowStation.id,
      latitude: brandPath.borrowStation.latitude,
      longitude: brandPath.borrowStation.longitude,
      iconPath: '/image/charge.png',
      width: 40,
      height: 40,
      callout: {
        content: `${brandName}(借)`,
        color: brandPath.brand.color,
        fontSize: 14,
        borderRadius: 5,
        bgColor: '#ffffff',
        padding: 5,
        display: 'ALWAYS'
      }
    });
    
    // 添加还站点标记
    markers.push({
      id: brandPath.returnStation.id,
      latitude: brandPath.returnStation.latitude,
      longitude: brandPath.returnStation.longitude,
      iconPath: '/image/charge.png',
      width: 40,
      height: 40,
      callout: {
        content: `${brandName}(还)`,
        color: brandPath.brand.color,
        fontSize: 14,
        borderRadius: 5,
        bgColor: '#ffffff',
        padding: 5,
        display: 'ALWAYS'
      }
    });
    
    // 更新地图标记
    this.setData({
      markers: markers
    });
  },

  // 添加新的美化详情显示函数
  showBeautifiedBrandDetails: function(brandName) {
    const brandPath = this.data.brandPaths[brandName];
    
    if (!brandPath) return;
    
    // 设置详情窗口数据
    this.setData({
      currentBrandDetail: {
        show: true,
        brand: brandName,
        color: brandPath.brand.color,
        borrowDistance: brandPath.segments.startToBorrow.distance,
        borrowTime: brandPath.segments.startToBorrow.time,
        returnDistance: brandPath.segments.returnToEnd.distance,
        returnTime: brandPath.segments.returnToEnd.time,
        totalTime: brandPath.totalTime,
        price: parseFloat(brandPath.brand.price).toFixed(2),
        borrowRatio: parseFloat(brandPath.borrowStation.predictedBorrowRatio).toFixed(2),
        returnRatio: parseFloat(brandPath.returnStation.predictedReturnRatio).toFixed(2),
        reputation: parseFloat(brandPath.brand.reputation).toFixed(1)
      }
    });
  },

  // 关闭详情窗口
  closeBrandDetail: function() {
    this.setData({
      'currentBrandDetail.show': false
    });
  },

  // 切换搜索面板显示状态
  toggleSearchPanel: function() {
    this.setData({
      showSearchPanel: !this.data.showSearchPanel,
      searchKeyword: '',
      searchResults: []
    });
    
    // 显示搜索面板时加载历史记录
    if (this.data.showSearchPanel) {
      this.loadLocationHistory();
    }
  },

  // 加载位置历史记录
  loadLocationHistory: function() {
    const history = wx.getStorageSync('locationHistory') || [];
    this.setData({
      locationHistory: history
    });
  },

  // 搜索输入事件
  onSearchInput: function(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 监听搜索按钮位置变化
  onSearchBtnChange: function(e) {
    // 防抖处理，不必每次移动都保存
    if (this.savePositionTimer) {
      clearTimeout(this.savePositionTimer);
    }
    
    this.savePositionTimer = setTimeout(() => {
      const x = e.detail.x;
      const y = e.detail.y;
      
      wx.setStorageSync('searchBtnX', x);
      wx.setStorageSync('searchBtnY', y);
    }, 300);
  },

  // 执行地点搜索
  searchLocation: function() {
    const keyword = this.data.searchKeyword;
    if (!keyword.trim()) {
      wx.showToast({
        title: '请输入搜索关键词',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '搜索中...'
    });
    
    console.log('开始搜索地点:', keyword);
    
    // 调用腾讯位置服务POI搜索API
    wx.request({
      url: 'https://apis.map.qq.com/ws/place/v1/search',
      data: {
        keyword: keyword,
        boundary: 'region(武汉,0)', // 限定在武汉市范围内搜索
        key: '3QOBZ-YCZLQ-CQI5N-2PW6B-2ELR7-57F4U', // 使用提供的密钥
        page_size: 20, // 返回结果数量
        page_index: 1, // 页码
        output: 'json', // 返回格式
        auto_extend: 1 // 自动扩大搜索范围
      },
      success: (res) => {
        wx.hideLoading();
        console.log('API返回数据:', res.data);
        
        if (res.data && res.data.status === 0 && res.data.data && res.data.data.length > 0) {
          // 处理返回结果
          const poiList = res.data.data;
          const results = poiList.map((item, index) => {
            return {
              id: index.toString(),
              name: item.title,
              address: item.address || item.title,
              latitude: item.location.lat,
              longitude: item.location.lng
            };
          });
          
          this.setData({
            searchResults: results
          });
          
          console.log('成功获取搜索结果:', results.length, '条数据');
        } else {
          console.error('搜索返回结果异常:', res.data);
          this.setData({
            searchResults: []
          });
          
          // 处理各种错误状态码
          if (res.data && res.data.status !== 0) {
            let errorMsg = '未找到相关地点';
            
            // 根据腾讯地图API状态码显示不同错误信息
            switch(res.data.status) {
              case 310: errorMsg = 'API密钥无效'; break;
              case 311: errorMsg = '请求超过配额'; break;
              case 306: errorMsg = '请求参数不符合规则'; break;
              default: errorMsg = `搜索失败(${res.data.status})`;
            }
            
            wx.showToast({
              title: errorMsg,
              icon: 'none'
            });
          } else {
            wx.showToast({
              title: '未找到相关地点',
              icon: 'none'
            });
          }
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('搜索请求失败', err);
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      }
    });
  },

  // 选择搜索结果
  selectLocation: function(e) {
    const location = e.currentTarget.dataset.location;
    
    // 保存到历史记录
    this.saveLocationToHistory(location);
    
    // 强制关闭搜索面板
    this.setData({
      showSearchPanel: false,  // 先隐藏搜索面板
      searchResults: []        // 清空搜索结果，防止再次显示
    });
    
    // 短暂延迟后显示操作菜单，确保搜索面板已完全关闭
    setTimeout(() => {
      // 显示操作菜单
      this.setData({
        selectedLocation: location,
        showLocationAction: true
      });
    }, 100);
  },

  // 保存位置到历史记录
  saveLocationToHistory: function(location) {
    let history = wx.getStorageSync('locationHistory') || [];
    
    // 检查是否已存在相同位置
    const index = history.findIndex(item => 
      item.id === location.id || 
      (item.latitude === location.latitude && item.longitude === location.longitude)
    );
    
    if (index !== -1) {
      // 如果存在，移除旧记录
      history.splice(index, 1);
    }
    
    // 限制历史记录数量
    if (history.length >= 10) {
      history.pop(); // 移除最旧的记录
    }
    
    // 添加新记录到开头
    history.unshift(location);
    
    // 保存到本地存储
    wx.setStorageSync('locationHistory', history);
    
    // 更新显示
    this.setData({
      locationHistory: history
    });
  },

  // 设为起点
  setAsStart: function() {
    const location = this.data.selectedLocation;
    
    this.setData({
      currentLocation: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      currentLocationName: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      showLocationAction: false,
      showSearchPanel: false  // 确保搜索面板被关闭
    });
    
    // 更新地图标记
    this.updateLocationMarkers();
    
    wx.showToast({
      title: '已设为起点',
      icon: 'success'
    });
    
    // 如果起点和终点都已设置，自动生成充电桩
    if (this.data.currentLocation && this.data.destinationLocation) {
      this.generateChargerStations();
    }
  },

  // 设为终点
  setAsEnd: function() {
    const location = this.data.selectedLocation;
    
    this.setData({
      destinationLocation: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      destinationName: location.name,
      showLocationAction: false,
      showSearchPanel: false  // 确保搜索面板被关闭
    });
    
    // 更新地图标记
    this.updateLocationMarkers();
    
    wx.showToast({
      title: '已设为终点',
      icon: 'success'
    });
    
    // 如果起点和终点都已设置，自动生成充电桩
    if (this.data.currentLocation && this.data.destinationLocation) {
      this.generateChargerStations();
    }
  },

  // 取消位置选择
  cancelLocationSelection: function() {
    this.setData({
      showLocationAction: false,
      showSearchPanel: false  // 确保搜索面板被关闭
    });
  },

  // 防止事件冒泡
  preventBubble: function() {
    return;
  },
  
  // 快速搜索热门地点
  quickSearchPlace: function(e) {
    const placeName = e.currentTarget.dataset.name;
    
    this.setData({
      searchKeyword: placeName
    });
    
    // 自动执行搜索
    this.searchLocation();
  },

  // 清除位置历史记录
  clearLocationHistory: function() {
    wx.showModal({
      title: '清除历史记录',
      content: '确定要清除所有搜索历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储中的历史记录
          wx.removeStorageSync('locationHistory');
          
          // 更新显示
          this.setData({
            locationHistory: []
          });
          
          wx.showToast({
            title: '历史记录已清除',
            icon: 'success'
          });
        }
      }
    });
  },
  
  // 删除单条历史记录
  deleteLocationHistory: function(e) {
    const index = e.currentTarget.dataset.index;
    let history = this.data.locationHistory;
    
    // 从数组中移除该记录
    history.splice(index, 1);
    
    // 保存到本地存储
    wx.setStorageSync('locationHistory', history);
    
    // 更新显示
    this.setData({
      locationHistory: history
    });
    
    wx.showToast({
      title: '已删除该记录',
      icon: 'success',
      duration: 1000
    });
  }
})