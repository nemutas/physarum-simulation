precision highp float;

varying float vType;

void main(){
  if (0.5 < distance(gl_PointCoord.xy, vec2(0.5))) discard;

  float d = 1.0 - length(gl_PointCoord.xy - 0.5);
  gl_FragColor = vec4(d, 0.0, 0.0, vType);
}