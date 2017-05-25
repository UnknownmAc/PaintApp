
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
var paint;
var globalAlpha = 1.0;

//Stroke
var strokeWidth = 5;

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
	  var mouseX = e.pageX - this.offsetLeft;
	  var mouseY = e.pageY - this.offsetTop;

	  paint = true;
	  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
	  redraw();
	});

	$('#canvas').mousemove(function(e){
	  if(paint){
	    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
	    redraw();
	  }
		var coordX  = e.offsetX;
    var coordY  = e.offsetY;
		var pointLiesOnPath = false;
		for(var i = 0;i < pathArray.length; i++) {
			var path1 = pathArray[i];
			if (context.isPointInPath(path1, coordX, coordY)) {
	      e.target.style.cursor = 'wait';
				pointLiesOnPath = true;
	    }
		}

		if(!pointLiesOnPath)
			e.target.style.cursor = 'defualt';
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

  context.strokeStyle = "#df4b26";
  context.lineJoin = "round";
  context.lineWidth = strokeWidth;
	pathArray.length = 0;
	var path = null;

  for(var i=0; i < clickX.length; i++) {
    context.beginPath();
    if(clickDrag[i] && i){
			if(path !== null)
				path.moveTo(clickX[i-1], clickY[i-1]);
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
			 if(path !== null) {
				 path.closePath();
				pathArray.push(path);
			 }
			 path = new Path2D();
			 path.moveTo(clickX[i]-1, clickY[i]);
       context.moveTo(clickX[i]-1, clickY[i]);
     }
		 if(path !== null) {
		 	path.lineTo(clickX[i], clickY[i]);
		 }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
		 context.strokeStyle = clickColor[i];
     //context.stroke();
  }
	if(pathArray.length > 1)
		console.log("pathArray.length : " + pathArray.length);
	for(var i = 0; i < pathArray.length; i++) {
		var path = pathArray[i];
		context.stroke(path);
	}
	context.globalAlpha = globalAlpha;
}
