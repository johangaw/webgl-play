import { Matrix3, m3 } from "./m3";

export function getTriangle(): Model {
  return {
    vertices: [
      0, 0,
      0, 100,
      68, 0,
    ],
    itemsPerVertex: 2,
    drawMode: WebGLRenderingContext.TRIANGLES,
    color: [1.0, 1.0, 1.0, 1],
    matrix: m3.identity(),
  }
}

export function getCircle(radius, resolution = 50): Model {
  const vertices = [0,0];
  const step = 2 * Math.PI / resolution;
  for(let angle=0; angle <= 2 * Math.PI + step; angle += step) {
    vertices.push(radius * Math.sin(angle), radius * Math.cos(angle));
  }
  return {
    vertices,
    itemsPerVertex: 2,
    drawMode: WebGLRenderingContext.TRIANGLE_FAN,
    color: [1.0, 1.0, 1.0, 1],
    matrix: m3.identity(),
  };
}

export interface Model {
  vertices: number[],
  itemsPerVertex: number,
  drawMode: number,
  color: [number, number, number, number],
  matrix: Matrix3,
};