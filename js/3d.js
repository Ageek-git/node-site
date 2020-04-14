/**
 * author:Ageek
 */
let scene = new THREE.Scene(), renderer, camera, controls, worldVector;
			urls = ['http://e.dangdang.com/booksshelf_page.html',
					'https://tieba.baidu.com/home/main?id=tb.1.60f1d798.4s05EGyyjxHXng8-t5qN8Q?t=1409129462&fr=userbar&red_tag=d2346089643', 
					'https://www.toutiao.com/', 
					'https://mp.weixin.qq.com/cgi-bin/home?token=27818280', 
					'https://www.aliyun.com/?utm_content=se_1000301881'];

function initRender() {
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setClearColor(0xffffff, 0);
	renderer.setSize(window.innerWidth,window.innerHeight);
	document.getElementById('WEBGL-RENDERER').appendChild(renderer.domElement);
}

function initCamera() {
	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1E4);
	camera.position.set(31, 10, 61);
	camera.lookAt(scene.position);
}

function initLight() {
	scene.add(new THREE.AmbientLight(0xffffff));
	var spotLight = new THREE.SpotLight(0xffffff);
	spotLight.intensity = 0.1;
	spotLight.position.copy(camera.position);
	spotLight.castShadow = true;
	scene.add(spotLight);
}

function initModel() {
	let geometry = new THREE.SphereGeometry(5, 25, 25);
	let cloudTexture = THREE.ImageUtils.loadTexture('./image/sphere/2.jpg');
	let sphereMaterial = new THREE.MeshPhongMaterial({
		transparent: true,
		opacity: .8,
		color: 0xffffff,
		map: cloudTexture,
		specular: 0xffffff,
		side: THREE.DoubleSide
	});
	let radius = 30;
	let num = urls.length;
	let rad = Math.PI * 2 / num;
	urls.forEach((j, i)=>{
		var sphereMesh = new THREE.Mesh(geometry, sphereMaterial);
		let curRad = rad * i;
		sphereMesh.position.set(radius * Math.cos(curRad), 0, radius * Math.sin(curRad));
		sphereMesh.name = j;
		scene.add(sphereMesh);
	});
}

function initControls() {
	controls = new THREE.OrbitControls(camera);
	controls.enabled = false;
	// 设置控制器的中心点
	// controls.target.set( 0, 5, 0 );
	controls.enableDamping = true;
	this.dampingFactor = 0.01;
	controls.enableZoom = false;
	controls.autoRotate = true;
	controls.autoRotateSpeed = 0.8;
	controls.minDistance = 1;
	controls.maxDistance = 2000;
	controls.enablePan = false;
}

function scale(obj){
	obj.firstTouch = true;
	var tween=new TWEEN.Tween({x: 1,y: 1,z: 1}).to({x: 1.2,y: 1.2,z: 1.2}, 100).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function(){
		obj.scale.set(this.x, this.y, this.z);
	}).onComplete(function(){
		obj.animated = false;
	}).start();
}

function backToNormalScale(){
	urls.forEach((j, i)=>{
		let obj = scene.getObjectByName(j);
		obj.firstTouch = false;
		if(obj.scale.x > 1){
			var tween=new TWEEN.Tween({x: 1.2,y: 1.2,z: 1.2}).to({x: 1,y: 1,z: 1}, 100).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function(){
				obj.scale.set(this.x, this.y, this.z);
			}).start();
		};
	});
}

function onMouseMove(){
	let originX=event.clientX,originY=event.clientY;
	let worldVector=new THREE.Vector3((originX/innerWidth)*2-1, 1-(originY/innerHeight)*2, .5);
	let viewpointVector=worldVector.unproject(camera);
	let raycaster=new THREE.Raycaster(camera.position, viewpointVector.sub(camera.position).normalize());
	let intersection=raycaster.intersectObjects(scene.children,true);
	if(intersection.length){
		controls.autoRotate = false;
		document.body.style.cursor = 'pointer';
		let obj = intersection[0].object;
		if(!obj.firstTouch)
			scale(obj);
	}else{
		controls.autoRotate = true;
		document.body.style.cursor = 'default';
		backToNormalScale();
	}
}

function onMouseDown(){
	let originX=event.clientX,originY=event.clientY;
	let worldVector=new THREE.Vector3((originX/innerWidth)*2-1, 1-(originY/innerHeight)*2, .5);
	let viewpointVector=worldVector.unproject(camera);
	let raycaster=new THREE.Raycaster(camera.position, viewpointVector.sub(camera.position).normalize());
	let intersection=raycaster.intersectObjects(scene.children,true);
	if(intersection.length){
		let name=intersection[0].object.name;
		window.open(name);
	}else{
		controls.autoRotate = true;
		document.body.style.cursor = 'default';
	}
}

function animate() {
	controls.update();
	TWEEN.update();
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

function draw() {
	// 兼容性判断
	if (!Detector.webgl)
		Detector.addGetWebGLMessage();
	initRender();
	initCamera();
	initLight();
	initModel();
	initControls();
	window.addEventListener('mousemove', onMouseMove, false);
	window.addEventListener('mousedown', onMouseDown, false);
	animate();
}
