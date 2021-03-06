/*
Filename:	RemoteTextEditor.js
Project:	jQuery Text Editor
Programmer:	Jorge Ramirez
Description:	
	This file contains the code for a AJAX based text editor class.

Date: 30 November 2015 (Monday)
*/



/*
Name:	RemoteTextEditor

Description:
	This class models a web based text editor.
*/
function RemoteTextEditor(textBoxID, textFileSelectID, nameTextBoxID) {
	this.textBoxID = textBoxID;
	this.textFileSelectID = textFileSelectID;
	this.nameTextBoxID = nameTextBoxID;

	this.filesDir = "MyFiles/"; // Default directory for files
	this.errorBoxID = "error"; // Default id for the error message box
	this.saveSuccessBoxID = "saved"; // Default id for confirming a successful save

	this.xmlhttp = new XMLHttpRequest();



	/*
	Name:			SaveFile()
	Description:
		This method validates the file name before sending a request to save the file with the content specified.

	Parameters: None
	Return: Void
	*/
	this.SaveFile = (function() {
		if (this.IsFileNameValid()) {
			// Create request parameters
			var requestParams = {
				name: $("#" + nameTextBoxID)[0].value, 
				content: $("#" + textBoxID)[0].value
			}

			// Create ajax request
			$.ajax({ 
				url: "SaveFile.php",
				method: "POST",
				data: requestParams
			}).done((function(response){
				if (response == "failure") {
		        	// Display error saving message
		        	$("#" + this.errorBoxID)[0].innerHTML = "Unexpected error. File could not save.";
		        } else {
		        	// Clear error message
		        	$("#" + this.errorBoxID)[0].innerHTML = ""
		        	$("#" + this.saveSuccessBoxID)[0].innerHTML = "Saved!"

		        	// Clear saved message after 2 seconds
		        	window.setTimeout((function() {
		        		$("#" + this.saveSuccessBoxID)[0].innerHTML = ""
		        	}).bind(this), 2000)

		        	// Reload file list
		        	this.GetFileList()
		        }
			}).bind(this))
		}
	}).bind(this)



	/*
	Name:			GetFileList()
	Description:
		This method requests the server for a list of the files in the user's folder 
		and fills the file selector with an option for each file.

	Parameters: None
	Return: Void
	*/
	this.GetFileList = (function() {
		// Create ajax request
		$.ajax({ url: "GetFileList.php" }).done((function(response){
			var filesArray = JSON.parse(response); // The new options
			var selectElement = $("#" + this.textFileSelectID)[0];
			var selectOptions = "";

			// Clear current list
			while (selectElement.length > 0) {
				selectElement.remove(0);
			}

			// Add new options to list
			for (var file = 0; file < filesArray.length; file++) {
				var option = document.createElement("OPTION");
				option.value = filesArray[file];
				option.text = filesArray[file];
				selectElement.add(option);
			};
		}).bind(this))
	}).bind(this)



	/*
	Name:			LoadFileContents()
	Description:
		This mehod requests the contents of a the file selected by the file selector
		and inserts the received contents into the text box.

	Parameters: None
	Return: Void
	*/
	this.LoadFileContents = (function() {
		// File to request
		var filePath = this.filesDir + $("#" + this.textFileSelectID)[0].value

		// Add a unique identifier to bypass caching of the file
		filePath += '?_=' + new Date().getTime()

		// Create request
		$.ajax({ url: filePath }).done((function(response){
			$("#" + this.textBoxID)[0].value = response;
		}).bind(this))
	}).bind(this)



	/*
	Name:			IsFileNameValid()
	Description:
		This method validates the name of a file.
		The following regex is used: /^[0-9a-zA-Z ]+$/
	
	Parameters: None
	Return: true if the file name is valid, false otherwise
	*/
	this.IsFileNameValid = (function() {
		var valid = false;
		// Create regex pattern for verification
        var namePatt = /^[0-9a-zA-Z ]+$/;

        // Get the file name
        var fileName = $("#" + this.nameTextBoxID)[0].value;

        // Compare the input to the pattern.
        fileName = fileName.match(namePatt);

        if (fileName == null) {
        	// Display invalid file name message
        	$("#" + this.errorBoxID)[0].innerHTML = "That file name is not valid. Only letters, number and spaces are allowed.";
        } else {
        	// Clear invalid file name message
        	$("#" + this.errorBoxID)[0].innerHTML = ""
        	valid = true
        }

        return valid
	}).bind(this)
}