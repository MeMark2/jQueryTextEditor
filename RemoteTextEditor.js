/*
Filename:	RemoteTextEditor.js
Project:	AJAX Text Editor
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
			var requestParams = "name=" + document.getElementById(nameTextBoxID).value;
			requestParams += "&content=" + document.getElementById(textBoxID).value;

			this.xmlhttp.onreadystatechange = (function() {
				if (this.xmlhttp.readyState == 4 && this.xmlhttp.status == 200) {
					var response = this.xmlhttp.responseText

					if (response == "failure") {
			        	// Display error saving message
			        	document.getElementById(this.errorBoxID).innerHTML = "Unexpected error. File could not save.";
			        } else {
			        	// Clear error message
			        	document.getElementById(this.errorBoxID).innerHTML = ""
			        	document.getElementById(this.saveSuccessBoxID).innerHTML = "Saved!"

			        	// Clear saved message after 2 seconds
			        	window.setTimeout((function() {
			        		document.getElementById(this.saveSuccessBoxID).innerHTML = ""
			        	}).bind(this), 2000)

			        	// Reload file list
			        	this.GetFileList()
			        }
				}
			}).bind(this)

			// Create request
			this.xmlhttp.open("POST", "SaveFile.php");
			this.xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

			// send request
			this.xmlhttp.send(requestParams);
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
		// Create response function
		this.xmlhttp.onreadystatechange = (function(){
			if (this.xmlhttp.readyState == 4 && this.xmlhttp.status == 200) {
				var response = this.xmlhttp.responseText;
				var filesArray = JSON.parse(response);
				var selectElement = document.getElementById(this.textFileSelectID);
				var selectOptions = "";

				while (selectElement.length > 0) {
					selectElement.remove(0);
				}

				for (var file = 0; file < filesArray.length; file++) {
					var option = document.createElement("OPTION");
					option.value = filesArray[file];
					option.text = filesArray[file];
					selectElement.add(option);
				};
			}
		}).bind(this)

		// Create request
		this.xmlhttp.open("GET", "GetFileList.php");

		// send request
		this.xmlhttp.send(null);
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
		// Create response function
		this.xmlhttp.onreadystatechange = (function(){
			if (this.xmlhttp.readyState == 4 && this.xmlhttp.status == 200) {
				document.getElementById(this.textBoxID).value = this.xmlhttp.responseText;
			}
		}).bind(this)

		// File to request
		var filePath = this.filesDir + document.getElementById(this.textFileSelectID).value

		// Add a unique identifier to bypass caching of the file
		filePath += '?_=' + new Date().getTime()

		// Create request
		this.xmlhttp.open("GET", filePath);

		// send request
		this.xmlhttp.send(null);
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
        var fileName = document.getElementById(this.nameTextBoxID).value;

        // Compare the input to the pattern.
        fileName = fileName.match(namePatt);

        if (fileName == null) {
        	// Display invalid file name message
        	document.getElementById(this.errorBoxID).innerHTML = "That file name is not valid. Only letters, number and spaces are allowed.";
        } else {
        	// Clear invalid file name message
        	document.getElementById(this.errorBoxID).innerHTML = ""
        	valid = true
        }

        return valid
	}).bind(this)
}