// Recreations of Blender procedural materials that the glTF exporter drops.
// Values are copied from the node trees in Website.blend.
import { ShaderMaterial, Color, Vector3, DoubleSide } from "three";

const outputChunks = `
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`;

// Classic 3D Perlin noise (Stefan Gustavson), range roughly [-1, 1]
const perlin = `
  vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
  float cnoise(vec3 P) {
    vec3 Pi0 = floor(P), Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod(Pi0, 289.0); Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P), Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz, iz1 = Pi1.zzzz;
    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0), ixy1 = permute(ixy + iz1);
    vec4 gx0 = ixy0 / 7.0, gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    vec4 gx1 = ixy1 / 7.0, gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x), g100 = vec3(gx0.y, gy0.y, gz0.y);
    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z), g110 = vec3(gx0.w, gy0.w, gz0.w);
    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x), g101 = vec3(gx1.y, gy1.y, gz1.y);
    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z), g111 = vec3(gx1.w, gy1.w, gz1.w);
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
    float n000 = dot(g000, Pf0), n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z)), n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z)), n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz)), n111 = dot(g111, Pf1);
    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    return 2.2 * mix(n_yz.x, n_yz.y, fade_xyz.x);
  }
`;

// Dust: Noise Texture (3D fBM, scale 3, detail 8, roughness 0.5, lacunarity 2)
// on Generated coords -> Color Ramp (0.405 black, 0.548 grey 0.152) -> Alpha
export function createDustMaterial(geometry) {
  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox;
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    uniforms: {
      uColor: { value: new Color(0.044, 0.024, 0.013) },
      uBoxMin: { value: min.clone() },
      uBoxSize: { value: new Vector3().subVectors(max, min) },
    },
    vertexShader: `
      uniform vec3 uBoxMin;
      uniform vec3 uBoxSize;
      varying vec3 vGenerated;
      void main() {
        vGenerated = (position - uBoxMin) / max(uBoxSize, vec3(1e-5));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying vec3 vGenerated;
      ${perlin}
      void main() {
        vec3 p = vGenerated * 3.0;
        float sum = 0.0, amp = 1.0, maxAmp = 0.0;
        for (int i = 0; i < 8; i++) {
          sum += cnoise(p) * amp;
          maxAmp += amp;
          amp *= 0.5;
          p *= 2.0;
        }
        float fac = clamp(0.5 + 0.5 * sum / maxAmp, 0.0, 1.0);
        float alpha = 0.152 * smoothstep(0.0, 1.0, (fac - 0.405) / (0.548 - 0.405));
        gl_FragColor = vec4(uColor, alpha);
        ${outputChunks}
      }
    `,
  });
}

// Flame: Object coords -> Mapping (scale 1, 1, 0.1) -> Spherical Gradient
// -> Color Ramp (alpha) mixing Transparent/Emission, and Color Ramp.001 (blue) -> Emission, strength 10
export function createFlameMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    // Tone mapping shifts the 10x-bright blue towards pink, so it's left off here
    toneMapped: false,
    side: DoubleSide,
    vertexShader: `
      varying vec3 vObject;
      void main() {
        vObject = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vObject;
      float ramp(float t, float a, float b) { return clamp((t - a) / (b - a), 0.0, 1.0); }
      void main() {
        // Blender's Z axis is glTF's Y axis, so the 0.1 scale applies to y here
        vec3 p = vObject * vec3(1.0, 0.1, 1.0);
        float g = max(1.0 - length(p), 0.0);
        float alpha = g < 0.648 ? 0.151 * ramp(g, 0.207, 0.648) : mix(0.151, 1.0, ramp(g, 0.648, 0.886));
        vec3 color = mix(vec3(0.001, 0.01, 1.0), vec3(0.0, 0.081, 1.0), ramp(g, 0.689, 0.902));
        gl_FragColor = vec4(color * 10.0, alpha);
        ${outputChunks}
      }
    `,
  });
}
