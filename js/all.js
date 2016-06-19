$(document).ready(init);
function init(){
	//地址轉經緯度
	function codeAddress(add){
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( { address: add}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			Lng=results[0].geometry.location.lng();
			Lat=results[0].geometry.location.lat();
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
	}
	//初始位置(列出楠梓區所有的點)
	function start(){
	var data1;
    $.when(
        $.ajax({
        	type:'GET',
        	url:'http://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AH&CaseNo2=5&FileType=2&Lang=C&FolderType=U',
        	async: false,
        	dataType: 'json', 
        	success:function(data){
        		data1=data; 
      		}
        })
        ).then(function(){
	        var first = true;
	        //對話框
	        var infowindow = new google.maps.InfoWindow();
	        var map;
	        var select1=$('.selectArea').val();
	        if(select1 == "null"){
				//以哪個緯經度中心來產生地圖
	            var latlng = new google.maps.LatLng(22.729485001, 120.2922123);
	            var myOptions = {
	                zoom: 14,
	                center: latlng,
	                mapTypeId: google.maps.MapTypeId.ROADMAP
	                //ROADMAP 顯示 Google 地圖的正常、預設 2D 地圖方塊
	            };
	            //產生地圖
	            map = new google.maps.Map($("#map")[0], myOptions);
	        	for(i=0;i<data1.length;i++){
		            var str;
		            var area=data1[i].address;
		            var type=data1[i].name;
		                if(area.match("楠梓區")){
									//建立緯經度座標
	                    			var myLatlng = new google.maps.LatLng(data1[i].緯度Lat, data1[i].經度Lng);
	                    			//加一個Marker到map中
	                    			var image='img/toilet3.png';
	                    			var marker = new google.maps.Marker({
	                        			position: myLatlng,
	                        			map: map,
	                        			icon:image,
	                        			html:"<ul><li>名稱 : "+type+"</li><li>地址 : "+area+"</li></ul>"
	                    			});
				                    //點擊對話框事件    
				                   	google.maps.event.addListener(marker, 'click', function(){ 
				                  		infowindow.setContent(this.html);
				                  		infowindow.open(map,this);
				                   	});
								
		                }//End if(area.match("楠梓區"))
	            }//End for(i=0;i<data1.length;i++)
	        }//End if(select1 !== "null")
	    });//End .then(function()
    }
    start();
	//查詢事件
    $(".search").click(function(){
        //$('.Table tbody').empty();清空上次搜尋結果
        var select1=$('#selectArea').val();
        var select2=[];
            $("[name=Type]:checkbox:checked").each(function(){
                select2.push($(this).val());
                console.log(select2.length);
            });
        var select3=$("input[name=accessible]:checked").val();
        //若沒選擇區域會彈出提醒視窗
        if(select1 == "null"){
            alert("請選擇區域");
            $('#selectArea').focus();
            return false;
        }
        var data1;
        $.when(
          	$.ajax({
            type:'GET',
            url:'http://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AH&CaseNo2=5&FileType=2&Lang=C&FolderType=U',
            async: false,
            dataType: 'json', 
            success:function(data){
              data1=data; 
      		  }
          	})
        ).then(function(){
            var arr1 = new Array();//arr1:全部條件皆符合的結果
            var arr2 = new Array();//arr2:符合部分條件的的結果 
            var arr3 = new Array();//arr3:符合單一條件的的結果  
            if( select3 != "No" ){ //查詢須包含殘障廁所
                //for(i=0;i<data1.length;i++){ 
            	for(i=0;i<5393;i++){  //第5393筆(鳳山區公有第一市場男廁)資料後又開始重複
    	            var str;
                    var area=data1[i].address;
    	            var type=data1[i].name;
                    if( area.match(select1) && type.match(select3)){ //該資料符合"障"的公廁名字
                        for(j=0;j<select2.length;j++){
                            select=select2[j];
                            if(type.match(select)){
                                arr1.push(data1[i]);
                            }
                        }
                    }else if(area.match(select1)){ //該資料未符合"障"的公廁名字
                        for(x=0;x<select2.length;x++){
                            select=select2[x];
                            if(type.match(select)){ //該資料符合區域及類型
                                arr2.push(data1[i]);
                            }else{
                                arr3.push(data1[i]);
                            }
                        }
                    }     
                }
                if( arr1.length > 0 ){
                    printResult(arr1);
                }else if( arr2.length > 0 ){
                    alert('在'+$("#selectArea").find(":selected").text()+'查不到此類型公廁的無障礙公廁');
                    printResult(arr2);
                }else if( arr3.length > 0){
                    alert('在'+$("#selectArea").find(":selected").text()+'查不到無障礙廁所');
                    printResult(arr3);
                }
            }else{ //查詢不用包含殘障廁所
                for(i=0;i<5393;i++){  //第5393筆(鳳山區公有第一市場男廁)資料後又開始重複
                    var area=data1[i].address;
                    var type=data1[i].name;
                    if( area.match(select1)){ //該資料符合區域及類型
                        for(j=0;j<select2.length;j++){
                            select=select2[j];
                            if(type.match(select)){
                                arr1.push(data1[i]);
                            }else{
                                arr2.push(data1[i]);
                            }
                        }
                    }
                }
                if( arr1.length > 0 ){
                    printResult(arr1);
                }else if( arr2.length > 0 ){
                    alert('在'+$("#selectArea").find(":selected").text()+'查不到此類型的公廁');
                    printResult(arr2);
                }else {
                    alert('在'+$("#selectArea").find(":selected").text()+'查不到公廁');
                }
            }
        });
    });//End $(".search").click(function()
} //End $(function init()
//印出結果的函式
function printResult(arr){
    for( var i = 0; i < arr.length; i++){
        //建立緯經度座標
        var myLatlng = new google.maps.LatLng(arr[i].緯度Lat, arr[i].經度Lng);
        //加一個Marker到map中
        var image='img/toilet3.png';
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            icon:image,
            html:"<ul><li>名稱 : "+arr[i].name+"</li><li>地址 : "+arr[i].address+"</li></ul>"
        });
		//點擊對話框事件    
        google.maps.event.addListener(marker, 'click', function(){ 
            infowindow.setContent(this.html);
            infowindow.open(map,this);
        });
    }
}
//重設
function clear1(){
  start();//回到初始位置
}


	

