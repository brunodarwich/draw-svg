import test from "node:test";
import assert from "node:assert/strict";
import {
  roundStrokePolygon,
  subtractPolygons,
  polygonsToPathD,
  pathDToPolygons,
  polygonArea,
  sliceStrokePoints,
  simplifyPolygonRings,
  pointToSegmentDistance,
} from "../src/engine/vectorEraser.js";
import { pointsToPathD, simplifyRDP } from "../src/engine/geometry.js";

test("eraser removes vector geometry instead of adding a covering stroke", () => {
  const stroke = roundStrokePolygon([{ x: 0, y: 0 }, { x: 100, y: 0 }], 10);
  const eraser = roundStrokePolygon([{ x: 50, y: -20 }, { x: 50, y: 20 }], 12);
  const remaining = subtractPolygons(stroke, eraser);
  assert.equal(remaining.length, 2, "the line becomes two disconnected pieces");
  assert.ok(polygonArea(remaining) < polygonArea(stroke));
  assert.ok(remaining.every((piece) => piece.every(({ x }) => x <= 44 || x >= 56)));
});

test("a single click erases a round spot from a filled shape", () => {
  const shape = [[{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }]];
  const eraser = roundStrokePolygon([{ x: 50, y: 50 }], 20);
  const remaining = subtractPolygons(shape, eraser);
  assert.equal(remaining.length, 2, "outer boundary and erased hole are stored as geometry");
  assert.ok(polygonArea(remaining) < polygonArea(shape));
  assert.deepEqual(pathDToPolygons(polygonsToPathD(remaining)), remaining);
});

test("sliceStrokePoints splits open stroke into clean sub-strokes without inflating bytes", () => {
  const stroke = [];
  for (let x = 0; x <= 100; x += 1) {
    stroke.push({ x, y: 50 });
  }

  // Eraser crossing the middle from (50, 20) to (50, 80) with radius 10 and stroke width 4
  const eraser = [{ x: 50, y: 20 }, { x: 50, y: 80 }];
  const pieces = sliceStrokePoints(stroke, eraser, 10, 4);

  assert.equal(pieces.length, 2, "must split into exactly 2 continuous sub-strokes");
  assert.ok(pieces[0].length >= 2, "first piece has valid points");
  assert.ok(pieces[1].length >= 2, "second piece has valid points");

  // Verify first piece ends before x=40 and second piece starts after x=60
  const piece1Last = pieces[0][pieces[0].length - 1];
  const piece2First = pieces[1][0];
  assert.ok(piece1Last.x <= 40, `piece 1 should end before eraser, ended at ${piece1Last.x}`);
  assert.ok(piece2First.x >= 60, `piece 2 should start after eraser, started at ${piece2First.x}`);

  // Test SVG path d generation with RDP simplification (< 100 bytes)
  const d1 = pointsToPathD(simplifyRDP(pieces[0], 0.6), false, 1);
  const d2 = pointsToPathD(simplifyRDP(pieces[1], 0.6), false, 1);
  assert.ok(d1.startsWith("M "), "valid SVG path command");
  assert.ok(d2.startsWith("M "), "valid SVG path command");
  assert.ok((d1.length + d2.length) < 100, `SVG code remains lightweight without bloat, was ${d1.length + d2.length} chars`);
});

test("sliceStrokePoints completely erases stroke when eraser covers it", () => {
  const smallStroke = [{ x: 50, y: 50 }, { x: 52, y: 50 }, { x: 54, y: 50 }];
  const eraser = [{ x: 50, y: 50 }];
  const pieces = sliceStrokePoints(smallStroke, eraser, 15, 4);
  assert.equal(pieces.length, 0, "completely erased stroke produces 0 remaining pieces");
});

test("pointToSegmentDistance calculates accurate distance to line segments", () => {
  const a = { x: 10, y: 10 };
  const b = { x: 50, y: 10 };

  // Point directly above segment
  assert.equal(Math.round(pointToSegmentDistance({ x: 30, y: 25 }, a, b)), 15);
  // Point before segment start (distance to a)
  assert.equal(Math.round(pointToSegmentDistance({ x: 10, y: 0 }, a, b)), 10);
  // Point beyond segment end (distance to b)
  assert.equal(Math.round(pointToSegmentDistance({ x: 60, y: 10 }, a, b)), 10);
});

test("simplifyPolygonRings reduces vertex count of complex rings", () => {
  // Ring with redundant collinear and nearly collinear points
  const ring = [
    { x: 0, y: 0 }, { x: 10, y: 0.01 }, { x: 20, y: 0 }, { x: 30, y: 0.02 }, { x: 40, y: 0 },
    { x: 40, y: 40 }, { x: 0, y: 40 },
  ];
  const simplified = simplifyPolygonRings([ring], 0.5);
  assert.ok(simplified[0].length < ring.length, "removes redundant vertices along straight edges");
});
