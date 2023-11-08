const canv = document.getElementById("game-board");
const ctx = canv.getContext("2d");

canv.width = window.innerWidth;
canv.height = window.innerHeight;

const fps = 30;
// Die Anzahl der Frames pro Sekunde im Spiel. Bestimmt die Aktualisierungsrate des Spiels.

const friction = 0.7;
// Der Reibungskoeffizient des Raumschiffs. Beeinflusst die Verlangsamung des Raumschiffs, wenn keine Tasten gedrückt werden.

const gameLives = 3;
// Die Anzahl der Leben, die der Spieler zu Beginn des Spiels hat.

const laserDist = 0.6;
// Die maximale Reichweite des Lasers in Bezug auf die Größe des Bildschirms.

const laserExplodeDur = 0.1;
// Die Dauer der Explosion, wenn ein Laser ein Objekt trifft.

const laserMax = 10;
// Die maximale Anzahl von Laserstrahlen, die gleichzeitig auf dem Bildschirm sein können.

const laserSpd = 500;
// Die Geschwindigkeit, mit der der Laser sich bewegt.

const roidJag = 0.4;
// Die Unregelmäßigkeit der Asteroidenformen. Beeinflusst ihre Ecken und Kanten.

const roidPtsLge = 20;
// Die Punktzahl, die der Spieler für das Zerstören eines großen Asteroiden erhält.

const roidPtsMed = 50;
// Die Punktzahl, die der Spieler für das Zerstören eines mittelgroßen Asteroiden erhält.

const roidPtsSml = 100;
// Die Punktzahl, die der Spieler für das Zerstören eines kleinen Asteroiden erhält.

const roidNum = 3;
// Die Anfangsanzahl der Asteroiden im Spiel.

const roidSize = 100;
// Die Größe der Asteroiden in Pixeln.

const roidSpd = 50;
// Die durchschnittliche Geschwindigkeit der Asteroiden.

const roidVert = 10;
// Die Anzahl der Ecken oder Vertices der Asteroiden. Beeinflusst ihre Form.

const saveKeyScore = "highscore";
// Der Schlüssel, unter dem die höchste Punktzahl im lokalen Speicher gespeichert wird.

const shipBlinkDur = 0.1;
// Die Dauer, für die das Raumschiff nach einer Kollision blinkt.

const shipExplodeDur = 0.3;
// Die Dauer der Explosion, wenn das Raumschiff zerstört wird.

const shipInvDur = 3;
// Die Dauer der Unverwundbarkeit des Spielers nach einer Kollision.

const shipSize = 30;
// Die Größe des Raumschiffs in Pixeln.

const shipThrust = 5;
// Die Beschleunigung des Raumschiffs bei Anwendung von Schub.

const shipTurnSpd = 360;
// Die Geschwindigkeit, mit der das Raumschiff gedreht werden kann, in Grad pro Sekunde.

const showBounding = false;
// Legt fest, ob die Begrenzungsrahmen für Objekte angezeigt werden sollen.

const showCentreDot = false;
// Legt fest, ob ein zentrales Punktmarkierung für Objekte angezeigt werden soll.

const musicOn = true;
// Legt fest, ob die Hintergrundmusik abgespielt werden soll.

const soundOn = true;
// Legt fest, ob Spielsounds abgespielt werden sollen.

const textFadeTime = 2.5;
// Die Zeit in Sekunden, die benötigt wird, um den Text im Spiel verblassen zu lassen.

const textSize = 40;
// Die Schriftgröße für den im Spiel angezeigten Text.

// Soundeffekte einrichten
const fxExplode = new Sound("sounds/explode.m4a");
// Der Soundeffekt für die Explosion von Objekten.

const fxHit = new Sound("sounds/hit.m4a", 5);
// Der Soundeffekt für den Treffer von Objekten. Die Zahl 5 gibt die maximale Anzahl gleichzeitig spielbarer Instanzen an.

const fxLaser = new Sound("sounds/laser.m4a", 5, 0.5);
// Der Soundeffekt für das Abschießen des Laserstrahls. Die Zahl 5 gibt die maximale Anzahl gleichzeitig spielbarer Instanzen an,
// und 0.5 ist die Lautstärke des Sounds (zwischen 0 und 1).

const fxThrust = new Sound("sounds/thrust.m4a");
// Der Soundeffekt für den Schub des Raumschiffs.

// Musik einrichten
const music = new Music("sounds/music-low.m4a", "sounds/music-high.m4a");
// Die Hintergrundmusik. Die ersten und zweiten Parameter sind die Dateipfade für die Musik in niedriger und hoher Qualität.

let roidsLeft, roidsTotal;
// roidsLeft: Die Anzahl der verbleibenden Asteroiden im Spiel.
// roidsTotal: Die Gesamtanzahl der Asteroiden im Spiel.

