const padding 			= 35;
const regexFilterForX	= "(?<=x:)(.*)(?=y)";
const regexFilterForY	= "(?<=y:)(.*)";

var rightClickedTile 	= [2]
var tiles 				= [];
var xSize 				= 15;
var ySize 				= 15;
var globalMineCount 	= 20;
var openTiles			= 0;
var menuIsOpen			= false;

class Tile {
	constructor(x,y){
		this.xPos 			= x;
		this.yPos 			= y;
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
	init_menu();//DEFINED IN: menu.js
}

function createRandomSeed(excludedTiles){
	let limit = xSize*ySize,
		randomSeed = [];
	for(let i = 0; i < globalMineCount; i++){
		for(y = 0;;y++){
			seed = (Math.floor(Math.random()*limit) + 1);
			if(!randomSeed.includes(seed) && !excludedTiles.includes(seed)){
				randomSeed[i] = seed;
				break;
			}
		}
	}
	
	return randomSeed;
}
function createTilesArray(){
	//sets the tiles array(s)
	let seedCounter = 0;
	for(let x = 0; x < xSize; x++){
		tiles[x] = [];
		for(let y = 0; y < ySize; y++){
			tiles[x][y] = new Tile(x, y);
		}
	}
}
function setMines(seed){
	//sets the tiles array(s)
	let seedCounter = 0;
	for(let x = 0; x < xSize; x++){
		for(let y = 0; y < ySize; y++){
			if(seed.includes(seedCounter)){
				tiles[x][y].isMine = true;
				console.log(seedCounter);
			}

			seedCounter++;
		}
	}

	//sets the adjacentMines member of the tiles
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

function init(){
	createTilesArray();
	drawField();
	// debugData();//NOTE: remove when done debugging
}
function click(id){
	if(!menuIsOpen){
		let	clickedTile = id.path[0],
			xPos		= clickedTile.id.match(regexFilterForX)[0],
			yPos		= clickedTile.id.match(regexFilterForY)[0];
		if(id.button === 0 ){//checks if the tile is beeing issued an open command or a flag command
			if(openTiles === 0){//checks if this is the first move of the game
				excludedTiles = getAdjacentTiles(xPos,yPos);
				for(let i = 0;;i++){
					if(typeof excludedTiles[i] == "undefined")
						break;
					else
						excludedTiles[i] = (excludedTiles[i].xPos * ySize) + excludedTiles[i].yPos;
				}
				setMines(createRandomSeed(excludedTiles));
				openTile(xPos,yPos);
			}
			else
				openTile(xPos,yPos);
		}
		else{
			flagTile(xPos,yPos);
		}
	}
}
//primes mine for auto-open
function rightClick(id){	
	let	clickedTile = id.path[0],
		xPos		= clickedTile.id.match(regexFilterForX)[0],
		yPos		= clickedTile.id.match(regexFilterForY)[0];
	
	if(tiles[xPos][yPos].isOpen){
		rightClickedTile[0] = parseInt(xPos);
		rightClickedTile[1] = parseInt(yPos);	
	}
}

function openTile(xPos, yPos){
	let tile = tiles[xPos][yPos];
	
	if(tile.isMine && !tile.isFlagged){
		menu("you lose");
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
					else
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
		
		openTiles++;
		
		if(openTiles >= (xSize*ySize - globalMineCount))
			menu("You Win");
	}
}
function flagTile(xPos,yPos){
	let tile = tiles[xPos][yPos]; 
		if(!tile.isOpen){ //stops flagging of already opened tile
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
				
				openTiles++;
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

