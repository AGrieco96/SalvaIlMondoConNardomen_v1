/*
Game Version: 5.0.1
Build: 777010
Author: B1akF1Re23, nardoz0918, Rahios
*/

var game = new Phaser.Game(800 , 600 , Phaser.AUTO , "gameContainer");

//variabile rendering laser (Menù principale)
var filter;
//variabili per il gamestate del MainMenu
var button;
var textButton;
var sprite;
var background;
//variabili per il nuovo livello
var flag_b = true;
//variabili per personaggi
var player;
var platforms;
var yos;
var baddies;
//variabili score e level
var score = 0;
var scoreText;
var level = 1;
var levelText;
var scoreStep = 10;
//modificatori spam personaggi
var moltYos = 3;
var count = moltYos*scoreStep;
var j = 0;
//variabili per i potenziamenti
var powerUps;
var velocity=230;
var powerSword = 0;
var swords;
//variabile per la musica
var music;		
var flag_music = true;
//variabili per il restart
var stateText; 
var powerFlag = 0;
//variabile di input tastiera
var cursors;
var first = true;

//Gamestate Menù principale (laser)
var MainMenu_v2 = {
	preload: function() {
		game.load.image('logopro','assets/game/assets/graphics_update/logopro.png');
		game.load.image('button','assets/game/assets/graphics_update/button_start2.png',193,71);
		game.load.script('filter','assets/game/assets/graphics_update/LightBeam.js');
		game.load.image('star','assets/game/assets/graphics_update/new_star.png');
	},
	create: function() {

		var logo = game.add.sprite(0,0,'logopro');

		background = game.add.sprite(0,0);
		background.width = 800;
		background.height = 600;

		filter = game.add.filter('LightBeam',800,600);
		//you have the following values to play with (default shown):
		filter.alpha = 0.0;
		// filter.red = 1.0;
		// filter.green = 1.0;
		// filter.blue = 2.0;
		// filter.thickness = 70.0;
		// filter.speed = 1.0;

		button = game.add.button(200,game.world.centerY+95,'button',actionOnClick,this,1,0,2);
		button.name = 'play'
		button.onInputOver.add(over,this);
		textButton = game.add.text(260,game.world.centerY+120,'PLAY',{fontsize:'10px' , fill: '#fff'});

		button = game.add.button(400,game.world.centerY+95,'button',actionOnClick,this,1,0,2);
		button.name = 'rank';
		button.onInputOver.add(over,this);
		textButton = game.add.text(440,game.world.centerY+120,'RANKING',{fontsize:'10px' , fill: '#fff'});

		button = game.add.button(16,16,'star',actionOnClick,this,1,0,2);
		button.name = 'star_v2'
		button.onInputOver.add(over,this);
		
		background.filters = [filter];
	},
	update: function() {

		filter.update();

	}

}

