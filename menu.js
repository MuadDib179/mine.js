			  //how was the menu opened, did you die or something else
window.onload = function(){
	alert("hello world");
}

function init_menu(){
	document.getElementById("retry").onclick = resetField;
}

function resetField(){
	document.getElementById("container").innerHTML = ""; // clears the field;
	createTilesArray(createRandomSeed());
	drawField();
	
	document.getElementById("menu").style.visibility="hidden";
}

function menu(context){
	document.getElementById("menu").style.visibility="visible";
	document.getElementById("menuTitle").innerHTML = context;
}
