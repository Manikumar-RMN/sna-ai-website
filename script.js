import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

document.getElementById("year").textContent=new Date().getFullYear();

const canvas=document.getElementById("scene");
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile=window.matchMedia("(max-width:900px)").matches;
const pointer={x:0,y:0,tx:0,ty:0};
let renderer,scene,camera,system,core,inner,ring1,ring2,ring3;
let heroHeight=1,scrollProgress=0;

function wire(color,opacity=1){
  return new THREE.MeshBasicMaterial({color,transparent:opacity<1,opacity,wireframe:true});
}

function init(){
  try{
    renderer=new THREE.WebGLRenderer({
      canvas,alpha:true,antialias:!mobile,powerPreference:"high-performance"
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.25:1.7));

    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(38,innerWidth/heroHeight,.1,100);
    camera.position.set(0,0,7);

    system=new THREE.Group();
    scene.add(system);

    core=new THREE.Mesh(new THREE.IcosahedronGeometry(mobile?.72:1,2),wire(0x8174ff,.78));
    system.add(core);

    inner=new THREE.Mesh(
      new THREE.SphereGeometry(mobile?.31:.42,24,24),
      new THREE.MeshBasicMaterial({color:0x8174ff,transparent:true,opacity:.15})
    );
    system.add(inner);

    ring1=new THREE.Mesh(new THREE.TorusGeometry(mobile?1.15:1.65,.012,8,96),wire(0x8174ff,.45));
    ring2=new THREE.Mesh(new THREE.TorusGeometry(mobile?1.5:2.05,.009,8,96),wire(0x5d8cff,.32));
    ring3=new THREE.Mesh(new THREE.TorusGeometry(mobile?1.85:2.45,.007,8,96),wire(0x8174ff,.22));
    ring1.rotation.x=1.1; ring2.rotation.y=.8; ring3.rotation.x=.45;
    system.add(ring1,ring2,ring3);

    const labels=["UNDERSTAND","IDENTIFY","ASSESS","DESIGN","IMPLEMENT","IMPROVE","AI AUTOMATION","CUSTOM APPS","INTEGRATION","SUPPORT"];
    const count=mobile?8:10;
    const nodes=[];

    for(let i=0;i<count;i++){
      const a=i/count*Math.PI*2;
      const r=mobile?1.65:2.25;
      const p=new THREE.Vector3(Math.cos(a)*r,Math.sin(i*1.7)*.62,Math.sin(a)*r);

      const g=new THREE.Group();
      g.position.copy(p);

      const sphere=new THREE.Mesh(
        new THREE.SphereGeometry(mobile?.075:.095,16,16),
        new THREE.MeshBasicMaterial({color:i<6?0x9b90ff:0x5d8cff})
      );
      const halo=new THREE.Mesh(
        new THREE.RingGeometry(mobile?.14:.18,mobile?.155:.2,24),
        new THREE.MeshBasicMaterial({color:0x8174ff,transparent:true,opacity:.5,side:THREE.DoubleSide})
      );
      halo.rotation.x=Math.PI/2;
      g.add(sphere,halo);
      g.userData.label=labels[i];
      system.add(g);
      nodes.push(g);

      const line=new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),p]),
        new THREE.LineBasicMaterial({color:0x8174ff,transparent:true,opacity:.18})
      );
      system.add(line);
    }

    for(let i=0;i<nodes.length;i++){
      const a=nodes[i].position,b=nodes[(i+1)%nodes.length].position;
      system.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([a,b]),
        new THREE.LineBasicMaterial({color:0x5d8cff,transparent:true,opacity:.12})
      ));
    }

    const pg=new THREE.BufferGeometry();
    const pc=mobile?70:190;
    const arr=new Float32Array(pc*3);
    for(let i=0;i<arr.length;i++) arr[i]=(Math.random()-.5)*8;
    pg.setAttribute("position",new THREE.BufferAttribute(arr,3));
    system.add(new THREE.Points(
      pg,
      new THREE.PointsMaterial({color:0x8174ff,size:mobile?.018:.025,transparent:true,opacity:.38})
    ));

    resize();
    addEventListener("pointermove",e=>{
      pointer.tx=(e.clientX/innerWidth-.5)*.8;
      pointer.ty=(e.clientY/innerHeight-.5)*.5;
    },{passive:true});
    canvas.addEventListener("touchmove",e=>{
      const t=e.touches[0];
      if(t){
        pointer.tx=(t.clientX/innerWidth-.5)*1.15;
        pointer.ty=(t.clientY/innerHeight-.5)*.75;
      }
    },{passive:true});

    addEventListener("scroll",updateScroll,{passive:true});
    addEventListener("resize",resize);

    if(reduce) render(0);
    else animate();
  }catch(e){
    canvas.style.display="none";
  }
}

function resize(){
  if(!renderer)return;
  heroHeight=document.querySelector(".hero").offsetHeight;
  renderer.setSize(innerWidth,heroHeight,false);
  camera.aspect=innerWidth/heroHeight;
  camera.updateProjectionMatrix();
}

function updateScroll(){
  const rect=document.querySelector(".hero").getBoundingClientRect();
  scrollProgress=Math.min(1,Math.max(0,-rect.top/(heroHeight*.8)));
  const labels=document.querySelectorAll(".system-label");
  labels.forEach((el,i)=>{
    el.style.opacity=String(Math.max(.15,1-scrollProgress*.9));
    el.style.transform=`translate3d(0,${scrollProgress*(i%2?12:-12)}px,0)`;
  });
}

function render(t){
  pointer.x+=(pointer.tx-pointer.x)*.035;
  pointer.y+=(pointer.ty-pointer.y)*.035;

  const drift=reduce?0:Math.sin(t*.00045)*.08;
  const speed=mobile?.0012:.0018;

  system.rotation.y+=speed*(1-scrollProgress*.7);
  if(mobile) system.rotation.y+=0.0009;
  system.rotation.x=pointer.y*.18-scrollProgress*.16;
  system.rotation.z=pointer.x*.05;
  system.position.y=drift-scrollProgress*.12;

  core.rotation.x+=.0012;
  core.rotation.z+=.001;
  inner.scale.setScalar(1+Math.sin(t*.0012)*.045);
  ring1.rotation.z+=.0011;
  ring2.rotation.x+=.0007;
  ring3.rotation.z-=.0006;

  camera.position.x=pointer.x*.22;
  camera.position.y=-pointer.y*.12+scrollProgress*.35;
  camera.position.z=7-scrollProgress*.7;
  camera.lookAt(0,0,0);

  renderer.render(scene,camera);
}

function animate(t=0){
  requestAnimationFrame(animate);
  render(t);
}

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const target=document.querySelector(a.getAttribute("href"));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:reduce?"auto":"smooth"});
    }
  });
});

init();