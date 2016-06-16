//google map
/*var map;
	function initMap() {
		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 22.7175372, lng: 120.30318710000006},
			zoom: 12
		});
	}
	var image='img/toilet.png';
	var myLatLng= new google.maps.LatLng(22.7241687, 120.2766451);
	var beachMarker=new google.maps.Marker({
		position:myLatLng,
		map:map,
		icon:image
	});
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
codeAddress();*/ 
$(document).ready(init);

        //網頁上所有的DOM都載入後
        function init() {
            addMarker();
        }
        //加入標記點
        function addMarker() {
            $.ajax(
            {
                url: 'http://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AH&CaseNo2=5&FileType=2&Lang=C&FolderType=U',
                type: 'GET',
                async: false,
                data: {},
                dataType: 'json',
                success: function (data) {
                    var first = true;
                    var infowindow = new google.maps.InfoWindow();
                    var map;
                    for (var index in data) {

                        if (first == true) {//第一次執行迴圈
                            /*以哪個緯經度中心來產生地圖*/
                            var latlng = new google.maps.LatLng(data[index].緯度Lat, data[index].經度Lng);
                            var myOptions = {
                                zoom: 14,
                                center: latlng,
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                            };
                            /*產生地圖*/
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
                            //title: data[index].name,
                            html:"<ul><li>名稱 : "+data[index].name+"</li><li>地址 : "+data[index].address+"</li></ul>"
                        });
                        google.maps.event.addListener(marker, 'click', function() { 
                  			infowindow.setContent(this.html);
                  			infowindow.open(map,this);
                   		});
                    } //End for (var index in data) 
                }     //End success: function (data) 
            });       //End jQuery Ajax
        }             //End function addMarker() 

	