// Spieleinstellungen einrichten
let level, lives, roids, score, scoreHigh, ship, text, textAlpha;
newGame();
// level: Das aktuelle Level des Spiels.
// lives: Die Anzahl der verbleibenden Leben des Spielers.
// roids: Ein Array, das die Asteroiden im Spiel enthält.
// score: Die aktuelle Punktzahl des Spielers.
// scoreHigh: Die höchste erreichte Punktzahl im Spiel.
// ship: Das Raumschiff des Spielers.
// text: Der angezeigte Text im Spiel, z.B., "Game Over".
// textAlpha: Der Alpha-Wert (Transparenz) des angezeigten Texts.


// Event-Handler einrichten
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
// Die Funktionen keyDown und keyUp werden aufgerufen, wenn eine Taste gedrückt oder losgelassen wird.

// Spiele-Schleife einrichten
setInterval(update, 1000 / fps);
// Die Funktion update wird mit der Bildwiederholungsrate (fps) aufgerufen, um das Spiel zu aktualisieren.

function createAsteroidBelt() {
  roids = [];
  roidsTotal = (roidNum + level) * 7;
  roidsLeft = roidsTotal;
  let x, y;
  for (let i = 0; i < roidNum + level; i++) {
    do {
      x = Math.floor(Math.random() * canv.width);
      y = Math.floor(Math.random() * canv.height);
    } while (distBetweenPoints(ship.x, ship.y, x, y) < roidSize * 2 + ship.r);
    // Solange ein neuer Asteroid innerhalb des Raumschiff-Radius generiert wird, wird erneut versucht.
    roids.push(newAsteroid(x, y, Math.ceil(roidSize / 2)));
    // Ein neuer Asteroid wird dem roids-Array hinzugefügt.
  }
}
// createAsteroidBelt erstellt eine Anzahl von Asteroiden basierend auf dem aktuellen Level und roidNum.


function destroyAsteroid(index) {
    const x = roids[index].x;
    const y = roids[index].y;
    const r = roids[index].r;
  
    // Punkte vergeben und neue Asteroiden erstellen, basierend auf der Größe des zerstörten Asteroiden
    if (r === Math.ceil(roidSize / 2)) {
      roids.push(newAsteroid(x, y, Math.ceil(roidSize / 4)));
      roids.push(newAsteroid(x, y, Math.ceil(roidSize / 4)));
      score += roidPtsLge;
    } else if (r === Math.ceil(roidSize / 4)) {
      roids.push(newAsteroid(x, y, Math.ceil(roidSize / 8)));
      roids.push(newAsteroid(x, y, Math.ceil(roidSize / 8)));
      score += roidPtsMed;
    } else {
      score += roidPtsSml;
    }
  
    // Überprüfen, ob die erreichte Punktzahl die bisherige Bestleistung übertrifft und sie im lokalen Speicher speichern
    if (score > scoreHigh) {
      scoreHigh = score;
      localStorage.setItem(saveKeyScore, scoreHigh);
    }
  
    // Den zerstörten Asteroiden aus dem Array entfernen, Sound abspielen und die Anzahl der verbleibenden Asteroiden reduzieren
    roids.splice(index, 1);
    fxHit.play();
    roidsLeft--;
  
    // Überprüfen, ob alle Asteroiden zerstört wurden, um zum nächsten Level zu wechseln
    if (roids.length === 0) {
      level++;
      newLevel();
    }
  }
  // Die Funktion destroyAsteroid wird aufgerufen, wenn ein Asteroid zerstört wird. Sie aktualisiert die Punktzahl, erstellt neue Asteroiden,
  // spielt den Zerstörungssound ab und prüft, ob das Level abgeschlossen wurde.
  
  function distBetweenPoints(x1, y1, x2, y2) {
    // Berechnet den Abstand zwischen zwei Punkten im Raum.
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }


function drawShip(x, y, a, colour = "white") {
    // Zeichnet das Raumschiff auf den Canvas.
    ctx.strokeStyle = colour;
    ctx.lineWidth = shipSize / 20;
    ctx.beginPath();
    ctx.moveTo(
      x + (4 / 3) * ship.r * Math.cos(a),
      y - (4 / 3) * ship.r * Math.sin(a)
    );
    ctx.lineTo(
      x - ship.r * ((2 / 3) * Math.cos(a) + Math.sin(a)),
      y + ship.r * ((2 / 3) * Math.sin(a) - Math.cos(a))
    );
    ctx.lineTo(
      x - ship.r * ((2 / 3) * Math.cos(a) - Math.sin(a)),
      y + ship.r * ((2 / 3) * Math.sin(a) + Math.cos(a))
    );
    ctx.closePath();
    ctx.stroke();
  }
  
  function explodeShip() {
    // Startet die Explosion des Raumschiffs.
    ship.explodeTime = Math.ceil(shipExplodeDur * fps);
    fxExplode.play();
  }