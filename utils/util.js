const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 计算两点之间的直线距离(米)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000; // 地球半径，米
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

// 根据距离计算行走时间(分钟)，假设步行速度4km/h
const calculateWalkTime = (distanceInMeters) => {
  const walkSpeedMetersPerMinute = 4000 / 60; // 每分钟行走的米数
  return Math.round(distanceInMeters / walkSpeedMetersPerMinute);
}

// 品牌信息定义
const chargingBrands = [
  { name: '小电', color: '#2b85ff', avgPrice: 3.0, icon: '/image/location.png' },
  { name: '怪兽', color: '#00c35b', avgPrice: 3.5, icon: '/image/location.png' },
  { name: '街电', color: '#ff7e12', avgPrice: 4.0, icon: '/image/location.png' },
  { name: '来电', color: '#ff4c4f', avgPrice: 3.8, icon: '/image/location.png' }
];

// 根据时间和位置预测借还比
const predictBorrowReturnRatio = (baseRatio, location, arrivalTime) => {
  // 获取当前小时
  const hour = new Date(arrivalTime).getHours();
  
  // 时间因子：早高峰(7-9)和晚高峰(17-19)借还比变化较大
  let timeFactor = 1.0;
  if (hour >= 7 && hour <= 9) {
    timeFactor = location === 'start' ? 0.7 : 1.3; // 早高峰借点借还比降低，还点升高
  } else if (hour >= 17 && hour <= 19) {
    timeFactor = location === 'start' ? 0.6 : 1.4; // 晚高峰借点借还比更低，还点更高
  } else if (hour >= 22 || hour <= 6) {
    timeFactor = 1.1; // 夜间借还比略高
  }
  
  // 位置因子
  const locationFactor = location === 'start' ? 0.9 : 1.1; // 起点附近借还比通常较低，终点附近较高
  
  // 计算最终借还比并确保在0.1-0.9之间
  let finalRatio = baseRatio * timeFactor * locationFactor;
  finalRatio = Math.max(0.1, Math.min(0.9, finalRatio));
  
  return finalRatio.toFixed(2);
}

// 生成充电桩数据 - 修改后的方法
const generateChargers = (startLocation, endLocation, count = 20) => {
  const chargers = [];
  const brandStations = {};
  
  // 初始化各品牌的借还站点集合
  chargingBrands.forEach(brand => {
    brandStations[brand.name] = {
      borrowStations: [], // 可借站点(起点附近)
      returnStations: []  // 可还站点(终点附近)
    };
  });
  
  // 为每个品牌生成借还站点
  chargingBrands.forEach(brand => {
    // 在起点附近生成借站点
    for (let i = 0; i < count / chargingBrands.length; i++) {
      // 生成借点，但增加合理性检查
      let isValid = false;
      let borrowStation;
      
      // 尝试最多5次，直到生成符合条件的点
      let tries = 0;
      while (!isValid && tries < 5) {
        tries++;
        
        // 原始的随机生成代码
        const radius = 300; 
        const latOffset = (Math.random() * 2 - 1) * radius / 111000;
        const lngOffset = (Math.random() * 2 - 1) * radius / (111000 * Math.cos(startLocation.latitude * Math.PI / 180));
        
        // 生成基础借还比 (0.2-0.6之间，借站点借还比通常较低)
        const baseRatio = (Math.random() * 0.4 + 0.2).toFixed(2);
        
        // 创建临时站点
        borrowStation = {
          id: `borrow-${brand.name}-${Date.now()}-${i}`,
          latitude: startLocation.latitude + latOffset,
          longitude: startLocation.longitude + lngOffset,
          brand: brand.name,
          type: 'borrow',
          color: brand.color,
          price: (parseFloat(brand.avgPrice) + (Math.random() * 0.6 - 0.3)).toFixed(1),
          reputation: (Math.floor(Math.random() * 40) / 10 + 1).toFixed(1),
          borrowReturnRatio: baseRatio,
          iconPath: '/image/location.png',
          width: 30,
          height: 40,
          nearLocation: '起点'
        };
        
        // 计算到起点和终点的距离
        const distToStart = calculateDistance(
          borrowStation.latitude, borrowStation.longitude,
          startLocation.latitude, startLocation.longitude
        );
        
        const distToEnd = calculateDistance(
          borrowStation.latitude, borrowStation.longitude,
          endLocation.latitude, endLocation.longitude
        );
        
        // 只有当借点离起点更近时才有效
        isValid = distToStart < distToEnd * 0.8; // 确保借点离起点明显更近
      }
      
      // 如果生成有效，添加到列表
      if (isValid) {
        brandStations[brand.name].borrowStations.push(borrowStation);
        chargers.push(borrowStation);
      }
    }
    
    // 在终点附近生成还站点
    for (let i = 0; i < count / chargingBrands.length; i++) {
      const radius = 300; // 300米范围内，从原来的800米缩小
      
      // 随机生成偏移量
      const latOffset = (Math.random() * 2 - 1) * radius / 111000;
      const lngOffset = (Math.random() * 2 - 1) * radius / (111000 * Math.cos(endLocation.latitude * Math.PI / 180));
      
      // 生成基础借还比 (0.4-0.8之间，还站点借还比通常较高)
      const baseRatio = (Math.random() * 0.4 + 0.4).toFixed(2);
      
      // 创建还站点
      const returnStation = {
        id: `return-${brand.name}-${Date.now()}-${i}`,
        latitude: endLocation.latitude + latOffset,
        longitude: endLocation.longitude + lngOffset,
        brand: brand.name,
        type: 'return',
        color: brand.color,
        price: (parseFloat(brand.avgPrice) + (Math.random() * 0.6 - 0.3)).toFixed(1),
        reputation: (Math.floor(Math.random() * 40) / 10 + 1).toFixed(1),
        borrowReturnRatio: baseRatio,
        iconPath: '/image/location.png',
        width: 30,
        height: 40,
        nearLocation: '终点'
      };
      
      brandStations[brand.name].returnStations.push(returnStation);
      chargers.push(returnStation);
    }
  });
  
  return {
    allChargers: chargers,
    brandStations: brandStations
  };
}

