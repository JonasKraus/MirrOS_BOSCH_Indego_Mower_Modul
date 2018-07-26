<?php
/**
 * Created by PhpStorm.
 * User: Jonas
 * Date: 25.07.2018
 * Time: 17:53
 */
if (isset($_POST['data'])) {

    $data = $_POST;

    // Try to open file - must be copied with module to have the correct rights
    $fp = fopen('map.svg', 'w') or die("can't open file");

    $header = "<?xml version=\"1.0\" encoding=\"utf-8\"?>
<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">
";
    fwrite($fp, $header . $data);
    fclose($fp);
    flush();
}