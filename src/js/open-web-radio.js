$(document).ready(function(){    
	
	// jPlayer stuff
	
	var myPlayer = $("#jquery_jplayer_1");   
	var station = 0;   

	var stations = [
		{mp3: "http://mp3-vr-128.as34763.net:80/;stream/1",
		oga: "http://ogg2.as34763.net/vr160.ogg"}, 
		{mp3: "http://mp3-vc-128.as34763.net:80/;stream/1",
		oga: "http://ogg2.as34763.net/vc160.ogg"},
		{mp3: "http://mp3-a8-128.as34763.net:80/;stream/1",
		oga: "http://ogg2.as34763.net/a8160.ogg"},
		{mp3: "http://mp3-a9-128.as34763.net:80/;stream/1",
		oga: "http://ogg2.as34763.net/a9160.ogg"},
		{mp3: "http://mp3-a0-128.as34763.net:80/;stream/1",
		oga: "http://ogg2.as34763.net/a0160.ogg"}                      
	];

  // radio appearance

  var dialerStart = 227;
  var dialerWidth = 344;
  var volDegMin = 0;
  var volDegMax = 270;

	myPlayer.jPlayer({
		ready: function () {
      		$(this).jPlayer("setMedia", {
				mp3: stations[station].mp3, oga: stations[station].oga
      		});
    	},   
		solution: "html, flash",
    	swfPath: "js",
    	supplied: "mp3, oga"
        //errorAlerts: "true",
		//warningAlerts: "true"
  	}); 
   
	var zoneSize = 100/stations.length;  
   
  function bound(val) {
    if (val > 100) return 100;
    if (val < 0) return 0;
    return val;
  };

	function spinTuning(event) {
		var self = $('#tuning');
    var value = self.data("value") - 0.3*event.move.y;
		var pc = bound(value);       
    self.data("value", pc);
		var degs = pc * 3.6+"deg"; 
		self.css({rotate: degs}); 
		
		// Check for station change
		
		for (i=0; i<stations.length; i++)
		{
			if (pc > i*zoneSize && pc <= (i+1)*zoneSize && i != station) {
			   	// Change stations  
			   	//console.log('station = '+i);
				station = i;  
				myPlayer.jPlayer("setMedia", {
					mp3: stations[station].mp3, oga: stations[station].oga
		      	});
		           
				// delay before playing or Firefox will stall for 15 seconds
		
				setTimeout(function() {myPlayer.jPlayer('play');},1500);

			}
		}
		
		return pc;
	}    
	
	function startChannel(){
		
	}
	      
	var switchedOn = false;
	var volume = 0;    
  
  // start at spinVolumes current value
  $("#volume").css({
    rotate: $("#volume").data("value") * (volDegMax - volDegMin) / 100 + volDegMin + "degs"
  });
	
	function spinVolume(event) {
		var self = $('#volume');  
	   
    var value = self.data("value") - 0.3*event.move.y;
		var pc = bound(value);       
    self.data("value", pc);
		var degs = pc * (volDegMax - volDegMin) / 100 + volDegMin + "degs"; 

    self.css({rotate: degs});   
		myPlayer.jPlayer("volume", pc/100);
	}
	
	
	$('#tuning').grab({
		onstart: function(){     
			// dragging = true;
		}, onmove: function(event){ 
			var pc = spinTuning(event); 
			$('#dialer').css('left',((pc*dialerWidth/100)+dialerStart)+'px');     
		}, onfinish: function(event){
           // do your funky thang here ...
		}
	});   
	
	$('#volume').grab({
		onstart: function(){     
			//dragging = true;
		}, onmove: function(event){   
			spinVolume(event);   
		}
	}); 
	
	 
});
