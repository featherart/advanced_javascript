function Widget(width,height) {
	this.width = width || 50;
	this.height = height || 50;
	this.$elem = null;
}

Widget.prototype.render = function($where){
	if (this.$elem) {
		this.$elem.css({
			width: this.width + "px",
			height: this.height + "px"
		}).appendTo($where);
	}
};

function Button(width,height,label) {
	// "super" constructor call
	Widget.call(this,width,height);
	this.label = label || "Default";

	this.$elem = $("<button>").text(this.label);
}
Button.prototype = Object.create(Widget.prototype);

Button.prototype.render = function($where) {
	// "super" call
	Widget.prototype.render.call(this,$where);
	this.$elem.click(this.onClick.bind(this));
};

Button.prototype.onClick = function(evt) {
	console.log("Button '" + this.label + "' clicked!");
};

$(document).ready(function(){
	var $body = $(document.body);
	var btn1 = new Button(125,30,"Hello");
	var btn2 = new Button(150,40,"World");

	btn1.render($body);
	btn2.render($body);
});