//Gamestate menù secondario (fuoco)
var MainMenu = {
	preload: function() {
		game.load.image('star','assets/game/assets/graphics_update/new_star.png');
		game.load.image('button','assets/game/assets/images_menu/button_start2.png',193,71);
		//un pò di game load cosa figa
		game.load.image('cyberglow','assets/game/assets/graphics_update/new_fire_v1.png');
	},
	create: function() {

		var fragmentSrc = [

		//questo è qualcosa di bellissimo
			"precision mediump float;",

			"uniform float		time;",
			"uniform vec2 		resolution;",
			"uniform sampler2D 	iChanne10;",

			"float noise(vec3 p){",
				"vec3 i = floor(p);",
				"vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);",
				"vec3 f = cos((p-i)*acos(-1.))*(-.5)+.5;",
				"a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);",
				"a.xy = mix(a.xz, a.yw, f.y);",
				"return mix(a.x, a.y, f.z);",
			"}",

			"float sphere(vec3 p, vec4 spr){",
				"return length(spr.xyz-p) - spr.w;",
			"}",

			"float flame(vec3 p){",
				"float t = time;",
				"float d = sphere(p*vec3(1.,.5,1.), vec4(.0,-1.,.0,1.));",
				"return d + (noise(p+vec3(.0,t*2.,.0)) + noise(p*3.)*.5)*.25*(p.y) ;",
			"}",

			"float scene(vec3 p){",
			"return min(100.-length(p) , abs(flame(p)) );",
			"}",

			"vec4 raymarch(vec3 org, vec3 dir){",
				"float d = 0.0, glow = 0.0, eps = 0.02;",
				"vec3  p = org;",
				"bool glowed = false;",
	
				"for(int i=0; i<64; i++){",
					"d = scene(p) + eps;",
					"p += d * dir;",
					"if( d>eps ){",
						"if(flame(p) < .0)",
						"glowed=true;",
					"if(glowed)",
       					"glow = float(i)/64.;",
					"}",
				"}",
			"return vec4(p,glow);",
			"}",

			//void mainImage( out vec4 fragColor, in vec2 fragCoord ){
			"void main( void ){",
				"vec2 v = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;",
				"v.x *= resolution.x/resolution.y;",
				"vec3 org = vec3(0., -2., 4.);",
				"vec3 dir = normalize(vec3(v.x*1.6, -v.y, -1.5));",
	
				"vec4 p = raymarch(org, dir);",
				"float glow = p.w;",
	
				"vec4 col = mix(vec4(1.,.5,.1,1.), vec4(0.1,.5,1.,1.), p.y*.02+.4);",
	
				"gl_FragColor = mix(vec4(0.), col, pow(glow*2.,4.));",
				//fragColor = mix(vec4(1.), mix(vec4(1.,.5,.1,1.),vec4(0.1,.5,1.,1.),p.y*.02+.4), pow(glow*2.,4.));

			"}",
		]

		sprite = game.add.sprite(0,0,"cyberglow");
		sprite.width = 800;
		sprite.heigth = 600;

		var customUniforms = {
			iChanne10: { type: 'sampler2D', value: sprite.texture, textureData: { repeat:true }}
		};

		filter = new Phaser.Filter(game,customUniforms,fragmentSrc);
		filter.setResolution(800,600);

		sprite.filters = [ filter ];

		//game.stage.backgroundColor = '#f0000b';
		//game.add.sprite(0,0,'background');
																		//in this order are 1=over 0=out 2=down
		button = game.add.button(200,game.world.centerY+95,'button',actionOnClick,this,1,0,2);
		button.name = 'play'
		button.onInputOver.add(over,this);
		textButton = game.add.text(260,game.world.centerY+120,'PLAY',{fontsize:'10px' , fill: '#fff'});

		button = game.add.button(400,game.world.centerY+95,'button',actionOnClick,this,1,0,2);
		button.name = 'rank';
		button.onInputOver.add(over,this);
		textButton = game.add.text(440,game.world.centerY+120,'RANKING',{fontsize:'10px' , fill: '#fff'});

		button = game.add.button(16,16,'star',actionOnClick,this,1,0,2);
		button.name = 'star'
		button.onInputOver.add(over,this);

	},
	update: function (){
		filter.update();
	}

}

