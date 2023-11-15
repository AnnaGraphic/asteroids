import { distBetweenPoints } from "./DistBetweenPoints.js";
import { newAsteroid } from "./NewAsteroid.js";
export function createAsteroidBelt(roids, roidsTotal, roidsLeft, roidNum, level, canv, ship, roidSize) {
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