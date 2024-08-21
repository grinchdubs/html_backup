// 

export const spCode =  `
  
  let spinningSphere = shape((x, theta) => {
  rotateZ(theta);
  displace(vec3(0.2 + x * nsin(time * 1.2), 0, 0));
  color(vec3(theta / (2 * PI), ncos(time), nsin(time)));
  sphere(0.2);
});

let sphereCount = 5;
rotateZ(time);
blend(0.5);
for (let i = 0; i < sphereCount; ++i) { 
  spinningSphere(0.5, 2.0 * PI * i / sphereCount);
}

let scale = 0.05;
let s = getSpace();
let n = noise(scale * s * time);
reset();
displace(vec3(n, n, n));
sphere(0.1);
`;