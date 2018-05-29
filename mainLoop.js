var canvas = document.getElementById('canvas');
// getContext('2d') to get necessary items for drawing and function on canvas
var context = canvas.getContext('2d');
// our game unit size in pixels
var gameUnitRectWidth = 20;
// may want to add a maxHeight variable if not a square (or shape desired)
var maxCanvasWidth = canvas.width;
// moving to 60 will change the timing of enemies and shooting, rebalance with 1/2 
var FPS = 30;
// gameUnitSpeed balanced off of size and frames; rebalance for 60..every second they move 60 pixels over 30 frames
var gameUnitSpeed = 4*gameUnitRectWidth/FPS;
// mouse x and y for drawing range or placing imgs
var mouse;
// variable to build the current tower (mostly a check)
var currentSelectedTower = 0; 
// borders for attacker's path | ------ |
var leftStartBorder = maxCanvasWidth/6;
var rightMaxLimitBorder = maxCanvasWidth*5/6;
// vertical borders for attacker's pathing 
var firstYBorder = maxCanvasWidth/4;
var secondYBorder = maxCanvasWidth/2;
var thirdYBorder = maxCanvasWidth*3/4;
// points/statistics
var attackerPoints = 0;
var stopped = 0;
// counter for when to add enemy units
var spawnTimer = 80; 
// starting money amount
var money = 300;
// everytime a unit dies, add this amount
var moneyIncrement = 5;
// mp3 for boo if player does poorly
var boo;
// mp3 for clap if player does decent
var clap;
// mp3 for cheer if player does well
var cheer;

// sound function for collision.  sound constructor
function sound(src) {
  // creates a sound element
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  // methods for the sound object
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }    
}

// using context to render our canvas, enemies, towers, bullets
mainLoopRender = function() {
  context.beginPath();
  // in order to show background pathing you need a clearRect
  context.clearRect(0,0,canvas.width,canvas.height);
  // calling two variables (i and j) for loop iteration of enemies
  for(var i =0, j = enemies.length; i < j; i ++ ) {
    enemies[i].draw();
  }
  // calling two variables (i and j) for loop iteration of towers
  for(var i = 0, j = towers.length; i < j; i++ ) {
    towers[i].draw();
  }
  // calling two variables (i and j) for loop iteration of bullets
  for(var i = 0, j = bullets.length; i < j; i++) {
    bullets[i].draw();
  }
  // should show the tower attack ability range
  mouseAttackRange();
  // instead of setInterval(function(), we can now use requestAnimationFrame which is browser optimized, animations in inactive tabs chill, battery friendly
  requestAnimationFrame(mainLoopRender);
};

//game logic (separate from draw stuff)
mainLoopLogic = function() {
  // a call to stoppedEnemies to check killed units, money, and increasing enemy health
  stoppedEnemies();
  // spawn time is decremented from 120, allows 
  spawnTimer--;
  // we then need to determine, based on the players strategy, if more enemies need to come out faster
  if(spawnTimer<1) {
    addEnemy()
    // condition where if player stops 35 units, then the spawn timer is drastically decreased
    if(stopped > 35){
      spawnTimer = 20;
    }
    else{
      spawnTimer = 30;
    }
  }
  // in our main Logic Loop, check enemy conditions
  for(var i =0, j = enemies.length; i < j; i ++ ) {
    //true if the move function within our object attackerUnits returns true (in this case, enemy x position is less than zero..off the canvas)
    if(enemies[i].checkMovement()){
      // add to the attackerPoints
      attackerPoints++;
      //add point on HTML
      document.getElementById('attackersScore').innerHTML = attackerPoints; 
      // remove enemy from the array by splicing that position with 1 removed
      enemies.splice(i,1);
      // not to skip the next array value
      i--;
      // lessen the length of the array
      j--;
    }
  }
  // in our main Logic Loop, check tower conditions
  for(var i = 0, j = towers.length; i < j; i++ ) {
    // scans for a target by calling a function in the tower class
    towers[i].scanForTarget();
    // aimed based on function
    towers[i].findUnitVector();
    //initiate an attack
    towers[i].fire();
  }
  // in our main Logic Loop, check bullet conditions (move bullets, hit markers?, remove bullets if collision?)
  for(var i = 0, j = bullets.length; i < j; i++) {
    bullets[i].checkMovement();
    if(bullets[i].checkCollision()) {
      bullets[i].target.damage(); //run the damage function when bullets detect hit
      bullets.splice(i,1);
      j--;
      i--;
    }
  }
  // delay the mainLoopLogic for 
  setTimeout(mainLoopLogic, 1000/FPS);
  // if  player fails to prevent 15 or less from ending
  if(attackerPoints > 15){
    setTimeout(mainLoopLogic=false);
    // if player is successful in stopping a certain amount, a sound like occur
    if(stopped <=20){
      boo = new sound("sound/boo.mp3");
      boo.play();
    }
    else if(stopped >20 && stopped <= 50){
      clap = new sound("sound/clap.mp3");
      clap.play();
    }
    else{
      cheer = new sound("sound/cheer.mp3");
      cheer.play();
    }
    window.alert("Sorry! You have let too many attackers through! YOU LOSE!!!!")
  }
}

// window loading, crucial for canvas and browser games
window.onload = function() {
  setTimeout(mainLoopLogic, 1000/FPS);
  // recursively calling itself
  // if wanting to stop, requestAnimationFrame returns an ID you can use to cancel it, just like setTimeout or setInterval
  requestAnimationFrame(mainLoopRender);
};

