$(document).ready(function(){    
	
	// jPlayer stuff
	
	var myPlayer = $("#jquery_jplayer_1");   
	var station = 0;   

	var stations = [
		{mp3: "http://198.154.106.98:8202/stream"}
	];

  // radio appearance

  var dialerStart = 227;
  var dialerWidth = 344;
  var volDegMin = 0;
  var volDegMax = 270;

	myPlayer.jPlayer({
		ready: function () {
      $(this).jPlayer("setMedia", {
        mp3: stations[station].mp3
      });
    },   
  	swfPath: "js",
  	supplied: "mp3"
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
					mp3: stations[station].mp3
		    });
		           
				// delay before playing or Firefox will stall for 15 seconds
		
				setTimeout(function() {myPlayer.jPlayer('play');},1500);

			}
		}
		
		return pc;
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
      play_static();
			var pc = spinTuning(event); 
			$('#dialer').css('left',((pc*dialerWidth/100)+dialerStart)+'px');     
		}, onfinish: function(event){
      // do your funky thang here ...
		}
	});   
	
	$('#volume').grab({
		onstart: function(){     
			// dragging = true;
		}, onmove: function(event){   
			spinVolume(event);   
		}
	}); 

  // autoplay
  myPlayer.jPlayer("setMedia", {
    mp3: stations[0].mp3
  });
  setTimeout(function() {myPlayer.jPlayer('play');},1500);

  // static
  var next_static = Math.round(5*Math.random());
  function play_static() {
    // pick random static sound
    next_static = (next_static+1) % 6;
    document.getElementById('static_' + next_static).play();
  }
});
