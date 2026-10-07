import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
document.getElementById("year").textContent=new Date().getFullYear();
const canvas=document.getElementById("scene"),reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches,mobile=window.matchMedia("(max-width:900px)").matches;
let renderer,scene,camera,system;
const pointer={x:0,y:0,tx:0,ty:0};
function material(color,opacity=1){return new THREE.MeshBasicMaterial({color,transparent:opacity<1,opacity,wireframe:true})}
function init(){
try{
renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!mobile,powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.2:1.6));renderer.setSize(innerWidth,document.querySelector(".hero").offsetHeight,false);
scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(38,innerWidth/document.querySelector(".hero").offsetHeight,.1,100);camera.position.set(0,0,7);system=new THREE.Group();scene.add(system);
const core=new THREE.Mesh(new THREE.IcosahedronGeometry(mobile?.72:1,2),material(0x8174ff,.72));system.add(core);
const inner=new THREE.Mesh(new THREE.SphereGeometry(mobile?.32:.42,24,24),new THREE.MeshBasicMaterial({color:0x8174ff,transparent:true,opacity:.16}));system.add(inner);
const ring1=new THREE.Mesh(new THREE.TorusGeometry(mobile?1.15:1.65,.012,8,96),material(0x8174ff,.45));ring1.rotation.x=1.1;system.add(ring1);
const ring2=new THREE.Mesh(new THREE.TorusGeometry(mobile?1.5:2.05,.009,8,96),material(0x5d8cff,.3));ring2.rotation.y=.8;system.add(ring2);
const ring3=new THREE.Mesh(new THREE.TorusGeometry(mobile?1.85:2.45,.007,8,96),material(0x8174ff,.2));ring3.rotation.x=.45;system.add(ring3);
const labels=["UNDERSTAND","IDENTIFY","ASSESS","DESIGN","IMPLEMENT","IMPROVE","AI AUTOMATION","CUSTOM APPS","INTEGRATION","SUPPORT"];
const count=mobile?8:10,nodes=[];
for(let i=0;i<count;i++){
 const a=i/count*Math.PI*2,r=mobile?1.65:2.25,y=Math.sin(i*1.7)*.62;
 const p=new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r);
 const g=new THREE.Group();g.position.copy(p);
 const sphere=new THREE.Mesh(new THREE.SphereGeometry(mobile?.075:.095,16,16),new THREE.MeshBasicMaterial({color:i<6?0x9b90ff:0x5d8cff}));
 const halo=new THREE.Mesh(new THREE.RingGeometry(mobile?.14:.18,mobile?.155:.2,24),new THREE.MeshBasicMaterial({color:0x8174ff,transparent:true,opacity:.55,side:THREE.DoubleSide}));halo.rotation.x=Math.PI/2;g.add(sphere,halo);g.userData.label=labels[i];system.add(g);nodes.push(g);
 const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),p]),new THREE.LineBasicMaterial({color:0x8174ff,transparent:true,opacity:.18}));system.add(line);
}
for(let i=0;i<nodes.length;i++){const a=nodes[i].position,b=nodes[(i+1)%nodes.length].position;system.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a,b]),new THREE.LineBasicMaterial({color:0x5d8cff,transparent:true,opacity:.12})));}
const pg=new THREE.BufferGeometry(),pc=mobile?80:170,arr=new Float32Array(pc*3);for(let i=0;i<arr.length;i++)arr[i]=(Math.random()-.5)*8;pg.setAttribute("position",new THREE.BufferAttribute(arr,3));system.add(new THREE.Points(pg,new THREE.PointsMaterial({color:0x8174ff,size:mobile?.018:.025,transparent:true,opacity:.4})));
addEventListener("pointermove",e=>{pointer.tx=(e.clientX/innerWidth-.5)*.8;pointer.ty=(e.clientY/innerHeight-.5)*.5},{passive:true});addEventListener("resize",resize);
if(reduce)renderer.render(scene,camera);else animate();
}catch(e){canvas.style.display="none";}
}
function resize(){if(!renderer)return;const h=document.querySelector(".hero").offsetHeight;renderer.setSize(innerWidth,h,false);camera.aspect=innerWidth/h;camera.updateProjectionMatrix();}
function animate(){requestAnimationFrame(animate);pointer.x+=(pointer.tx-pointer.x)*.035;pointer.y+=(pointer.ty-pointer.y)*.035;system.rotation.y+=mobile?.0012:.0018;system.rotation.x=pointer.y*.18;system.position.y=Math.sin(performance.now()*.00045)*.08;renderer.render(scene,camera);}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{const t=document.querySelector(a.getAttribute("href"));if(t){e.preventDefault();t.scrollIntoView({behavior:reduce?"auto":"smooth"})}}));
init();