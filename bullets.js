// array for holding bullets
var bullets = [];

// object constructor for Bullet
function Bullet(x,y,target,dmg) {
  this.x = x,
  this.y = y,
  this.target = target,
  this.dmg = dmg
}

// the javascript prototype property allows you to add new properties to object constructors
// radius based on the 20 unit /4.  So it's size is based on this for drawing
Bullet.prototype.r = gameUnitRectWidth/4;
// approaches it's target at twice the targets speed
Bullet.prototype.speed = gameUnitSpeed*2.5;


// to check the movement of a bullet
Bullet.prototype.checkMovement = function() {
  //find unit vector
  // dividing the gameUnitRectWidth by 2 and subtracting the distance will aim toward the center
  var xDist = this.target.x+gameUnitRectWidth/2-this.x; 
  // dividing the gameUnitRectWidth by 2 and subtracting the distance will aim toward the center
  var yDist = this.target.y+gameUnitRectWidth/2-this.y;
  // the distance that the bullet needs to go, pytha theor
  var dist = Math.sqrt(xDist*xDist+yDist*yDist);
  // starting from the end of the turret
  this.x = this.x+this.speed*xDist/dist;
  this.y = this.y+this.speed*yDist/dist;
}

// to check for a collision on the target
Bullet.prototype.checkCollision = function() {
  // finding the absolute center of the target..so hits somewhere in the hitbox
  if(this.x < this.target.x + gameUnitRectWidth &&
     this.x + this.r > this.target.x &&
     this.y < this.target.y + gameUnitRectWidth &&
     this.y + this.r > this.target.y) {
       //pushing to the list instead of setting life
       this.target.dmg.push(this.dmg);
       return true;
     }
  // if it doesn't hit the hit box then you have to return false
  return false;
}


// draw function called by the mainLoop
Bullet.prototype.draw = function() {
  // beginning the drawing
  context.beginPath();
  // drawing the bullet circle
  context.arc(this.x,this.y,this.r,0,2*Math.PI);
  // it's fill color
  if(stopped <=20){
    context.fillStyle='yellow';
  }
  else if(stopped >20 && stopped <= 50){
    context.fillStyle='orange';
  }
  else if(stopped >50 && stopped <= 100){
    context.fillStyle='red';
  }
  else{
    var clrs = [
      'rgba(22, 90, 201, .5)',
      'rgba(25, 209, 28, .5)',
      'rgba(209, 61, 25, .5)',
      'rgba(160, 25, 209, .5)',
      'rgba(209, 199, 23, .5)'
    ];
    context.fillStyle= clrs[Math.floor(Math.random()*clrs.length)]
  }
  // filling
  context.fill();
}
 