//Gamestate gioco 
var GameState = {
	preload: function(){
		//backgrounds
		game.load.image('background' , 'assets/game/assets/graphics_update/new_background_v2.png');
		game.load.image('background_2','assets/game/assets/graphics_update/background_2.png');
		game.load.image('platform' , 'assets/game/assets/graphics_update/new_platform.png');
		//da raccogliere
		game.load.image('yo' , 'assets/game/assets/images/yo.png');
		//nardo
		game.load.spritesheet('nardo' , 'assets/game/assets/images/nardosheet.png' , 42 , 70);
		game.load.spritesheet('supernardo','assets/game/assets/images/supernardo.png', 70 ,70);
		game.load.spritesheet('nardopower','assets/game/assets/images/nardopower.png', 42 ,70);
		//baddies
		game.load.image('baddie' , 'assets/game/assets/images/anto.png');
		game.load.image('baddie2' , "assets/game/assets/images/stef.png");
		//powerUp
		game.load.image('powerUp' , 'assets/game/assets/images/diamond.png');
		game.load.image('sword', 'assets/game/assets/images/sword.png');
		//siccome firefox non supporta i file .mp3 cerchiamo di rendere il programma compatibile per tutti.
		//game.load.audio('music',['assets/game/assets/SoundEffects/enter_the_east.mp3']);
		game.load.audio('music',['assets/game/assets/SoundEffects/back_to_back.mp3','assets/SoundEffects/back_to_back.ogg']);
		game.load.image('b_play','assets/game/assets/graphics_update/b_play.png');
		game.load.image('b_pause','assets/game/assets/graphics_update/b_pause.png');
	},
	create: function(){
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//fa apparire il mondo più grande
		game.world.setBounds(0,0,1400,600);	
		background = game.add.sprite(0,0,'background');
		//posiziona terreno
		platforms = game.add.group();
		platforms.enableBody  = true;
		var ground = platforms.create(0 , game.world.height - 32 , 'platform');
		ground.body.immovable = true;
		ground = platforms.create(400,game.world.height - 32 , 'platform');
		ground.body.immovable = true;
		ground = platforms.create(800,game.world.height - 32 , 'platform');
		ground.body.immovable = true;
		ground = platforms.create(1200,game.world.height - 32 , 'platform');
		ground.body.immovable = true;
		//posizione piattaforme
		var ledge = platforms.create(360, 382, 'platform');
    	ledge.body.immovable = true;
    	ledge = platforms.create(-150, 232, 'platform');
    	ledge.body.immovable = true;
    	ledge = platforms.create(840,282,'platform');
    	ledge.body.immovable = true;
    	//bottone musica
    	button = game.add.button(720,25,'b_pause',actionOnClick,this,1,0,2);
    	button.name = 'musica';
    	button.onInputOver.add(over,this);
    	button.fixedToCamera = true;
    	//start musica
    	music = game.add.sound('music');
    	music.play('',0,1,true,true);
    	//add nardo
    	player = game.add.sprite(32 , game.world.height-150 , 'nardo');
    	game.physics.arcade.enable(player);

		player.body.bounce.y = 0.2;
    	player.body.gravity.y = 300;
    	player.body.collideWorldBounds = true;

		player.animations.add('left' , [9,10,11,12,13,14,15,16,17] , 10 , true);
    	player.animations.add('right' , [27,28,29,30,31,32,33,34,35] , 10 , true);
    	player.animations.add('stand' , [22] , 1 , false);
    	//add yo
    	yos = game.add.group();
    	yos.enableBody = true;
    	spamYos();
    	//add baddies
    	baddies = game.add.group();
    	baddies.enableBody = true;
    	spamBaddies();
    	//add powerUp
    	powerUps = game.add.group();
    	powerUps.enableBody = true;
    	//add sword
    	swords = game.add.group();
    	swords.enableBody = true;
    	//score and level
    	scoreText = game.add.text(16 , 16 , 'Score : 0' , {fontsize: '32px' , fill: '#000'});
    	levelText = game.add.text(16 , 45 , 'Level : 1' , {fontsize: '32px' , fill: '#000'});
    	scoreText.fixedToCamera = true;
    	levelText.fixedToCamera = true;
    	//Text del restart!!
    	stateText = game.add.text(400,300,'',{font:'84px Arial', fill: '#fff' , align: "center"});
    	stateText.stroke = "#ff0000";
    	stateText.strokeThickness = 16;
    	stateText.setShadow(2, 2, "#333333", 2, true, false);
    	stateText.anchor.setTo(0.5,0.5);
    	stateText.visible = false;
    	stateText.fixedToCamera = true;
    	//la camera segue nardo
    	game.camera.follow(player);
    	//event handler
    	cursors = game.input.keyboard.createCursorKeys();
    	//spam baddies
    	game.time.events.loop((Phaser.Timer.SECOND*20)/level, spamBaddies, this);
    	game.time.events.loop((Phaser.Timer.SECOND*40), spamPowerUp , this );
    	game.time.events.loop((Phaser.Timer.SECOND*60)/level, spamSword, this);
	},
	update: function(){
		var hitPlatform = game.physics.arcade.collide(player , platforms);
		//collisioni di tutti gli oggetti
		game.physics.arcade.collide(yos , platforms);
		game.physics.arcade.collide(baddies , platforms);
		game.physics.arcade.collide(yos , baddies);
		game.physics.arcade.collide(baddies , baddies);
		//game.physics.arcade.collide(yos , yos);
		game.physics.arcade.collide(powerUps , powerUps);
		game.physics.arcade.collide(powerUps , platforms);
		game.physics.arcade.collide(powerUps , yos);
		game.physics.arcade.collide(powerUps , baddies);
		game.physics.arcade.collide(swords , platforms);
		game.physics.arcade.collide(swords , yos);
		game.physics.arcade.collide(swords , baddies);
		game.physics.arcade.collide(swords , swords );
		game.physics.arcade.collide(swords , powerUps );
		//gestione collisione con player
		game.physics.arcade.overlap(player , yos , collectYos , null , this);
		game.physics.arcade.overlap(player , baddies , loseHandler , null , this);
		game.physics.arcade.overlap(player , powerUps , speedUP , null , this);
		game.physics.arcade.overlap(player , swords , collectSword , null , this);
		//cambio background durante la fase di gioco
		if(flag_b == true && level > 2){
			flag_b = false;
			background.loadTexture('background_2');
		}
		//velocità e animazione di nardo
		player.body.velocity.x = 0;
  		if (cursors.left.isDown){
        	player.body.velocity.x = -velocity;

        	player.animations.play('left');
    	}
    	else if (cursors.right.isDown){
        	player.body.velocity.x = velocity;

        	player.animations.play('right');
    	}
    	else{
        	player.animations.stop();

        	player.animations.play('stand');
    	}
    
    	if (cursors.up.isDown && player.body.touching.down&&hitPlatform){
        	player.body.velocity.y = -350;
    	}
	}
};
//start del menù
game.state.add('MainMenu_v2' , MainMenu_v2);
game.state.start('MainMenu_v2')

