# 充电宝推荐小程序开发文档

## 一、项目概述

该项目是一个微信小程序，用于为用户推荐最优的充电宝借还方案，通过分析起点到借充点、还充点到终点的距离以及其他因素，为用户提供最佳选择。

## 二、已完成功能模块

### 1. 地图模块

**功能描述**：显示地图，标记起点、终点、借充点和还充点位置，提供用户交互。

**关键函数**：
- `mapBindtap`：地图点击处理，设置起点或终点
- `markertap`/`callouttap`：标记点点击处理
- `updateLocationMarkers`：更新地图上的位置标记
- `showBrandPathOnMap`：在地图上显示某品牌的借还路径

### 2. 位置管理模块

**功能描述**：获取和管理用户位置信息，设置起点和终点。

**关键函数**：
- `getCurrentLocation`：获取当前位置（真实或模拟）
- `startSearch`：开始搜索目的地（真实或模拟）
- `getLocationName`：获取位置名称

### 3. 充电宝站点生成模块

**功能描述**：根据起点和终点生成充电宝借还站点，计算最佳路径。

**关键函数**：
- `generateChargerStations`：生成站点并计算最佳路径
- `util.generateChargers`：生成充电桩数据
- `util.calculateOptimalPaths`：计算最佳借还路径
- `util.calculateBrandScores`：根据不同排序方法计算品牌评分

### 4. 排序推荐模块

**功能描述**：按照不同条件对充电宝品牌进行排序，提供推荐。

**关键函数**：
- `onSortMethodChange`：更改排序方式
- `calculateBrandScores`：计算品牌评分并排序

### 5. 品牌详情展示模块

**功能描述**：展示品牌详细信息，包括距离、时间、价格等。

**关键函数**：
- `selectBrand`：选择品牌
- `showBrandPathOnMap`：在地图上显示品牌路径
- `showBeautifiedBrandDetails`：显示美化的品牌详情
- `closeBrandDetail`：关闭详情窗口

### 6. 导航功能模块

**功能描述**：提供到借充点的导航功能。

**关键函数**：
- `navigateToBorrowStation`：导航到借充站点（需要接入高德地图API，暂时没有实现）

### 7. 工具函数模块

**功能描述**：提供各种计算和辅助功能。

**关键函数**：
- `calculateDistance`：计算两点之间的直线距离
- `calculateWalkTime`：根据距离计算行走时间
- `predictBorrowReturnRatio`：预测借还比
- `updateBorrowReturnRatios`：更新借还比

## 三、数据流和排序实现进度

### 数据流程

小程序已实现完整的数据流：
1. 用户设置起点和终点
2. 生成充电宝借还站点数据
3. 计算最佳借还路径
4. 根据排序方法对品牌进行评分和排序
5. 显示排序结果和推荐品牌
6. 用户可选择查看详情或导航到借充点

### 排序功能实现情况

已实现的排序方法：

| 排序方法 | 实现状态 | 描述 |
|---------|---------|------|
| `shortestDistanceToBorrow` | ✅ 已完成 | 按照起点到借充点的距离排序，越近越优先 |
| `shortestDistanceToReturn` | ✅ 已完成 | 按照还充点到终点的距离排序，越近越优先 |
| `shortestTotalTime` | ✅ 已完成 | 按照总时间（包括步行和充电时间）排序，越短越优先 |
| `bestBorrowReturnRatio` | ✅ 已完成 | 按照借还比（借点借还比越低越好，还点借还比越高越好）排序 |
| `bestReputation` | ✅ 已完成 | 按照品牌口碑评分排序，评分越高越优先 |
| `lowestPrice` | ✅ 已完成 | 按照价格排序，越低越优先 |

### 排序算法实现

排序算法在`util.calculateBrandScores`函数中实现，根据不同的排序方法计算品牌评分：

```js
switch(sortMethod) {
  case 'shortestDistanceToBorrow':
    score = -path.segments.startToBorrow.distance;
    break;
  case 'shortestDistanceToReturn':
    score = -path.segments.returnToEnd.distance;
    break;
  case 'shortestTotalTime':
    score = -path.totalTime;
    break;
  case 'bestBorrowReturnRatio':
    score = (10 - parseFloat(path.borrowStation.predictedBorrowRatio) * 10) + 
            (parseFloat(path.returnStation.predictedReturnRatio) * 10);
    break;
  case 'bestReputation':
    score = parseFloat(path.brand.reputation);
    break;
  case 'lowestPrice':
    score = -parseFloat(path.brand.price);
    break;
  default:
    // 默认综合评分
    score = -path.totalTime * 0.5 +  // 时间因素
            (10 - parseFloat(path.borrowStation.predictedBorrowRatio) * 10) * 0.3 +  // 借点借还比
            (parseFloat(path.returnStation.predictedReturnRatio) * 10) * 0.2;  // 还点借还比
}
```

## 四、UI实现情况

已实现的UI组件：
1. 地图显示区域
2. 起点和终点标记显示
3. 排序方式选择栏
4. 品牌列表展示
5. 品牌详情弹窗
6. 导航按钮
