import test from 'node:test';
import assert from 'node:assert/strict';
import {
  distance,
  perpendicularDistance,
  simplifyRDP,
  pointsToPathD,
  isPathClosed,
  roundCoord,
} from '../src/engine/geometry.js';
import { serializeSvg, escapeXml, analyzeSvg } from '../src/engine/serializer.js';

test('Vector Geometry - distance calculation', () => {
  assert.equal(distance({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
  assert.equal(distance({ x: 10, y: 10 }, { x: 10, y: 10 }), 0);
});

test('Vector Geometry - perpendicularDistance calculation', () => {
  const p1 = { x: 0, y: 0 };
  const p2 = { x: 10, y: 0 };
  const pAbove = { x: 5, y: 3 };
  assert.equal(perpendicularDistance(pAbove, p1, p2), 3);

  const pCollinear = { x: 5, y: 0 };
  assert.equal(perpendicularDistance(pCollinear, p1, p2), 0);
});

test('Vector Geometry - Ramer-Douglas-Peucker (RDP) simplification', () => {
  // Collinear points along a straight line should collapse to 2 points
  const straightLine = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
  ];
  const simplifiedLine = simplifyRDP(straightLine, 0.5);
  assert.equal(simplifiedLine.length, 2);
  assert.deepEqual(simplifiedLine[0], { x: 0, y: 0 });
  assert.deepEqual(simplifiedLine[1], { x: 5, y: 0 });

  // A line with a sharp corner must keep the corner
  const cornerLine = [
    { x: 0, y: 0 },
    { x: 2, y: 0.1 },
    { x: 5, y: 10 }, // sharp peak
    { x: 8, y: 0.1 },
    { x: 10, y: 0 },
  ];
  const simplifiedCorner = simplifyRDP(cornerLine, 2.0);
  assert.equal(simplifiedCorner.length, 3);
  assert.deepEqual(simplifiedCorner[1], { x: 5, y: 10 });

  // Edge cases
  assert.deepEqual(simplifyRDP([], 0.8), []);
  assert.deepEqual(simplifyRDP([{ x: 1, y: 1 }], 0.8), [{ x: 1, y: 1 }]);
});

test('Vector Geometry - pointsToPathD generates smooth Bezier path', () => {
  const points = [
    { x: 10, y: 10 },
    { x: 20, y: 25 },
    { x: 40, y: 30 },
    { x: 60, y: 15 },
  ];

  const d = pointsToPathD(points, false);
  assert.ok(d.startsWith('M 10 10'), 'Path must start with M command');
  assert.ok(d.includes(' C '), 'Path must include Cubic Bezier curves');
  assert.ok(!d.endsWith(' Z'), 'Open path must not end with Z');

  const dClosed = pointsToPathD(points, true);
  assert.ok(dClosed.endsWith(' Z'), 'Closed path must end with Z');
});

test('Vector Geometry - isPathClosed detection', () => {
  const openPoints = [
    { x: 0, y: 0 },
    { x: 50, y: 10 },
    { x: 100, y: 60 },
    { x: 80, y: 120 },
    { x: 100, y: 200 },
  ];
  assert.equal(isPathClosed(openPoints, 6), false);

  const closedPoints = [
    { x: 100, y: 100 },
    { x: 150, y: 120 },
    { x: 160, y: 180 },
    { x: 110, y: 190 },
    { x: 102, y: 103 }, // near start (dist = ~3.6 < threshold)
  ];
  assert.equal(isPathClosed(closedPoints, 6), true);
});

test('SVG Serializer - escapeXml', () => {
  assert.equal(escapeXml('<script>"danger" & \'alert\'</script>'), '&lt;script&gt;&quot;danger&quot; &amp; &apos;alert&apos;&lt;/script&gt;');
});

test('SVG Serializer - serializeSvg outputs valid semantic SVG markup', () => {
  const layers = [
    { id: 'layer-1', name: 'Background', visible: true, locked: false, opacity: 1 },
    { id: 'layer-2', name: 'Linework & Details', visible: false, locked: true, opacity: 0.8 },
  ];

  const svgXml = serializeSvg({
    width: 800,
    height: 600,
    layers,
    getLayerChildrenHtml: (id) => (id === 'layer-1' ? '<path d="M 0 0 L 10 10" stroke="#000" />' : ''),
    pretty: true,
  });

  assert.ok(svgXml.includes('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">'));
  assert.ok(svgXml.includes('<g id="layer-1" data-name="Background" data-locked="false" opacity="1">'));
  assert.ok(svgXml.includes('<path d="M 0 0 L 10 10" stroke="#000" />'));
  assert.ok(svgXml.includes('data-name="Linework &amp; Details"'));
  assert.ok(svgXml.includes('data-locked="true"'));
  assert.ok(svgXml.includes('opacity="0.8"'));
  assert.ok(svgXml.includes('style="display:none"'));
  assert.ok(svgXml.endsWith('</svg>'));
});

test('SVG Serializer - analyzeSvg extracts accurate metrics and line counts', () => {
  const xml = `<svg viewBox="0 0 100 100">\n  <g id="l1">\n    <path d="M 0 0 L 10 10" />\n    <circle cx="5" cy="5" r="2" />\n  </g>\n</svg>`;
  const analysis = analyzeSvg(xml);
  assert.equal(analysis.elementsCount, 2);
  assert.equal(analysis.lineCount, 6);
  assert.ok(analysis.bytes > 0);
  assert.ok(analysis.sizeKb >= 0);
});
