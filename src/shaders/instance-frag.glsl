#version 300 es
precision highp float;

layout (location = 0) out vec4 color;

uniform sampler2D image;

void main() {
    //color = vec4(0.0, 0.0, 0.8, 1.0) * texture( image, gl_PointCoord );
    color = vec4(0.0, 0.0, 1.0, 1.0);
}
