# Leaflet

## 定义地图
```js
const map = L.map("mapDiv", {
       crs: L.CRS.EPSG3857, //要使用的坐标参考系统，默认的坐标参考系,互联网地图主流坐标系
       // crs: L.CRS.EPSG4326, //WGS 84坐标系，GPS默认坐标系
       zoomControl: true,
       // minZoom: 1,
       attributionControl: true, //attributionControl版权信息
   }).setView([30.6268660000, 104.1528940000], 18);//定位在成都北纬N30°37′45.58″ 东经E104°09′1.44″
  
```

### 加载底图
```js
let Baselayer = L.tileLayer(
    urlTemplate.mapbox_Image, { //第一个参数为图层类型
        maxZoom: 17, //最大视图
        minZoom: 2, //最小视图
        attribution: 'liuvigongzuoshi@foxmail.com  &copy; <a href="https://github.com/liuvigongzuoshi/WebGIS-for-learnning/tree/master/Leaflet_Demo">WebGIS-for-learnning</a>'
    }).addTo(map);
```
## 删除某一个图层
```js
map.removeLayer(Baselayer)
```
## 添加覆盖物
### 添加marker
```js
  const marker =L.marker([30.6268660000, 104.1528940000], {
        highlight: "permanent" //永久高亮显示,需要库支持
    }).addTo(map);
    // 绑定一个提示标签
   marker.bindTooltip('这是个Marker', { direction: 'top' }).openTooltip();//初始化展示

```

### 自定义marker
```js
  //自定义一个maker
    const greenIcon = L.icon({
        iconUrl: 'http://111.75.54.230:8086/upload/5/5c/5c75e76cebd9df08d84803a9.png',
        iconSize: [26,26], // size of the icon
    });
    const oMarker = L.marker([30.6268660000, 104.1628940000], { icon: greenIcon }).addTo(map);
    // 绑定一个提示标签
    oMarker.bindTooltip('这是个自定义Marker', { direction: 'left' });
```
### 添加多边形
```js
   let polygon = L.polygon([[37, -109.05], [41, -109.03], [41, -102.05], [37, -102.04]],
        [40.774, -74.125], {
            color: 'green',
            fillColor: '#f03',
            fillOpacity: 0.5
        }).addTo(map); //地图上绘制一个多边形
```