//funzione che spawna 'yo'
function spamYos(){
	for(var i = 0;i<moltYos ; i++){
    	var yo = yos.create(game.world.width*Math.random(), game.world.height*Math.random()-100, 'yo');
    	yo.scale.setTo(0.25);
    	yo.body.gravity.y = 200;
    	yo.body.velocity.x = 100*Math.random();
    	yo.body.bounce.y = 0.3 + Math.random() * 0.2;
    	yo.body.bounce.x = 0.3 + Math.random() * 0.2;
    	yo.body.collideWorldBounds = true;
    }
}
//funzione che spawna i nemici
function spamBaddies(){
	var random;
	var baddie;
	if(first == true){
		first = false;
		random  = Math.random();
		if(random <0.5){
			if(Math.random()<0.5) spamLocation = game.world.width*Math.random()+(Math.random()*10);
			else spamLocation = game.world.width*Math.random()-(Math.random()*10);

			if(Math.random() < 0.5)
				baddie = baddies.create( spamLocation, 0 , 'baddie');
			else
				baddie = baddies.create( spamLocation, 0 , 'baddie2');

			if(spamLocation < (game.world.width/2)){
				baddie.body.velocity.x = (300*Math.random());
				baddie.body.gravity.x = 1;
			}
			else{
				baddie.body.velocity.x = -(300*Math.random());
				baddie.body.gravity.x = -1;
			}
		}
		else{
			if(Math.random()<0.5) spamLocation = game.world.height*Math.random()+(Math.random()*10);
			else spamLocation = game.world.height*Math.random()-100;
			//controllo che i nemici non escano nella piattaforma del terreno
			if(spamLocation >= game.world.height-32) spamLocation-=32;
			if(Math.random()< 0.5)
					baddie = baddies.create( game.world.width, spamLocation , 'baddie');
				else
					baddie = baddies.create( game.world.width, spamLocation , 'baddie2');
			baddie.body.velocity.x = -(300*Math.random());
			baddie.body.gravity.x = -1;
		}
		baddie.body.gravity.y = 200;
    	baddie.body.bounce.y = 0.7+Math.random()*0.2;
    	baddie.body.bounce.x = 1+Math.random();
		return;
	}
	for(var i = 0; i<level;i++){
		random = Math.random();
		if(random < 1/3){
			if(Math.random()<0.5) spamLocation = game.world.width*Math.random()+(Math.random()*10);
			else spamLocation = game.world.width*Math.random()-(Math.random()*10);

			if(Math.random() < 0.5)
				baddie = baddies.create( spamLocation, 0 , 'baddie');
			else
				baddie = baddies.create( spamLocation, 0 , 'baddie2');
			if(spamLocation < (game.world.width/2)){
				baddie.body.velocity.x = (300*Math.random());
				baddie.body.gravity.x = 1;
			}
			else{
				baddie.body.velocity.x = -(300*Math.random());
				baddie.body.gravity.x = -1;
			}
		}
		else {
			if(Math.random()<0.5) spamLocation = game.world.height*Math.random()+(Math.random()*10);
			else spamLocation = game.world.height*Math.random()-100;
			//controllo che i nemici non escano nella piattaforma del terreno
			if(spamLocation >= game.world.height-32) spamLocation-=32;

			if(random < 2*(1/3)){
				if(Math.random() < 0.5)
					baddie = baddies.create( 0 , spamLocation , 'baddie');
				else
					baddie = baddies.create( 0, spamLocation , 'baddie2');
				baddie.body.velocity.x = (300*Math.random());
				baddie.body.gravity.x = 1;
			}
			else{
				if(Math.random()< 0.5)
					baddie = baddies.create( game.world.width, spamLocation , 'baddie');
				else
					baddie = baddies.create( game.world.width, spamLocation , 'baddie2');
				baddie.body.velocity.x = -(300*Math.random());
				baddie.body.gravity.x = -1;
			}		
		}
		baddie.body.gravity.y = 200;
    	baddie.body.bounce.y = 0.7+Math.random()*0.2;
    	baddie.body.bounce.x = 1+Math.random();
    	/*
    	if(spamLocation < (game.world.width/2)){
			baddie.body.velocity.x = (300*Math.random());
			baddie.body.gravity.x = 1;
		}
		else{
			baddie.body.velocity.x = -(300*Math.random());
			baddie.body.gravity.x = -1;
		}
		*/
	}
}
//funzione che spawna il powerup
function spamPowerUp(){
	var speed = powerUps.create(game.world.width*Math.random(), game.world.height*Math.random()-100, 'powerUp');	
	speed.body.gravity.y = 200;
    speed.body.velocity.x = 100*Math.random();
    speed.body.bounce.y = 0.3 + Math.random() * 0.2;
    speed.body.bounce.x = 0.3 + Math.random() * 0.2;
    speed.body.collideWorldBounds = true;
}

