<?php 
/*
Filename:	GetFileList.php
Project:	AJAX Text Editor
Programmer:	Jorge Ramirez
Description:	
	This file contains the code to scan and echo an array of files within a given directory (./MyFiles/).

Date: 30 November 2015 (Monday)
*/

$dir = './MyFiles/'; // Default directory to search for files
$contents = scandir($dir); // Scan for contents of directory

// Filter the contents of the directory to only include files (no directories)
$files = array();
for ($item=0; $item < count($contents); $item++) { 
	if (is_file($dir.$contents[$item])) {
		array_push($files, $contents[$item]);
	}
}

// Send the array of files from the directory
echo json_encode($files);

?>