const padding 			= 35;
const xSize 			= 28;
const ySize 			= 25;
const globalMineCount 	= 20;
const regexFilterForX	= "(?<=x:)(.*)(?=y)";
const regexFilterForY	= "(?<=y:)(.*)";

var rightClickedTile 	= [2]
var randomSeed 			= [];
var tiles 				= [];

class Tile {
	constructor(x,y){
		this.xPos = x;
		this.yPos = y;
		this.adjacentMines 	= 0;
		this.div			= null;
		this.isMine 		= false;
		this.isFlagged		= false;
		this.isOpen			= false;
		this.isEdgePiece 	= false;

		if(this.xPos === 0 || this.yPos === 0 || this.xPos === xSize - 1 || this.yPos === ySize - 1)
			this.isEdgePiece = true;
		}
}

class Position {
	constructor(xPos, yPos){
		this.xPos = xPos;
		this.yPos = yPos;
	}

	compare(position2){
		if(this.xPos === position2.xPos && this.yPos === position2.yPos)
			return true;
		else
			return false;
	}
}

//This is linked list variant used in an old zeroTile version. This can probably be removed! 
class Queue {
	constructor(){
		this.tail = null;
		this.root = null;
	}

	add(data){
		if(this.root === null)
			this.root = new Node(data, null);
		else if(this.tail === null){
			this.tail = new Node(data, null);
			this.root.next = this.tail;
		}
		else{
			this.tail.next = new Node(data, null);
			this.tail = this.tail.next;
		}
	}

	get(){
		if(this.root !== null){
			let tempNode = this.root;
			this.root = this.root.next;

			if(this.root === this.tail)
				this.tail = null;

			return tempNode;
		}
		else
			return null;
	}
}
class Node{
	constructor(data, next){
		this.next = next;
		this.data = data;
	}
}

window.onload = function(){
	init();
	init_size();//DEFINED IN: renderer.js
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
			tiles[x][y] = new Tile(x, y);

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
		div.className				= "tile";
		div.style.left 				= padding*x;
		div.style.top 				= padding*y;
		div.id 						= "x:" + x.toString() + "y:" + y.toString();
		div.onmousedown				= click;
		div.oncontextmenu 			= rightClick;

	tiles[x][y].div = div;
	return div;
}
function init(){
	createRandomSeed();
	createTilesArray();

	let container = document.getElementById("container");
	for(let x = 0; x < xSize; x++){
		for(let y = 0; y < ySize; y++){
			container.appendChild(createDiv(x,y));
		}
	}
	
	container.style.width = padding*xSize - 12 + "px";
	container.style.height = padding*ySize - 12 + "px";

	//debugData();//NOTE: remove when done debugging
}
function click(id){
	let	clickedTile = id.path[0],
		xVal		= clickedTile.id.match(regexFilterForX)[0],
		yVal		= clickedTile.id.match(regexFilterForY)[0];
		
	if(id.button === 0 ){//checks if the tile is beeing issued an open command or a flag command
		openTile(xVal,yVal);
	}
	else{
		flagTile(xVal,yVal);
	}
}
//primes mine for auto-open
function rightClick(id){	
	let	clickedTile = id.path[0],
		xVal		= clickedTile.id.match(regexFilterForX)[0],
		yVal		= clickedTile.id.match(regexFilterForY)[0];
	
	if(xVal == rightClickedTile[0] && yVal == rightClickedTile[1]){
		rightClickedTile[0] = -1;
		rightClickedTile[1] = -1;	
	}
	else{
		rightClickedTile[0] = parseInt(xVal);
		rightClickedTile[1] = parseInt(yVal);	
	}
}

function openTile(xPos, yPos){
	let tile = tiles[xPos][yPos];
	
	if(tile.isMine){
		failState(xPos,yPos);
	}
	else if(tile.xPos == rightClickedTile[0] && tile.yPos == rightClickedTile[1]){
		let adjacent 			= getAdjacentTiles(xPos,yPos),
			adjacentFlagsCount	= 0,
			tilesToOpen			= [];

		for(let i = 0;;i++){
			if(typeof adjacent[i] == "undefined"){
				break;
			}
			else{
				if(!(adjacent[i] === tile)){
					if(adjacent[i].isFlagged === true)
						adjacentFlagsCount++;
					else if(!adjacent[i].isMine)
						tilesToOpen[tilesToOpen.length] = adjacent[i];
				}
			}
		}
		//checks if criteria for opening is met
		if(adjacentFlagsCount === tile.adjacentMines){
			for(let i = 0; i < tilesToOpen.length; i++){
				if(!tilesToOpen[i].isOpen)
					openTile(tilesToOpen[i].xPos, tilesToOpen[i].yPos);
			}
		}
	}
	else if(tile.isOpen === false){
		tile.isOpen = true;
		tile.div.classList.add("opened");
		if(tile.adjacentMines == 0){
			zeroTile(getAdjacentTiles(xPos,yPos));
		}
		else
			tile.div.innerText = tile.adjacentMines;
	}
}
function flagTile(xPos,yPos){
	let tile = tiles[xPos][yPos]; 
		if(!tile.isOpen){ //stops flagging of already opend tiles
			if(tile.isFlagged){
				tile.isFlagged = false;
				tile.div.style.backgroundColor = "#ffabaa"
			}
			else{
				tile.isFlagged = true;
				tile.div.style.backgroundColor = "red";
			}
		}
}
function failState(xPos, yPos){
	alert("You Just died");
	location.reload();
}

//recursive version is working. The proble was using dispatchEvent to generate the recursive behaviour.
function zeroTile(adjacentTiles){
	for(let i = 0;;i++){
		if(typeof adjacentTiles[i] == "undefined")
			break;
		else{
			if(!adjacentTiles[i].isOpen){//checks if the tile still hidden
				adjacentTiles[i].div.classList.add("opened");
				adjacentTiles[i].isOpen = true;
				
				if(adjacentTiles[i].adjacentMines != 0)
					adjacentTiles[i].div.innerText = adjacentTiles[i].adjacentMines;
				else{
					zeroTile(getAdjacentTiles(adjacentTiles[i].xPos, adjacentTiles[i].yPos));
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
