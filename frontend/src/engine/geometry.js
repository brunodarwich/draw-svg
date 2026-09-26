/**
 * DrawSVG Studio - Vector Geometry Engine
 * Algoritmos de geometria, simplificação de traços (RDP) e interpolação spline Bézier/Catmull-Rom.
 */

/**
 * Calcula a distância euclidiana entre dois pontos {x, y}.
 */
export function distance(p1, p2) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

/**
 * Calcula a distância perpendicular de um ponto p a um segmento de reta (p1 -> p2).
 */
export function perpendicularDistance(p, p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  if (dx === 0 && dy === 0) {
    return distance(p, p1);
  }

  const numerator = Math.abs(dy * p.x - dx * p.y + p2.x * p1.y - p2.y * p1.x);
  const denominator = Math.hypot(dx, dy);
  return numerator / denominator;
}

/**
 * Simplificação de caminho pelo algoritmo Ramer-Douglas-Peucker (RDP).
 * Reduz a densidade de pontos redundantes mantendo a forma geométrica essencial.
 * 
 * @param {Array<{x: number, y: number}>} points - Lista ordenada de pontos.
 * @param {number} epsilon - Tolerância de simplificação em pixels (padrão: 0.8).
 * @returns {Array<{x: number, y: number}>} Lista simplificada de pontos.
 */
export function simplifyRDP(points, epsilon = 0.8) {
  if (!points || points.length <= 2) {
    return points ? [...points] : [];
  }

  let maxDist = 0;
  let index = 0;
  const last = points.length - 1;

  for (let i = 1; i < last; i++) {
    const dist = perpendicularDistance(points[i], points[0], points[last]);
    if (dist > maxDist) {
      maxDist = dist;
      index = i;
    }
  }

  if (maxDist > epsilon) {
    const left = simplifyRDP(points.slice(0, index + 1), epsilon);
    const right = simplifyRDP(points.slice(index), epsilon);
    return left.slice(0, -1).concat(right);
  } else {
    return [points[0], points[last]];
  }
}

/**
 * Arredonda coordenadas para uma precisão fixa (reduz tamanho do arquivo SVG).
 */
export function roundCoord(val, precision = 1) {
  const factor = 10 ** precision;
  return Math.round(val * factor) / factor;
}

/**
 * Interpolação suave de pontos em curvas Bézier Cúbicas através de Catmull-Rom.
 * Garante continuidade C^1 e ausência de cantos pontiagudos indesejados.
 * 
 * @param {Array<{x: number, y: number}>} points - Pontos do traço.
 * @param {boolean} closed - Se o traço deve ser fechado com comando 'Z'.
 * @param {number} precision - Casas decimais das coordenadas (padrão: 1).
 * @returns {string} String do atributo 'd' para elemento <path>.
 */
export function pointsToPathD(points, closed = false, precision = 1) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) {
    const p = points[0];
    return `M ${roundCoord(p.x, precision)} ${roundCoord(p.y, precision)}`;
  }

  if (points.length === 2) {
    const p0 = points[0];
    const p1 = points[1];
    return `M ${roundCoord(p0.x, precision)} ${roundCoord(p0.y, precision)} L ${roundCoord(p1.x, precision)} ${roundCoord(p1.y, precision)}${closed ? ' Z' : ''}`;
  }

  let d = `M ${roundCoord(points[0].x, precision)} ${roundCoord(points[0].y, precision)}`;

  const n = points.length;
  for (let i = 0; i < n - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i + 2 < n ? points[i + 2] : p2;

    const cp1x = roundCoord(p1.x + (p2.x - p0.x) / 6, precision);
    const cp1y = roundCoord(p1.y + (p2.y - p0.y) / 6, precision);
    const cp2x = roundCoord(p2.x - (p3.x - p1.x) / 6, precision);
    const cp2y = roundCoord(p2.y - (p3.y - p1.y) / 6, precision);
    const endx = roundCoord(p2.x, precision);
    const endy = roundCoord(p2.y, precision);

    d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${endx} ${endy}`;
  }

  if (closed) {
    d += ' Z';
  }

  return d;
}

/**
 * Detecta se o início e fim de um traço formam um circuito fechado.
 * 
 * @param {Array<{x: number, y: number}>} points - Pontos do traço.
 * @param {number} strokeWidth - Espessura do traço em pixels.
 * @returns {boolean} Verdadeiro se o traço foi fechado.
 */
export function isPathClosed(points, strokeWidth = 6) {
  if (!points || points.length < 5) return false;
  const first = points[0];
  const last = points[points.length - 1];
  const threshold = Math.max(14, strokeWidth * 1.5);
  return distance(first, last) <= threshold;
}
