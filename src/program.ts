
export type ProgramProps = 
  {program: WebGLProgram}
  & Partial<Record<ProgramAttribute, AttributeProps>>
  & Partial<Record<ProgramUniform, UniformProps>>

export interface AttributeProps {
  location: GLint;
  buffer: WebGLBuffer;
  size: GLint;
};

export interface UniformProps {
  location: WebGLUniformLocation;
}

type ProgramAttribute = 'aPosition';
type ProgramUniform = 'uModelViewMatrix';

/**
 * Should be called one outside the render loop
 */
export function prepareAttribute(gl: WebGLRenderingContext, props: ProgramProps, attr: ProgramAttribute, values: number[]) {
  const location = gl.getAttribLocation(props.program, attr);
  const buffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);

  props[attr] = {
    buffer,
    location,
    size: 2
  }
}

export function prepareUniform(gl: WebGLRenderingContext, props: ProgramProps, attr: ProgramUniform) {
  const location = gl.getUniformLocation(props.program, attr);
  props[attr] = {
    location,
  }
}

export function enableAttribute(gl: WebGLRenderingContext, attr: AttributeProps) {
  gl.bindBuffer(gl.ARRAY_BUFFER,  attr.buffer);
  gl.enableVertexAttribArray(attr.location);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = attr.size;  // number of components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer

  gl.vertexAttribPointer(attr.location, size, type, normalize, stride, offset)
}


export function createProgram(gl: WebGLRenderingContext): ProgramProps {
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
  }
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