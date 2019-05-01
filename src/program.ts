export interface ProgramInfo {
  program: WebGLProgram,
  aPosition: {
    location: GLint;
  }
  uModelViewMatrix: {
    location: WebGLUniformLocation;  
  }
}

export interface AttributeInfo {
  location: GLint;
  buffer: WebGLBuffer;
};

export interface UniformProps {
  location: WebGLUniformLocation;
}

export function loadDataOntoGPU(gl: WebGLRenderingContext, bufferData: number[]): WebGLBuffer {
  const buffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);

  return buffer;
}


export function createProgram(gl: WebGLRenderingContext): ProgramInfo {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, getVertexShaderSource());
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, getFragmentShaderSource());

   // Create the shader program
   const shaderProgram = gl.createProgram();
   gl.attachShader(shaderProgram, vertexShader);
   gl.attachShader(shaderProgram, fragmentShader);
   gl.linkProgram(shaderProgram);

   // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return {
    program: shaderProgram,
    aPosition: {
      location: gl.getAttribLocation(shaderProgram, 'aPosition')
    },
    uModelViewMatrix: {
      location: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
    }
  }
}

export function enableAttribute(gl: WebGLRenderingContext, location: GLint, buffer: WebGLBuffer, itemsPerIteration: number) {
  gl.bindBuffer(gl.ARRAY_BUFFER,  buffer);
  gl.enableVertexAttribArray(location);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = itemsPerIteration;  // number of components per iteration
  var type = gl.FLOAT;           // the data is 32bit floats
  var normalize = false;         // don't normalize the data
  var stride = 0;                // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;                // start at the beginning of the buffer

  gl.vertexAttribPointer(location, size, type, normalize, stride, offset)
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function compileShader(gl: WebGLRenderingContext, type, source: string) {
  const shader = gl.createShader(type);

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}


function getVertexShaderSource() {
    return `
    attribute vec2 aPosition;
  
    uniform mat3 uModelViewMatrix;
  
    void main() {
      gl_Position = vec4(uModelViewMatrix * vec3(aPosition, 1), 1);
    }
    `;
  }
  
  function getFragmentShaderSource() {
    return `
    void main() {
      gl_FragColor = vec4(1.0, 0, 0.5, 1.0);
    }
    `;
  }