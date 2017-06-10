
var canvas;
var context;
var canvasWidth = 1000;
var canvasHeight = 600;

//Colors...
var colorPurple = "#cb3594";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBrown = "#986928";

var curColor = colorPurple;
var clickColor = new Array();

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var pathArray = new Array();
var colorArray = new Array();
var sizeArray = new Array();
var opacityArray = new Array();
var paint;
var globalAlpha = 1.0;
var copiedPathIndex = -1;

//Stroke
var strokeWidth = 5;

if (document.addEventListener) { // IE >= 9; other browsers
        document.addEventListener('contextmenu', function(e) {
            paint = false;
            //alert("You've tried to open context menu"); //here you draw your own menu
						e.preventDefault();
						document.getElementById("rmenu").className = "";
						document.getElementById("rmenu").style.position = "absolute";
						$('#rmenu').css('top' , e.pageY);
						$('#rmenu').css('left' , e.pageX);
            pathIndexPointLiesOnPath(e);
        }, false);
}

function pathIndexPointLiesOnPath(e) {
  var coordX  = e.pageX;
  var coordY  = e.pageY;
  var pointLiesOnPath = false;
  for(var i = 0;i < pathArray.length; i++) {
    var path1 = pathArray[i];
    if (context.isPointInStroke(path1, coordX, coordY)) {
      copiedPathIndex = i;
      pointLiesOnPath = true;
      return;
    }
  }

}

function handleCopyStrokeStyle() {
  curColor = document.getElementById("color").value = colorArray[copiedPathIndex];
	strokeWidth = document.getElementById("size").value = sizeArray[copiedPathIndex];
	globalAlpha = document.getElementById("opacity").value = opacityArray[copiedPathIndex];
  document.getElementById("rmenu").className = "hide";
}

function handleContextMenuExit() {
	document.getElementById("rmenu").className = "hide";
}

/**
* Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
*/
function prepareCanvas()
{
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	context = canvas.getContext("2d"); // Grab the 2d canvas context

	$('#canvas').mousedown(function(e){
    if(e.button === 2)
      return;
	  var mouseX = e.pageX - this.offsetLeft;
	  var mouseY = e.pageY - this.offsetTop;

	  paint = true;
	  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		sizeArray.push(strokeWidth);
		colorArray.push(curColor);
		opacityArray.push(globalAlpha);
		redraw();
	});

	$('#canvas').mousemove(function(e){
	  if(paint){
	    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
	    redraw();
	  }
	});

	$('#canvas').mouseup(function(e){
	  paint = false;
	});

	$('#canvas').mouseleave(function(e){
	  paint = false;
	});

}

function handleColorClick(color) {
	curColor = color;
}

function handleSizeSliderChange(size) {
	strokeWidth = size;
}

function handleOpacitySliderChange(opacity) {
	globalAlpha = opacity;
}

/**
* Clears the canvas.
*/
function clearCanvas()
{
	context.clearRect(0, 0, canvasWidth, canvasHeight);
}

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
	clickColor.push(curColor);
}

function redraw(){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

	context.lineJoin = "round";
  pathArray.length = 0;
	var path = null;

  for(var i=0; i < clickX.length; i++) {
    if(clickDrag[i] && i){
			if(path !== null)
				path.moveTo(clickX[i-1], clickY[i-1]);
			else {
				path = new Path2D();
				path.moveTo(clickX[i-1], clickY[i-1]);
			}
     }else{
			 if(path !== null) {
				 path.closePath();
				 pathArray.push(path);
				 path = null;
			 }
			 path = new Path2D();
			 path.moveTo(clickX[i]-1, clickY[i]);
     }
		 if(path !== null) {
		 	path.lineTo(clickX[i], clickY[i]);
		 }
  }

	if(path !== null)
		pathArray.push(path);

	for(var i = 0; i < pathArray.length; i++) {
		var path = pathArray[i];
		context.strokeStyle = colorArray[i];
		context.lineWidth = sizeArray[i];
		context.globalAlpha = opacityArray[i];
		context.stroke(path);
	}
}
