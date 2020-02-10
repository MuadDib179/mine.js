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
	if(window.matchMedia("(max-width:360px)").matches){
		container.style.width = 86*xSize + "px";
		container.style.height = 86*ySize + "px";
	}
	else if(window.matchMedia("(max-width:411px)").matches){
		container.style.width = 76*xSize + "px";
		container.style.height = 76*ySize + "px";
		console.log("size");
	}
	else{
		container.style.width = 41*xSize + "px";
		container.style.height = 41*ySize + "px";
	}
	setMenuPosition(container.getBoundingClientRect());
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

function setMenuPosition(fieldRect){
	//menu is 350x350
	let menu 				= document.getElementById("menu"),
		sizeDifferentialX 	= fieldRect.width - 350,
		sizeDifferentialY 	= fieldRect.height - 350, 
		left 				= fieldRect.left + sizeDifferentialX/2,
		top 				= fieldRect.top + sizeDifferentialY/2;

		menu.style.left = left;
		menu.style.top 	= (top < 0) ? 5 : top; //stops menu from beeing drawn above the page
}