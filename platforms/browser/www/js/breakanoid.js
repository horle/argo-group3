function startBreakanoid() {

	var id;
	stopBreakanoid = false;

	var canvas=document.getElementById("breakanoid");
	var ctx = canvas.getContext("2d");
	ctx.canvas.width = window.innerWidth-50;
	ctx.canvas.height = window.innerHeight-50;

	var speedX = Math.floor(canvas.width/150);
	var speedY = Math.floor(canvas.height/150);

	var ballRadius = 10;
	var x = canvas.width/2;
	var y = canvas.height-30;
	var dx = speedX;//2;
	var dy = speedY;//-2;

	var paddleHeight = 10;
	var paddleWidth = 75;
	var paddleX = (canvas.width-paddleWidth)/2;

	var rightPressed = false;
	var leftPressed = false;

	var brickWidth = 75;
	var brickHeight = 20;
	var brickPadding = 10;
	var brickOffsetTop = 50;//30;
	var brickOffsetLeft = 50;//30;
	var brickRowCount = canvas.width / (brickWidth + brickOffsetLeft)//5;
	var brickColumnCount = canvas.height / (brickHeight + brickOffsetTop)//3;

	var count = 0;
	var score = 0;
	var lives = 3;

	var bricks = [];
	for(c=0; c<brickColumnCount; c++) {
			  bricks[c] = [];
			  for(r=0; r<brickRowCount; r++) {
						 var random = Math.floor(Math.random()*2);
						 bricks[c][r] = { x: 0, y: 0, status: random };
						 if(random == 1) count++;
			  }
	}

	//Interaktion
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("mousemove", mouseMoveHandler, false);
	function keyDownHandler(e) {
			  if(e.keyCode == 39) {
						 rightPressed = true;
			  }
			  else if(e.keyCode == 37) {
						 leftPressed = true;
			  }
	}
	function keyUpHandler(e) {
			  if(e.keyCode == 39) {
						 rightPressed = false;
			  }
			  else if(e.keyCode == 37) {
						 leftPressed = false;
			  }
	}

	//oder durch Maus 
	function mouseMoveHandler(e) {
			  var relativeX = e.clientX - canvas.offsetLeft;
			  if(relativeX > 0 && relativeX < canvas.width) {
						 paddleX = relativeX - paddleWidth/2;
			  }
	}

	//Kollsion mit brick
	function collisionDetection() {
			  for(c=0; c<brickColumnCount; c++) {
						 for(r=0; r<brickRowCount; r++) {
									var b = bricks[c][r];
									if(b.status == 1) {
											  if(x+ballRadius > b.x && x-ballRadius < b.x+brickWidth && y+ballRadius > b.y && y-ballRadius < b.y+brickHeight) {
														 dy = -dy;
														 b.status = 0;
														 score++;
														 if(score == count) {
																	alert("Julius Wins!");
//																	document.location.reload();
																	dx = 0; dy = 0;
														 }
											  }
									}
						 }
			  }
	}
	//Zeichen Funktion
	function drawBall() {
			  ctx.beginPath();
			  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
			  ctx.fillStyle = "#FF0000";
			  ctx.fill();
			  ctx.closePath();
	}
	function drawPaddle() {
			  ctx.beginPath();
			  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
			  ctx.fillStyle = "#BC7642";
			  ctx.fill();
			  ctx.closePath();
	}
	function drawBricks() {
			  for(c=0; c<brickColumnCount; c++) {
						 for(r=0; r<brickRowCount; r++) {
									if(bricks[c][r].status == 1) {
											  var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
											  var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
											  bricks[c][r].x = brickX;
											  bricks[c][r].y = brickY;
											  ctx.beginPath();
											  ctx.rect(brickX, brickY, brickWidth, brickHeight);
											  ctx.fillStyle = "#0000FF";
											  ctx.fill();
											  ctx.closePath();
									}
						 }
			  }
	}
	function drawScore() {
			  ctx.font = "16px roman font";
			  ctx.fillStyle = "#BC7642";
			  ctx.fillText("Score: "+score, 8, 20);
	}
	function drawLives() {
			  ctx.font = "16px roman font";
			  ctx.fillStyle = "#BC7642";
			  ctx.fillText("Lives: "+lives, canvas.width-65, 20);
	}
	function draw() {
			  if(stopBreakanoid == true){
					window.cancelAnimationFrame(id);
					return;
				}

			  ctx.clearRect(0, 0, canvas.width, canvas.height);
			  drawBricks();
			  drawBall();
			  drawPaddle();
			  drawScore();
			  drawLives();
			  collisionDetection();

			  //Berechnung
			  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
						 dx = -dx;
			  }
			  if(y + dy < ballRadius) {
						 dy = -dy;
			  }
			  else if(y + dy > canvas.height-1.5*ballRadius) {
						 if(x > paddleX && x < paddleX + paddleWidth) {
									dy = -dy;
						 }
						 else {
									lives--;
									if(!lives) {
											  alert("Barbar Wins!");
//											  document.location.reload();
												dx = 0; dy = 0;
									}
									// neue runde nach fail
									else {
											  x = canvas.width/2;
											  y = canvas.height-30;
											  dx = speedX;//3;
											  dy = -speedY;//-3;
											  paddleX = (canvas.width-paddleWidth)/2;
									}
						 }
			  }

			  // Bewegung
			  if(rightPressed && paddleX < canvas.width-paddleWidth) {
						 paddleX += 7;
			  }
			  else if(leftPressed && paddleX > 0) {
						 paddleX -= 7;
			  }

			  x += dx;
			  y += dy;
			  if (stopBreakanoid == false)
				  id = requestAnimationFrame(draw);
	}
	draw();
}
