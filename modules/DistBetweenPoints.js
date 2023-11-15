// Die Funktion destroyAsteroid wird aufgerufen, wenn ein Asteroid zerstört wird. Sie aktualisiert die Punktzahl, erstellt neue Asteroiden,
// spielt den Zerstörungssound ab und prüft, ob das Level abgeschlossen wurde.
export function distBetweenPoints(x1, y1, x2, y2, ship) {
  // Berechnet den Abstand zwischen zwei Punkten im Raum.
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}