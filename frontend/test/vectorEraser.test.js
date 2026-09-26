import test from "node:test";
import assert from "node:assert/strict";
import {
  roundStrokePolygon,
  subtractPolygons,
  polygonsToPathD,
  pathDToPolygons,
  polygonArea,
} from "../src/engine/vectorEraser.js";

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
