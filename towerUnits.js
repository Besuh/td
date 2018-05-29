// array to hold tower objects (Sean added the images array and sources)
var towers=[];
var sources = [];
// tower images
var towerImage = new Image();
towerImage.src = "imgs/a1.png";
var towerImage2 = new Image();
towerImage2.src = "imgs/a2.png";
var towerImage3 = new Image();
towerImage3.src = "imgs/a3.png";
var towerImage4 = new Image();
towerImage4.src = "imgs/a4.png";
var towerImageOne = new Image();
var towerImageOne = new Image();
towerImageOne.src = "imgs/catapult.png";
var towerImageTwo = new Image();
towerImageTwo.src = "imgs/balista.png";

// like our linked list node, this is a object constructor for a Tower with x, y 
function Tower(x,y) {
  this.x = x;
  this.y = y;
}

// the javascript prototype property allows you to add new properties to object constructors
//identifies the radius of the tower, for drawing purposes (can delete for img)
Tower.prototype.r = gameUnitRectWidth;
//smaller value will means more bullets per second
// we could have also used a lasttime variable holding Date.now() and a cooldown with a number, FPS seems to run better
Tower.prototype.rateOfFire = FPS; 
// first tower type will have a range of 20 times 5 (20 is the game unit width)
Tower.prototype.range = gameUnitRectWidth*5;
// first tower does dmg based on a 1/6 of the maxLife
Tower.prototype.dmg = Enemy.prototype.maxLife/6;
// unit costing
Tower.prototype.cost = 50;
// sound for this tower arrowSwoosh.mp3
Tower.prototype.sound = new sound('sound/arrowSwoosh.mp3');
// call to tower image
Tower.prototype.image = towerImage;
Tower.prototype.image2 = towerImage2;
Tower.prototype.image3 = towerImage3;
Tower.prototype.image4 = towerImage4;
// call to angle of the tower (atan2)
Tower.prototype.towAngle;
// for condition on render
Tower.prototype.wow = 1;

// scan for a target
Tower.prototype.scanForTarget = function() {
  //if no enemies, then there is no target
  if(enemies.length === 0) {
    this.target = null;
    return;
  }
  //if the target is dead, then don't find vector or fire
  if(this.target && this.target.life <= 0) {
    this.target = null;
  }
  //find first enemy within the towers' range and select that this tower's target
  for (var i = 0, j = enemies.length; i < j; i ++) {
    // like pong tutorial, gameUnitRectWidth included to look at center of rectangle, not top left corner
    // difference in enemies x vs tower x
    var dist = (enemies[i].x-this.x)*(enemies[i].x-this.x+gameUnitRectWidth)+
                (enemies[i].y-this.y)*(enemies[i].y-this.y+gameUnitRectWidth); 
    // if ranged squared is greater than the distance, then you can target
    if (dist < (this.range*this.range)) {
      this.target = enemies[i];
      // since one target is identified you can exit the loop, however, maybe for other towers that shoot multiple?
      return;
    }
  }
}

// aim at a target (if present)
Tower.prototype.findUnitVector = function() {
  // determines whether or not to even calculate a vector (Pytha Theor)
  if (!this.target){
    return false;
  }
  // determine x distance 
  var xDist = this.target.x-this.x;
  // determine y distance..you know have your right triangle
  var yDist = this.target.y-this.y;
  // hypotenuse is square root of xsquared and ysquared, just like on the platform
  this.towAngle = Math.atan2(yDist, xDist);
  var dist = Math.sqrt(xDist*xDist+yDist*yDist);
  // this determines where the turret ends and a bullet begins..we may need to change this based on the shape of our img
  this.xFire = this.x+this.r*xDist/dist; 
  this.yFire = this.y+this.r*yDist/dist;
}

// FIRE!
Tower.prototype.fire = function() {
  // essentially a countdown of fire..so for this Tower it will be a countdown from 30 FPS
  this.rateOfFire--;
  // if your scanForTarget brought back a target and your fire is at 0
  if(this.target && this.rateOfFire <=0) {
    // push a bullet to the Bullet constructor
    bullets.push(new Bullet(this.xFire,this.yFire,this.target,this.dmg));
    this.sound.play();
    //reset this objects rateOfFire to FPS
    this.rateOfFire = FPS;
  }
}

// second version of a Tower
var Tower2 = function(x,y) {
  Tower.call(this,x,y);
}
// creating an object similar to the Tower prototype and inheriting those properties
Tower2.prototype = Object.create(Tower.prototype);
// points to the object constructor above
Tower2.prototype.constructor = Tower2;
// overriding range for this tower, where we double the area, NOT radius or range
Tower2.prototype.range = Tower.prototype.range*1.4;
// overriding the cost
Tower2.prototype.cost = Tower.prototype.cost * 1.5;
// overriding rate of fire which should
Tower2.prototype.rateOfFire = FPS / 2;
// overriding sound for tower 2
Tower2.prototype.sound = new sound('sound/Explosion+1.mp3');
// update image for tower 2 (override)
Tower2.prototype.image = towerImageOne;
// dmg overide
Tower2.prototype.dmg = Tower.prototype.dmg * 1.5;
// tower condition for render
Tower2.prototype.wow = 2;

//short range high damage tower
var Tower3 = function(x,y) {
  Tower.call(this,x,y);
}
// creating an object similar to the Tower prototype and inheriting those properties
Tower3.prototype = Object.create(Tower.prototype);
// points to the object constructor above
Tower3.prototype.constructor = Tower3;
// overriding range for this tower, where we 1/2 the area, NOT radius or range.  0.7 rather than 0.5 because looking at area
Tower3.prototype.range = Tower.prototype.range * 0.7;
// overriding dmg for higher
Tower3.prototype.dmg = Tower.prototype.dmg*2;
// overriding the cost
Tower3.prototype.cost = Tower.prototype.cost * 1.5;
// tower sound for tower 3
Tower3.prototype.sound = new sound('sound/fireball.mp3');
// image update
Tower3.prototype.image = towerImageTwo;
// condition for rendering
Tower3.prototype.wow =2;

// finally, the draw function
Tower.prototype.draw= function() {
  if(this.wow == 2){
    var ctx = context;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.towAngle);
    context.drawImage(this.image, -20,-20);
    ctx.restore();
  }
  else{
    var ctx = context;
    ctx.save();
    ctx.translate(this.x, this.y);
    if(this.towAngle<= (0*Math.PI/180) && this.towAngle >(Math.PI/-2)){
      context.drawImage(this.image2, -20,-20);
      console.log("1");
    }
    else if(this.towAngle<= (Math.PI/-2) && this.towAngle >(-1*Math.PI)){
      context.drawImage(this.image, -20,-20);
      console.log("2");
    }
    else if(this.towAngle>= (0 * Math.PI/180) && this.towAngle <(90 * Math.PI/180)){
      context.drawImage(this.image4, -20,-20);
      console.log("3");
    }
    else if(this.towAngle>= (90 * Math.PI/180) && this.towAngle <(180 * Math.PI/180)){
      context.drawImage(this.image3, -20,-20);
      console.log("4");
    }
    else{
      context.drawImage(this.image3, -20,-20);
    }
    ctx.restore();
  }
}

//class of tower to add when mouse is clicked
var towerClasses = [Tower,Tower2,Tower3];