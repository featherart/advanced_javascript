function NotesManager() {
	this.notes = [];
}

NotesManager.prototype.addNote = function(note) {
	this.$notes.prepend(
		$("<a href='#'></a>")
		.addClass("note")
		.text(note)
	);
};

NotesManager.prototype.addCurrentNote = function() {
	var current_note = this.$new_note.val();

	if (current_note) {
		this.notes.push(current_note);
		this.addNote(current_note);
		this.$new_note.val("");
	}
};

NotesManager.prototype.showHelp = function() {
	var self = this;
	self.$help.show();

	document.addEventListener("click",function __handler__(evt){
		evt.preventDefault();
		evt.stopPropagation();
		evt.stopImmediatePropagation();

		document.removeEventListener("click",__handler__,true);
		self.hideHelp();
	},true);
};

NotesManager.prototype.hideHelp = function() {
	this.$help.hide();
};

NotesManager.prototype.loadData = function(data) {
	for (var i=0; i<data.length; i++) {
		this.notes.push(data[i]);
	}
};

NotesManager.prototype.handleOpenHelp = function(evt) {
	if (!this.$help.is(":visible")) {
		evt.preventDefault();
		evt.stopPropagation();

		this.showHelp();
	}
};

NotesManager.prototype.handleAddNote = function(evt) {
	this.addCurrentNote();
};

NotesManager.prototype.handleEnter = function(evt) {
	if (evt.which == 13) {
		this.addCurrentNote();
	}
};

NotesManager.prototype.handleDocumentClick = function(evt) {
	this.$notes.removeClass("active");
	this.$notes.children(".note").removeClass("highlighted");
};

NotesManager.prototype.handleNoteClick = function(evt) {
	evt.preventDefault();
	evt.stopPropagation();

	this.$notes.addClass("active");
	this.$notes.children(".note").removeClass("highlighted");
	$(evt.target).addClass("highlighted");
};

NotesManager.prototype.init = function(opts) {
	// cache references to the DOM elements we need to manage
	this.$notes = $(opts.notes);
	this.$new_note = $(opts.new_note);
	this.$add_note = $(opts.add_note);
	this.$help = $(opts.help);
	this.$open_help = $(opts.open_help);

	// build the initial list from the existing `notes` data
	var html = "";
	for (i=0; i<this.notes.length; i++) {
		html += "<a href='#' class='note'>" + this.notes[i] + "</a>";
	}
	this.$notes.html(html);

	// listen to "help" button
	this.$open_help.bind("click",this.handleOpenHelp.bind(this));

	// listen to "add" button
	this.$add_note.bind("click",this.handleAddNote.bind(this));

	// listen for <enter> in text box
	this.$new_note.bind("keypress",this.handleEnter.bind(this));

	// listen for clicks outside the notes box
	$(document).bind("click",this.handleDocumentClick.bind(this));

	// listen for clicks on note elements
	this.$notes.on("click",".note",this.handleNoteClick.bind(this));
};


var myNotes = new NotesManager();

// assume this data came from the database
myNotes.loadData([
	"This is the first note I've taken!",
	"Now is the time for all good men to come to the aid of their country.",
	"The quick brown fox jumped over the moon."
]);


$(document).ready(function(){
	myNotes.init({
		notes: "#notes",
		new_note: "#note",
		add_note: "#add_note",
		help: "#help",
		open_help: "#open_help"
	});
});
