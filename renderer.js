var whiteSpaceX; // whiteSpace is represented in number of columns/rows
var whiteSpaceY;
var minHorizontalSize;

window.onresize = sizeField;

function init_size(){
	whiteSpaceX = document.body.clientWidth	/ 35 - xSize;
	whiteSpaceY = document.body.clientHeight / 35 - ySize;

	minHorizontalSize = Math.floor(whiteSpaceX + xSize * 35)// finds the minimal pixal widht of the screen	
}

function drawField(){
	let container = document.getElementById("container");
	for(let y = 0; y < ySize; y++){
		for(let x = 0; x < xSize; x++){
			container.appendChild(createTile(x,y));
		}
	}
	
	sizeField();
}

function sizeField(){
	let container = document.getElementById("container");
	if(window.matchMedia("(max-width:1000px)").matches){
		container.style.width = 81*xSize + "px";
		container.style.height = 81*ySize + "px";
	}
	else{
		container.style.width = 41*xSize + "px";
		container.style.height = 41*ySize + "px";
	}
}

function createTile(x, y) {
	let div = document.createElement("div");
		div.className				= "tile";
		div.id 						= "x:" + x.toString() + "y:" + y.toString();
		div.onmousedown				= click;
		div.oncontextmenu 			= rightClick;

	tiles[x][y].div = div;
	return div;
}