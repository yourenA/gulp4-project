# Openlayers

## 初始化
以下行创建一个OpenLayers Map对象。就其本身而言，这没有任何作用，因为没有附加的层或交互。
```js
var map = new ol.Map({ ... });
```

```js
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([110, 23]),//经纬度
            zoom: 4
        })
    });
```
* target : 渲染DIV
* layers : 地图图层,```new ol.layer.Tile``加载瓦片,每个图层有对应的数据源（Source）
* view : 选入按地图