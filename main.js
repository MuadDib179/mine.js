const padding 			= 35;
const xSize 			= 20;
const ySize 			= 15;
const globalMineCount 	= 2;
const regexFilterForX	= "(?<=x:)(.*)(?=y)";
const regexFilterForY	= "(?<=y:)(.*)";

var randomSeed 	= [];
var tiles 		= [];

class Tile {
	constructor(tileId){
		this.adjacentMines 	= 0;
		this.adjacentFlags	= 0;
		this.div			= null;
		this.isMine 		= false;
		this.isFlagged		= false;
		this.isOpen			= false;
	}
}
window.onload = function(){
	init();
}

function createRandomSeed(){
	let limit = xSize*ySize;
	for(let i = 0; i < globalMineCount; i++){
		randomSeed[i] = (Math.floor(Math.random()*limit) + 1);
	}
}
function createTilesArray(){
	//sets the tiles array(s)
	let seedCounter = 0;
	for(let x = 0; x < xSize; x++){
		tiles[x] = [];
		for(let y = 0; y < ySize; y++){
			tiles[x][y] = new Tile("x:" + x.toString() + "y:" + y.toString());

			if(randomSeed.includes(seedCounter))
				tiles[x][y].isMine = true;

			seedCounter++;
		}
	}

	//sets the adjacentMines member field of the tiles
	for(let x = 0; x < xSize; x++){
		for(let y = 0; y < ySize; y++){
			if(tiles[x][y].isMine === true){
				setAdjacentMinesField(x,y);
			}
		}
	}
}
function setAdjacentMinesField(xPos, yPos){
	let adjacentTiles = getAdjacentTiles(xPos,yPos);
	for(let i = 0;;i++){
		if(typeof adjacentTiles[i] == "undefined"){
			break;
		}
		else{
			if(!adjacentTiles[i].isMine){
				adjacentTiles[i].adjacentMines++;
			}
		}
	}
}
function getAdjacentTiles(xPos, yPos){
	let adjacentTiles 	= [],
		counter			= 0
		readX 			= xPos-1,
		readY 			= yPos-1;
	//checks all the adjacentTiles
	for(let x = 0; x < 3; x++){
		readY = yPos-1;
		for(let y = 0; y < 3; y++){
			if(readX >= 0 && readY >= 0 && readX < xSize && readY < ySize ){//does the tile index exist
				adjacentTiles[counter] = tiles[readX][readY];
				counter++;
			}
			readY++;
		}
		readX++;
	}
	return adjacentTiles;
}
function createDiv(x, y) {
	let div = document.createElement("div");
		div.style.position 			= "absolute";
		div.style.left 				= padding*x;
		div.style.top 				= padding*y;
		div.style.width 			= 32;
		div.style.height 			= 32;
		div.style.backgroundColor 	= "#ffabaa";
		div.id 						= "x:" + x.toString() + "y:" + y.toString();
		div.onmousedown				= click;
		div.oncontextmenu 			= function(event){
										event.preventDefault();
									};

	tiles[x][y].div = div;
	return div;
}
function init(){
	createRandomSeed();
	createTilesArray();

	for(let x = 0; x < xSize; x++){
		for(let y = 0; y < ySize; y++){
			document.body.appendChild(createDiv(x,y));
		}
	}

	debugData();//NOTE: remove when done debugging
}

function click(id){
	let	clickedTile = id.path[0],
		xVal		= clickedTile.id.match(regexFilterForX)[0],
		yVal		= clickedTile.id.match(regexFilterForY)[0];
		tile 		= tiles[xVal][yVal];

						  //NOTE: this check should be changed for something more robust
	if(id.button === 0 || !id.cancelable){//checks if the tile is beeing issued an open command
		if(tile.isMine){
			alert("you just clicked a mine");
		}
		else if(tile.isOpen === false){
			tile.isOpen = true;
			clickedTile.style.backgroundColor = "#FFFFFF";
			if(tile.adjacentMines == 0){
				zeroTile(getAdjacentTiles(xVal,yVal));
			}
			else
				clickedTile.innerText = tile.adjacentMines;
		}
	}
	else{

	}
}
function zeroTile(adjacentTiles){
	for(let i = 0;;i++){
		if(typeof adjacentTiles[i] == "undefined")
			break;
		else{
			if(!adjacentTiles[i].isOpen){//checks if the tile still hidden
				adjacentTiles[i].div.style.backgroundColor = "#FFFFFF";
				if(adjacentTiles[i].adjacentMines != 0)
					adjacentTiles[i].div.innerText = adjacentTiles[i].adjacentMines;
				else{
					adjacentTiles[i].div.dispatchEvent(new Event("mousedown"));
				}
			}
		}
	}
}
function debugData(){ //shows tiles
	let tile;
	for(let x = 0; x < xSize; x++){
		for(let y = 0; y < ySize; y++){
			tile = document.getElementById("x:" + x.toString() + "y:"+y.toString());

			if(tiles[x][y].isMine == true) // NOTE: only for prtotyping
				tile.innerText = "M";
			else{
				//uncomment to see tile numbers
				//tile.innerText = tiles[x][y].adjacentMines;
			}
		}
	}
}
