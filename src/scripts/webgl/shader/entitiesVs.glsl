attribute vec2 uv;

uniform sampler2D tAgentMap;

varying float vType;

void main(){
    vec4 agent = texture2D(tAgentMap, uv);

    agent.xy = agent.xy * 2.0 - 1.0;
    vType = agent.w;

    gl_Position = vec4(agent.xy, 0.0, 1.0);
    gl_PointSize = 1.0;
}