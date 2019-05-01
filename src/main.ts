import { m3 } from "./m3";
import { createProgram, enableAttribute, ProgramInfo, loadDataOntoGPU } from "./program";
import { getCircle, Model } from "./shapes";

let gl: WebGLRenderingContext;
let programInfo: ProgramInfo;
interface StuffToDraw {
  programInfo: ProgramInfo;
  model: Model;
  buffer: WebGLBuffer;
}

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

  programInfo = createProgram(gl);

  const c1 = getCircle(70);
  const c2 = getCircle(40);

  c2.matrix = m3.translation(100, 100);

  const stuffsToDraw: StuffToDraw[] = [
    {
      programInfo: programInfo,
      model: c1,
      buffer: loadDataOntoGPU(gl, c1.vertices),
    },
    {
      programInfo: programInfo,
      model: c2,
      buffer: loadDataOntoGPU(gl, c2.vertices),
    },
  ]
  
  drawScene(gl, stuffsToDraw, 0);
}

function drawScene(gl: WebGLRenderingContext, stuffsToDraw: StuffToDraw[], angleInRadians: number) {
  // clear canvas

  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  // gl.clearDepth(1.0);                 // Clear everything
  // gl.enable(gl.DEPTH_TEST);           // Enable depth testing

  // Clear the canvas before we start drawing on it.
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Tell it to use our program (pair of shaders)

  stuffsToDraw.forEach(({programInfo, model, buffer}) => {
    gl.useProgram(programInfo.program);
    enableAttribute(gl, programInfo.aPosition.location, buffer, model.itemsPerVertex)
  
    let modelViewMatrix = m3.projection(gl.canvas.width, gl.canvas.height);
  
    // TRS matrix (model to world matrix)
    modelViewMatrix = m3.translate(modelViewMatrix, 200, 200);
    modelViewMatrix = m3.rotate(modelViewMatrix, angleInRadians);
    // modelViewMatrix = m3.scale(modelViewMatrix, 1, 1);

    modelViewMatrix = m3.multiply(modelViewMatrix, model.matrix);
    
  
    gl.uniformMatrix3fv(programInfo.uModelViewMatrix.location, false, modelViewMatrix);
  
    {
      const offset = 0;
      const vertexCount = model.vertices.length / model.itemsPerVertex;
      gl.drawArrays(model.drawMode, offset, vertexCount);
    }
  })

  window.requestAnimationFrame((time: number) => {
    const currentAngle = 2 * Math.PI * time / 5000;   // 5000ms => 2s => 1 revolation every 2 sec
    drawScene(gl, stuffsToDraw, currentAngle);
  })
}

main();
