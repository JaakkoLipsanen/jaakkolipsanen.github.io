// INPUT
var KeyCode = {
	Enter : 13,
	Esc : 27,
	Space : 32,
	Up : 38,
	Down : 40,
	Left : 37,
	Right : 39,
	
	A: 65,
	D: 68,
	S: 83,
	W: 87,
}

function InputState() {
	this.KeysDown = {};
	this.OnKeyPressed = null;
	this.OnKeyReleased = null;
	
	var _this = this;
	addEventListener("keydown", function (e) {
		_this.KeysDown[e.keyCode] = true;
		
		if(this.OnKeyPressed) {
			this.OnKeyPressed(e.keyCode);
		}
	}.bind(this), false);

	addEventListener("keyup", function (e) {
		delete _this.KeysDown[e.keyCode];
		
		if(this.OnKeyReleased) {
			this.OnKeyReleased(e.keyCode);
		}
	}.bind(this), false)
	
	this.IsKeyDown = function(keyCode) {
		return keyCode in this.KeysDown;
	}
}