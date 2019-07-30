var renderer;

function initRender() {

    renderer = new THREE.WebGLRenderer({ antialias: true});

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

}



var camera;

function initCamera() {

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);
}



var scene;

function initScene() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
}
function setGrid(num) {
    var gridHelper = new THREE.GridHelper(num*10, num/30, 'red', 'gray');
    gridHelper.position.y = -100;
    gridHelper.position.x = 0;
    scene.add(gridHelper);
    var axes = new THREE.AxesHelper(num*10);//参数设置了三条轴线的长度
    scene.add(axes);
}


var light;

function initLight() {
    var ambiColor = 0xFFFFFF;
    var ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);
}

function getColor(type) {
    var color = parseInt(0x98FB98);
    color += (parseInt(type) - 1) * 89999 * Math.pow(parseInt(type) - 1, 2);
    return "0x" + color.toString(16).substr(-6);
}
function getAllGeo(cargonums) {
    var allgeo = new Array();
    var a_i = 0;
    for (var i = 0; i < cargonums.length; i++) {
        if (cargonums[i].length === cargonums[i].width && cargonums[i].length === cargonums[i].height) {
            var geo = new THREE.BoxGeometry(cargonums[i].length, cargonums[i].width, cargonums[i].height);
            allgeo[a_i++] = geo;
        }
        else if (cargonums[i].length === cargonums[i].width || cargonums[i].length === cargonums[i].height || cargonums[i].height === cargonums[i].width) {
            geo = new THREE.BoxGeometry(cargonums[i].length, cargonums[i].width, cargonums[i].height);
            allgeo[a_i++] = geo;
            geo = new THREE.BoxGeometry(cargonums[i].width, cargonums[i].height, cargonums[i].length);
            allgeo[a_i++] = geo;
            geo = new THREE.BoxGeometry(cargonums[i].height, cargonums[i].length, cargonums[i].width);
            allgeo[a_i++] = geo;
        }
        else {
            geo = new THREE.BoxGeometry(cargonums[i].length, cargonums[i].width, cargonums[i].height);
            allgeo[a_i++] = geo;
            geo = new THREE.BoxGeometry(cargonums[i].width, cargonums[i].height, cargonums[i].length);
            allgeo[a_i++] = geo;
            geo = new THREE.BoxGeometry(cargonums[i].height, cargonums[i].length, cargonums[i].width);
            allgeo[a_i++] = geo;
            geo = new THREE.BoxGeometry(cargonums[i].length, cargonums[i].height, cargonums[i].width);
            allgeo[a_i++] = geo;
            geo = new THREE.BoxGeometry(cargonums[i].width, cargonums[i].length, cargonums[i].height);
            allgeo[a_i++] = geo;
            geo = new THREE.BoxGeometry(cargonums[i].height, cargonums[i].width, cargonums[i].length);
            allgeo[a_i++] = geo;
        }
    }
    return allgeo;
}


var controls;

function initControls() {

    controls = new THREE.TrackballControls(camera);

    //��ת�ٶ�

    controls.rotateSpeed = 2;

    //�佹�ٶ�

    controls.zoomSpeed = 2;

    //ƽ���ٶ�

    controls.panSpeed = 0.5;

    //�Ƿ񲻱佹

    controls.noZoom = false;

    //�Ƿ�ƽ��

    controls.noPan = false;

    //�Ƿ����ƶ�����

    controls.staticMoving = false;

    //��̬����ϵ�� ���������

    controls.dynamicDampingFactor = 0.3;

    //δ֪��ռʱ�ȱ���

    //controls.keys = [ 65, 83, 68 ];

    controls.addEventListener('change', render);

}


function initTransformControls() {
    // 添加平移控件
    transformControls = new THREE.TransformControls(camera);
    scene.add(transformControls);
}

function render() {

    renderer.render(scene, camera);

}

//���ڱ䶯�����ĺ���
function onWindowResize() {



    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    controls.handleResize();

    render();

    renderer.setSize(window.innerWidth, window.innerHeight);



}

function animate() {

    //���¿�����

    controls.update();

    TWEEN.update();

    render();

    requestAnimationFrame(animate);
}

function draw() {

    initRender();

    initScene();

    initCamera();

    initLight();

    initControls();
    initTransformControls();
    animate();

    window.onresize = onWindowResize;

}