import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

document.getElementById("year").textContent=new Date().getFullYear();

const canvas=document.getElementById("scene");
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile=window.matchMedia("(max-width:900px)").matches;
const pointer={x:0,y:0,tx:0,ty:0};
let renderer,scene,camera,system,core,inner,clockStart=performance.now();

const colors={violet:0x8a78ff,blue:0x5e8fff,soft:0xb7b0ff};

function init(){
  try{
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!mobile,powerPreference:"high-performance"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,mobile?1.25:1.7));
    renderer.setClearColor(0x000000,0);
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(34,1,.1,100);
    camera.position.set(0,0,7.6);

    system=new THREE.Group();
    scene.add(system);

    core=new THREE.Mesh(
      new THREE.IcosahedronGeometry(mobile?.68:.9,2),
      new THREE.MeshBasicMaterial({color:colors.violet,transparent:true,opacity:.92,wireframe:true})
    );
    system.add(core);

    const glow=new THREE.Mesh(
      new THREE.SphereGeometry(mobile?.43:.54,24,24),
      new THREE.MeshBasicMaterial({color:colors.violet,transparent:true,opacity:.12})
    );
    system.add(glow);

    inner=new THREE.Mesh(
      new THREE.BoxGeometry(mobile?.42:.52,mobile?.42:.52,mobile?.42:.52),
      new THREE.MeshBasicMaterial({color:colors.blue,transparent:true,opacity:.18,wireframe:true})
    );
    system.add(inner);

    const rings=[
      [mobile?1.1:1.45,.012,colors.violet,1.08,.4],
      [mobile?1.45:1.9,.009,colors.blue,.72,.32],
      [mobile?1.8:2.35,.007,colors.violet,.44,.22]
    ];
    rings.forEach(([radius,tube,color,rot,opacity],i)=>{
      const r=new THREE.Mesh(
        new THREE.TorusGeometry(radius,tube,8,96),
        new THREE.MeshBasicMaterial({color,transparent:true,opacity,wireframe:true})
      );
      r.rotation.x=rot;
      r.rotation.y=i*.55;
      r.userData.speed=(i===1?-1:1)*(i+1)*.0005;
      system.add(r);
    });

    const inputPositions=[
      [-1.75,.9,.55],[-1.95,.2,.05],[-1.75,-.55,-.4],[-1.35,-1.05,.45]
    ];
    const outputPositions=[
      [1.65,.95,-.35],[1.95,.28,.35],[1.78,-.45,-.25],[1.35,-1.05,.35]
    ];
    const nodes=[];

    function addNode(pos,color){
      const p=new THREE.Vector3(...pos);
      const g=new THREE.Group();
      g.position.copy(p);
      const dot=new THREE.Mesh(
        new THREE.SphereGeometry(mobile?.065:.085,14,14),
        new THREE.MeshBasicMaterial({color})
      );
      const halo=new THREE.Mesh(
        new THREE.RingGeometry(mobile?.11:.15,mobile?.125:.17,24),
        new THREE.MeshBasicMaterial({color,transparent:true,opacity:.55,side:THREE.DoubleSide})
      );
      halo.rotation.x=Math.PI/2;
      g.add(dot,halo);
      system.add(g);
      nodes.push(g);
      return p;
    }

    inputPositions.forEach(p=>addNode(p,colors.blue));
    outputPositions.forEach(p=>addNode(p,colors.violet));

    const lineMaterial=(color,opacity)=>new THREE.LineBasicMaterial({color,transparent:true,opacity});
    [...inputPositions,...outputPositions].forEach((p,i)=>{
      system.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(...p)]),
        lineMaterial(i<4?colors.blue:colors.violet,.18)
      ));
    });

    for(let i=0;i<3;i++){
      const a=new THREE.Vector3(...inputPositions[i]);
      const b=new THREE.Vector3(...inputPositions[i+1]);
      system.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a,b]),lineMaterial(colors.blue,.1)));
      const c=new THREE.Vector3(...outputPositions[i]);
      const d=new THREE.Vector3(...outputPositions[i+1]);
      system.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([c,d]),lineMaterial(colors.violet,.1)));
    }

    const particleGeometry=new THREE.BufferGeometry();
    const count=mobile?90:220;
    const data=new Float32Array(count*3);
    for(let i=0;i<data.length;i++) data[i]=(Math.random()-.5)*7;
    particleGeometry.setAttribute("position",new THREE.BufferAttribute(data,3));
    system.add(new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({color:colors.violet,size:mobile?.016:.022,transparent:true,opacity:.4})
    ));

    addEvents();
    resize();
    if(reduce) render(0); else animate();
  }catch(error){
    canvas.classList.add("webgl-fallback");
  }
}

function addEvents(){
  window.addEventListener("pointermove",e=>{
    pointer.tx=(e.clientX/window.innerWidth-.5)*.9;
    pointer.ty=(e.clientY/window.innerHeight-.5)*.6;
  },{passive:true});

  canvas.addEventListener("pointerdown",e=>{
    pointer.tx=(e.clientX/window.innerWidth-.5)*1.25;
    pointer.ty=(e.clientY/window.innerHeight-.5)*.9;
  },{passive:true});

  canvas.addEventListener("pointermove",e=>{
    if(e.pointerType==="touch"){
      pointer.tx=(e.clientX/window.innerWidth-.5)*1.25;
      pointer.ty=(e.clientY/window.innerHeight-.5)*.9;
    }
  },{passive:true});

  window.addEventListener("resize",resize);
}

function resize(){
  if(!renderer)return;
  const hero=document.querySelector(".hero");
  const h=hero.offsetHeight;
  renderer.setSize(window.innerWidth,h,false);
  camera.aspect=window.innerWidth/h;
  camera.updateProjectionMatrix();
}

function render(t){
  const elapsed=(t-clockStart);
  pointer.x+=(pointer.tx-pointer.x)*.045;
  pointer.y+=(pointer.ty-pointer.y)*.045;

  const speed=mobile?.00115:.0017;
  system.rotation.y+=speed;
  system.rotation.x=pointer.y*.12;
  system.rotation.z=pointer.x*.035;
  system.position.x=pointer.x*.12;
  system.position.y=pointer.y*-.08;

  core.rotation.x+=.0011;
  core.rotation.z+=.0008;
  inner.rotation.x-=.0007;
  inner.rotation.y+=.001;

  system.children.forEach(child=>{
    if(child.userData.speed) child.rotation.z+=child.userData.speed;
  });

  const pulse=1+Math.sin(elapsed*.0015)*.035;
  core.scale.setScalar(pulse);
  camera.position.x=pointer.x*.16;
  camera.position.y=-pointer.y*.1;
  camera.lookAt(0,0,0);
  renderer.render(scene,camera);
}

function animate(t=performance.now()){
  requestAnimationFrame(animate);
  render(t);
}

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const target=document.querySelector(a.getAttribute("href"));
    if(target){e.preventDefault();target.scrollIntoView({behavior:reduce?"auto":"smooth"});}
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