//funzione che spawna la spada
function spamSword(){
    var sword = swords.create(game.world.width*Math.random(), game.world.height*Math.random()-100, 'sword');
    sword.body.gravity.y = 200;
    sword.body.velocity.x = 100*Math.random();
    sword.body.bounce.y = 0.3 + Math.random() * 0.2;
    sword.body.bounce.x = 0.3 + Math.random() * 0.2;
    sword.body.collideWorldBounds = true;
}
//collisione player e 'yo'
function collectYos(player , star){
	star.kill();
	score+=scoreStep;
	count-=scoreStep;
	scoreText.text = 'Score: '+score;
	if(count <= 0){
		spamYos();
		count=moltYos*scoreStep;
		j++;
		if(j!=0 && j%2 == 0)
			level++;
			if(moltYos < 13)
				moltYos++;
			levelText.text = 'Level: '+level;
	}

}
//collisione player e spada
function collectSword(player, sword){
	sword.kill();
	if ( powerSword == 0 ) {
		powerSword ++;
		velocity+=30;
		player.loadTexture('supernardo',[0,1,2],false);
		player.animations.add('left' , [0] , 10 , true);
    	player.animations.add('right' , [2] , 10 , true);
    	player.animations.add('stand' , [1 ] , 2 , true);
	}

}
//aumento velocità
function speedUP(player , powerUp){
	powerUp.kill();
	velocity=velocity+150;
	powerFlag = 1;
	if(powerSword==0){
		player.loadTexture('nardopower' , [0,1,2] , false);
		player.animations.add('left' , [0] , 1 , false);
		player.animations.add('right' , [2] , 1 , false);
		player.animations.add('stand' , [1] , 1 , false);
	}
	game.time.events.repeat(Phaser.Timer.SECOND*10,1,NormalSpeed,this);
	
}
//ritorno a normale velocità
function NormalSpeed(){
	velocity=velocity-150;
	powerFlag = 0;
	if(powerSword==0){
		player.loadTexture('nardo','',false);
		player.animations.add('left' , [9,10,11,12,13,14,15,16,17] , 10 , true);
    	player.animations.add('right' , [27,28,29,30,31,32,33,34,35] , 10 , true);
    	player.animations.add('stand' , [22] , 1 , false);
	}
}
//collisione player baddie
function loseHandler(player , baddie){
	//con spada
	if(powerSword == 1){
		baddie.kill();
		powerSword -= 1;
		velocity-=30;
		if(powerFlag == 0){
			player.loadTexture('nardo','',false);
			player.animations.add('left' , [9,10,11,12,13,14,15,16,17] , 10 , true);
    		player.animations.add('right' , [27,28,29,30,31,32,33,34,35] , 10 , true);
    		player.animations.add('stand' , [22] , 1 , false);
    	}
    	else{ 		
			player.loadTexture('nardopower' , [0,1,2] , false);
			player.animations.add('left' , [0] , 1 , false);
			player.animations.add('right' , [2] , 1 , false);
			player.animations.add('stand' , [1] , 1 , false);    	
		}
	}
	//senza spada
	else{
		stateText.text="GAME OVER\nClick to\ncome back to menu";
		stateText.visible = true;
		game.input.onTap.addOnce(restart,this);
		checkRank(score);
		game.paused = true;
	
	}
}

