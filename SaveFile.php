<?php 
/*
Filename:	SaveFile.php
Project:	AJAX Text Editor
Programmer:	Jorge Ramirez
Description:	
	This file contains the code that the server uses to create/write to a file using data from a request message

Date: 02 December 2015 (Wednesday)
*/

$dir = './MyFiles/'; // Default directory to save files to
$ext = '.txt'; // Default file extension
$fileName = $_POST['name'];
$fileContent = $_POST['content'];
$response = "";

// Open file
$fileHandle = fopen($dir.$fileName.$ext, "w");
if ($fileHandle) {
	// Write to file
	fwrite($fileHandle,$fileContent);

	// close file
	fclose($fileHandle);

	$response = "success";
} else {
	// return error if file failed to open
	$response = "failure";
}

// Return response
echo $response;

?>