//google map
//地址轉經緯度
/*function codeAddress(){
	var add = "高雄市楠梓區";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { address: add}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
		$('.address').append("<ul><li>"+results[0].geometry.location.lng()+"</li><li>"+results[0].geometry.location.lat()+"</li></ul>");
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}
codeAddress();*/ 
/*$(document).ready(init);

    //網頁上所有的DOM都載入後
    function init() {
        addMarker();
    }

    //加入標記點
    function addMarker() {
        $.ajax({
            url: 'http://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AH&CaseNo2=5&FileType=2&Lang=C&FolderType=U',
            type: 'GET',
            async: false,
            data: {},
            dataType: 'json',
            success: function (data) {
                var first = true;
                //對話框
                var infowindow = new google.maps.InfoWindow();
                var map;
                for (var index in data) {
					if (first == true) {//第一次執行迴圈
                        /*以哪個緯經度中心來產生地圖*//*
                        var latlng = new google.maps.LatLng(22.729485001, 120.2922123);
                        var myOptions = {
                            zoom: 14,
                            center: latlng,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };
                        /*產生地圖*//*
                        map = new google.maps.Map($("#map")[0], myOptions);

                        first = false;
                    } //End if (first == true) 

					//建立緯經度座標
                    var myLatlng = new google.maps.LatLng(data[index].緯度Lat, data[index].經度Lng);
                    //加一個Marker到map中
                    var image='img/toilet3.png';
                    var marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        icon:image,
                        html:"<ul><li>名稱 : "+data[index].name+"</li><li>地址 : "+data[index].address+"</li></ul>"
                    });

                    //點擊對話框事件    
                   	google.maps.event.addListener(marker, 'click', function(){ 
                  		infowindow.setContent(this.html);
                  		infowindow.open(map,this);
                   	});
                } //End for (var index in data) 
            }     //End success: function (data) 
        });       //End jQuery Ajax
    }             //End function addMarker() 
*/
	
