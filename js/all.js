$(function (){
    $(".search").click(function(){
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
        var select1=$('.selectArea').val();
        var select2=[];
            $("[name=Type]:checkbox:checked").each(function(){
              select2.push($(this).val());
              console.log(select2);
            });
        var select3=$("input[name=accessible]:checked").val();
        var first = true;
        //對話框
        var infowindow = new google.maps.InfoWindow();
        var map;
        if(select1 !== "null"){
        	for(i=0;i<data1.length;i++){
	            if (first == true) {//第一次執行迴圈
                    /*以哪個緯經度中心來產生地圖*/
                    var latlng = new google.maps.LatLng(22.729485001, 120.2922123);
                    var myOptions = {
                        zoom: 14,
                        center: latlng,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    /*產生地圖*/
                    map = new google.maps.Map($("#map")[0], myOptions);

                    first = false;
                } //End if (first == true) 
	            var str;
	            var area=data1[i].address;
	            var type=data1[i].name;
	                if(area.match(select1)){
	                	if(type.match(select3)){
	                		for(j=0;j<select2.length;j++){
		                		select=select2[j];
		                		if(type.match(select)){
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
		                			/*str='<tr><td>'+type+'</td><td>'+area+'</td></tr>'; 
		                        	$('.Table').append(str);*/
		                		}
	                		}
	                	}else{
	                		
	                	}
	                }/*else if(area.match(select1)){
	                	for(x=0;x<select2.length;x++){
		                		select=select2[x];
		                		if(type.match(select)){
		                			str='<tr><td>'+type+'</td><td>'+area+'</td></tr>'; 
		                        	$('.Table').append(str);
		                		}/*else{
		                			str='<tr><td colspan="2">'+"此區域查無此類型的廁所"+'</td></tr>';
		                			$('.Table').append(str);
		                		}*/
	                		//}
	                //}*/
	                /*else{
	                	str='<tr><td colspan="2">'+"此區域查無廁所"+'</td></tr>';
		                $('.Table').append(str);
	                }*/
            }
        }/*else if(select1 == "null" && select2 =="null"){
        	for(i=0;i<data1.length;i++){
	            var str;
	            var area=data1[i].address;
	            var type=data1[i].name;
	            str='<tr><td>'+type+'</td><td>'+area+'</td></tr>'; 
	            $('.Table').append(str);
	        }
        } */
        
        });
    });
}); 


	

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
	
