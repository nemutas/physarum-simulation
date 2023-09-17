precision highp float;

uniform sampler2D tTrailMap;
uniform vec2 uUvTransform;

varying vec2 vUv;

void main() {
  vec2 uv = (vUv - 0.5) * uUvTransform + 0.5;
  float sim = texture2D(tTrailMap, uv).b;
  vec3 color = vec3(sim);

  vec3 col = vec3(0.77, 0.40, 0.40);
  color = mix(vec3(0.0), col, color * 2.5);

  float dist = distance(vUv, vec2(0.5));
  dist = 1.0 - smoothstep(0.2, 0.55, dist);
  color *= dist;
  
  gl_FragColor = vec4(color, 1.0);
}