<?php
require_once 'login.php';

$userName = $_POST['userName'];
$score = $_POST['score'];
$speed = $_POST['speed'];

$userName = strtr($userName, ",;()'`", "      ");
$score = strtr($score, ",;()'`", "      ");
$speed = strtr($speed, ",;()'`", "      ");

$date = date("Y-m-d H:i:s");

$con = mySQL_connect($db_hostname, $db_username, $db_passwd);

if(!$con){
    die('Fehler bei der Verbindung zum MySQL-Server!');
}

if(!mySQL_select_db('sebix_db1', $con)){
    die('Fehler bei der Auswahl der Datenbank!');
}


function eingabe($inickname, $iscore, $ispeed, $idate){
    if($inickname != '')
    {
        $sql = "INSERT INTO `snakehighscore` (`nickname`, `score`, `speed`, `datum`, `nummer`) 
                                      VALUES ('$inickname', '$iscore', '$ispeed', '$idate', NULL) ;";
        mysql_query($sql)
        or die("INSERT fehlgeschlagen ".mysql_error());
    }
}

function ausgabe(){
/*    $sql = "SELECT * FROM `snakehighscore` ORDER BY `snakehighscore`.`score` DESC LIMIT 0, 15 ";  */
    $sql = "SELECT nickname, MAX(score) AS `score`, COUNT(*) AS `rounds`, datum FROM `snakehighscore` GROUP BY `nickname` ORDER BY MAX(score) DESC LIMIT 15";
    $result = mysql_query($sql)
            or die("SELECT fehlgeschlagen ".mysql_error()." ..");
    
/*    echo '<tr>  <td>#</td>  <td>Name</td>  <td>Punkte</td>  <td>Schwierigkeitsgrad</td>  <td>Datum</td>  </tr>';  */
    echo '<tr>  <td>#</td>  <td>Name</td>  <td>Punkte</td>  <td>Runden</td>  <td>Datum</td>  </tr>';
    
    $zeile = null;
    $platz = 1;
    while($zeile = mysql_fetch_array($result)){
        echo '
<tr>
    <th>' . $platz . '</th>
    <th>' . $zeile['nickname'] . '</th>
    <th>' . $zeile['score'] . '</th>
    <th>' . $zeile['rounds'] . '</th>
    <th>' . $zeile['datum'] . '</th>
</tr>
';
/*  <th>' . $zeile['speed'] . '</th>    */
        $platz++;
    }
}

eingabe($userName, $score, $speed, $date);
ausgabe();

?>