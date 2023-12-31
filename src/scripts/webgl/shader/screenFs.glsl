precision highp float;

uniform sampler2D tTrailMap;
uniform vec2 uUvTransform;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
  vec2 uv = (vUv - 0.5) * uUvTransform + 0.5;
  vec4 trail = texture2D(tTrailMap, uv);

  vec3 color = mix(vec3(0.0), vec3(trail.b), uColor * 2.5);

  float dist = distance(vUv, vec2(0.5));
  dist = 1.0 - smoothstep(0.2, 0.55, dist);
  color *= dist;
  
  gl_FragColor = vec4(color, 1.0);
}