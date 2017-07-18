


var canvas = $("#canvasOne")[0];
var context = canvas.getContext('2d');

//Center the canvas
canvas.style.position = 'absolute';
var cw = (window.innerWidth/2) - (canvas.width / 2);
var ch = (window.innerHeight/2) - (canvas.height / 2);
canvas.style.left = cw + 'px';
canvas.style.top = ch + 'px';

//Game settings
//**************************************************************************************************
//Set this to true for multiplayer
var multiplayer = false;
//Set to less than 1001 for testing purposes
var repetitions = 1001;
//Difficulty. With 1 being the easiest and 1 being impossible to beat.
var difficulty = 1;

var main = function(){


	//Left paddle
	var leftPaddle = {
		x:70,
	 	y:240,
	 	w:10,
	 	h:40,
	 	score:0
	};
	//Right Paddle
	var rightPaddle = {
	 	x:510,
	 	y:240,
	 	w:10 ,
	 	h:40,
	 	score:0
	};
	var ball = {
		x:80,
	 	y:260,
	 	w:15,
	 	h:15,
	 	speed:8,
	 	dirX:0,
	 	dirY:0,
	 	turn: 'left'
	}

	var getRandNum = function(range){
	 	return Math.floor(Math.random() * (range-1) + 1);
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
	 		var finish = callback();
	 		if(finish){
	 			return;
	 		}
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

	var newGame = function(){

	}
	

	$('#newGameBtn').click(function(){
		//Set initial position of ball.
		ball.x = rightPaddle.x - ball.w;
		ball.y = rightPaddle.y + rightPaddle.w/2;
		ball.dirX = -5;
		ball.dirY = Math.random() < 0.5 ? 10 : -10;
		if(ball.turn == 'left'){
			ball.x = leftPaddle.x + leftPaddle.w;
			ball.y = leftPaddle.y + leftPaddle.h/2;
			ball.dirX = 5;
		}
		
		//Randomize direction of ball
 		var rand = getRandNum(ball.speed);
 		ball.dirX = rand;
		ball.dirY = rand - ball.speed;

		loop(repetitions, 20, function(){
			clearImg(ball);
			//Bounce ball if at top or bottom of screen.
			if(ball.y < 0 || (ball.y + ball.h) > 500){
				ball.dirY = -ball.dirY;
			}

			ball.x += ball.dirX;
			ball.y += ball.dirY;
			//Determine which paddle to check collision for.
			var ballDirection = ball.dirX > 0;
			var paddle = ball.dirX > 0 ? rightPaddle : leftPaddle;
			//Check Collision
			if(colDetection(ball, paddle)){
				//Increase the speed of the ball;
				//ball.speed = ball.speed > 0 ? ball.speed + 1 : ball.speed - 1;
				//ball.speed = -ball.speed;
				ball.dirX = -ball.dirX// + ball.speed;
				ball.dirY = -ball.dirY + getRandNum(5);
				//Ball travelling right.
				if(ballDirection){
					ball.x = paddle.x - ball.w;
				}
				//Ball travlleing left.
				else{
					ball.x = paddle.x + paddle.w;
				}
			}

			var scoreboard = $('#score');
			//Check goal
			//leftPaddle scored on rightPaddle
			if(ball.x > canvas.width){
				leftPaddle.score += 1;
				scoreboard.text('Left: ' + leftPaddle.score + ', Right: ' + rightPaddle.score);
				ball.turn = 'right'
				return true;

			}
			else if(ball.x < 15){
				rightPaddle.score += 1;
				scoreboard.text('Left: ' + leftPaddle.score + ', Right: ' + rightPaddle.score);
				ball.turn = 'left';
				return true;
			}

			draw(ball.x, ball.y, ball.w, ball.h, 'grey');

			if(multiplayer){
				return;
			}
			//Single player mode.
			clearImg(rightPaddle);
			var diff = ball.y - rightPaddle.y;
			//Track the ball
			if(diff != 0 && (Math.random() <= difficulty)){
				rightPaddle.y = diff > 0 ? rightPaddle.y + 10: rightPaddle.y - 10;
			}
			draw(rightPaddle.x, rightPaddle.y, rightPaddle.w, rightPaddle.h, 'white');

			console.log("Looping", scoreboard);
		});

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
	draw(ball.x, ball.y, ball.w, ball.h, 'blue');

}


main();