attribute vec2 uv;

uniform sampler2D tAgentMap;

void main(){
    vec2 sim = texture2D(tAgentMap, uv).xy;
    sim = sim * 2.0 - 1.0;

    gl_Position = vec4(sim, 0.0, 1.0);
    gl_PointSize = 0.5;
}