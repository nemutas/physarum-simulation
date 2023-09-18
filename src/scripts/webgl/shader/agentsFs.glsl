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
  vec4 prev = texture2D(tPrev, vUv);
  float type = prev.w;

  vec2 so = uSo * uPx;
  vec2 ss = uSs * uPx;

  float angle = prev.z * PI2;

  vec2 uvFL = prev.xy + rot(angle - uSa) * so;
  vec2 uvF  = prev.xy + rot(angle) * so;
  vec2 uvFR = prev.xy + rot(angle + uSa) * so;

  float fl = texture2D(tTrailMap, uvFL).g;
  float f = texture2D(tTrailMap, uvF).g;
  float fr = texture2D(tTrailMap, uvFR).g;

  if(fl < f && fr < f) {}
  else if(f < fl && f < fr) {
    if(rand(prev.xy) < 0.5) {
      angle += uRa;
    } else {
      angle -= uRa;
    }
  }
  else if(fl < fr) { angle += uRa; }
  else if(fr < fl) { angle -= uRa; }

  vec2 offset = rot(angle) * ss;
  prev.xy += offset;

  prev.xy = fract(prev.xy);
  prev.z = angle / PI2;

  gl_FragColor = prev;
}