precision highp float;

#define rot(angle) vec2(cos(angle), sin(angle))

uniform sampler2D tTrailMap;
uniform sampler2D tPrev;
uniform vec2 uPx;
uniform float uTime;
uniform float uSa;
uniform float uRa;
uniform float uSo;
uniform float uSs;

varying vec2 vUv;

const float PI = acos(-1.0);
const float PI2 = PI * 2.0;

float rand(in vec2 seed) {
  return fract(tan(distance(seed * (uTime + 1.61803398874989484820459), vec2(1.61803398874989484820459, PI))) * 1.41421356237309504880169);
}

void main() {
  vec2 so = uSo * uPx;
  vec2 ss = uSs * uPx;

  vec4 val = texture2D(tPrev, vUv);

  float angle = val.z * PI2;

  vec2 uvFL = val.xy + rot(angle - uSa) * so;
  vec2 uvF  = val.xy + rot(angle) * so;
  vec2 uvFR = val.xy + rot(angle + uSa) * so;

  float fl = texture2D(tTrailMap, uvFL).g;
  float f = texture2D(tTrailMap, uvF).g;
  float fr = texture2D(tTrailMap, uvFR).g;

  if(fl < f && fr < f) {}
  else if(f < fl && f < fr) {
    if(rand(val.xy) < 0.5) {
      angle += uRa;
    } else {
      angle -= uRa;
    }
  }
  else if(fl < fr) { angle += uRa; }
  else if(fr < fl) { angle -= uRa; }

  vec2 offset = rot(angle) * ss;
  val.xy += offset;

  val.xy = fract(val.xy);
  val.z = angle / PI2;

  gl_FragColor = val;
}