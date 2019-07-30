var renderer;

function initRender() {

    renderer = new THREE.WebGLRenderer({ antialias: true});

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

}



var camera;

function initCamera() {

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);
    //camera.position.set(-300, 250, 300);

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

    /*scene.add(new THREE.AmbientLight(0x101040));
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1000,1000,1000);
    scene.add(light);*/
    var ambiColor = 0xFFFFFF;
    var ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

}



function initModel() {
    /*
    var material = new THREE.MeshLambertMaterial({ color: 0xb0b0b0, depthTest: false });
    var material_c = new THREE.MeshLambertMaterial({ color: 0xb040b0 });
    var cube = new THREE.Mesh(new THREE.BoxGeometry(200, 100, 100, 20, 20, 20), material);
    cube.position.x = 100;
    cube.position.y = 50;
    cube.position.z = 50;
    var edges = new THREE.EdgesHelper(cube, 0x1535f7);//设置边框，可以旋转
    edges.position.x = 100;
    edges.position.y = 50;
    edges.position.z = 50;
    scene.add(edges);
    scene.add(cube);

    var cube1 = new THREE.Mesh(new THREE.BoxGeometry(20, 10, 10, 20, 20, 20), material_c);
    cube1.position.x = 10;
    cube1.position.y = 5;
    cube1.position.z = 5;
    scene.add(cube1);
    */
}

function getColor(type) {
    var color = parseInt(0x98FB98);
    color += (parseInt(type) - 1) * 89999 * Math.pow(parseInt(type) - 1, 2);
    return "0x"+color.toString(16).substr(-6);
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



//�û�������� ��������ס��ת���Ҽ���סƽ�ƣ���������

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
// 添加拖拽控件
function initDragControls() {
    // 过滤不是 Mesh 的物体,例如辅助网格
    var objects = [];
    for (let i = 0; i < scene.children.length; i++) {
        if (scene.children[i].isMesh) {
            if (scene.children[i].material.depthTest !== false)
                objects.push(scene.children[i]);
        }
    }
    // 初始化拖拽控件
    dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
    dragControls.addEventListener('hoveron', function (event) {
        // 让变换控件对象和选中的对象绑定
        transformControls.attach(event.object);
    });
    // 开始拖拽
    dragControls.addEventListener('dragstart', function (event) {
        controls.enabled = false;
    });
    // 拖拽结束
    dragControls.addEventListener('dragend', function (event) {
        controls.enabled = true;
    });
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

function inittemp() {
    
}

function draw() {

    initRender();

    initScene();

    initCamera();

    initLight();

    initModel();

    initControls();
    initTransformControls();
    initDragControls();

    inittemp();
    animate();

    window.onresize = onWindowResize;

}