/*********************************************
This servo module demo turns the servo around
1/10 of its full rotation  every 500ms, then
resets it after 10 turns, reading out position
to the console at each movement.
*********************************************/

var tessel = require('tessel');
var servolib = require('servo-pca9685');
var router = require('tiny-router');

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
    servo.configure(servo1, 0.07/, 0.001, function () {
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