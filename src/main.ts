import { createProgram, prepareAttribute, ProgramProps, enableAttribute, prepareUniform } from "./program";

main();

function main() {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  document.querySelector('body').appendChild(canvas);
  
  const gl = canvas.getContext('webgl');

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);


  const programProps = createProgram(gl);
  const vertices = [
    0.0, 0.0,
    0.0, 0.5,
    0.5, 0.0,
  ]
  prepareAttribute(gl, programProps, 'aPosition', vertices);
  prepareUniform(gl, programProps, 'uModelViewMatrix');

  drawScene(gl, programProps);
}

function drawScene(gl: WebGLRenderingContext, progProps: ProgramProps) {
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

  const translationMatrix = [
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, -1.0, 1.0,
  ]

  gl.uniformMatrix3fv(progProps.uModelViewMatrix.location, false, translationMatrix);

  {
    const offset = 0;
    const vertexCount = 3;
    gl.drawArrays(gl.TRIANGLES, offset, vertexCount);
  }
}
