// const padding 		= 35;
// const xSize 			= 20;
// const ySize 			= 20;

var whiteSpaceX; // whiteSpace is represented in number of columns/rows
var whiteSpaceY;

window.onresize = resize;

function init_size(){
	whiteSpaceX = document.body.clientWidth	/ 35;
	whiteSpaceY = document.body.clientHeight / 35;
		
	resize();
}

function resize(){
	console.log("width " + document.body.clientWidth);
	console.log("height " + document.body.clientHeight);
}
