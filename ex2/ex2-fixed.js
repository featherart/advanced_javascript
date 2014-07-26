var NotesManager = (function(){

	function addNote(note) {
		$notes.prepend(
			$("<a href='#'></a>")
			.addClass("note")
			.text(note)
		);
	}

	function addCurrentNote() {
		var current_note = $new_note.val();

		if (current_note) {
			notes.push(current_note);
			addNote(current_note);
			$new_note.val("");
		}
	}

	function showHelp() {
		$help.show();

		document.addEventListener("click",function __handler__(evt){
			evt.preventDefault();
			evt.stopPropagation();
			evt.stopImmediatePropagation();

			document.removeEventListener("click",__handler__,true);
			hideHelp();
		},true);
	}

	function hideHelp() {
		$help.hide();
	}

	function handleOpenHelp(evt) {
		if (!$help.is(":visible")) {
			evt.preventDefault();
			evt.stopPropagation();

			showHelp();
		}
	}

	function handleAddNote(evt) {
		addCurrentNote();
	}

	function handleEnter(evt) {
		if (evt.which == 13) {
			addCurrentNote();
		}
	}

	function handleDocumentClick(evt) {
		$notes.removeClass("active");
		$notes.children(".note").removeClass("highlighted");
	}

	function handleNoteClick(evt) {
		evt.preventDefault();
		evt.stopPropagation();

		$notes.addClass("active");
		$notes.children(".note").removeClass("highlighted");
		$(evt.target).addClass("highlighted");
	}

	function loadData(data) {
		for (var i=0; i<data.length; i++) {
			notes.push(data[i]);
		}
	}

	function init(opts) {
		// cache references to the DOM elements we need to manage
		$notes = $(opts.notes);
		$new_note = $(opts.new_note);
		$add_note = $(opts.add_note);
		$help = $(opts.help);
		$open_help = $(opts.open_help);

		// build the initial list from the existing `notes` data
		var html = "";
		for (i=0; i<notes.length; i++) {
			html += "<a href='#' class='note'>" + notes[i] + "</a>";
		}
		$notes.html(html);

		// listen to "help" button
		$open_help.bind("click",handleOpenHelp);

		// listen to "add" button
		$add_note.bind("click",handleAddNote);

		// listen for <enter> in text box
		$new_note.bind("keypress",handleEnter);

		// listen for clicks outside the notes box
		$(document).bind("click",handleDocumentClick);

		// listen for clicks on note elements
		$notes.on("click",".note",handleNoteClick);
	}


	var
		// private `notes` data
		notes = [],

		// DOM refs
		$notes,
		$new_note,
		$add_note,
		$help,
		$open_help,

		// module API
		publicAPI = {
			loadData: loadData,
			init: init
		}
	;

	return publicAPI;
})();


// assume this data came from the database
NotesManager.loadData([
	"This is the first note I've taken!",
	"Now is the time for all good men to come to the aid of their country.",
	"The quick brown fox jumped over the moon."
]);


$(document).ready(function(){
	NotesManager.init({
		notes: "#notes",
		new_note: "#note",
		add_note: "#add_note",
		help: "#help",
		open_help: "#open_help"
	});
});
