/*
Build: 777010
Author: B1akF1Re23, nardoz0918, Rahios
*/

var newName ;
var globalPos;
var globalScore;
var control = true;
var update = false;

function addScore(score , pos , maxPos){
	
	if(pos == maxPos){
		//window.alert("adding in pos: "+pos);
		globalPos = pos;
		globalScore = score;
		openFormModal();
		return;	
	}
	else if(localStorage.getItem(''+maxPos) == null || localStorage.getItem(''+maxPos) == ''){
		if(localStorage.getItem(''+(maxPos-1)) != null || localStorage.getItem(''+(maxPos-1)) != '')
			localStorage.setItem(''+(maxPos) , localStorage.getItem(''+(maxPos-1)));
		addScore(score , pos , maxPos-1);
	}
	else{
		localStorage.setItem(''+maxPos , localStorage.getItem((maxPos-1)+''));
		addScore(score , pos , maxPos-1);
	}
}

function add(){
	//window.alert(newName);
	var a = [newName , globalScore];
	localStorage.setItem(''+globalPos , JSON.stringify(a));
	//((window.alert(localStorage.getItem(''+globalPos));
	update = true;
	//window.alert(update);
}

function checkRank(score){
	//1
	//window.alert("checking pos 1");
	var elem = localStorage.getItem("1");
	//window.alert("pos 1"+elem);
	if(elem == null || elem == '' || elem == undefined){
		addScore(score , 1 , 1);
		return;
	}
	else{
		var num = Number(JSON.parse(elem)[1]);
		if(num<score){
			addScore(score , 1 , 5);
			return;
		}
	}
	//2
	//window.alert("checking pos 2");
	elem = localStorage.getItem("2");
	//window.alert("pos 2"+elem);
	if(elem == null || elem == ''|| elem == undefined){
		addScore(score , 2 , 2);
		return;
	}
	else{
		var num = Number(JSON.parse(elem)[1]);
		if(num<score){
			addScore(score , 2 , 5);
			return;
		}
	}
	//3
	//window.alert("checking pos 3");
	elem = localStorage.getItem("3");
	//window.alert("pos 3"+elem);
	if(elem == null || elem == ''|| elem == undefined){
		addScore(score , 3 , 3);
		return;
	}
	else{
		var num = Number(JSON.parse(elem)[1]);
		if(num<score){
			addScore(score , 3 , 5);
			return;
		}
	}
	//4
	//window.alert("checking pos 4");
	elem = localStorage.getItem("4");
	//window.alert("pos 4"+elem);
	if(elem == null || elem == ''|| elem == undefined){
		addScore(score , 4 , 4);
		return;
	}
	else{
		var num = Number(JSON.parse(elem)[1]);
		if(num<score){
			addScore(score , 4 , 5);
			return;
		}
	}
	//5
	//window.alert("checking pos 5");
	elem = localStorage.getItem("5");
	//window.alert("pos 5"+elem);
	if(elem == null || elem == ''|| elem == undefined){
		addScore(score , 5 , 5);
		return;
	}
	else{
		var num = Number(JSON.parse(elem)[1]);
		if(num<score){
			addScore(score , 5 , 5);
			return;
		}
	}
	return;
}

function showRank(){
	if(control == true || update == true){
		listRank();
	}
	var modal = document.getElementById('RankModal');
	modal.style.display = "block";
}

function closeRank(){
	var modal = document.getElementById('RankModal');
	modal.style.display = "none";
}

function openFormModal(){
	var modal = document.getElementById('FormModal');
	modal.style.display = "block";
}

function closeFormModal(){
	newName = document.getElementById('newName').value;
	var modal = document.getElementById('FormModal');
	modal.style.display = "none";
	add();
}

function resetRank(){
	localStorage.setItem("1" , JSON.stringify(["cic" , 0]));
	localStorage.setItem("2" , JSON.stringify(["cic" , 0]));
	localStorage.setItem("3" , JSON.stringify(["cic" , 0]));
	localStorage.setItem("4" , JSON.stringify(["cic" , 0]));
	localStorage.setItem("5" , JSON.stringify(["cic" , 0]));
	//window.alert(localStorage.getItem("1"));
}

function listRank(){
	if(update == true && control==false){
		update = false;
		var kill = document.getElementById("rankList");
		kill.parentNode.removeChild(kill);
	}
	control  = false;
	var s = document.createElement("ul");
	s.id = "rankList";
	var child , span , elem , a;
	for(var i =1 ; i <= 5 ; i++){
		elem = localStorage.getItem(""+i);
		if(elem != null && elem != undefined && elem!=''){
			a = JSON.parse(elem);
			if(a!=null){
				child = document.createElement("li");
				child.class="rankLi";
				span = document.createElement("span");
				span.innerHTML = "Position "+i+" ) Name: "+a[0]+" , Score:  "+a[1];
				child.appendChild(span);
				s.appendChild(child);
				s.appendChild(document.createElement("br"));
				s.appendChild(document.createElement("br"));
			}
		}
	}
	document.getElementById("rank").appendChild(document.createElement("br"));
	document.getElementById("rank").appendChild(document.createElement("br"));
	document.getElementById("rank").appendChild(document.createElement("br"));
	document.getElementById("rank").appendChild(s);
	
}