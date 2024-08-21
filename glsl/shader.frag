#ifdef GL_ES
precision mediump float;
#endif




////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

uniform vec2 u_resolution;
uniform float iScale;
uniform float u_time;
uniform float u_delta;
uniform int u_frame;
uniform vec4 u_mouse;
uniform vec4 u_date;

#define iTime u_time
#define iResolution u_resolution
#define fragCoord gl_FragCoord
#define fragColor gl_FragColor

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// Fork of "3D voronoi fog" by jasondecode. https://shadertoy.com/view/XlXBWj
// 2020-03-31 03:27:56

/*
3D Voronoi fogness.

Author: Tim Gerritsen <tim@mannetje.org>
Date: December 2017

*/

#define MAX_MARCH_STEPS 16
#define MARCH_STEP_SIZE 0.2

#define NOISE_AMPLITUDE 0.75

#define FBM_ITERATIONS 3
#define FBM_AMPLITUDE_GAIN .8
#define FBM_FREQUENCY_GAIN 1.9

// 2*tan(radians(45)/2)
#define FOV45 0.82842693331417825056778150945139

vec3 UvToWorld(vec2 uv) { return normalize(vec3((uv-0.5) * iResolution.xy, -iResolution.y / FOV45)); }
vec3 Hash3( vec3 p ) { return fract(sin(vec3( dot(p,vec3(127.1,311.7,786.6)), dot(p,vec3(269.5,183.3,455.8)), dot(p,vec3(419.2,371.9,948.6))))*43758.5453); }
float Voronoi(vec3 p)
{
  vec3 n = floor(p);
  vec3 f = fract(p);

  float shortestDistance = 1.0;
  for (int x = -1; x < 1; x++) {
    for (int y = -1; y < 1; y++) {
      for (int z = -1; z < 1; z++) {
        vec3 o = vec3(x,y,z);
        vec3 r = (o - f) + 1.0 + sin(Hash3(n + o)*50.0)*0.2;
        float d = dot(r,r);
        if (d < shortestDistance) {
          shortestDistance = d;
        }
      }
    }
  }
  return shortestDistance;
}

float FractalVoronoi(vec3 p)
{
  float n = 0.0;
  float f = 0.8, a = 0.5;
  mat2 m = mat2(1, 0.6, -0.6, 0.8);
  for (int i = 0; i < FBM_ITERATIONS; i++) {
    n += Voronoi(p * f) * a;
    f *= FBM_FREQUENCY_GAIN;
    a *= FBM_AMPLITUDE_GAIN;
    p.xy = m * p.xy;
  }
  return n;
}

vec2 March(vec3 origin, vec3 direction)
{
  float depth = MARCH_STEP_SIZE;
  float d = 0.0;
  for (int i = 0; i < MAX_MARCH_STEPS; i++) {
    vec3 p = origin + direction * depth;
    d = FractalVoronoi(p) * NOISE_AMPLITUDE;
    depth += max(MARCH_STEP_SIZE, d);
  }
  return vec2(depth, d);
}

void main()
{
  vec2 res = iResolution.xy;
  vec2 uv = (fragCoord.xy / res);

  vec3 direction = UvToWorld(uv);
  vec3 origin = vec3(0.0, -iTime*0.2, 0.0);
  vec2 data = March(origin, direction);
    
  vec4 color = vec4(.5, 0.615733, 0.555, 1) * data.y * data.x * 0.7;
        fragColor = mix(color, vec4(1,.2,1,1), max(0.0, 0.4-data.y));
}

