$(document).ready(init);
function init(){
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
	        //對話框
	        var infowindow = new google.maps.InfoWindow();
	        var map;
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
	    });//End .then(function()
    }
    start();
	//查詢事件
    $(".search").click(function(){
        var select1=$('.selectArea').val();
        var select2=[];
            $("[name=Type]:checkbox:checked").each(function(){
                select2.push($(this).val());
                //console.log(select2.length);
            });
        var select3=$("input[name=accessible]:checked").val();
        //若沒選擇區域會彈出提醒視窗
        if(select1 == "null"){
            alert("請選擇區域");
            $('.selectArea').focus();
            return false;
        }
        var data2;
        $.when(
          	$.ajax({
            type:'GET',
            url:'http://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AH&CaseNo2=5&FileType=2&Lang=C&FolderType=U',
            async: false,
            dataType: 'json', 
            success:function(data){
              data2=data; 
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
                    var area=data2[i].address;
    	            var type=data2[i].name;
                    if( area.match(select1) && type.match(select3)){ //該資料符合"障"的公廁名字
                        for(j=0;j<select2.length;j++){
                            select=select2[j];
                            if(type.match(select)){
                                arr1.push(data2[i]);
                            }
                        }
                    }else if(area.match(select1)){ //該資料未符合"障"的公廁名字
                        for(x=0;x<select2.length;x++){
                            select=select2[x];
                            if(type.match(select)){ //該資料符合區域及類型
                                arr2.push(data2[i]);
                            }else{
                                arr3.push(data2[i]);
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
                for(i=0;i<5393;i++){  //第5393筆(鳳山區公有第一市場男廁)資料後又開始重複
                    var area=data2[i].address;
                    var type=data2[i].name;
                    if( area.match(select1)){ //該資料符合區域及類型
                        for(j=0;j<select2.length;j++){
                            select=select2[j];
                            if(type.match(select)){
                                arr1.push(data2[i]);
                            }else{
                                arr2.push(data2[i]);
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
		/*var add1=arr[0].address;
		var name1=arr[0].name;
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( { address: add1}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				convertLatLng1=results[0].geometry.location;
    			var infowindow = new google.maps.InfoWindow();
	    		//產生地圖
	    		var map;
	    		var myOptions = {
	        		zoom: 14,
	        		center: convertLatLng1,
	        		mapTypeId: google.maps.MapTypeId.ROADMAP
	    		};
	    		map = new google.maps.Map($("#map")[0], myOptions); 
				//加一個Marker到map中
       			var image='img/toilet3.png';
        		var marker = new google.maps.Marker({
	            	position: convertLatLng1,
	            	map: map,
	            	icon:image,
	            	html:"<ul><li>名稱 : "+name1+"</li><li>地址 : "+add1+"</li></ul>"
        		});
				//點擊對話框事件    
		        google.maps.event.addListener(marker, 'click', function(){ 
		            infowindow.setContent(this.html);
		            infowindow.open(map,this);
		        });

			} else {
					//alert("Geocode was not successful for the following reason: " + status);
			}
		});*/
	//以陣列第一個地址的經緯度為中心來產生地圖

	/*var map;
	var myOption = {
	    /*zoom: 14,
	    center: convertLatLng1,
	    mapTypeId: google.maps.MapTypeId.ROADMAP*/
	//};
	//產生地圖
	//map = new google.maps.Map($("#map")[0], myOption);
	var first=true;
	var map;
	var infowindow = new google.maps.InfoWindow();
	for( var i = 0; i < arr.length; i++){
		var add=arr[i].address;
		var name=arr[i].name;
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( { address: add}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				convertLatLng=results[0].geometry.location;
				if(first==true){
					var myOptions = {
	        		zoom: 14,
	        		center: convertLatLng,
	        		mapTypeId: google.maps.MapTypeId.ROADMAP
	    		};
	    		map = new google.maps.Map($("#map")[0], myOptions);
	    		first=false;
				}
    			
	    		
	    		
	    		 
				//加一個Marker到map中
       			var image='img/toilet3.png';
        		var marker = new google.maps.Marker({
	            	position: convertLatLng,
	            	map: map,
	            	icon:image,
	            	html:"<ul><li>名稱 : "+name+"</li><li>地址 : "+add+"</li></ul>"
        		});
				//點擊對話框事件    
		        google.maps.event.addListener(marker, 'click', function(){ 
		            infowindow.setContent(this.html);
		            infowindow.open(map,this);
		        });

			} else {
					//alert("Geocode was not successful for the following reason: " + status);
			}
		});
	}
}

//重設
$("#clear1").click(function(){
  start();//回到初始位置
});