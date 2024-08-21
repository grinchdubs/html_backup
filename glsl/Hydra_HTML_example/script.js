let hydra, hydraCanvas;
hydraCanvas = document.createElement("canvas");
hydraCanvas.width = window.innerWidth;
hydraCanvas.height = window.innerHeight;
hydraCanvas.id = "hydraCanvas";

hydra = new Hydra({
  canvas: hydraCanvas,
  detectAudio: false,
  enableStreamCapture: false,
  width: window.innerWidth,
  height: window.innerHeight,
});

document.body.appendChild(hydraCanvas);


const codeblocks = document.querySelectorAll("code");

let initialized = false;

for(const cb of codeblocks) {
  if(initialized == false) {
    eval(cb.textContent);
    initialized = true;
  }

  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting === true) {
      // hush();
      // solid(0,0,0,0).out(o0)
      // solid(0,0,0,0).out(o1)
      // solid(0,0,0,0).out(o2)
      // solid(0,0,0,0).out(o3)
      render(o0);
      setTimeout(()=>{
        eval(cb.textContent)
      }, 60);
    }
  }, { threshold: [0.7] });

  observer.observe(cb);
}
      