// 计算最佳借还路径
const calculateOptimalPaths = (brandStations, startLocation, endLocation) => {
  const brandPaths = {};
  
  // 为每个品牌找出最优的借还站点组合
  Object.keys(brandStations).forEach(brandName => {
    const borrowStations = brandStations[brandName].borrowStations;
    const returnStations = brandStations[brandName].returnStations;
    
    let bestBorrowStation = null;
    let bestReturnStation = null;
    let bestTotalDistance = Infinity;
    let bestPathDetails = null;
    
    // 尝试每一种借还站点组合
    borrowStations.forEach(borrowStation => {
      returnStations.forEach(returnStation => {
        // 计算完整路径的三段距离
        const distanceStartToBorrow = calculateDistance(
          startLocation.latitude, startLocation.longitude,
          borrowStation.latitude, borrowStation.longitude
        );
        
        const distanceBorrowToReturn = calculateDistance(
          borrowStation.latitude, borrowStation.longitude,
          returnStation.latitude, returnStation.longitude
        );
        
        const distanceReturnToEnd = calculateDistance(
          returnStation.latitude, returnStation.longitude,
          endLocation.latitude, endLocation.longitude
        );
        
        // 计算总距离
        const totalDistance = distanceStartToBorrow + distanceBorrowToReturn + distanceReturnToEnd;
        
        // 如果找到更短的路径，更新最佳组合
        if (totalDistance < bestTotalDistance) {
          bestTotalDistance = totalDistance;
          bestBorrowStation = borrowStation;
          bestReturnStation = returnStation;
          
          // 计算时间
          const timeToBorrow = calculateWalkTime(distanceStartToBorrow);
          const timeToReturn = calculateWalkTime(distanceBorrowToReturn);
          const timeToEnd = calculateWalkTime(distanceReturnToEnd);
          const totalTime = timeToBorrow + timeToReturn + timeToEnd;
          
          // 计算到达时的借还比
          const arrivalTimeToBorrow = Date.now() + timeToBorrow * 60 * 1000;
          const arrivalTimeToReturn = arrivalTimeToBorrow + timeToReturn * 60 * 1000;
          
          const predictedBorrowRatio = predictBorrowReturnRatio(
            bestBorrowStation.borrowReturnRatio, 
            'start', 
            arrivalTimeToBorrow
          );
          
          const predictedReturnRatio = predictBorrowReturnRatio(
            bestReturnStation.borrowReturnRatio, 
            'end', 
            arrivalTimeToReturn
          );
          
          bestPathDetails = {
            totalDistance: totalDistance,
            totalTime: totalTime,
            segments: {
              startToBorrow: {
                distance: distanceStartToBorrow,
                time: timeToBorrow
              },
              borrowToReturn: {
                distance: distanceBorrowToReturn,
                time: timeToReturn
              },
              returnToEnd: {
                distance: distanceReturnToEnd,
                time: timeToEnd
              }
            },
            borrowStation: {
              ...bestBorrowStation,
              predictedBorrowRatio: predictedBorrowRatio
            },
            returnStation: {
              ...bestReturnStation,
              predictedReturnRatio: predictedReturnRatio
            },
            brand: {
              name: brandName,
              color: bestBorrowStation.color,
              price: bestBorrowStation.price,
              reputation: (parseFloat(bestBorrowStation.reputation) + parseFloat(bestReturnStation.reputation)) / 2
            }
          };
        }
      });
    });
    
    brandPaths[brandName] = bestPathDetails;
  });
  
  return brandPaths;
}

