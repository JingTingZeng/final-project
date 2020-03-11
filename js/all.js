//網頁動畫
//顯示 & 隱藏註解
function show_remark(x){
    var id = 'remark_' + x;
    document.getElementById(id).style.display = 'block';
};
function hide_remark(x){
    var id = 'remark_' + x;			    
    document.getElementById(id).style.display = 'none';
};

//拿資料
var toiletData;
var getData = $.ajax({
    type:'GET',
    url:'https://opendata.epa.gov.tw/api/v1/OTH00307?%24skip=0&%24top=1000&%24format=json',
    dataType: 'json', 
    success:function(data){
        toiletData = data.filter(function(item){
            if(item.Country === "高雄市"){
                return item;
            } 
        });
        console.log(toiletData);
    }
})

//map 初始化設定
var myMapOptions = {
    zoom: 15,
    center: [22.729485001, 120.2922123],
    mapUrl: "https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamluZ3RpbmciLCJhIjoiY2s2ZGN5b2Z2MDEwMjNlcDgzejV0bDlicSJ9.4Of7k2GAZSujGrM9y380Ow"
};
var map;
var markersLayer = new L.LayerGroup();
//初始位置(列出楠梓區所有的點)
function start(){
    $.when(getData).done(function () {
        var first = true;
        for( var i = 0 ; i < toiletData.length ; i++ ){
            var city = toiletData[i].City;
            var name = toiletData[i].Name;
            var address = toiletData[i].Address;
            if( city == "楠梓區" ){
                if(first){
                    var latlng = [parseFloat(toiletData[i].Latitude), parseFloat(toiletData[i].Longitude)];
                    map = L.map("map").setView(latlng, myMapOptions.zoom);
                    L.tileLayer(myMapOptions.mapUrl).addTo(map);
                    first = false;
                }
                var myLatlng = [parseFloat(toiletData[i].Latitude), parseFloat(toiletData[i].Longitude)];
                //建立緯經度座標
                var marker = L.marker(myLatlng,
                    {
                        icon: L.icon({iconUrl: "img/toilet3.png"})
                    }
                )
                var popupContent = "<ul><li>名稱 : "+ name + "</li><li>地址 : " + address + "</li></ul>";
                marker.bindPopup(popupContent).openPopup();
                markersLayer.addLayer(marker); 
            }
        }
        markersLayer.addTo(map);
    });
};

//map+搜尋
$(document).ready(init);

function init(){
    start();

    //查詢事件
    $("#searchBtn").click(function(){
        var selectArea = $('.selectArea').val();
        var selectType = [];
        $("[name=Type]:checkbox:checked").each(function(){
            selectType.push($(this).val());
        });
        var accessible = $("input[name=accessible]:checked").val();
        //若沒選擇區域會彈出提醒視窗
        if(selectArea == "null"){
            alert("請選擇區域");
            $('.selectArea').focus();
            return;
        }
        $.when(toiletData).done(function () {
            var arr1 = new Array();//arr1:全部條件皆符合的結果
            var arr2 = new Array();//arr2:符合部分條件的的結果 
            var arr3 = new Array();//arr3:符合單一條件的的結果
            if( accessible != "No" ){ //查詢須包含殘障廁所
                for( var i = 0 ; i < toiletData.length ; i++ ){
                    var city= toiletData[i].City;
                    var type = toiletData[i].Type;
                    var accessibleType = toiletData[i].Type2;
                    if( city == selectArea && accessibleType.match(accessible)){ //該資料符合"障"的公廁名字
                        if( selectType.length === 0 ){
                            arr1.push(toiletData[i]);
                        }else{
                            for( var j = 0 ; j < selectType.length ; j++ ){
                                if( type.match( selectType[j] ) ){
                                    arr1.push(toiletData[i]);
                                }
                            }
                        }
                    }else if( city == selectArea ){ //該資料未符合"障"的公廁名字
                        if( selectType.length === 0 ){
                            arr2.push(toiletData[i]);
                        }else{
                            for( var x = 0 ; x < selectType.length ; x++ ){
                                if( type.match( selectType[x] ) ){ //該資料符合區域及類型
                                    arr2.push(toiletData[i]);
                                }else{
                                    arr3.push(toiletData[i]);
                                }
                            }
                        }
                    }     
                }
                if( arr1.length > 0 ){
                    printResult(arr1);
                }else if( arr2.length > 0 ){
                    alert('在'+$(".selectArea").find(":selected").text()+'查不到此類型公廁的無障礙公廁');
                    printResult(arr2);
                }else if( arr3.length > 0){
                    alert('在'+$(".selectArea").find(":selected").text()+'查不到無障礙廁所');
                    printResult(arr3);
                }
            }else{ //查詢不用包含殘障廁所
                for( var i = 0 ; i < toiletData.length ; i++ ){
                    var city= toiletData[i].City;
                    var type = toiletData[i].Type;
                    if( city == selectArea){ //該資料符合區域及類型
                        if( selectType.length === 0 ){
                            arr1.push(toiletData[i]);
                        }else{
                            for( var z = 0 ; z < selectType.length ; z++ ){
                                if( type.match( selectType[z] ) ){
                                    arr1.push(toiletData[i]);
                                }else{
                                    arr2.push(toiletData[i]);
                                }
                            }
                        }
                    }
                }
                if( arr1.length > 0 ){
                    printResult(arr1);
                }else if( arr2.length > 0 ){
                    alert('在'+$(".selectArea").find(":selected").text()+'查不到此類型的公廁');
                    printResult(arr2);
                }else {
                    alert('在'+$(".selectArea").find(":selected").text()+'查不到公廁');
                }
            }
        });
    });//End $(".search").click(function()
} //End $(function init()

//將地址轉經緯再印出結果圖標的函式
function printResult(arr){
    markersLayer.clearLayers();
    var first = true;
    for( var i in arr ){
        if(first){
            map.setView(new L.LatLng(parseFloat(arr[i].Latitude), parseFloat(arr[i].Longitude)), 14);
            first = false;
        }
        var myLatlng = [parseFloat(arr[i].Latitude), parseFloat(arr[i].Longitude)];
        var name = arr[i].Name;
        var address = arr[i].Address;
        var marker = L.marker(myLatlng,
            {
                icon: L.icon({iconUrl: "img/toilet3.png"})
            }
        )
        var popupContent = "<ul><li>名稱 : "+ name + "</li><li>地址 : " + address + "</li></ul>";
        marker.bindPopup(popupContent).openPopup();
        markersLayer.addLayer(marker); 
    }
    markersLayer.addTo(map);
}

//重設
$("#clear1").click(function(){
    start();//回到初始位置
});