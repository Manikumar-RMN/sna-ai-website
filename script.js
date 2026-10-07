import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

document.documentElement.classList.add("js");
document.getElementById("year").textContent=new Date().getFullYear();

const canvas=document.getElementById("scene");
const status=document.getElementById("scene-status");
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let renderer,scene,camera,group,raf=0;
const pointer={x:0,y:0,tx:0,ty:0};
const mobile=window.matchMedia("(max-width:800px)").matches;

function makeNode(position,label,index){
  const node=new THREE.Group();
  node.position.copy(position);
  const size=mobile?.055:.07;
  const sphere=new THREE.Mesh(new THREE.SphereGeometry(size,16,16),new THREE.MeshBasicMaterial({color:index===0?0xffffff:0x9a8fff}));
  const ring=new THREE.Mesh(new THREE.RingGeometry(size*1.8,size*1.92,24),new THREE.MeshBasicMaterial({color:0x8b7cff,transparent:true,opacity:.45,side:THREE.DoubleSide}));
  ring.rotation.x=Math.PI/2;
  node.add(sphere,ring);
  node.userData.label=label;
  return node;
}

function lineBetween(a,b){
  const geo=new THREE.BufferGeometry().setFromPoints([a,b]);
  return new THREE.Line(geo,new THREE.LineBasicMaterial({color:0x7d73d9,transparent:true,opacity:.22}));
}

function init(){
  try{
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!mobile,powerPreference:"high-performance"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,mobile?1.25:1.8));
    renderer.setSize(window.innerWidth,document.querySelector(".hero").offsetHeight,false);
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(38,window.innerWidth/document.querySelector(".hero").offsetHeight,.1,100);
    camera.position.set(0,0,6.4);
    group=new THREE.Group();
    scene.add(group);

    const core=new THREE.Mesh(new THREE.IcosahedronGeometry(mobile?.65:.82,2),new THREE.MeshBasicMaterial({color:0x8b7cff,wireframe:true,transparent:true,opacity:.55}));
    group.add(core);
    const inner=new THREE.Mesh(new THREE.SphereGeometry(mobile?.28:.36,24,24),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.12}));
    group.add(inner);

    const count=mobile?7:11;
    const nodes=[];
    for(let i=0;i<count;i++){
      const angle=(i/count)*Math.PI*2;
      const radius=mobile?1.35:1.65;
      const y=Math.sin(i*1.7)*(.55);
      const p=new THREE.Vector3(Math.cos(angle)*radius,y,Math.sin(angle)*radius);
      const n=makeNode(p,["AI","CRM","EMAIL","DATA","TEAM","REPORTS","CUSTOMER","DOCS","WORKFLOW","ERP","PORTAL"][i],i);
      group.add(n);nodes.push(n);
      group.add(lineBetween(new THREE.Vector3(0,0,0),p));
    }
    for(let i=0;i<nodes.length;i++){
      const a=nodes[i].position,b=nodes[(i+1)%nodes.length].position;
      group.add(lineBetween(a,b));
    }

    const particles=new THREE.BufferGeometry();
    const particleCount=mobile?90:180;
    const arr=new Float32Array(particleCount*3);
    for(let i=0;i<particleCount*3;i++)arr[i]=(Math.random()-.5)*8;
    particles.setAttribute("position",new THREE.BufferAttribute(arr,3));
    group.add(new THREE.Points(particles,new THREE.PointsMaterial({color:0x8b7cff,size:mobile?.018:.024,transparent:true,opacity:.45})));

    window.addEventListener("pointermove",e=>{pointer.tx=(e.clientX/window.innerWidth-.5)*.75;pointer.ty=(e.clientY/window.innerHeight-.5)*.5},{passive:true});
    window.addEventListener("resize",resize,{passive:true});

    if(!reduce) animate();
    else renderer.render(scene,camera);
  }catch(e){
    status.textContent="Business system";
    canvas.style.display="none";
    const fallback=document.createElement("div");
    fallback.className="scene-fallback";
    document.querySelector(".scene-wrap").appendChild(fallback);
  }
}

function resize(){
  if(!renderer)return;
  const h=document.querySelector(".hero").offsetHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,mobile?1.25:1.8));
  renderer.setSize(window.innerWidth,h,false);
  camera.aspect=window.innerWidth/h;
  camera.updateProjectionMatrix();
}

function animate(){
  raf=requestAnimationFrame(animate);
  pointer.x+=(pointer.tx-pointer.x)*.035;
  pointer.y+=(pointer.ty-pointer.y)*.035;
  group.rotation.y+=.0018;
  group.rotation.x=pointer.y*.22;
  group.rotation.y+=pointer.x*.002;
  group.position.y=Math.sin(performance.now()*.00045)*.08;
  renderer.render(scene,camera);
}

document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener("click",e=>{
  const target=document.querySelector(link.getAttribute("href"));
  if(target){e.preventDefault();target.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"});}
}));

init();