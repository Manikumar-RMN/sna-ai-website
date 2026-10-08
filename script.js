import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

document.getElementById("year").textContent=new Date().getFullYear();

const canvas=document.getElementById("scene");
const visual=document.querySelector(".hero-visual");
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile=window.matchMedia("(max-width:900px)").matches;
const pointer={x:0,y:0,tx:0,ty:0};
let renderer,scene,camera,system,core,inner,clockStart=performance.now();

const C={violet:0x8d7cff,blue:0x5d8fff,soft:0xc0b8ff};

function init(){
  try{
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!mobile,powerPreference:"high-performance"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,mobile?1.2:1.7));
    renderer.setClearColor(0x000000,0);
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(30,1,.1,100);
    camera.position.set(0,0,8.2);
    system=new THREE.Group();
    scene.add(system);

    core=new THREE.Mesh(
      new THREE.IcosahedronGeometry(mobile?.7:.92,2),
      new THREE.MeshBasicMaterial({color:C.violet,transparent:true,opacity:.8,wireframe:true})
    );
    system.add(core);

    const coreBox=new THREE.Mesh(
      new THREE.BoxGeometry(mobile?.66:.88,mobile?.66:.88,mobile?.66:.88),
      new THREE.MeshBasicMaterial({color:C.blue,transparent:true,opacity:.2,wireframe:true})
    );
    coreBox.rotation.set(.35,.45,.15);
    system.add(coreBox);
    inner=coreBox;

    const glow=new THREE.Mesh(
      new THREE.SphereGeometry(mobile?.46:.62,28,28),
      new THREE.MeshBasicMaterial({color:C.violet,transparent:true,opacity:.11})
    );
    system.add(glow);

    const rings=[
      [mobile?1.02:1.35,.016,C.violet,1.08,.52],
      [mobile?1.35:1.78,.012,C.blue,.72,.34],
      [mobile?1.68:2.25,.009,C.violet,.45,.25]
    ];
    rings.forEach(([radius,tube,color,rot,opacity],i)=>{
      const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,8,120),
        new THREE.MeshBasicMaterial({color,transparent:true,opacity,wireframe:true}));
      ring.rotation.x=rot;
      ring.rotation.y=i*.58;
      ring.userData.speed=(i===1?-1:1)*(i+1)*.00065;
      system.add(ring);
    });

    const left=[[-1.8,.95,.2],[-2.02,.28,-.15],[-1.84,-.42,.2],[-1.55,-1.02,-.1]];
    const right=[[1.78,.95,-.1],[2.02,.3,.15],[1.86,-.4,-.2],[1.55,-1.02,.15]];
    const points=[...left,...right];

    const addPoint=(p,color)=>{
      const g=new THREE.Group();
      g.position.set(...p);
      const dot=new THREE.Mesh(new THREE.SphereGeometry(mobile?.055:.075,12,12),new THREE.MeshBasicMaterial({color}));
      const ring=new THREE.Mesh(new THREE.RingGeometry(mobile?.1:.14,mobile?.112:.15,24),
        new THREE.MeshBasicMaterial({color,transparent:true,opacity:.5,side:THREE.DoubleSide}));
      ring.rotation.x=Math.PI/2;
      g.add(dot,ring);
      system.add(g);
    };
    left.forEach(p=>addPoint(p,C.blue));
    right.forEach(p=>addPoint(p,C.violet));

    const line=(a,b,color,opacity=.18)=>{
      const curve=new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(...a),
        new THREE.Vector3((a[0]+b[0])*.5,(a[1]+b[1])*.5+(a[0]<0?.22:-.22),0),
        new THREE.Vector3(...b)
      );
      system.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(22)),
        new THREE.LineBasicMaterial({color,transparent:true,opacity})
      ));
    };

    left.forEach(p=>line(p,[0,0,0],C.blue,.2));
    right.forEach(p=>line([0,0,0],p,C.violet,.2));
    for(let i=0;i<3;i++){line(left[i],left[i+1],C.blue,.09);line(right[i],right[i+1],C.violet,.09);}

    const particleGeometry=new THREE.BufferGeometry();
    const count=mobile?80:180;
    const data=new Float32Array(count*3);
    for(let i=0;i<data.length;i++)data[i]=(Math.random()-.5)*7;
    particleGeometry.setAttribute("position",new THREE.BufferAttribute(data,3));
    system.add(new THREE.Points(particleGeometry,new THREE.PointsMaterial({
      color:C.violet,size:mobile?.018:.024,transparent:true,opacity:.42
    })));

    addEvents();
    resize();
    if(reduce) render(0); else animate();
  }catch(e){
    canvas.style.display="none";
    visual.classList.add("no-webgl");
  }
}

function addEvents(){
  window.addEventListener("pointermove",e=>{
    pointer.tx=(e.clientX/window.innerWidth-.5)*.75;
    pointer.ty=(e.clientY/window.innerHeight-.5)*.45;
  },{passive:true});
  window.addEventListener("resize",resize,{passive:true});
}

function resize(){
  if(!renderer)return;
  const w=visual.clientWidth;
  const h=visual.clientHeight;
  renderer.setSize(w,h,false);
  camera.aspect=w/h;
  camera.updateProjectionMatrix();
}

function render(t){
  const elapsed=t-clockStart;
  pointer.x+=(pointer.tx-pointer.x)*.045;
  pointer.y+=(pointer.ty-pointer.y)*.045;

  system.rotation.y+=mobile?.00105:.0015;
  system.rotation.x=pointer.y*.1;
  system.rotation.z=pointer.x*.025;
  system.position.x=pointer.x*.08;
  system.position.y=-pointer.y*.05;

  core.rotation.x+=.001;
  core.rotation.z+=.0008;
  inner.rotation.x-=.00065;
  inner.rotation.y+=.001;

  system.children.forEach(c=>{if(c.userData.speed)c.rotation.z+=c.userData.speed});

  const pulse=1+Math.sin(elapsed*.0015)*.035;
  core.scale.setScalar(pulse);
  camera.position.x=pointer.x*.12;
  camera.position.y=-pointer.y*.07;
  camera.lookAt(0,0,0);
  renderer.render(scene,camera);
}

function animate(t=performance.now()){requestAnimationFrame(animate);render(t)}

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const target=document.querySelector(a.getAttribute("href"));
    if(target){e.preventDefault();target.scrollIntoView({behavior:reduce?"auto":"smooth"})}
  });
});

const menuButton=document.querySelector(".menu-button");
const mobileMenu=document.querySelector(".mobile-menu");
if(menuButton){
  menuButton.addEventListener("click",()=>{
    const open=mobileMenu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded",String(open));
    mobileMenu.setAttribute("aria-hidden",String(!open));
  });
  mobileMenu.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
    mobileMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded","false");
    mobileMenu.setAttribute("aria-hidden","true");
  }));
}

init();
