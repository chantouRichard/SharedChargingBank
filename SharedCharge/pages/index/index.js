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
    longitude: 120.14700833494362,
    latitude: 30.26064905500077,
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
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化地图位置（示例为杭州西湖位置）
    this.setData({
      longitude: 120.13026,  // 确保设置了默认经度
      latitude: 30.28907,    // 确保设置了默认纬度
      markers: []
    });
    
    // 立即获取用户当前位置作为起点
    this.getCurrentLocation();
  },

  // 获取当前位置
  getCurrentLocation: function() {
    const that = this;
    
    if (this.data.useSimulatedLocation) {
      // 使用模拟位置
      const simulatedLocation = {
        latitude: 30.26064905500077,
        longitude: 120.14700833494362,
        name: '西湖风景区'
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

  // 开始搜索目的地
  startSearch: function() {
    const that = this;
    
    if (this.data.useSimulatedSearch) {
      // 使用模拟目的地
      const simulatedDestination = {
        latitude: 30.254560602316,
        longitude: 120.14637312004,
        name: '西湖音乐喷泉'
      };
      
      that.setData({
        destinationLocation: {
          latitude: simulatedDestination.latitude,
          longitude: simulatedDestination.longitude
        },
        destinationName: simulatedDestination.name
      });
      
      wx.showToast({
        title: '已设置模拟目的地',
        icon: 'success'
      });
      
      // 检查是否可以生成充电桩
      if (that.data.currentLocation && that.data.destinationLocation) {
        that.generateChargerStations();
      }
    } else {
      // 使用真实搜索
      wx.showToast({
        title: '请选择目的地',
        icon: 'none',
        duration: 1500
      });
      
      wx.chooseLocation({
        success: function(res) {
          that.setData({
            destinationLocation: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            destinationName: res.name || res.address
          });
          
          wx.showToast({
            title: '已设置目的地',
            icon: 'success'
          });
          
          // 检查是否可以生成充电桩
          if (that.data.currentLocation && that.data.destinationLocation) {
            that.generateChargerStations();
          }
        },
        fail: function() {
          wx.showToast({
            title: '选择位置失败',
            icon: 'none'
          });
        }
      });
    }
  },

  // 获取位置名称
  getLocationName: function(latitude, longitude, type) {
    // 实际应用中应调用逆地址解析API
    // 这里为了简化，使用模拟数据
    if (type === 'current') {
      this.setData({
        currentLocationName: '当前位置'
      });
    } else {
      this.setData({
        destinationName: '目的地'
      });
    }
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
      iconPath: '/image/location.png',
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
      iconPath: '/image/location.png',
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
      iconPath: '/image/location.png',
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
      iconPath: '/image/location.png',
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
        iconPath: '/image/location.png',
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
        iconPath: '/image/location.png',
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
      url: '/pages/search/search'
    });
  },

  navigateToMark: function() {
    wx.navigateTo({
      url: '/pages/mark/mark'
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
        iconPath: '/image/location.png',
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
        iconPath: '/image/location.png',
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
      iconPath: '/image/location.png',
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
      iconPath: '/image/location.png',
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
})