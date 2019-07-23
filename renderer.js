var whiteSpaceX; // whiteSpace is represented in number of columns/rows
var whiteSpaceY;
var minHorizontalSize;

window.onresize = resize;

function init_size(){
	whiteSpaceX = document.body.clientWidth	/ 35 - xSize;
	whiteSpaceY = document.body.clientHeight / 35 - ySize;

	minHorizontalSize = Math.floor(whiteSpaceX + xSize * 35)// finds the minimal pixal widht of the screen
	console.log(tiles);

}
function resize(){
	if(document.body.clientWidth < minHorizontalSize){
		
		let scalePercentage = 1 - (document.body.clientWidth/minHorizontalSize);
		let xScale, yScale;
		
		for(let x = 0; x < xSize; x++){
			for(let y = 0; y < ySize; y++){
				xScale = Math.ceil(35 * (1 + scalePercentage));
				yScale = Math.ceil(35 * (1 + scalePercentage));
				tiles[x][y].div.style.width = xScale;
				tiles[x][y].div.style.height = yScale;
				
				//excludes edge tiles
				if(tiles[x][y].xPos != 0)
					tiles[x][y].div.style.left = (tiles[x][y].xPos * padding) + (xScale - 35);
				if(tiles[x][y].yPos != 0)
					tiles[x][y].div.style.left = (tiles[x][y].yPos * padding) + (yScale - 35);
			}
		}
		// console.log(1+scalePercentage);
	}
}
function drawField(){
	let container = document.getElementById("container");
	for(let x = 0; x < xSize; x++){
		for(let y = 0; y < ySize; y++){
			container.appendChild(createTile(x,y));
		}
	}
	
	container.style.width = padding*xSize - 12 + "px";
	container.style.height = padding*ySize - 12 + "px";
}
function createTile(x, y) {
	let div = document.createElement("div");
		div.className				= "tile";
		div.style.width				= 32;
		div.style.height			= 32;
		div.style.left 				= padding*x;
		div.style.top 				= padding*y;
		div.id 						= "x:" + x.toString() + "y:" + y.toString();
		div.onmousedown				= click;
		div.oncontextmenu 			= rightClick;

	tiles[x][y].div = div;
	return div;
}