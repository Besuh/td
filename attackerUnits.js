// array to hold enemies.  Similar to entity array taught by Tony
var enemies = [];
// value will increase based on transitive relationship in stoppedEnemies()
var enemyHPIncrease = 0; 
// sprit sheet height and width
var sheetWidth = 160;
var sheetHeight =120;
// definiton of cols and rows
var cols = 4;
var rows = 3;
// width and height dependent on sprite sheet and cols/rows
var width = sheetWidth/cols;
var height = sheetHeight/rows;
// character model for base enemy
var character1 = new Image();
character1.src = "imgs/character.png";
// character model for 2nd type of  enemy
var character2 = new Image();
character2.src = "imgs/characterRed.png";
// character model for 3rd type of enemy
var character3 = new Image();
character3.src = "imgs/characterBlue.png";
// star image
var star = new Image();
star.src = "imgs/star.png";
// sound when an enemy dies
var cashMoney = new sound("sound/cash.mp3");


// enemy constructor..notice how maxLife takes also enemyHPIncrease
function Enemy(x,y) {
  this.x = x;
  this.y = y;
  this.life = this.maxLife + enemyHPIncrease;
  this.dmg = []; //put all damage taken from bullets
}

// the javascript prototype property allows you to add new properties to object constructors
//common to all Emeny objects with maxLife...this also determines dmg dealt by a tower
Enemy.prototype.maxLife = 40;
// speed of an enemy is the set gameUnitSpeed on mainLoop;
Enemy.prototype.speed = gameUnitSpeed;
// counter to determine sprite rendering
Enemy.prototype.ctr = 9;
// direction of sprit movement
Enemy.prototype.direction = 0;
Enemy.prototype.currentFrame = 0;
Enemy.prototype.srcX = 0;
Enemy.prototype.srcY=0;
Enemy.prototype.character = character1;

// updates counter everytime render is successful
function updateCtr(z){
  z.ctr++;
}
// updates currentFrame and determines which col
function updateFrame(z){
  // console.log(this.ctr);
  if(z.ctr > 8){
    z.currentFrame = ++z.currentFrame % cols;
    z.srcX = z.currentFrame * width;
    z.srcY = z.direction *height;
    z.ctr = 0;
    // context.clearRect(this.x,this.y, width, height);
  }
}

// in each render loop on main, draw function is called to draw the object
Enemy.prototype.draw = function() {
  context.beginPath();
  // draws an enemy unit based on which is selected
  context.drawImage(this.character, this.srcX, this.srcY, width, height,this.x, this.y-9, width, height);
  //life bar
  context.fillStyle='rgba(210, 105, 30, .5)';
  context.fillRect(this.x,this.y+gameUnitRectWidth/3,gameUnitRectWidth*this.life/(this.maxLife+enemyHPIncrease),gameUnitRectWidth/3);
  // helper functions are called
  updateCtr(this);
  updateFrame(this);
}

//created move function
Enemy.prototype.checkMovement = function() {
  // this.speed is currently set to (4*20) / 30 or (4 * gameUnitgameUnitRectWidth) / FPS
  var move = this.speed;
  // if the x position of current enemy is less than the right max border and also y position is less than 1st border at 150 pixels
  if(this.x < rightMaxLimitBorder && this.y < firstYBorder){
    // x is then moved right by this.speed amount of pixels
    this.x += move; 
    this.direction = 0;
  } 
  // if the x position is right at the right border or greater and also y position is less than firstYBorder at 150 pixels
  else if (this.x >= rightMaxLimitBorder && this.y < firstYBorder){
    // y is then moved down by this.speed amount of pixels held in the variable move
    this.y += move;
    this.direction = 2;
  } 
  // if the x position is greater than the left start border (100) and y is less than or equal secondYBorder at 300 pixels
  else if (this.x >= leftStartBorder && this.y <= secondYBorder){
    // x moves left by decrementing
    this.x -= move; 
    this.direction = 1;
  } 
  // if the x position is less than leftStartBorder (100) and y is still less than or equal to secondYborder at 300 pixels
  else if (this.x <= leftStartBorder && this.y <= secondYBorder){
    // y moves down by increasing
    this.y += move;
    this.direction = 2;
  } 
  // if the x position is less than the right max border and y is less than the thirdYBorder at 450 pixels
  else if (this.x <= rightMaxLimitBorder && this.y < thirdYBorder){
    // x moves right by incrementing
    this.x += move;
    this.direction = 0
  } 
  // if the x position is greater or equal to the max border, and y is less than or equal to thirdYborder at 450 pixels
  else if (this.x >= rightMaxLimitBorder  && this.y <= thirdYBorder){
    // y moves down by incrementing
    this.y += move;
    this.direction = 2;
  } 
  // ALL remaining will move left
  else  {
    this.x -= move;
    this.direction = 1;
    //returns true if the position of x is less than 0.  Attackers score will go up one
    if(this.x < 0){
      return true; 
  }
  // if the unit didn't make it through the pathing, it will return false
  return false;
  }
}

