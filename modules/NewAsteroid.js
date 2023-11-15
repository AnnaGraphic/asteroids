export function newAsteroid(x, y, r, level, roidSpd, fps, roidVert) {
  // Erstellt einen neuen Asteroiden mit den angegebenen Koordinaten und Größe.
  const lvlMult = 1 + 0.1 * level;
  const roid = {
    x: x,
    y: y,
    xv:
      ((Math.random() * roidSpd * lvlMult) / fps) *
      (Math.random() < 0.5 ? 1 : -1),
    yv:
      ((Math.random() * roidSpd * lvlMult) / fps) *
      (Math.random() < 0.5 ? 1 : -1),
    a: Math.random() * Math.PI * 2,
    r: r,
    offs: [],
    vert: Math.floor(Math.random() * (roidVert + 1) + roidVert / 2),
  };

  for (let i = 0; i < roid.vert; i++) {
    roid.offs.push(Math.random() * roidJag * 2 + 1 - roidJag);
  }

  return roid;
}