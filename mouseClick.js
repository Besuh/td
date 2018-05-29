// updates FROM the div on the html and then changes the currentSelectedTower here
function changeTower(n) {
  // this currently will be either 0,1,2
  currentSelectedTower = n;
}

// adding a mousedown to try and add a tower
canvas.addEventListener('mousedown', function() {
  // calls to the towerAllowed, based on the x and y position of the mouse ON canvas
  if(towerAllowed(event.offsetX, event.offsetY)) {
    towers.push(new towerClasses[currentSelectedTower](event.offsetX, event.offsetY));
    money -= towerClasses[currentSelectedTower].prototype.cost;
    document.getElementById('money').innerHTML = money; //update money when adding tower
  }
  // true for capturing phase and false for bubbling phase on listeners
}, false);

// function to capture the mouse position
function getMousePos(evt) {
  // getting the canvas rectangle
  var rect = canvas.getBoundingClientRect();
  mouse = {
    // identifying the location on canvas
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
} 

// adding an listener to the window 
window.addEventListener('mousemove', getMousePos, false); 

//draws the attack range for the towers
function mouseAttackRange() {
  // if the mouse isn't on canvas, this doesn't work so we need this condition
  if(!mouse){
    return;
  } 
  // hold the tower range in a variable called range
  var range = towerClasses[currentSelectedTower].prototype.range;
  context.beginPath();
  // transparency is defined here with globalAlpha
  context.globalAlpha = 0.2;
  // drawing the fire range arc
  context.arc(mouse.x,mouse.y,range, 0, 3*Math.PI);
  // blue for allowable places
  if(towerAllowed(mouse.x,mouse.y)){
    context.fillStyle='blue';
  }
  // red for no no places
  else{
    context.fillStyle = 'red';
  }
  context.fill();
  context.globalAlpha = 1;
}

//see if tower can be built here and starts at the top of the canvas
function towerAllowed(x,y) {
  // to see if money is less than the cost of the current towers cost (currenSelectedTower) is updated on the div
  if (money < towerClasses[currentSelectedTower].prototype.cost){
    return false;
  } 
  // if y is within the '1st' lane max Y or above it then you can't place..if y is less than 60
  if( y < gameUnitRectWidth*3){
    return false;
  }
  // if above the first border plus 2 units, BUT x is beyond the right max border..unfortunately this cuts off the 'right' column for placements
  else if (y < firstYBorder+gameUnitRectWidth*2 && x > rightMaxLimitBorder && x < maxCanvasWidth -  3 * gameUnitRectWidth){
    return false;
  } 
  // anything withint the 2nd lane
  else if (y > firstYBorder - gameUnitRectWidth && y < firstYBorder + gameUnitRectWidth *2 && x > leftStartBorder - gameUnitRectWidth){
    return false;
  } 
  // middle vertical lane, be mindful of how this is configuring to an exact range with dimensions
  else if (y > firstYBorder + gameUnitRectWidth*3 && y < secondYBorder + gameUnitRectWidth && x > leftStartBorder - gameUnitRectWidth && x < leftStartBorder + gameUnitRectWidth*2){
    return false;
  } 
  // second middle, horizontal lane
  else if (y > secondYBorder - gameUnitRectWidth && y < secondYBorder + gameUnitRectWidth * 2 && x > leftStartBorder + gameUnitRectWidth *2){
    return false;
  } 
  // last vertical lane
  else if (y > secondYBorder && y < thirdYBorder + gameUnitRectWidth*2 && x > rightMaxLimitBorder && x < maxCanvasWidth -  3 * gameUnitRectWidth){
    return false;
  } 
  // last horizontal lane
  else if (y > thirdYBorder - gameUnitRectWidth && y < thirdYBorder + gameUnitRectWidth*2){
    return false;
  }
  else {
    // check this tower against ALL currently placed towers
    for (var i = 0, j = towers.length; i < j; i++) {
      //check to see if existing tower is too close to where you want to place
      //simple rectangular check, might want to change to circular check at some point. 
      if(Math.abs(x-towers[i].x) < 2*gameUnitRectWidth && Math.abs(towers[i].y-y) < 2*gameUnitRectWidth){ 
        return false 
      } 
    }
  }
  // if this passes ALL these conditions, then you are allowed to place
  return true;
}
