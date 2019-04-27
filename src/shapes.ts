export function getTriangle(): Model {
  return {
    vertices: [
      0, 0,
      0, 100,
      68, 0,
    ],
    drawMode: WebGLRenderingContext.TRIANGLES
  }
}

export function getCircle(radius, resolution = 20): Model {
  const vertices = [0,0];
  const step = 2 * Math.PI / resolution;
  for(let angle=0; angle <= 2 * Math.PI + step; angle += step) {
    vertices.push(radius * Math.sin(angle), radius * Math.cos(angle));
  }
  return {vertices, drawMode: WebGLRenderingContext.TRIANGLE_FAN};
}

export interface Model {vertices: number[], drawMode: number};