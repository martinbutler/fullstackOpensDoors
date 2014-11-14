/* the wifi-cc3000 library is bundled in with Tessel's firmware,
 * so there's no need for an npm install. It's similar
 * to how require('tessel') works.
 */ 
var wifi = require('wifi-cc3000');
var network = 'FullstackFast' // put in your network name here
var pass = 'Fullst@ck'; // put in your password here, or leave blank for unsecured
var security = 'wpa2'; // other options are 'wep', 'wpa', or 'unsecured'

  var tessel = require('tessel');
  var servolib = require('servo-pca9685');
  var router = require('tiny-router');

// connect to the wifi network
// check if the wifi chip is busy (currently trying to connect), if not, try to connect
function tryConnect(){
  if (!wifi.isBusy()) {
    connect();
  } else {
    // The cc3k is set up to automatically try to connect on boot. 
    // For the first few seconds of program bootup, you'll always 
    // see the wifi chip as being "busy"
    console.log("is busy, trying again");
    setTimeout(function(){
      tryConnect();
    }, 1000);
  } 
}

function connect(){
  wifi.connect({
    security: security
    , ssid: network
    , password: pass
    , timeout: 30 // in seconds
  });
}

wifi.on('connect', function(err, data){
  // you're connected
  console.log("connect emitted", err, data);
  // Any copyright is dedicated to the Public Domain.
  // http://creativecommons.org/publicdomain/zero/1.0/

  /*********************************************
  This servo module demo turns the servo around
  1/10 of its full rotation  every 500ms, then
  resets it after 10 turns, reading out position
  to the console at each movement.
  *********************************************/

  // var tessel = require('tessel');
  // var servolib = require('servo-pca9685');
  // var router = require('tiny-router');

  var servo = servolib.use(tessel.port['A']);
  router.listen(3000);
  var servo1 = 1; // We have a servo plugged in at position 1

  router.get('/', function(req, res) {
    console.log(req);
    
      var position = 0.001;  //  Target position of the servo between 0 (min) and 1 (max).

      //  Set the minimum and maximum duty cycle for servo 1.
      //  If the servo doesn't move to its full extent or stalls out
      //  and gets hot, try tuning these values (0.05 and 0.12).
      //  Moving them towards each other = less movement range
      //  Moving them apart = more range, more likely to stall and burn out
      servo.configure(servo1, 0.001, 0.09, function () {
        // setInterval(function () {
          console.log('Position (in range 0-1):', position);
          //  Set servo #1 to position pos.
          servo.move(servo1, 0.001);
          console.log("first move 001");
          // Increment by 10% (~18 deg for a normal servo)
              
          setTimeout(function(){
            servo.move(servo1, .997);
            console.log("first move 997");
          }, 5000);
                         
    });
    res.send({anything: true});
  });
});

wifi.on('disconnect', function(err, data){
  // wifi dropped, probably want to call connect() again
  console.log("disconnect emitted", err, data);
})

wifi.on('timeout', function(err){
  // tried to connect but couldn't, retry
  console.log("timeout emitted"); 
  connect();
});

wifi.on('error', function(err){
  // one of the following happened
  // 1. tried to disconnect while not connected
  // 2. tried to disconnect while in the middle of trying to connect
  // 3. tried to initialize a connection without first waiting for a timeout or a disconnect
  console.log("error emitted", err);
});