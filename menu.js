			  //how was the menu opened, did you die or something else
function init_menu(){
	document.getElementById("retry").onclick 	= resetField;
	document.getElementById("width").onchange 	= setMineInterval; 
	document.getElementById("height").onchange 	= setMineInterval;
}

function setMineInterval(){
	let height 			= document.getElementById("height").value,
		widht 			= document.getElementById("width").value,
		mineCountSlider = document.getElementById("mineCount"),
		tileCount 		= height*widht,
		max				= Math.floor(tileCount*0.8),
		min				= Math.floor(tileCount*0.1);
	
	mineCountSlider.max = max;
	mineCountSlider.min = min;
}

function resetField(){
	//gets new settings
	xSize 			= document.getElementById("width").value;
	ySize 			= document.getElementById("height").value;
	globalMineCount = document.getElementById("mineCount").value;
	openTiles 		= 0;
	
	document.getElementById("container").innerHTML = ""; // clears the field;
	createTilesArray(createRandomSeed());
	drawField();
	
	document.getElementById("menu").style.visibility="hidden";
}

function menu(context){
	document.getElementById("menu").style.visibility	= "visible";
	document.getElementById("menuTitle").innerHTML 		= context;
}
