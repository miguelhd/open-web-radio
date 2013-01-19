var stations = [
  {
    mp3: "http://198.154.106.98:8201/stream",
    metadata: "8201"
  },
  {
    mp3: "http://198.154.106.98:8202/stream",
    metadata: "8202"
  },
  {
    mp3: "http://198.154.106.98:8203/stream",
    metadata: "8203"
  },
  {
    mp3: "http://198.154.106.98:8204/stream",
    metadata: "8204"
  }
];


// metadata display
var socket = io.connect('http://confit.aws.af.cm');

socket.on('connect', function (data) {
  socket.emit("join_channel", stations[0].metadata);
  //console.log("connected");
});

socket.on('track_change', function (data) {
  //console.log(data);
  $("#song_metadata h1").text(data.name || "-");
  $("#song_metadata .artist").text(data.artist || "-");
  $("#song_metadata .album").text(data.album || "-");
  $("#song_metadata .year").text(data.year || "-");
});

$(document).ready(function(){    
  // radio player
  var myPlayer = $("#jquery_jplayer_1");   
  var station = 0;   

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
  
  // start at spinTuning's current value
  $("#tuning")
    .css({
      rotate: "0degs"
    })
    .animate({
      rotate: ($("#tuning").data("value") * 3.6) + "degs"
    }, 920);
  $('#dialer').animate({'left': ((0.5/stations.length*dialerWidth)+dialerStart)+'px'}, 920);     

  function spinTuning(event) {
    var self = $('#tuning');
    var value = self.data("value") - 1.6*event.move.y;
    var pc = bound(value);       
    self.data("value", pc);
    var degs = (pc * 3.6) +"deg"; 
    self.css({rotate: degs}); 
    
    // Check for station change
    
    for (i=0; i<stations.length; i++)
    {
      if (pc > i*zoneSize && pc <= (i+1)*zoneSize && i != station) {
        changeStation(i);
      }
    }
    return pc;
  }    

  function changeStation(i) {
    // Change stations  
    //console.log('station = '+i);
    station = i;  
    myPlayer.jPlayer("setMedia", {
      mp3: stations[station].mp3
    });
    socket.emit("join_channel", stations[i].metadata);
           
    // delay before playing or Firefox will stall for 15 seconds
    setTimeout(function() {myPlayer.jPlayer('play');},1200);
  };
  
  var switchedOn = false;
  var volume = 0;    
  
  // start at spinVolumes current value
  $("#volume")
    .css({
      rotate: "0degs"
    })
    .animate({
      rotate: $("#volume").data("value") * (volDegMax - volDegMin) / 100 + volDegMin + "degs"
    }, 820);
  
  function spinVolume(event) {
    var self = $('#volume');  
     
    var value = self.data("value") - 1.0*event.move.y;
    var pc = bound(value);       
    self.data("value", pc);
    var degs = pc * (volDegMax - volDegMin) / 100 + volDegMin + "degs"; 

    self.css({rotate: degs});   
    myPlayer.jPlayer("volume", pc/100);
  }
  
  // pick random static sound and play it
  var play_static = function() {
    var next_static = Math.round(5*Math.random());

    // set volume of static
    var volume = $("#volume").data("value")/3/100;
    document.getElementById('static_' + next_static).volume = volume;

    // play static
    document.getElementById('static_' + next_static).play();
    //console.log("static");
  }
  var throttled_static = _.throttle(play_static, 1640);
  
  var tune_moved = false;
  $('#tuning').grab({
    onstart: function(){     
      // dragging = true;
      tune_moved = false;
    }, onmove: function(event){ 
      tune_moved = true;
      throttled_static();
      var pc = spinTuning(event); 
      $('#dialer').css('left',((pc*dialerWidth/100)+dialerStart)+'px');     
    }, onfinish: function(event){
      if (tune_moved) return;
      station = (station + 1) % stations.length;
      changeStation(station);
      play_static();
      $('#dialer').animate({
        'left': (((station+0.5)/stations.length*dialerWidth)+dialerStart)+'px'
      }, {
        duration: 1900,
        easing: 'easeOutBack'
      });     
    }
  });   
  
  var vol_moved = false;
  var vol_on = true;
  $('#volume').grab({
    onstart: function(event){     
      vol_moved = false;
    }, onmove: function(event){   
      vol_moved = true;
      vol_on = true;
      spinVolume(event);   
    }, onfinish: function() {
      if (vol_moved) return;
      if (vol_on) {
        vol_on = false;
        $("#volume")
          .animate({
            rotate: "0degs"
          }, 1200)
          .data("value", 0);
        volume = 0;
        myPlayer.jPlayer("volume", volume/100);
      } else {
        vol_on = true;
        $("#volume")
          .data("value", 60)
          .animate({
            rotate: $("#volume").data("value") * (volDegMax - volDegMin) / 100 + volDegMin + "degs"
          }, 820);
        volume = 60;
        myPlayer.jPlayer("volume", volume/100);
      }
    }
  }); 

  // autoplay
  myPlayer.jPlayer("setMedia", {
    mp3: stations[0].mp3
  });

  setTimeout(function() {
    myPlayer.jPlayer('play');}
  , 1200);
});
