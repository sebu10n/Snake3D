<?php
require_once 'login.php';


$userName = $_POST['userName'];
$score = $_POST['score'];
$date = date("Y-m-d H:i:s");

$con = mySQL_connect($db_hostname, $db_username, $db_passwd);

if(!$con){
    die('Fehler bei der Verbindung zum MySQL-Server!');
}

if(!mySQL_select_db('sauronsql1', $con)){
    die('Fehler bei der Auswahl der Datenbank!');
}

function ausgabe(){
    $sql = "SELECT * FROM `snakehighscore` ORDER BY `snakehighscore`.`score` DESC LIMIT 0, 15 ";
    $result = mysql_query($sql)
            or die("SELECT fehlgeschlagen ".mysql_error()." ..");
    
    echo '<tr>
  <td>#</td>
  <td>Name</td>
  <td>Punkte</td>
  <td>Datum</td>
</tr>';
    
    $zeile;
    $platz = 1;
    while($zeile = mysql_fetch_array($result)){
        echo '
<tr>
    <th>' . $platz . '</th>
    <th>' . $zeile['nickname'] . '</th>
    <th>' . $zeile['score'] . '</th>
    <th>' . $zeile['datum'] . '</th>
</tr>
';
        $platz++;
    }
}

ausgabe();

?>