function restart() {
	baddies.removeAll();
	yos.removeAll();
	level = 1;
	score = 0;
	scoreStep = 10;
	j = 0;
	moltYos = 3;
	count = moltYos*scoreStep;
	velocity = 230;
	stateText.visible = false;
	first = true;
	music.stop();
	game.paused = false;
	game.state.start('MainMenu_v2');
}
//funzioni per il bottone
function over(button) {
	if(button.name == 'play')
		console.log('button play');
	else if(button.name == 'class'){
		console.log('button class');
	}else{
		console.log('button music')
	}
}
//event handler button
function actionOnClick(button) {
	if(button.name == 'play'){
	game.state.add('GameState' , GameState);
	game.state.start('GameState')	
	}
	if(button.name == 'musica'){
		if(flag_music == true){
			music.pause();
			button.loadTexture('b_play');
			flag_music = false;
		}
		else{
			flag_music = true;
			button.loadTexture('b_pause');
			music.resume();
		}		
	}
	if(button.name == 'star'){
		game.state.add('MainMenu_v2',MainMenu_v2);
		game.state.start('MainMenu_v2');
	}
	if(button.name == 'star_v2'){
		game.state.add('MainMenu',MainMenu);
		game.state.start('MainMenu');
	}
	if(button.name == 'rank'){
		showRank();
	}
}