//takes arr .dmg and sums the damage taken then subtracts from life
Enemy.prototype.damage = function() {
  if(this.dmg.length > 0){
    var sum = 0;
    for(var i =0;i<this.dmg.length;i++){
      sum += this.dmg[i];
    }
    this.life -= sum;
    this.dmg = [];
  }
}

// an iterator that checks for killed enemies and buffs subsequent enemies with added HP
function stoppedEnemies() {
  // iterates through enemies
  for (var i = 0, j = enemies.length; i < j; i++ ) {
    // if an enemy in an array has 0 HP
    if (enemies[i].life <=0) {
      // star graphic
      this.character = star;
      // enemyHPIncrease will go up based on a function as number of enemies stopped goes up, life goes up. Transitive relationship based on enemies
      enemyHPIncrease = Math.floor(stopped/10) * (1 + Math.floor(stopped/100));
      // HTML - the number of stopped enemies is innerHTML'd
      document.getElementById('stopped').innerHTML = ++stopped;
      // since a unit is killed, money is incremented
      money += moneyIncrement;
      // cash money sound
      cashMoney.play();
      // HTML - money is then innerHTML'd
      document.getElementById('money').innerHTML = money;
      // enemy is then removed from the array, new array is returned
      enemies.splice(i,1);
      // i is then iterated back down to not skip
      i--;
      // j is lessened due to the splice
      j--; 
    }
  }
}

// function to add enemies
var addEnemy = function() {
  // variable to hold an enemy type
   var enemy;
   // giving variation to the game, if stopped is greater than 20
   if(stopped > 20) {
     // a picking variable that takes a random number multiplied by 3 length..so 0,1,2 are selectable in our enemyTypes array
     var pick = Math.floor(Math.random()*enemyTypes.length); 
     //select random enemy type based on the pick.  enemyTypes[pick] will give you one of the enemy objects with it's attributes
     enemy = new enemyTypes[pick](0,gameUnitRectWidth);
   } else {
     // if under 20, then stick to the regular base enemy
     enemy = new Enemy(0,gameUnitRectWidth);
   }
   // after selection, push to the array
  enemies.push(enemy);
}

// object constructor of a faster enemy
var FastEnemy = function(x,y) {
  Enemy.call(this,x,y);
}
// creating the 'class' by inheriting from the Enemy prototype
FastEnemy.prototype = Object.create(Enemy.prototype);
// setting the object constructor
FastEnemy.prototype.constructor = FastEnemy;
// faster speed
FastEnemy.prototype.speed = Enemy.prototype.speed*1.4;
FastEnemy.prototype.character = character2;

// object constructor of a tougher enemy
var StrongEnemy = function(x,y) {
  Enemy.call(this,x,y);
}
// creating the 'class' by inheriting from the Enemy prototype
StrongEnemy.prototype = Object.create(Enemy.prototype);
// setting the object constructor
StrongEnemy.prototype.constructor = StrongEnemy;
// more life
StrongEnemy.prototype.maxLife = Enemy.prototype.maxLife*2;
StrongEnemy.prototype.character = character3;

//list of enemy types
var enemyTypes = [Enemy,FastEnemy,StrongEnemy];

