//google map
function initialize() {
	var mapOptions = {
	   	zoom: 5,//縮放層級
	    center: new google.maps.LatLng(120.22, 22.44)//經緯度
	    mapTypeId:google.maps.MapTypeId.ROADMAP
	};

	var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);
//延後載入地圖
/*function loadScript() {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
	      '&signed_in=true&callback=initialize';
	document.body.appendChild(script);
}
window.onload = loadScript;*/

$(function (){
	/*$.ajax({
            type:'GET',
            url:'http://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AH&CaseNo2=5&FileType=2&Lang=C&FolderType=U',
            //dataType: 'json', 
            success:function(data){
            	var thisdata = JSON.parse(data);
              	for(i=0;i<data.length;i++){
		            var str;
		            str='<tr><td>'+thisdata[i].name+'</td><td>'+thisdata[i].address+'</td></tr>'; 
		            $('.Table').append(str);
	        	}
      		}
    })*/
    $(".search").click(function(){
        var data1;
        $.when(
          	$.ajax({
            type:'GET',
            url:'http://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AH&CaseNo2=5&FileType=2&Lang=C&FolderType=U',
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
        
        if(select1 !== "null"){
        	for(i=0;i<data1.length;i++){
	            var str;
	            var area=data1[i].address;
	            var type=data1[i].name;
	                if(area.match(select1)){
	                	if(type.match(select2)){
	                		if(type.match(select3)){
	                			str='<tr><td>'+type+'</td><td>'+area+'</td></tr>'; 
	                        	$('.Table').append(str);
	                		}
	                	}/*else{
	                		str='<tr><td>'+type+'</td><td>'+area+'</td></tr>'; 
	                       	$('.Table').append(str);
	                	}*/
	                }/*else{
	                	str='<tr><td>'+type+'</td><td>'+area+'</td></tr>'; 
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


	
