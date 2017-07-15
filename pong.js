


var canvas = $('#canvasOne')[0];
var context = canvas.getContext('2d');

//Reposition the canvas
canvas.style.position = 'absolute';
canvas.style.left = 600 + 'px';
canvas.style.top = 150 + 'px';
//Set this to true for multiplayer
var multiplayer = true;

//
var infinate = 1001;
var temporary = 10;

var main = function(){
	//Left paddle
	var leftPaddle = {
		x:70,
	 	y:240,
	 	w:10,
	 	h:40
	};
	//Right Paddle
	var rightPaddle = {
	 	x:510,
	 	y:240,
	 	w:10,
	 	h:40
	};
	var ball = {
		x:150,
	 	y:240,
	 	w:15,
	 	h:15,
	 	speed:15,
	 	dirX:0,
	 	dirY:0
	}

	var getRandNum = function(range){
	 	return Math.floor((Math.random() * (range - 1)) + 1);
	}

	var colDetection = function(first, second){
		//Check for Collision
		if(first.x < second.x + second.w &&
			first.x + first.w > second.x &&
			first.y < second.y + second.h &&
			first.y + first.h > second.y){
			return true;
		};
		
		return false;
	};

	var loop = function(times, interval, callback){
		if(times < 1){
			return;
	 	}
	 	//If times is > 1000 repeat indefinately.
	 	else if(times > 1000){
	 		times += 1;
	 	}
	 	if(callback){
	 		callback();
	 		setTimeout(function(){
	 			loop(times - 1, interval, callback);
	 		}, interval);	 	}

	 	else{
	 		console.log('No function passed.');
	 	}
	}
	var draw = function(x, y, w, h, color){
	 	context.fillStyle = color;
	 	context.fillRect(x, y, w, h);

	}

	var clearImg = function(paddle){
	 	draw(paddle.x, paddle.y, paddle.w, paddle.h, 'black');
	}

	//Randomize direction of ball
 	var rand = getRandNum(ball.speed);
 	ball.dirX = rand;
	ball.dirY = rand - ball.speed;

	
	loop(infinate, 120, function(){
		clearImg(ball);

		//Change direciton if at top or bottom of screen of screen
		if(ball.y < 0 || (ball.y + ball.h) > 500){
			ball.dirY = -ball.dirY;
		}

		ball.x += ball.dirX;
		ball.y += ball.dirY;
		//Determine which paddle to check collision for.
		var second = ball.dirX > 0 ? rightPaddle : leftPaddle;
		//Check Collision
		if(colDetection(ball, second)){
			ball.dirX = -ball.dirX
			ball.dirY = -ball.dirY + getRandNum(5);

		}
		
		draw(ball.x, ball.y, ball.w, ball.h, 'white');

		if(multiplayer){
			return;
		}

		clearImg(rightPaddle);
		var diff = ball.y - rightPaddle.y;
		//Track the ball
		if(diff != 0){
			rightPaddle.y = diff > 0 ? rightPaddle.y + 10: rightPaddle.y - 10;
		}
		draw(rightPaddle.x, rightPaddle.y, rightPaddle.w, rightPaddle.h, 'white');
		console.log("Looping");
	});


	$('html').keydown(function(e){
	 	var key = e.which;

	 	//Left paddle
	 	clearImg(leftPaddle);
	 	if(key == 87){
	 		leftPaddle.y -= 10;
	 	}
	 	else if(key == 83){
	 		leftPaddle.y += 10;
	 	}
	 	draw(leftPaddle.x, leftPaddle.y, leftPaddle.w, leftPaddle.h, 'white')

	 	//Multiplayer Mode
	 	//*******************************************************************************************************
	 	if(!multiplayer){
	 		return false;
	 	}
	 	
	 	//Right paddle
	 	clearImg(rightPaddle)
	 	if(key == 38){
	 		rightPaddle.y -=10;
	 	}
	 	else if(key == 40){
	 		rightPaddle.y +=10;
	 	}
	 	draw(rightPaddle.x, rightPaddle.y, rightPaddle.w, rightPaddle.h, 'white');

	 	//*******************************************************************************************************
	});

	//Draw canvas
	draw(0, 0, canvas.width, canvas.height, 'black');
	//Draw paddles
	draw(leftPaddle.x, leftPaddle.y, leftPaddle.w, leftPaddle.h, 'white');
	 
	//Right paddle
	draw(rightPaddle.x, rightPaddle.y, rightPaddle.w, rightPaddle.h, 'white');

	//Draw ball
	draw(ball.x, ball.y, ball.w, ball.h, 'white');

}


main();