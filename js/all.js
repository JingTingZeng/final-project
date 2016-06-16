//google map
var map;
		function initMap() {
		  map = new google.maps.Map(document.getElementById('map'), {
		    center: {lat: 22.7175372, lng: 120.30318710000006},
		    zoom: 12
		  });
		}
function codeAddress(){
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
codeAddress();
$(function (){
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
	                	for(i=0;i<select2.length;i++){
	                		if(type.match(select2[i])){
	                			if(type.match(select3)){
	                			str='<tr><td>'+type+'</td><td>'+area+'</td></tr>'; 
	                        	$('.Table').append(str);
	                			}
	                		}
	                	}
	                	/*else{
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


	
