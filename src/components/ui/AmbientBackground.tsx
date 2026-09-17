"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;

  vec3 oklchToLinear(vec3 c) {
    float l = c.x;
    float a = c.y;
    float b = c.z;
    float L = l + 0.3963377774 * a + 0.2158037573 * b;
    float M = l - 0.1055613458 * a - 0.0638541728 * b;
    float S = l - 0.0894841775 * a - 1.2914855480 * b;
    L = L * L * L;
    M = M * M * M;
    S = S * S * S;
    return vec3(
      4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
      -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
      -0.0041960863 * L - 0.7034186147 * M + 1.7076147010 * S
    );
  }

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(noise(i), noise(i + vec2(1.0, 0.0)), u.x),
      mix(noise(i + vec2(0.0, 1.0)), noise(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float t = u_time * 0.18;

    // 4 animated color stops in OKLCH-like space
    float w1 = 0.25 + 0.18 * sin(t * 0.7 + uv.x * 3.1);
    float w2 = 0.28 + 0.15 * cos(t * 0.5 + uv.y * 2.8);
    float w3 = 0.24 + 0.14 * sin(t * 0.9 + uv.x * 1.9 + uv.y * 2.2);
    float w4 = 1.0 - w1 - w2 - w3;

    // Color stops: deep dark, lime tint, subtle purple, pure dark
    vec3 c1 = vec3(0.02, 0.02, 0.02);   // #050505 deep
    vec3 c2 = vec3(0.06, 0.09, 0.015);  // lime-tinted dark
    vec3 c3 = vec3(0.03, 0.02, 0.06);   // purple-dark
    vec3 c4 = vec3(0.01, 0.01, 0.01);   // pure dark

    vec3 col = w1 * c1 + w2 * c2 + w3 * c3 + w4 * c4;

    // Subtle vignette
    float d = distance(uv, vec2(0.5));
    col = mix(col, col * 0.5, smoothstep(0.3, 0.85, d));

    // Film grain
    float grain = smoothNoise(uv * 200.0 + t * 50.0) * 0.018;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (prefersReducedMotion) {
      canvas.style.display = "none";
      return;
    }

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    // Build program
    const vert = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const frag = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram()!;
    gl.attachShader(program, vert!);
    gl.attachShader(program, frag!);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let rafId: number;
    let paused = false;
    const startTime = performance.now();

    const render = (now: number) => {
      if (!paused) {
        gl.uniform1f(uTime, (now - startTime) * 0.001);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    // Pause when not visible
    const io = new IntersectionObserver(
      ([entry]) => { paused = !entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <>
      {/* WebGL canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full -z-10"
        aria-hidden="true"
      />
      {/* Static CSS fallback (no-JS / no-WebGL) */}
      <noscript>
        <div className="absolute inset-0 -z-10 bg-[#050505]" />
      </noscript>
    </>
  );
}
