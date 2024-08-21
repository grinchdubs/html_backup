<?php
 $path = 'data.txt';
 if (isset($_POST['field2']) && isset($_POST['code'])) {
    $fh = fopen($path,"a+");
    $string = $_POST['field2'].' - '.$_POST['code'];
    fwrite($fh,$string); // Write information to the file
    fclose($fh); // Close the file
 }
?>

