import { createProgram, prepareAttribute, ProgramProps, enableAttribute, prepareUniform } from "./program";
import { m3 } from "./m3";

let gl: WebGLRenderingContext;
let programProps: ProgramProps;

function main() {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth - 50;
  canvas.height = window.innerHeight - 50;
  document.querySelector('body').appendChild(canvas);
  
  gl = canvas.getContext('webgl');

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

  programProps = createProgram(gl);
  const vertices = [
    0, 0,
    0, 100,
    68, 0,
  ]
  prepareAttribute(gl, programProps, 'aPosition', vertices);
  prepareUniform(gl, programProps, 'uModelViewMatrix');

  drawScene(gl, programProps, 0);
}

function drawScene(gl: WebGLRenderingContext, progProps: ProgramProps, angleInRadians) {
  // clear canvas

  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  // gl.clearDepth(1.0);                 // Clear everything
  // gl.enable(gl.DEPTH_TEST);           // Enable depth testing

  // Clear the canvas before we start drawing on it.
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(progProps.program);
  enableAttribute(gl, progProps.aPosition)


  let modelViewMatrix = m3.projection(gl.canvas.width, gl.canvas.height);
  
  // TRS matrix (model to world matrix)
  modelViewMatrix = m3.translate(modelViewMatrix, 200, 200);
  modelViewMatrix = m3.rotate(modelViewMatrix, angleInRadians);
  modelViewMatrix = m3.scale(modelViewMatrix, 4, 1);

  // Move origin within model
  modelViewMatrix = m3.translate(modelViewMatrix, -68/3, -100/3);
  gl.uniformMatrix3fv(progProps.uModelViewMatrix.location, false, modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 3;
    gl.drawArrays(gl.TRIANGLES, offset, vertexCount);
  }

  window.requestAnimationFrame((time: number) => {
    const currentAngle = 2 * Math.PI * time / 5000;   // 5000ms => 2s => 1 revolation every 2 sec
    drawScene(gl, progProps, currentAngle);
  })
}

main();
