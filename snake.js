
$(document).ready(function jqMain() {
//  Hinweis auf deaktiviertes JS entfernen
$('#JavaScriptHinweis').remove();

var canvas;

function mausPunkt(x, y) {
    this.x = x;
    this.y = y;
}

var letzterMausPunkt = new mausPunkt(0,0);
var istMouseDown = false;

var drehungX = 12, drehungY = 0;
var kameraAbstand = 25.0;

var rotationDegree = 0;
var rotationAxis = 0;

var spielfeldGroesse = {x : 10, y : 10, z : 10};
var schlangenMaxLaenge = spielfeldGroesse.x * spielfeldGroesse.y * spielfeldGroesse.z;
var aktLaengeSchlange = 3;
var headPos, tailPos, futterPos;   //  Zeiger auf Kopf und Hinterteil der Schlange im Array

var schlangenKoordinaten;   //  Schlangen-Array

var bannerSchlangenKoordinaten;   //  Array fuer den Schriftzug
var bannerHead = 0;
var bannerTail = 0;
var bannerLaeuft = true;
var bannerStoppt = false;

var leer = 0, schlange = 1, futter = 2;
var welt;

var laserlaenge;
var laserAn = false;

var transparenzAn = false;
var schattenAn = false;
var gitternetzAn = false;

var cheatAn = false;

var debug = false;

var punkte;
var schrittanzahl = 0;

var darfLenken = true;
var verloren = false;
var pause = false;

var rechts = 0;
var links = 1;
var oben = 2;
var unten = 3;
var vorne = 4;
var hinten = 5;
var richtung;    // Startrichtung

var effekt = false;
var schwierigkeitsgrad = 500;

function koordinate(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
}

welt = new Array();
for (var dimX = 0; dimX < spielfeldGroesse.x; dimX++) {
    welt[dimX] = new Array();
    for (var dimY = 0; dimY < spielfeldGroesse.y; dimY++) {
        welt[dimX][dimY] = new Array();
        // Hier kann man das Array initialisieren:
        for (var dimZ = 0; dimZ < spielfeldGroesse.z; dimZ++) {
            welt[dimX][dimY][dimZ] = leer; //  erstmal ist alles leer
            //  moegliche Werte sind:   0   -   leer
            //                          1   -   Schlange
            //                          2   -   Futter
        }
    }
}

function neuesSpiel()
{
    //  Welt-Array leeren
    for (var dimX = 0; dimX < spielfeldGroesse.x; dimX++) {
        for (var dimY = 0; dimY < spielfeldGroesse.y; dimY++) {
            for (var dimZ = 0; dimZ < spielfeldGroesse.z; dimZ++) {
                welt[dimX][dimY][dimZ] = leer; //  erstmal ist alles leer
            }
        }
    }
    schlangenKoordinaten = new Array(schlangenMaxLaenge);
    drehungX = 12;
    drehungY = 0; 
    drehen();
    richtung = rechts;
    schlangeEinfuegen();
    futterEinfuegenBei(6, 1, 0);
    verloren = false;
    scored = false;
    punkte = 0;
    schrittanzahl = 0;
    $('#schwierigkeitsgrad').show();
    $('schwierigkeitsgradSlider').val(1);
}    

// fuegt die anfaengliche Snake ein, die 3 Felder gross ist
function schlangeEinfuegen() {
    schlangenKoordinaten[2] = new koordinate(2, 0, 0);
    schlangenKoordinaten[1] = new koordinate(1, 0, 0);
    schlangenKoordinaten[0] = new koordinate(0, 0, 0);
    welt[2][0][0] = schlange;  //  Kopf
    welt[1][0][0] = schlange;
    welt[0][0][0] = schlange;  //  Hinterteil

    headPos = 2;
    tailPos = 0;

    aktLaengeSchlange = 3;
}

function bannerBauen()
{
    bannerSchlangenKoordinaten = new Array();
    var i = 0;
    //  _
    bannerSchlangenKoordinaten[i++] = new koordinate( 17, 15, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate( 17, 15, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate( 17, 15, -33);
    bannerSchlangenKoordinaten[i++] = new koordinate( 17, 15, -34);
    bannerSchlangenKoordinaten[i++] = new koordinate( 17, 15, -35);
    for(var j = 18; j < 26; j++)
    {
        bannerSchlangenKoordinaten[i++] = new koordinate( j, 15, -35);
    }
    bannerSchlangenKoordinaten[i++] = new koordinate( 25, 15, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( 25, 14, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( 25, 13, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( 25, 12, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( 25, 11, -35);
    for(var j = 25; j > -17; j--)
    {
        bannerSchlangenKoordinaten[i++] = new koordinate( j, 10, -35);
    }
    for(var j = -16; j < -10; j++)
    {
        bannerSchlangenKoordinaten[i++] = new koordinate( j, 11, -35);
    }
    bannerSchlangenKoordinaten[i++] = new koordinate(-10, 11, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( -9, 11, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( -9, 11, -34);
    bannerSchlangenKoordinaten[i++] = new koordinate( -9, 11, -33);
    bannerSchlangenKoordinaten[i++] = new koordinate( -9, 11, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate( -9, 11, -31);
    //  S
    bannerSchlangenKoordinaten[i++] = new koordinate( -9, 11, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -8, 11, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -7, 11, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -7, 12, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -7, 13, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -8, 13, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -9, 13, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -9, 14, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -9, 15, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -8, 15, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -7, 15, -30);
    //  \
    bannerSchlangenKoordinaten[i++] = new koordinate( -7, 15, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate( -7, 15, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate( -7, 15, -33);
    bannerSchlangenKoordinaten[i++] = new koordinate( -7, 15, -34);
    bannerSchlangenKoordinaten[i++] = new koordinate( -7, 15, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( -7, 14, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( -6, 14, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( -6, 13, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( -6, 12, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( -5, 12, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( -5, 11, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( -5, 11, -34);
    bannerSchlangenKoordinaten[i++] = new koordinate( -5, 11, -33);
    bannerSchlangenKoordinaten[i++] = new koordinate( -5, 11, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate( -5, 11, -31);
    //  N
    bannerSchlangenKoordinaten[i++] = new koordinate( -5, 11, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -5, 12, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -5, 13, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -5, 14, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -5, 15, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -4, 15, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -3, 15, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -3, 14, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -3, 13, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -3, 12, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -3, 11, -30);
    //  _
    bannerSchlangenKoordinaten[i++] = new koordinate( -3, 11, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate( -3, 11, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate( -3, 11, -33);
    bannerSchlangenKoordinaten[i++] = new koordinate( -3, 11, -34);
    bannerSchlangenKoordinaten[i++] = new koordinate( -3, 11, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( -2, 11, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( -1, 11, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( -1, 11, -34);
    bannerSchlangenKoordinaten[i++] = new koordinate( -1, 11, -33);
    bannerSchlangenKoordinaten[i++] = new koordinate( -1, 11, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate( -1, 11, -31);
    //  A
    bannerSchlangenKoordinaten[i++] = new koordinate( -1, 11, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -1, 12, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -1, 13, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -1, 14, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -1, 15, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( -0, 15, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  1, 15, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  1, 14, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  1, 13, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  1, 12, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  1, 11, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  1, 11, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate(  1, 11, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  1, 12, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  1, 13, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  1, 13, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate(  0, 13, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate( -1, 13, -31);
    //  /
    bannerSchlangenKoordinaten[i++] = new koordinate( -1, 13, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate( -1, 13, -33);
    bannerSchlangenKoordinaten[i++] = new koordinate( -1, 13, -34);
    bannerSchlangenKoordinaten[i++] = new koordinate( -1, 13, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate(  0, 13, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate(  0, 14, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate(  1, 14, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate(  2, 14, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate(  2, 15, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate(  3, 15, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate(  3, 15, -34);
    bannerSchlangenKoordinaten[i++] = new koordinate(  3, 15, -33);
    bannerSchlangenKoordinaten[i++] = new koordinate(  3, 15, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  3, 15, -31);
    //  K
    bannerSchlangenKoordinaten[i++] = new koordinate(  3, 15, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  3, 14, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  4, 14, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  4, 13, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  3, 13, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  3, 12, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  3, 11, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  3, 11, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate(  3, 11, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  4, 11, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  5, 11, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  5, 11, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate(  5, 11, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  5, 12, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  5, 12, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate(  5, 12, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  5, 13, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  5, 14, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  5, 14, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate(  5, 14, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  5, 15, -30);
    //  -
    bannerSchlangenKoordinaten[i++] = new koordinate(  5, 15, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate(  5, 15, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  5, 15, -33);
    bannerSchlangenKoordinaten[i++] = new koordinate(  5, 15, -34);
    bannerSchlangenKoordinaten[i++] = new koordinate(  5, 15, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate(  6, 15, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate(  7, 15, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate(  8, 15, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate(  9, 15, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate(  9, 15, -34);
    bannerSchlangenKoordinaten[i++] = new koordinate(  9, 15, -33);
    bannerSchlangenKoordinaten[i++] = new koordinate(  9, 15, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  9, 15, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate(  9, 15, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  8, 15, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  7, 15, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  7, 14, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  7, 13, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  7, 12, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  7, 11, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  8, 11, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  9, 11, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate(  9, 11, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate(  9, 11, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  8, 11, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  7, 11, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  7, 12, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  7, 13, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  7, 13, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate(  8, 13, -31);

    bannerHead = bannerSchlangenKoordinaten.length;
    //  -
    bannerSchlangenKoordinaten[i++] = new koordinate(  8, 13, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate(  8, 13, -33);
    bannerSchlangenKoordinaten[i++] = new koordinate(  8, 13, -34);
    bannerSchlangenKoordinaten[i++] = new koordinate(  8, 13, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate(  9, 13, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( 10, 13, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( 11, 13, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( 12, 13, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( 12, 13, -34);
    bannerSchlangenKoordinaten[i++] = new koordinate( 12, 13, -33);
    bannerSchlangenKoordinaten[i++] = new koordinate( 12, 13, -32);
    //  3
    bannerSchlangenKoordinaten[i++] = new koordinate( 12, 13, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate( 13, 13, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate( 14, 13, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate( 14, 12, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate( 14, 11, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate( 13, 11, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate( 12, 11, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate( 12, 11, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate( 12, 11, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 13, 11, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 14, 11, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 14, 12, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 14, 13, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 14, 14, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 14, 15, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 13, 15, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 12, 15, -30);
    //  -
    bannerSchlangenKoordinaten[i++] = new koordinate( 12, 15, -31);
    bannerSchlangenKoordinaten[i++] = new koordinate( 12, 15, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate( 12, 15, -33);
    bannerSchlangenKoordinaten[i++] = new koordinate( 12, 15, -34);
    bannerSchlangenKoordinaten[i++] = new koordinate( 12, 15, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( 13, 15, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( 14, 15, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( 15, 15, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( 16, 15, -35);
    bannerSchlangenKoordinaten[i++] = new koordinate( 16, 15, -34);
    bannerSchlangenKoordinaten[i++] = new koordinate( 16, 15, -33);
    bannerSchlangenKoordinaten[i++] = new koordinate( 16, 15, -32);
    bannerSchlangenKoordinaten[i++] = new koordinate( 16, 15, -31);
    //  D
    bannerSchlangenKoordinaten[i++] = new koordinate( 16, 15, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 16, 14, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 16, 13, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 16, 12, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 16, 11, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 17, 11, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 17, 12, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 18, 12, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 18, 13, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 18, 14, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 17, 14, -30);
    bannerSchlangenKoordinaten[i++] = new koordinate( 17, 15, -30);
}

bannerBauen();

function futterEinfuegenBei(x, y, z)
{
    welt[x][y][z] = futter;
    futterPos = new koordinate(x, y, z);
}

futterEinfuegenBei(6, 1, 0);

function zufallsGanzZahl(max)
{
    return Math.floor(Math.random()*max);
}

function futterEinfuegen()
{
    while(true)
    {
        //  Irgendein zufaelliger Ort in der Welt wird als Futter registriert.
        var x = zufallsGanzZahl(spielfeldGroesse.x);
        var y = zufallsGanzZahl(spielfeldGroesse.y);
        var z = zufallsGanzZahl(spielfeldGroesse.z);
        futterPos = new koordinate(x, y, z);
        if(welt[futterPos.x][futterPos.y][futterPos.z] !== schlange)
        {
            welt[futterPos.x][futterPos.y][futterPos.z] = futter;
            break;
        }
    }
}

function stop(){
    pause = !pause;
}      

// Der Benutzer wird nach 50 Schritten und 
// noch keinen gefressenen Wuerfel gefragt, ob er Hilfe benoetigt

var hilfeCheck;
function hilfe()
{
    if(hilfeCheck != false && schrittanzahl == 50 && aktLaengeSchlange == 3) 
    {
        hilfeCheck = confirm("Brauchst Du Hilfe bei der Steuerung?");
        if (hilfeCheck == true) 
        {
            $('#btStop').click();
            $('#btSteuerung').click();
            hilfeCheck = false;
        }
        else 
            hilfeCheck = false;
    }
}

function level(level) {

    if (level == 1)  return schwierigkeitsgrad = 500;
    if (level == 2)  return schwierigkeitsgrad = 370;
    if (level == 3)  return schwierigkeitsgrad = 270;
    if (level == 4)  return schwierigkeitsgrad = 200;
    if (level == 5)  return schwierigkeitsgrad = 100;

    // fuer Auswahl Schwierigkeit ueber Dropdown
    // schwierigkeitsgrad = level;      
}

function score() {

    var laenge = aktLaengeSchlange - 3;

    punkte = laenge * $('#schwierigkeitsgradSlider').val();

//          fuer Auswahl Schwierigkeit ueber Dropdown
//            if (schwierigkeitsgrad == 500)  punkte = laenge * 1;
//            if (schwierigkeitsgrad == 400)  punkte = laenge * 2;
//            if (schwierigkeitsgrad == 300)  punkte = laenge * 3;
//            if (schwierigkeitsgrad == 200)  punkte = laenge * 4;
//            if (schwierigkeitsgrad == 100)  punkte = laenge * 5;
}

var nickname = '';

function verlieren(){
    verloren = true;
    $('#schwierigkeitsgrad').show();
    window.setTimeout(function(){highscoreName();}, 100);
}

var scored = false;

function highscoreName(){
    if(verloren && !scored && !cheatAn)
    {
        var speed = $('#schwierigkeitsgradSlider').val();
        var zeitPunkt = '' + new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes();
        if(nickname == null)
            nickname = '';
        nickname = prompt('Du hast ' + punkte + ' Punkte erreicht! Gib deinen Namen fuer den Highscore ein:', nickname);
        if(nickname == null)
            nickname = '';
        if(nickname != '')
        {
            $('#highscore').append('<tr>' +
                                       '<th></th>' +
                                       '<th>' + nickname + '</th>' +
                                       '<th>' + punkte + '</th>' +
                                       '<th>' + speed + '</th>' +
                                       '<th>' + zeitPunkt + '</th>' +
                                   '</tr>');
        }
        //alert(window.location.hostname);
        if(window.location.hostname == 'sebix.de' || window.location.hostname.trim().toLowerCase().search('sebix.de') != -1)
        {
            $( "#highscore" ).load( "postAndGetHighscore.php",
                                    { userName: nickname, score: punkte, speed: speed },
                                    function( response, status, xhr ) 
                                    {
                                        if ( status == "error" ) {
                                            var msg = "Sorry but there was an error: ";
                                            alert( msg + xhr.status + " " + xhr.statusText );
                                        }
                                    }
            );
        }
        else
        {
            $('#highscoreOffline').show();
        }
        $('#btStop').click();
        $('#divHighscore').show();
        scored = true;
    }
    else
    {
        if(window.location.hostname == 'sebix.de' || window.location.hostname.trim().toLowerCase().search('sebix.de') != -1)
        {
            $( "#highscore" ).load( "getHighscore.php",
                                    function( response, status, xhr ) 
                                    {
                                        if ( status == "error" ) {
                                            var msg = "Sorry but there was an error: ";
                                            alert( msg + xhr.status + " " + xhr.statusText );
                                        }
                                    }
            );
        }
        else
        {
            $('#highscoreOffline').show();
        }
    }
}

function gehen(){
    if(!pause)
    {
        if(cheatAn)
            futterEinfuegen();

        // Schlange versetzen
        // wenn Richtung rechts, dann 1, sonst wenn links -1, sonst 0
        var moveX = (richtung === 0) ? 1 : (richtung === 1) ? -1 : 0;     // Bewegung auf der X-Achse nach rechts = 0 (1) oder links = 1 (-1)
        var moveY = (richtung === 2) ? 1 : (richtung === 3) ? -1 : 0;     // Bewegung auf der Y-Achse nach oben = 2 (1) oder unten = 3 (-1)
        var moveZ = (richtung === 4) ? 1 : (richtung === 5) ? -1 : 0;     // Bewegung auf der Z-Achse nach vorne = 4 (1) oder hinten = 5 (-1)

        //  Umsetzung des Kopfzeigers auf die neue Position
        var headPosAlt = headPos;
        //headPos++;
        headPos = (headPos + 1) % schlangenMaxLaenge;
        //  Erzeugung einer neuen Koordinate an der neuen Kopfposition
        schlangenKoordinaten[headPos] = 
            new koordinate ((schlangenKoordinaten[headPosAlt].x + moveX + spielfeldGroesse.x) % spielfeldGroesse.x,
                            (schlangenKoordinaten[headPosAlt].y + moveY + spielfeldGroesse.y) % spielfeldGroesse.y,
                            (schlangenKoordinaten[headPosAlt].z + moveZ + spielfeldGroesse.z) % spielfeldGroesse.z);

        // Schlange wurde versetzt, jetzt wird gegessen!
        if(!fressen())
        {
            //  Ohne Folgendes wird die Schlange mit jedem Schritt laenger
            //  Alte Tailkoordinate wird auf leer gesetzt
            welt[schlangenKoordinaten[tailPos].x][schlangenKoordinaten[tailPos].y][schlangenKoordinaten[tailPos].z] = leer;
            //  Umsetzung des Hinterteilzeigers auf die neue Position
            //tailPos++;
            tailPos = (tailPos + 1) % schlangenMaxLaenge;
        }

        //  Neue Kopfkoordinate wird auf schlange gesetzt, wenn sie nicht schon schlange ist
        if(welt[schlangenKoordinaten[headPos].x][schlangenKoordinaten[headPos].y][schlangenKoordinaten[headPos].z] === schlange) {
            verlieren();
        }

        welt[schlangenKoordinaten[headPos].x][schlangenKoordinaten[headPos].y][schlangenKoordinaten[headPos].z] = schlange;
        schrittanzahl++;   
    }
}

function fressen() {
    //if (welt[futterPos.x][futterPos.y][futterPos.z] === schlange)
    if (welt[schlangenKoordinaten[headPos].x][schlangenKoordinaten[headPos].y][schlangenKoordinaten[headPos].z] === futter)
    {
        if(!debug)
            $('#schwierigkeitsgrad').hide();
        bannerLaeuft = false;
        futterEinfuegen();
        aktLaengeSchlange++;
        effektLos();
        return true;
    }
    else return false;
}


// ANFANG Steuerung
// Java Key Code: http://www.mediaevent.de/javascript/Extras-Javascript-Keycodes.html

function keyDown(event) 
{
    switch (event.keyCode) 
    {
        case 27: // Escape
            $('#btStop').click();
            break;

        case 81: // Q
            $('#hudMaske').click();
            break;

        case 90: // Z
            $('#cbLaser').click();
            break;

        case 84: // T
            $('#cbTransparenz').click();
            break;

        case 72: // H
            $('#cbSchatten').click();
            break;

        case 71: // G
            $('#cbGitternetz').click();
            break;

        case 70: // F
            farbIndex = (farbIndex + 1) % 4;
            switch(farbIndex)
            {
                case 0:
                    $('#farbauswahl').val('Hochschule');
                    break;
                case 1:
                    $('#farbauswahl').val('Simpsons');
                    break;
                case 2:
                    $('#farbauswahl').val('Schlumpfhausen');
                    break;
                case 3:
                    $('#farbauswahl').val('Tron');
                    break;
            }
            $('#farbauswahl').change();
            break;
    }

    if(darfLenken && !pause)
    {
        switch (event.keyCode) 
        {
            case 39: // rechts
            case 68: // D
//                    alert('rechts');
                if(richtung !== links && richtung !== rechts)
                {
                    richtung = rechts;
                    darfLenken = false;
                }
                break;

            case 37: // links
            case 65: // A
//                    alert('links');
                if(richtung !== rechts && richtung !== links)
                {
                    richtung = links;
                    darfLenken = false;
                }
                break;

            case 38: // oben 
            case 87: // W 
//                    alert('oben');
                if(richtung !== unten && richtung !== oben)
                {
                    richtung = oben;
                    darfLenken = false;
                }
                break;   

            case 40: // unten 
            case 83: // S 
//                    alert('unten');
                if(richtung !== oben && richtung !== unten)
                { 
                    richtung = unten;
                    darfLenken = false;
                }
                break; 
            //  Steuerung nach hinten und vorne, nicht mehr notwenig
//                    case 34: // Bild Ab
//                    case 88: // X
//    //                    alert('vorne');
//                        if(richtung !== hinten && richtung !== vorne)
//                        { 
//                            richtung = vorne;
//                            darfLenken = false;
//                        }
//                        break;      
//    
//                    case 33: // Bild Auf
//                    case 69: // E
//    //                    alert('hinten');
//                        if(richtung !== vorne && richtung !== hinten)
//                        { 
//                            richtung = hinten;
//                            darfLenken = false;
//                        }
//                        break;   
        }
    }

    switch (event.keyCode) 
       {
        case 49: //1 in Leiste
        case 97: //1 Numpad
            drehungX = 0;
            drehungY = 0;
            break;

        case 50: //2 in Leiste
        case 98: //2 Numpad
            drehungX = 00;
            drehungY = 90;
            break;

        case 51: //3 in Leiste
        case 99: //3 Numpad
            drehungX = 00;
            drehungY = 180;
            break;

        case 52: //4 in Leiste
        case 100://4 Numpad
            drehungX = 00;
            drehungY = 270;
            break;

        case 53: //5 in Leiste
        case 101://5 Numpad
            drehungX = 90;
            drehungY = 00;
            break;

        case 54: //6 in Leiste
        case 102: //6 Numpad
            drehungX = 270;
            drehungY = 00;
            break;
   }
};


// Die Taste wird gerade gedrueckt 
document.addEventListener('keydown', keyDown, false);


// ENDE Steuerung 


var gl;

function initGL(canvas) {
    try {
        gl = canvas.getContext('experimental-webgl');
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }

    // Wenn wir keinen WebGl Kontext haben

    if (!gl) {
        alert('WebGL konnte nicht initialisiert werden.');
    }
}

function getShader(gl, id) {

    var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = '';
        var currentChild  = shaderScript.firstChild;
        while (currentChild ) {
            if (currentChild.nodeType == 3) {
                str += currentChild.textContent;
            }
            currentChild  = currentChild.nextSibling;
        }

    var shader;
        if (shaderScript.type == 'x-shader/x-fragment') {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == 'x-shader/x-vertex') {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;    // Unbekannter Shadertyp
        }

    gl.shaderSource(shader, str);

        // Kompiliere das Shaderprogramm
        gl.compileShader(shader);
        // Ueberpruefe, ob die Kompilierung erfolgreich war
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('Es ist ein Fehler beim Kompilieren der Shader aufgetaucht: ' + gl.getShaderInfoLog(shader));
            return null;
        }

    return shader;
}

var shaderProgram;

function initShaders() {
    var fragmentShader = getShader(gl, 'shader-fs');
    var vertexShader = getShader(gl, 'shader-vs');

    // Erzeuge Shader

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // Wenn die das Aufrufen der Shader fehlschlaegt,
    // gib eine Fehlermeldung aus:

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Initialisierung des Shaderprogramms nicht moeglich.');
    }

    gl.useProgram(shaderProgram);


    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    // Farbattribut
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, 'aVertexColor');      
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
}

var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw 'Invalid popMatrix!';
    }
    mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

var faceVertexPositionBuffer;                               
var faceVertexColorBuffer;               //Farbpuffer fuer die Levelwuerfelflaechen
var faceDeadVertexColorBuffer;

var laserVertexPositionBuffer;           //Puffer fuer den Laser
var laserVertexIndexBuffer;
var laserVertexColorBuffer;              //Farbpuffer fuer den Laser

var cubeVertexPositionBuffer;                               
var cubeVertexIndexBuffer;
var cubeVertexColorBuffer;               //Farbpuffer fuer den Levelwuerfel

var snakeVertexColorBuffer;              //Farbpuffer fuer die Schlange
var snakeDeadVertexColorBuffer;          // '' tote ''
var headVertexColorBuffer;               //Farbpuffer fuer den Kopf
var tailVertexColorBuffer;               //Farbpuffer fuer den Schwanz

var futterVertexColorBuffer;             //Farbpuffer fuer das Futter
var futterDeadVertexColorBuffer;         //Farbpuffer fuer das Futter

var banner1VertexColorBuffer;
var banner2VertexColorBuffer;

var shadowVertexColorBuffer;             //Farbpuffer fuer den Schatten

function initBuffers() {
    initVertexBuffers();
    initColorBuffers();
}

function initVertexBuffers()
{
//  Quadrat-Flaeche
    faceVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, faceVertexPositionBuffer);
    var vertices = [
         0.5,  0.5, 0.0,
        -0.5,  0.5, 0.0,
         0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    faceVertexPositionBuffer.itemSize = 3;
    faceVertexPositionBuffer.numItems = 4;

//  Laser - Objekt
    laserVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, laserVertexPositionBuffer);
    vertices = [
        // Front face
        -0.5, -0.5, 0.0,
         0.5, -0.5, 0.0,
         0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,

        // Back face
        -0.5, -0.5, 0.0,
        -0.5, 0.5, 0.0,
         0.5, 0.5, 0.0,
         0.5, -0.5, 0.0,

        // Top face
        -0.5, 0.0, -0.5,
        -0.5, 0.0, 0.5,
         0.5, 0.0, 0.5,
         0.5, 0.0, -0.5,

        // Bottom face
        -0.5, 0.0, -0.5,
         0.5, 0.0, -0.5,
         0.5, 0.0, 0.5,
        -0.5, 0.0, 0.5
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    laserVertexPositionBuffer.itemSize = 3;
    laserVertexPositionBuffer.numItems = 16;

    laserVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, laserVertexIndexBuffer);

    // Dieses Array definiert jede Flaeche als zwei Dreiecke ueber die Indizes
    // im Vertex-Array, um die Position jedes Dreiecks festzulegen.
    var laserVertexIndices = [
        0, 1, 2,        0, 2, 3,        // Front face
        4, 5, 6,        4, 6, 7,        // Back face
        8, 9, 10,       8, 10, 11,      // Top face
        12, 13, 14,     12, 14, 15      // Bottom face
    ];

    // Sende nun das Element-Array zum GL
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(laserVertexIndices), gl.STATIC_DRAW);
    laserVertexIndexBuffer.itemSize = 1;
    laserVertexIndexBuffer.numItems = 24;

//  Wuerfel
    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    vertices = [
        // Front face
        -0.5, -0.5, 0.5,
         0.5, -0.5, 0.5,
         0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,

        // Back face
        -0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,
         0.5, 0.5, -0.5,
         0.5, -0.5, -0.5,

        // Top face
        -0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
         0.5, 0.5, 0.5,
         0.5, 0.5, -0.5,

        // Bottom face
        -0.5, -0.5, -0.5,
         0.5, -0.5, -0.5,
         0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,

        // Right face
         0.5, -0.5, -0.5,
         0.5, 0.5, -0.5,
         0.5, 0.5, 0.5,
         0.5, -0.5, 0.5,

        // Left face
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = 24;

    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

    // Dieses Array definiert jede Flaeche als zwei Dreiecke ueber die Indizes
    // im Vertex-Array, um die Position jedes Dreiecks festzulegen.
    var cubeVertexIndices = [
        0, 1, 2,        0, 2, 3,        // Front face
        4, 5, 6,        4, 6, 7,        // Back face
        8, 9, 10,       8, 10, 11,      // Top face
        12, 13, 14,     12, 14, 15,     // Bottom face
        16, 17, 18,     16, 18, 19,     // Right face
        20, 21, 22,     20, 22, 23      // Left face
    ];

    // Sende nun das Element-Array zum GL
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;
}

function setColor(colorBuffer, r, g, b, alpha, numItems){ 

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer); 

    var colors;
    if(numItems === 4)
    {
        colors = [
            [r, g, b, 1.0]    // einzige Flaeche
        ];
    }
    else if(numItems === 16)
    {
        colors = [ // alpha: 1.0
            [r, g, b, alpha-0.2],   // Front face             // Rot, Gruen, Blau, Deckkraft
            [r, g, b, alpha-0.15],  // Back face
            [r, g, b, alpha-0.25],  // Top face
            [r, g, b, alpha]    // Bottom face
        ];
    }
    else if(numItems === 24)
    {
        colors = [ // alpha: 1.0
            [r, g, b, alpha-0.2],   // Front face             // Rot, Gruen, Blau, Deckkraft
            [r, g, b, alpha-0.15],  // Back face
            [r, g, b, alpha-0.25],  // Top face
            [r, g, b, alpha],   // Bottom face
            [r, g, b, alpha-0.05],  // Right face
            [r, g, b, alpha-0.1]    // Left face
        ];
    }

    var unpackedColors = [];
    for (var i in colors) {
        var color = colors[i];
        for (var j = 0; j < 4; j++) {
            unpackedColors = unpackedColors.concat(color);
        }
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
    colorBuffer.itemSize = 4;
    colorBuffer.numItems = numItems;
}

function initColorBuffers()
{
    faceVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, faceVertexColorBuffer);            
    setColor(faceVertexColorBuffer, 0.0, 0.29, 0.5, 1.0, 4);

    faceDeadVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, faceDeadVertexColorBuffer);  
    setColor(faceDeadVertexColorBuffer, 0.9, 0.2, 0.0, 1.0, 4);

    laserVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, laserVertexColorBuffer);  
    setColor(laserVertexColorBuffer, 1.0, 0.0, 0.0, 1.0, 16);    

    cubeVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);  
    setColor(cubeVertexColorBuffer, 0.0, 0.0, 0.0, 2.0, 24);

    snakeVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, snakeVertexColorBuffer);  
    setColor(snakeVertexColorBuffer, 0.4, 0.8, 0.2, 1.0, 24);

    snakeDeadVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, snakeDeadVertexColorBuffer);  
    setColor(snakeDeadVertexColorBuffer, 0.0, 0.0, 0.0, 1.0, 24);

    headVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, headVertexColorBuffer);  
    setColor(headVertexColorBuffer, 0.5, 1, 0.25, 1.0, 24);

    tailVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tailVertexColorBuffer);  
    setColor(tailVertexColorBuffer, 0.4, 0.9, 0.2, 1.0, 24);

    futterVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, futterVertexColorBuffer);  
    setColor(futterVertexColorBuffer, 0.9, 0.0, 0.0, 1.0, 24);

    futterDeadVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, futterDeadVertexColorBuffer);  
    setColor(futterDeadVertexColorBuffer, 0.0, 0.0, 0.0, 0.0, 24);

    banner1VertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, banner1VertexColorBuffer);  
    setColor(banner1VertexColorBuffer, 0.4, 0.8, 0.2, 1.0, 24);

    banner2VertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, banner2VertexColorBuffer);  
    setColor(banner2VertexColorBuffer, 0.5, 1, 0.25, 0.75, 24);

    shadowVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, shadowVertexColorBuffer);  
    setColor(shadowVertexColorBuffer, 0.0, 0.13, 0.25, 2.0, 24);
}


////////////////////////////////////////////////////////////////////////
//                          drawScene()                               //
////////////////////////////////////////////////////////////////////////

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //  Aktivieren von Backface-Culling (von http://www.html5rocks.com/en/tutorials/webgl/webgl_orthographic_3d/)
    gl.enable(gl.CULL_FACE);

    // Blending wird disabled, gilt sonst fuer alles
    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);

    // Blickwinkel, Hoehen-/Breitenverhaeltnis, Objekte wird zwischen 0.1 und 100 Einheiten gerendert 
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);


    // Gesamtbild 

    mat4.translate(mvMatrix, [0.0, 0.0, -kameraAbstand]);          // Verschiebung des Gesamtbildes (x, y, z) Achse

    // Coole Perspektive: (Rotation des Gesamtbildes um die x-Achse) 
    //mat4.rotate(mvMatrix, degToRad(10), [1, 0, 0]);    

    // Drehung des Wuerfels um die X-Achse 
    mat4.rotate(mvMatrix, degToRad(drehungX),  [1, 0, 0]);
    // Drehung des Wuerfels um die Y-Achse 
    mat4.rotate(mvMatrix, degToRad(drehungY),  [0, 1, 0]);

    ////////  FLAECHEN
    // Puffer des Quadrats wird mit dem Kontext verbunden 
    gl.bindBuffer(gl.ARRAY_BUFFER, faceVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, faceVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Farb Puffer 
    if(!verloren)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, faceVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, faceVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }
    else
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, faceDeadVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, faceDeadVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }

    mvPushMatrix();
        mat4.translate(mvMatrix, [0, 0, -spielfeldGroesse.z/2-0.1]);
        mat4.scale(mvMatrix, [spielfeldGroesse.x+0.2, spielfeldGroesse.y+0.2, 1]);
        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
    mvPopMatrix();

    mvPushMatrix();
        mat4.rotate(mvMatrix, degToRad(90),  [0, 1, 0]);
        mvPushMatrix();
            mat4.translate(mvMatrix, [0, 0, -spielfeldGroesse.z/2-0.1]);
            mat4.scale(mvMatrix, [spielfeldGroesse.x+0.2, spielfeldGroesse.y+0.2, 1]);
            setMatrixUniforms();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
        mvPopMatrix();
    mvPopMatrix();

    mvPushMatrix();
        mat4.rotate(mvMatrix, degToRad(90),  [1, 0, 0]);
        mvPushMatrix();
            mat4.translate(mvMatrix, [0, 0, -spielfeldGroesse.z/2-0.1]);
            mat4.scale(mvMatrix, [spielfeldGroesse.x+0.2, spielfeldGroesse.y+0.2, 1]);
            setMatrixUniforms();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
        mvPopMatrix();
    mvPopMatrix();

    mvPushMatrix();
        mat4.rotate(mvMatrix, degToRad(-90),  [0, 1, 0]);
        mvPushMatrix();
            mat4.translate(mvMatrix, [0, 0, -spielfeldGroesse.z/2-0.1]);
            mat4.scale(mvMatrix, [spielfeldGroesse.x+0.2, spielfeldGroesse.y+0.2, 1]);
            setMatrixUniforms();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
        mvPopMatrix();
    mvPopMatrix();

    mvPushMatrix();
        mat4.rotate(mvMatrix, degToRad(-90),  [1, 0, 0]);
        mvPushMatrix();
            mat4.translate(mvMatrix, [0, 0, -spielfeldGroesse.z/2-0.1]);
            mat4.scale(mvMatrix, [spielfeldGroesse.x+0.2, spielfeldGroesse.y+0.2, 1]);
            setMatrixUniforms();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
        mvPopMatrix();
    mvPopMatrix();

    mvPushMatrix();
        mat4.rotate(mvMatrix, degToRad(180),  [1, 0, 0]);
        mvPushMatrix();
            mat4.translate(mvMatrix, [0, 0, -spielfeldGroesse.z/2-0.1]);
            mat4.scale(mvMatrix, [spielfeldGroesse.x+0.2, spielfeldGroesse.y+0.2, 1]);
            setMatrixUniforms();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
        mvPopMatrix();
    mvPopMatrix();


    /// HILFSLINIEN

    if(!verloren && gitternetzAn) 
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);


        var di = 0.05;
        for(var h = -4; h <= 4; h++)
        {

        //rechts vertikal
        mvPushMatrix();
            mat4.rotate(mvMatrix, degToRad(-90),  [0, 1, 0]);
            mvPushMatrix();
            mat4.translate(mvMatrix, [h, 0, -spielfeldGroesse.z/2-0.09]);
                mat4.scale(mvMatrix, [di, spielfeldGroesse.y+0.2, di]);
                setMatrixUniforms();
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
            mvPopMatrix();
        mvPopMatrix();

        //rechts horizontal
        mvPushMatrix();
            mat4.rotate(mvMatrix, degToRad(-90),  [0, 1, 0]);
            mvPushMatrix();
            mat4.translate(mvMatrix, [0, h, -spielfeldGroesse.z/2-0.09]);
                mat4.scale(mvMatrix, [spielfeldGroesse.x+0.2, di, di]);
                setMatrixUniforms();
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
            mvPopMatrix();   
        mvPopMatrix(); 

        //links vertikal
        mvPushMatrix();
            mat4.rotate(mvMatrix, degToRad(90),  [0, 1, 0]);
            mvPushMatrix();
            mat4.translate(mvMatrix, [h, 0, -spielfeldGroesse.z/2-0.09]);
                mat4.scale(mvMatrix, [di, spielfeldGroesse.y+0.2, di]);
                setMatrixUniforms();
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
            mvPopMatrix();
        mvPopMatrix();

        //links horizontal
        mvPushMatrix();
            mat4.rotate(mvMatrix, degToRad(90),  [0, 1, 0]);
            mvPushMatrix();
            mat4.translate(mvMatrix, [0, h, -spielfeldGroesse.z/2-0.09]);
                mat4.scale(mvMatrix, [spielfeldGroesse.x+0.2, di, di]);
                setMatrixUniforms();
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
            mvPopMatrix();   
        mvPopMatrix(); 

        //hinten vertikal
        mvPushMatrix();
            mat4.rotate(mvMatrix, degToRad(0),  [0, 1, 0]);
            mvPushMatrix();
            mat4.translate(mvMatrix, [h, 0, -spielfeldGroesse.z/2-0.09]);
                mat4.scale(mvMatrix, [di, spielfeldGroesse.y+0.2, di]);
                setMatrixUniforms();
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
            mvPopMatrix();
        mvPopMatrix();

        //hinten horizontal
        mvPushMatrix();
            mat4.rotate(mvMatrix, degToRad(0),  [0, 1, 0]);
            mvPushMatrix();
            mat4.translate(mvMatrix, [0, h, -spielfeldGroesse.z/2-0.09]);
                mat4.scale(mvMatrix, [spielfeldGroesse.x+0.2, di, di]);
                setMatrixUniforms();
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
            mvPopMatrix();   
        mvPopMatrix(); 

        //vorne vertikal
        mvPushMatrix();
            mat4.rotate(mvMatrix, degToRad(180),  [0, 1, 0]);
            mvPushMatrix();
            mat4.translate(mvMatrix, [h, 0, -spielfeldGroesse.z/2-0.09]);
                mat4.scale(mvMatrix, [di, spielfeldGroesse.y+0.2, di]);
                setMatrixUniforms();
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
            mvPopMatrix();
        mvPopMatrix();

        //vorne horizontal
        mvPushMatrix();
            mat4.rotate(mvMatrix, degToRad(180),  [0, 1, 0]);
            mvPushMatrix();
            mat4.translate(mvMatrix, [0, h, -spielfeldGroesse.z/2-0.09]);
                mat4.scale(mvMatrix, [spielfeldGroesse.x+0.2, di, di]);
                setMatrixUniforms();
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
            mvPopMatrix();   
        mvPopMatrix(); 

        //oben vertikal
        mvPushMatrix();
            mat4.rotate(mvMatrix, degToRad(90),  [1, 0, 0]);
            mvPushMatrix();
            mat4.translate(mvMatrix, [h, 0, -spielfeldGroesse.z/2-0.09]);
                mat4.scale(mvMatrix, [di, spielfeldGroesse.y+0.2, di]);
                setMatrixUniforms();
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
            mvPopMatrix();
        mvPopMatrix();

        //oben horizontal
        mvPushMatrix();
            mat4.rotate(mvMatrix, degToRad(90),  [1, 0, 0]);
            mvPushMatrix();
            mat4.translate(mvMatrix, [0, h, -spielfeldGroesse.z/2-0.09]);
                mat4.scale(mvMatrix, [spielfeldGroesse.x+0.2, di, di]);
                setMatrixUniforms();
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
            mvPopMatrix();   
        mvPopMatrix(); 

        //unten vertikal
        mvPushMatrix();
            mat4.rotate(mvMatrix, degToRad(-90),  [1, 0, 0]);
            mvPushMatrix();
            mat4.translate(mvMatrix, [h, 0, -spielfeldGroesse.z/2-0.09]);
                mat4.scale(mvMatrix, [di, spielfeldGroesse.y+0.2, di]);
                setMatrixUniforms();
               gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
            mvPopMatrix();
        mvPopMatrix();

        //unten horizontal
        mvPushMatrix();
            mat4.rotate(mvMatrix, degToRad(-90),  [1, 0, 0]);
            mvPushMatrix();
            mat4.translate(mvMatrix, [0, h, -spielfeldGroesse.z/2-0.09]);
                mat4.scale(mvMatrix, [spielfeldGroesse.x+0.2, di, di]);
                setMatrixUniforms();
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, faceVertexPositionBuffer.numItems);
            mvPopMatrix();   
        mvPopMatrix(); 

        }
    }


    ////////  WUERFEL

    // Puffer des Wuerfels wird mit dem Kontext verbunden 
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Farb Puffer 
    if(!verloren)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }
    else
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, snakeDeadVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, snakeDeadVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }

    // Element Puffer 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

    // Gesamten Rest in den Spielfeldursprung verschieben 
    mvPushMatrix();
        mat4.translate(mvMatrix, [-spielfeldGroesse.x / 2, -spielfeldGroesse.y / 2, -spielfeldGroesse.z / 2]);

        //  Spielfeld-Rahmen (ist schwarz)

        // Linie rechts vorne
        mvPushMatrix();
            mat4.translate(mvMatrix, [spielfeldGroesse.x+0.1, spielfeldGroesse.y / 2, spielfeldGroesse.z+0.1]);
            mat4.scale(mvMatrix, [0.1, spielfeldGroesse.y+0.3, 0.1]);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        mvPopMatrix();
        // Linie rechts hinten
        mvPushMatrix();
            mat4.translate(mvMatrix, [spielfeldGroesse.x+0.1, spielfeldGroesse.y / 2 , -0.1]);
            mat4.scale(mvMatrix, [0.1, spielfeldGroesse.y+0.3, 0.1]);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        mvPopMatrix();
        // Linie links vorne
        mvPushMatrix();
            mat4.translate(mvMatrix, [-0.1, spielfeldGroesse.y / 2 , spielfeldGroesse.z+0.1]);
            mat4.scale(mvMatrix, [0.1, spielfeldGroesse.y+0.3, 0.1]);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        mvPopMatrix();
        // Linie links hinten
        mvPushMatrix();
            mat4.translate(mvMatrix, [-0.1, spielfeldGroesse.y / 2 , -0.1]);
            mat4.scale(mvMatrix, [0.1, spielfeldGroesse.y+0.3, 0.1]);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        mvPopMatrix();
        // Linie oben vorne
        mvPushMatrix();
            mat4.translate(mvMatrix, [spielfeldGroesse.x / 2, spielfeldGroesse.y+0.1, spielfeldGroesse.z+0.1]);
            mat4.scale(mvMatrix, [spielfeldGroesse.x+0.3, 0.1, 0.1]);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        mvPopMatrix();
        // Linie oben hinten
        mvPushMatrix();
            mat4.translate(mvMatrix, [spielfeldGroesse.x / 2, spielfeldGroesse.y+0.1, -0.1]);
            mat4.scale(mvMatrix, [spielfeldGroesse.x+0.3, 0.1, 0.1]);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        mvPopMatrix();
        // Linie unten vorne
        mvPushMatrix();
            mat4.translate(mvMatrix, [spielfeldGroesse.x / 2, -0.1, spielfeldGroesse.z+0.1]);
            mat4.scale(mvMatrix, [spielfeldGroesse.x+0.3, 0.1, 0.1]);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        mvPopMatrix();
        // Linie unten hinten
        mvPushMatrix();
            mat4.translate(mvMatrix, [spielfeldGroesse.x / 2, -0.1, -0.1]);
            mat4.scale(mvMatrix, [spielfeldGroesse.x+0.3, 0.1, 0.1]);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        mvPopMatrix();
        // Linie links oben
        mvPushMatrix();
            mat4.translate(mvMatrix, [-0.1, spielfeldGroesse.y+0.1, spielfeldGroesse.z / 2]);
            mat4.scale(mvMatrix, [0.1, 0.1, spielfeldGroesse.z+0.3]);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        mvPopMatrix();
        // Linie rechts oben
        mvPushMatrix();
            mat4.translate(mvMatrix, [spielfeldGroesse.x+0.1, spielfeldGroesse.y+0.1, spielfeldGroesse.z / 2]);
            mat4.scale(mvMatrix, [0.1, 0.1, spielfeldGroesse.z+0.3]);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        mvPopMatrix();
        // Linie rechts unten
        mvPushMatrix();
            mat4.translate(mvMatrix, [spielfeldGroesse.x+0.1, -0.1, spielfeldGroesse.z / 2]);
            mat4.scale(mvMatrix, [0.1, 0.1, spielfeldGroesse.z+0.3]);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        mvPopMatrix();
        // Linie links unten
        mvPushMatrix();
            mat4.translate(mvMatrix, [-0.1, -0.1, spielfeldGroesse.z / 2]);
            mat4.scale(mvMatrix, [0.1, 0.1, spielfeldGroesse.z+0.3]);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        mvPopMatrix();

        mvPushMatrix();
        mat4.translate(mvMatrix, [0.5, 0.5, 0.5]);

        ////////////////////////  SCHRIFTZUG  //////////////////////////

            if(!bannerStoppt)
            {
                // Nicht transparent
                gl.disable(gl.BLEND);
                gl.enable(gl.DEPTH_TEST);

                var skalierung = 1;
                for (var i = bannerTail; i !== bannerHead; i = (i + 1) % bannerSchlangenKoordinaten.length)
                {
                    var dimX = bannerSchlangenKoordinaten[i].x;
                    var dimY = bannerSchlangenKoordinaten[i].y;
                    var dimZ = bannerSchlangenKoordinaten[i].z;

                    if(dimZ === -30 || dimZ === -31)
                    {
                        // Farb Puffer fuer Schlangenkoerper
                        gl.bindBuffer(gl.ARRAY_BUFFER, banner1VertexColorBuffer);
                        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, banner1VertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
                    }
                    else
                    {
                        // Farb Puffer fuer Schlangenkoerper
                        gl.bindBuffer(gl.ARRAY_BUFFER, banner2VertexColorBuffer);
                        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, banner2VertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
                    }

                    mvPushMatrix();
                        mat4.translate(mvMatrix, [dimX, dimY, dimZ]);  
                        mat4.scale(mvMatrix, [skalierung, skalierung, skalierung]);
                        setMatrixUniforms();
                        gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
                    mvPopMatrix();
                    skalierung += 1/(bannerSchlangenKoordinaten.length*5);
                }
            }


        //////////////////////////  FUTTER   ///////////////////////////

            for (var dimX = 0; dimX < spielfeldGroesse.x; dimX++)
            {
                for (var dimY = 0; dimY < spielfeldGroesse.y; dimY++)
                {
                    for (var dimZ = 0; dimZ < spielfeldGroesse.z; dimZ++)
                    {
                        if(welt[dimX][dimY][dimZ] === futter)
                        {
                            //  Erst FUTTERSCHATTEN
                            if(!verloren && schattenAn)
                            {
                                // Blending fuer Schatten deaktiviert, weil schwarz und sonst unsichtbar
                                gl.disable(gl.BLEND);
                                gl.enable(gl.DEPTH_TEST);

                                // Farb Puffer fuer Schlangenschatten == schwarz == Kantenfarbe
                                gl.bindBuffer(gl.ARRAY_BUFFER, shadowVertexColorBuffer);
                                gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, shadowVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

                                var skalierungX = 1;
                                var skalierungY = 1;
                                var skalierungZ = 1;

                                var dimXs = dimX;
                                var dimYs = dimY;
                                var dimZs = dimZ;
                                switch (unten)
                                {
                                    case 0: //  urspr. rechte Seite ist Boden
                                        dimXs = 9.6;
                                        skalierungX = 0.1;
                                        break;
                                    case 1: //  urspr. linke Seite ist Boden
                                        dimXs = -0.6;
                                        skalierungX = 0.1;
                                        break;
                                    case 3: //  urspr. untere Seite ist Boden
                                        dimYs = -0.6;
                                        skalierungY = 0.1;
                                        break;
                                    case 4: //  urspr. vordere Seite ist Boden
                                        dimZs = 9.6;
                                        skalierungZ = 0.1;
                                        break;
                                    case 5: //  urspr. hintere Seite ist Boden
                                        dimZs = -0.6;
                                        skalierungZ = 0.1;
                                        break;
                                }


                                mvPushMatrix();
                                    mat4.translate(mvMatrix, [dimXs, dimYs, dimZs]);
                                    mat4.scale(mvMatrix, [skalierungX, skalierungY, skalierungZ]);
                                    setMatrixUniforms();
                                    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
                                mvPopMatrix();
                            }

                            //  Dann FUTTER
                            if(!verloren && transparenzAn)
                            {
                                // Der Depth-Buffer wird deaktiviert, Blending wird aktiviert
                                gl.blendFunc(gl.SRC_COLOR, gl.ONE);
                                gl.enable(gl.BLEND);
                                gl.disable(gl.DEPTH_TEST);
                            }
                            else
                            {
                                // Im Todesfall wird das Blending wieder deaktiviert
                                gl.disable(gl.BLEND);
                                gl.enable(gl.DEPTH_TEST);
                            }

                            if(!verloren)
                            {
                                // Farb Puffer fuer Futter
                                gl.bindBuffer(gl.ARRAY_BUFFER, futterVertexColorBuffer);
                                gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, futterVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
                            }
                            else
                            {
                                // Farb Puffer fuer Futter im Sterbefall
                                gl.bindBuffer(gl.ARRAY_BUFFER, futterDeadVertexColorBuffer);
                                gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, futterDeadVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
                            }

                        mvPushMatrix();
                            mat4.translate(mvMatrix, [dimX, dimY, dimZ]);
                            setMatrixUniforms();
                            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
                        mvPopMatrix();


                        }
                    }
                }
            }


        /////////////////////  SCHLANGENSCHATTEN  //////////////////////


            if(!verloren && schattenAn)
            {
                // Blending fuer Schatten deaktiviert, weil schwarz und sonst unsichtbar
                gl.disable(gl.BLEND);
                gl.enable(gl.DEPTH_TEST);

                // Farb Puffer fuer Schlangenschatten == schwarz == Kantenfarbe
                gl.bindBuffer(gl.ARRAY_BUFFER, shadowVertexColorBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, shadowVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

                var skalierung = 1;
                var skalierungX = 1;
                var skalierungY = 1;
                var skalierungZ = 1;
                for (var i = tailPos; ; i = (i + 1) % schlangenMaxLaenge)
                {
                    var dimX = schlangenKoordinaten[i].x;
                    var dimY = schlangenKoordinaten[i].y;
                    var dimZ = schlangenKoordinaten[i].z;

                    skalierungX = skalierung;
                    skalierungY = skalierung;
                    skalierungZ = skalierung;

                    switch (unten)
                    {
                        case 0: //  urspr. rechte Seite ist Boden
                            dimX = 9.6;
                            skalierungX = 0.1;
                            break;
                        case 1: //  urspr. linke Seite ist Boden
                            dimX = -0.6;
                            skalierungX = 0.1;
                            break;
                        case 3: //  urspr. untere Seite ist Boden
                            dimY = -0.6;
                            skalierungY = 0.1;
                            break;
                        case 4: //  urspr. vordere Seite ist Boden
                            dimZ = 9.6;
                            skalierungZ = 0.1;
                            break;
                        case 5: //  urspr. hintere Seite ist Boden
                            dimZ = -0.6;
                            skalierungZ = 0.1;
                            break;
                    }

                    mvPushMatrix();
                        mat4.translate(mvMatrix, [dimX, dimY, dimZ]);
                        mat4.scale(mvMatrix, [skalierungX, skalierungY, skalierungZ]);
                        //  Effekt bei Kopf
                        if(i === headPos)
                        {
                            mat4.rotate(mvMatrix,
                                        degToRad(rotationDegree), 
                                       [Math.sin(degToRad(rotationAxis)), 
                                        Math.sin(degToRad(0.9*rotationAxis+120)), 
                                        Math.sin(degToRad(1.1*rotationAxis-120))]);
                        }
                        setMatrixUniforms();
                        gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

                    mvPopMatrix();
                    skalierung += 1/(aktLaengeSchlange*5);

                    //  Schleife verlassen, wenn Kopf erledigt
                    if (i === headPos)
                        break;
                }
            }


        /////////////////////////  SCHLANGE  ///////////////////////////

            if(!verloren && transparenzAn)
            {
                // Der Depth-Buffer wird deaktiviert, Blending wird aktiviert
                gl.blendFunc(gl.SRC_COLOR, gl.ONE);
                gl.enable(gl.BLEND);
                gl.disable(gl.DEPTH_TEST);
            }
            else
            {
                // Im Todesfall wird das Blending wieder deaktiviert
                gl.disable(gl.BLEND);
                gl.enable(gl.DEPTH_TEST);
            }

            skalierung = 1;
            var farbzaehler = 1;

            for (var i = tailPos; ; i = (i + 1) % schlangenMaxLaenge, farbzaehler++)
            {
                var dimX = schlangenKoordinaten[i].x;
                var dimY = schlangenKoordinaten[i].y;
                var dimZ = schlangenKoordinaten[i].z;

                mvPushMatrix();
                    mat4.translate(mvMatrix, [dimX, dimY, dimZ]);
                    //  Effekt bei Kopf
                    if(!verloren)
                    {
                        if(i === headPos)
                        {
                            // Farb Puffer fuer Schlangen-Kopf
                            gl.bindBuffer(gl.ARRAY_BUFFER, headVertexColorBuffer);
                            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, headVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
                            mat4.rotate(mvMatrix,
                                        degToRad(rotationDegree), 
                                       [Math.sin(degToRad(rotationAxis)), 
                                        Math.sin(degToRad(0.9*rotationAxis+120)), 
                                        Math.sin(degToRad(1.1*rotationAxis-120))]);
                        }
                        else if(farbzaehler <= aktLaengeSchlange / 2)
                        {
                            // Farb Puffer fuer Schlangen-Schwanz
                            gl.bindBuffer(gl.ARRAY_BUFFER, tailVertexColorBuffer);
                            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, tailVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
                        }
                        else
                        {
                            // Farb Puffer fuer Schlangenkoerper
                            gl.bindBuffer(gl.ARRAY_BUFFER, snakeVertexColorBuffer);
                            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, snakeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
                        }
                    }    
                    else 
                    {    
                        // Im Todesfall
                        // Farb Puffer fuer Schlangenkoerper == schwarz
                        gl.bindBuffer(gl.ARRAY_BUFFER, snakeDeadVertexColorBuffer);
                        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, snakeDeadVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);                               
                    }

                    mat4.scale(mvMatrix, [skalierung, skalierung, skalierung]);
                    setMatrixUniforms();
                    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

                    ////  Ansatz einer prozeduralen Textur
//                            //
//                            mvPushMatrix();
//
//                                gl.bindBuffer(gl.ARRAY_BUFFER, headVertexColorBuffer);
//                                gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, headVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
//
//                                var texturWinkel = [  0,
//                                                    180,
//                                                     90,
//                                                    -90,
//                                                     90,
//                                                    -90];
//                                var texturAchsen = [[1, 0, 0],
//                                                    [0, 1, 0],
//                                                    [0, 1, 0],
//                                                    [0, 1, 0],
//                                                    [0, 0, 1],
//                                                    [0, 0, 1]];
//
//                                for(var i = 0; i < 6; i++)
//                                {
//                                    mvPushMatrix();
//                                        mat4.rotate(mvMatrix, degToRad(texturWinkel[i]), texturAchsen[i]);
//                                        mvPushMatrix();
//                                            mat4.rotate(mvMatrix, degToRad(45), [1, 0, 0]);
//                                            mat4.translate(mvMatrix, [0.5,0,0]);
//                                            mat4.scale(mvMatrix, [0.05, Math.sqrt(2)/2, Math.sqrt(2)/2]);
//
//                                            setMatrixUniforms();
//                                            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
//                                        mvPopMatrix();
//                                    mvPopMatrix();
//                                }
//                            mvPopMatrix();

                mvPopMatrix();
                skalierung += 1/(aktLaengeSchlange*5);

                //  Schleife verlassen, wenn Kopf erledigt
                if (i === headPos)
                    break;
            }

            ///// Laser    

            if(laserAn)                    
            {     

                var laserX = (richtung === 0) ? 1 : (richtung === 1) ? -1 : 0; 
                var laserY = (richtung === 2) ? 1 : (richtung === 3) ? -1 : 0;
                var laserZ = (richtung === 4) ? 1 : (richtung === 5) ? -1 : 0; 
                var laserDrehung;
                var laserDrehachse;

                //laserlaenge = 0;
                if(laserX == 1) 
                {
                    laserDrehung = 0;
                    laserDrehachse = [0, 1, 0];
                    laserlaenge = spielfeldGroesse.x - schlangenKoordinaten[headPos].x;
                    laserlaenge = laserlaenge - 1;
                }
                else if (laserX == -1)
                {
                    laserDrehung = 180;
                    laserDrehachse = [0, 1, 0];
                    laserlaenge = spielfeldGroesse.x + schlangenKoordinaten[headPos].x;
                    laserlaenge = laserlaenge - spielfeldGroesse.x;
                }
                if(laserY == 1) 
                {
                    laserDrehung = 90; 
                    laserDrehachse = [0, 0, 1];
                    laserlaenge = spielfeldGroesse.y - schlangenKoordinaten[headPos].y;
                    laserlaenge = laserlaenge - 1;
                }
                else if (laserY == -1)
                {
                    laserDrehung = -90;
                    laserDrehachse = [0, 0, 1];
                    laserlaenge = spielfeldGroesse.y + schlangenKoordinaten[headPos].y;
                    laserlaenge = laserlaenge - spielfeldGroesse.y;
                }
                if(laserZ == 1) 
                {
                    laserDrehung = -90;
                    laserDrehachse = [0, 1, 0];
                    laserlaenge = spielfeldGroesse.z - schlangenKoordinaten[headPos].z;
                    laserlaenge = laserlaenge - 1;
                }
                else if (laserZ == -1)
                {
                    laserDrehung = 90; 
                    laserDrehachse = [0, 1, 0];
                    laserlaenge = spielfeldGroesse.z + schlangenKoordinaten[headPos].z;
                    laserlaenge = laserlaenge - spielfeldGroesse.z;
                }

                // Der Depth-Buffer wird deaktiviert, Blending wird aktiviert
                if(!verloren && transparenzAn)
                {
                    gl.blendFunc(gl.SRC_COLOR, gl.ONE);
                    gl.enable(gl.BLEND);
                    gl.disable(gl.DEPTH_TEST);
                }

                // Puffer des Lasers wird mit dem Kontext verbunden
                gl.bindBuffer(gl.ARRAY_BUFFER, laserVertexPositionBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, laserVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

                // Farb Puffer fuer Laser
                gl.bindBuffer(gl.ARRAY_BUFFER, laserVertexColorBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, laserVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

                // Laser Element Puffer
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, laserVertexIndexBuffer);

                // Laser Linie
                mvPushMatrix();
                    mvPushMatrix();
                        mat4.translate(mvMatrix, [laserX * laserlaenge/2, laserY * laserlaenge/2, laserZ * laserlaenge/2]);
                        mvPushMatrix();
                            mat4.translate(mvMatrix, [schlangenKoordinaten[headPos].x, schlangenKoordinaten[headPos].y , schlangenKoordinaten[headPos].z]);
                            mvPushMatrix();                                    
                                mat4.rotate(mvMatrix, degToRad(laserDrehung), laserDrehachse);
                                mat4.translate(mvMatrix, [0.5, 0, 0]);
                                mat4.scale(mvMatrix, [laserlaenge, 0.1, 0.1]);                         

                                setMatrixUniforms();
                                gl.drawElements(gl.TRIANGLES, laserVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

                                //  Blending wird fuer den folgenden Code wieder disabled
                                gl.disable(gl.BLEND);
                                gl.enable(gl.DEPTH_TEST); 
                            mvPopMatrix();
                        mvPopMatrix();
                    mvPopMatrix();
                mvPopMatrix();  
            }

        mvPopMatrix();
    mvPopMatrix();


}


var lastTime = 0;

function animate() {                                // Drehung
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        if(effekt)
        {
            rotationDegree = (rotationDegree + ((75 * elapsed) / 100.0)) % 360;
            rotationAxis = (rotationAxis + ((23 * elapsed) / 100.0)) % 360;
            if(timeNow - lastEffekt > 500)
            {
                rotationDegree = 0;
                rotationAxis = 0;
                effekt = false;
            }
        }
    }

    lastTime = timeNow;
}

var lastEffekt = 0;

function effektLos() {
    effekt = true;
    lastEffekt = new Date().getTime();
}

var framecounter = 0;
var lastFramecounter = 0;
var lastGehen = 0;
var lastSekunde = 0;
var lastBannertick = 0;
var fps = 0;

function tick() {
    requestAnimFrame(tick);
    drawScene();
    var timeNow = new Date().getTime();
    if(timeNow - lastSekunde > 1000)
    {
        fps = (framecounter - lastFramecounter);
        lastSekunde = timeNow;
        lastFramecounter = framecounter;
    }
    //  Schriftzug
    if(timeNow - lastBannertick > 200)
    {
        if(bannerLaeuft)
            bannerHead = (bannerHead + 1) % bannerSchlangenKoordinaten.length;
        if(!bannerStoppt)
        {
            bannerTail = (bannerTail + 1) % bannerSchlangenKoordinaten.length;
            if(bannerHead === bannerTail)
                bannerStoppt = true;
        }
    }

    if(timeNow - lastGehen > schwierigkeitsgrad){
        if(!verloren)
        {
            gehen();
            hilfe();
            lastGehen = timeNow;
        }
        darfLenken = true;
    }
    score();
    $('#hud').html("<table><tr><td>FPS:</td><td class='tr'>" + fps + "</td></tr>" + 
                          "<tr><td>Schritte:</td><td class='tr'>" + schrittanzahl + "</td></tr>" +
                          "<tr><td>Schwierigkeit:</td><td class='tr'>" + $('#schwierigkeitsgradSlider').val() + "</td></tr>" +
                          "<tr><td>L&auml;nge:</td><td class='tr'>" + aktLaengeSchlange + "</td></tr>" +
                          "<tr><td>Punkte:</td><td class='tr'>" + punkte + "</td></tr></table>");

    if(debug)
    {
        $('#hud table').append("<tr><td>DrehungX: </td><td class='tr'>" + drehungX + "</td></tr>" + 
                                   "<tr><td>DrehungY: </td><td class='tr'>" + drehungY + "</td></tr>" + 
                                   "<tr><td>Richtung: </td><td class='tr'>" + richtung + "</td></tr>" + 
                                   "<tr><td>SchlangenKoordinaten[headPos].x: </td><td class='tr'>" + schlangenKoordinaten[headPos].x + "</td></tr>" + 
                                   "<tr><td>SchlangenKoordinaten[headPos].y: </td><td class='tr'>" + schlangenKoordinaten[headPos].y + "</td></tr>" + 
                                   "<tr><td>SchlangenKoordinaten[headPos].z: </td><td class='tr'>" + schlangenKoordinaten[headPos].z + "</td></tr>" +
                                   "<tr><td>headPos: </td><td class='tr'>" + headPos + "</td></tr>" +
                                   "<tr><td>tailPos: </td><td class='tr'>" + tailPos + "</td></tr>" +
                                   "<tr><td>Verloren: </td><td class='tr'>" + verloren + "</td></tr>" +
                                   "<tr><td>Pause: </td><td class='tr'>" + pause + "</td></tr>");
    }                                           
    animate(); // Drehung
    framecounter++;        
}


function webGLStart() {
    canvas = document.getElementById('snakecanvas');

    // Passt die Groesse des Canvas dynamisch an die Groesse des Browserfensters an
    canvas.height = window.innerHeight-40;
    canvas.width = window.innerWidth-30;

    initGL(canvas);                  // Initialisierung des WebGL Kontextes

    initShaders();
    initBuffers();

    neuesSpiel();



    // Es geht nur weiter, wenn WebGl verfuegbar ist.
    if (gl) {
      gl.clearColor(0.0, 0.0, 0.0, 0.0);  // Setzt die Farbe auf Weiss
      gl.clearDepth(1.0);                 // Loesche alles, um die neue Farbe sichtbar zu machen
      gl.enable(gl.DEPTH_TEST);           // Aktiviere Tiefentest
      gl.depthFunc(gl.LEQUAL);            // Naehere Objekte verdecken entferntere Objekte
    }

    //  Maussteuerung

    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;
    canvas.onmousemove = mouseMove;

    tick();
}


function mouseMove(einEvent)  {
    if(einEvent.clientX > canvas.getAttribute('width')-10  ||
       einEvent.clientX < 10                               ||
       einEvent.clientY > canvas.getAttribute('height')-10 ||
       einEvent.clientY < 10)
    {
        istMouseDown = false;
    }

    if(istMouseDown == true)
    {
        if(!pause)
        {
            drehungX = Math.max(Math.min((drehungX + (einEvent.clientY - letzterMausPunkt.y)), 90) , -90);
            drehungY = (drehungY + (einEvent.clientX - letzterMausPunkt.x) + 360) % 360;
        }
    }  

    drehen();

    letzterMausPunkt.x=einEvent.clientX;
    letzterMausPunkt.y=einEvent.clientY;
}

function mouseDown(einEvent)   {
    istMouseDown = true;
}

function mouseUp(einEvent)   {
    istMouseDown=false;
}

function drehen()   //(drehRichtung)
{
    if (drehungY > 315 || drehungY <= 45)
    {
        rechts = 0;
        links = 1;
        if(drehungX > 45)       //  Wuerfel von oben betrachtet
        {
            oben = 5;
            unten = 4;
            vorne = 2;
            hinten = 3;
        }
        else if(drehungX < -45)  //  Wuerfel von unten betrachtet
        {
            oben = 4;
            unten = 5;
            vorne = 3;
            hinten = 2;
        }
        else                    //  Wuerfel von vorne betrachtet
        {
            oben = 2;
            unten = 3;
            vorne = 4;
            hinten = 5;
        }
    }
    else if (drehungY > 45 && drehungY <= 135)
    {
        rechts = 4;
        links = 5;
        if(drehungX > 45)       //  Wuerfel von oben betrachtet
        {
            oben = 0;
            unten = 1;
            vorne = 2;
            hinten = 3;
        }
        else if(drehungX < -45)  //  Wuerfel von unten betrsachtet
        {
            oben = 1;
            unten = 0;
            vorne = 3;
            hinten = 2;
        }
        else                    //  Wuerfel von vorne betrachtet
        {
            oben = 2;
            unten = 3;
            vorne = 1;
            hinten = 0;
        }
    } 
    else if (drehungY > 135 && drehungY <= 225)
    {
        rechts = 1;
        links = 0;
        if(drehungX > 45)       //  Wuerfel von oben betrachtet
        {
            oben = 4;
            unten = 5;
            vorne = 2;
            hinten = 3;
        }
        else if(drehungX < -45)  //  Wuerfel von unten betrachtet
        {
            oben = 5;
            unten = 4;
            vorne = 3;
            hinten = 2;
        }
        else                    //  Wuerfel von vorne betrachtet
        {
            oben = 2;
            unten = 3;
            vorne = 5;
            hinten = 4;
        }
    }
    else if (drehungY > 225 && drehungY <= 315)
    {
        rechts = 5;
        links = 4;
        if(drehungX > 45)       //  Wuerfel von oben betrachtet
        {
            oben = 1;
            unten = 0;
            vorne = 2;
            hinten = 3;
        }
        else if(drehungX < -45)  //  Wuerfel von unten betrachtet
        {
            oben = 0;
            unten = 1;
            vorne = 3;
            hinten = 2;
        }
        else                    //  Wuerfel von vorne betrachtet
        {
            oben = 2;
            unten = 3;
            vorne = 0;
            hinten = 1;
        }
    }
}

webGLStart();

//////  JQuery

//  Setzt Anfangswert 1 auf Schw.slider
$('#schwierigkeitsgradSlider').val(1);

//  Changehandler
$('#schwierigkeitsgradSlider').change(function(){
    level($('#schwierigkeitsgradSlider').val());
});

//  Clickhandler

$('#btStop').click(function(){
    stop();
    $('#inhalt').toggle();
    $('#impressum').hide();
    $('#steuerung').hide();
    $('#divHighscore').hide();
    $('#optionen').hide();
});

$('#btNeuesSpiel').click(function(){
    if(!verloren) {
        var Check = confirm("Willst Du wirklich ein neues Spiel beginnen?");
        if (Check == true) {
          neuesSpiel();
        }
    }
    else 
    {
        neuesSpiel();
    }

    $('#btStop').click();
    $('#impressum').hide();
    $('#steuerung').hide();
    $('#divHighscore').hide();
    $('#optionen').hide();
});        
$('#btHighscore').click(function(){
    highscoreName();
    $('#divHighscore').toggle();
    $('#steuerung').hide();
    $('#impressum').hide();
    $('#optionen').hide();
});
$('#btSteuerung').click(function(){
    $('#steuerung').toggle();
    $('#divHighscore').hide();
    $('#impressum').hide();
    $('#optionen').hide();
});
$('#btImpressum').click(function(){
    $('#impressum').toggle();
    $('#steuerung').hide();
    $('#divHighscore').hide();
    $('#optionen').hide();
});
$('#btOptionen').click(function(){
    $('#optionen').toggle();
    $('#steuerung').hide();
    $('#divHighscore').hide();
    $('#impressum').hide();
});
$(':checkbox').removeAttr('checked');

$('#cbTransparenz').click(function(){
    transparenzAn = !transparenzAn;
});
$('#cbLaser').click(function(){
    laserAn = !laserAn;
});
$('#cbSchatten').click(function(){
    schattenAn = !schattenAn;
});
$('#cbGitternetz').click(function(){
    gitternetzAn = !gitternetzAn;
});

// Rot, Gruen, Blau, Alpha, NumItems
//
//   Hochschule:        komplett gruen      Futter: PG-Rot
//   Simpson:           gelb, weis, blau    Futter: Schweinchenpink oder Donutglasurpink 
//   Schlumpfhausen:    weis, blau, weis    Futter: Schlumpfbeerenrot
//   Tron:              tuerkis             Futter: Tronorange

$('#ddHochschule').attr('selected','selected');

var farbIndex = 0;

$('#farbauswahl').change(function(){
    var auswahl = $('#farbauswahl').val();
    switch(auswahl)
    {
        case 'Hochschule':
            farbIndex = 0;
            setColor(headVertexColorBuffer,     0.5, 1,   0.25, 1.0, 24);
            setColor(snakeVertexColorBuffer,    0.4, 0.8, 0.2, 1.0, 24);
            setColor(tailVertexColorBuffer,     0.4, 0.9, 0.2, 1.0, 24);
            setColor(futterVertexColorBuffer,   0.9, 0.0, 0.0, 1.0, 24);

            setColor(shadowVertexColorBuffer,   0.0, 0.13, 0.25, 2.0, 24);

            setColor(faceVertexColorBuffer,     0.0, 0.29, 0.5, 1.0, 4);
            setColor(cubeVertexColorBuffer,     0.0, 0.0, 0.0, 2.0, 24);
            break;

        case 'Simpsons':
            farbIndex = 1;
            setColor(headVertexColorBuffer,     1.0, 1.0, 0.0, 1.0, 24);
            setColor(snakeVertexColorBuffer,    0.9, 0.9, 0.9, 1.0, 24);
            setColor(tailVertexColorBuffer,     0.0, 0.0, 0.9, 1.0, 24);
            setColor(futterVertexColorBuffer,   0.9, 0.55, 0.8, 1.0, 24);

            setColor(shadowVertexColorBuffer,   0.0, 0.075, 0.18, 2.0, 24);

            setColor(faceVertexColorBuffer,     0.0, 0.15, 0.35, 1.0, 4);
            setColor(cubeVertexColorBuffer,     0.0, 0.0, 0.0, 2.0, 24);
            break;

        case 'Schlumpfhausen':
            farbIndex = 2;
            setColor(headVertexColorBuffer,     0.9, 0.9, 0.9, 1.0, 24);
            setColor(snakeVertexColorBuffer,    0.004, 0.7, 0.9, 1.0, 24);
            setColor(tailVertexColorBuffer,     0.9, 0.9, 0.9, 1.0, 24);
            setColor(futterVertexColorBuffer,   0.9, 0.0, 0.0, 1.0, 24);

            setColor(shadowVertexColorBuffer,   0.15, 0.34, 0.1, 2.0, 24);

            setColor(faceVertexColorBuffer,     0.3, 0.68, 0.2, 1.0,  4);
            setColor(cubeVertexColorBuffer,     0.42, 0.2, 0.17, 2.0, 24);
            break;

        case 'Tron':
            farbIndex = 3;
            setColor(headVertexColorBuffer,     0.0, 0.8, 0.8, 1.0, 24);
            setColor(snakeVertexColorBuffer,    0.0, 0.8, 0.8, 1.0, 24);
            setColor(tailVertexColorBuffer,     0.0, 0.8, 0.8, 1.0, 24);
            setColor(futterVertexColorBuffer,   1.0, 0.75, 0.0, 1.0, 24);

            setColor(shadowVertexColorBuffer,   0.75, 1.0, 1.0, 2.0, 24);    //0.1, 0.1, 0.1, 2.0, 24);

            setColor(faceVertexColorBuffer,     0.0, 0.0, 0.0, 2.0, 4);
            setColor(cubeVertexColorBuffer,     0.0, 1.0, 1.0, 1.0, 24);
            break;
      }
});

$('#hudMaske').css('width', $('#hud').css('width'));
$('#hudMaske').css('height', $('#hud').css('height'));

$('#hudMaske').click(function(){
    if(parseInt($('#hudMaske').css("left")) > 0)
    {
        $('#hudMaske').css("left", "-=" + ($('#hudMaske').width()+35));
        $('#hud').animate({ 
            "left": "-=" + ($('#hud').width()+35)
        }, "slow", function(){
            $('#hudTitel').toggle();
        });
    }
    else
    {
        $('#hud').animate({ "left": "+=" + ($('#hud').width()+35)}, "slow" );
        $('#hudTitel').toggle();
        $('#hudMaske').css("left", "+=" + ($('#hudMaske').width()+35));
    }
});

if(!debug)
    $('#hudMaske').click();
}); //  Ende JQuery