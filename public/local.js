// Start a WebSocket connection with the server using SocketIO
var socket = io(); 	// Note that the SocketIO client-side library was imported on line 13 of index.html,
			// and this file (local.js) was imported on line 14 of index.html

// Key codes for W (UP), S (DOWN), A (LEFT), and D (RIGHT):
var UP = 87, DOWN = 83, LEFT = 65, RIGHT = 68;

// NOTE: if you prefer using the arrow keys, you could use this code instead:
// var UP = 38, DOWN = 40, LEFT = 37, RIGHT = 39;
// But it doesn't really matter :)

// Listen for key presses:
document.addEventListener('keydown', moveAndBroadcast);

// Move the box according to key presses and send the data to the server
function moveAndBroadcast(event) {
	// Normalize key codes across browsers:
	var keyCode = event.which || event.keyCode || 0;
	
	// If one of our control keys was pressed, move the box and send the code to the server
	if ( keyCode == UP || keyCode == DOWN || keyCode == LEFT || keyCode == RIGHT ) {
		// Move the box on the screen accordingly:
		moveTheBox(keyCode);
		// Send the key code to the server, which will then broadcast it to other clients
		socket.emit( 'shared move', keyCode );
	}
}

// When "shared move" event is received, move the box using the data received
socket.on('shared move', function(keyCode){
	moveTheBox(keyCode);
});

// This function actually MOVES the box on the page as needed using absolute positioning with CSS
function moveTheBox(keyCode) {

	var SCREENWIDTH = 100, SCREENHEIGHT = 100, BOXSIZE = 10, STEPSIZE = 1.5, direction = 1, newPositionValue = 0;

	// Create a variable for the HTML element with the id="movebox"
	var box = document.getElementById('movebox');

	// The below code is a bit tricky because it's doing a little math
	// to make the box wrap around if it goes off the edge of the screen.
	// But essentially it's just resetting the "top" or "left" CSS property
	// by either adding or subtracting a constant amount (STEPSIZE) to its existing position
	switch (keyCode) {
		case UP:
			direction = -1;
		case DOWN:
			newPositionValue = parseInt(box.style.top, 10) + (direction * STEPSIZE);
			if (newPositionValue >= SCREENHEIGHT) {
				box.style.top = (newPositionValue - SCREENHEIGHT) - BOXSIZE + '%';
			} else if (newPositionValue <= 0 - BOXSIZE) {
				box.style.top = newPositionValue + SCREENHEIGHT + BOXSIZE + '%';
			} else {
				box.style.top = newPositionValue + "%";
			}
			break;
		case LEFT:
			direction = -1;
		case RIGHT:
			newPositionValue = parseInt(box.style.left, 10) + (direction * STEPSIZE);
			if (newPositionValue >= SCREENWIDTH) {
				box.style.left = (newPositionValue - SCREENWIDTH) - BOXSIZE + '%';
			} else if (newPositionValue <= 0 - BOXSIZE) {
				box.style.left = newPositionValue + SCREENWIDTH + BOXSIZE + '%';
			} else {
				box.style.left = newPositionValue + "%";
			}
			break;
	}
}