// 计算品牌综合评分
const calculateBrandScores = (brandPaths, sortMethod) => {
  const scores = [];
  
  Object.keys(brandPaths).forEach(brandName => {
    const path = brandPaths[brandName];
    if (!path) return;
    
    // 不同排序方式的原始评分计算
    let rawScore = 0;
    
    switch(sortMethod) {
      case 'shortestDistanceToBorrow':
        rawScore = -path.segments.startToBorrow.distance;
        break;
      case 'shortestDistanceToReturn':
        rawScore = -path.segments.returnToEnd.distance;
        break;
      case 'shortestTotalTime':
        rawScore = -path.totalTime;
        break;
      case 'bestBorrowReturnRatio':
        // 借点借还比越低越好(10-借还比*10)，还点借还比越高越好
        rawScore = (10 - parseFloat(path.borrowStation.predictedBorrowRatio) * 10) + 
                  (parseFloat(path.returnStation.predictedReturnRatio) * 10);
        break;
      case 'bestReputation':
        rawScore = parseFloat(path.brand.reputation);
        break;
      case 'lowestPrice':
        rawScore = -parseFloat(path.brand.price);
        break;
      default:
        // 默认综合评分
        rawScore = -path.totalTime * 0.5 +  // 时间因素
                  (10 - parseFloat(path.borrowStation.predictedBorrowRatio) * 10) * 0.3 +  // 借点借还比
                  (parseFloat(path.returnStation.predictedReturnRatio) * 10) * 0.2;  // 还点借还比
    }
    
    // 生成便于显示的正数评分（仅用于显示，不影响排序）
    let displayScore;
    switch(sortMethod) {
      case 'shortestDistanceToBorrow':
        displayScore = Math.max(0, 100 - (path.segments.startToBorrow.distance / 1000) * 20);
        break;
      case 'shortestDistanceToReturn':
        displayScore = Math.max(0, 100 - (path.segments.returnToEnd.distance / 1000) * 20);
        break;
      case 'shortestTotalTime':
        displayScore = Math.max(0, 100 - (path.totalTime / 60) * 10);
        break;
      case 'bestBorrowReturnRatio':
        displayScore = rawScore; // 这个本身就是正数
        break;
      case 'bestReputation':
        displayScore = parseFloat(path.brand.reputation) * 20;
        break;
      case 'lowestPrice':
        displayScore = Math.max(0, 100 - (parseFloat(path.brand.price) * 20));
        break;
      default:
        // 确保默认评分是正数
        displayScore = Math.max(0, 50 + rawScore);
    }
    
    scores.push({
      brand: brandName,
      path: path,
      score: rawScore, // 用于排序的原始评分
      formattedScore: displayScore.toFixed(2) // 用于显示的美化评分
    });
  });
  
  // 按原始评分排序
  return scores.sort((a, b) => b.score - a.score);
}

// 随机更新借还比 - 仅用于演示
const updateBorrowReturnRatios = (chargers) => {
  return chargers.map(charger => {
    // 随机小幅度调整借还比，范围±0.05，但保持在0.1-0.9之间
    let newRatio = parseFloat(charger.borrowReturnRatio) + (Math.random() * 0.1 - 0.05);
    newRatio = Math.max(0.1, Math.min(0.9, newRatio));
    
    return {
      ...charger,
      borrowReturnRatio: newRatio.toFixed(2)
    };
  });
}

module.exports = {
  formatTime,
  calculateDistance,
  calculateWalkTime,
  generateChargers,
  calculateOptimalPaths,
  calculateBrandScores,
  updateBorrowReturnRatios,
  predictBorrowReturnRatio
}
