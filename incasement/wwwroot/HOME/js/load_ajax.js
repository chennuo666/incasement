var tweenIndex = -1;
var tweenplay = true;
var position = [];
var true_position = [];
var cube_cargo = new Array();
var arr_tween = new Array();
var arr_tween_back = new Array();
window.addEventListener("message", function (event) {
    if (event.data.status === 1) {
        console.clear();
        var data = event.data.msg;
        var containers = data.containers;
        camera.position.set(containers[0].exchange_x * 3, containers[0].exchange_y * 3, containers[0].exchange_z * 3);
        camera.far = containers[0].exchange_x * 100;
        setGrid(containers[0].exchange_x);
        var material = new THREE.MeshLambertMaterial({ color: 0xE6E6FA, depthTest: false });
        var boxgeometry = new THREE.BoxGeometry(containers[0]._true_length, containers[0]._true_height, containers[0]._true_width);
        var cargogeo = getAllGeo(data.cargos_num);
        var material_c = new Array();
        var edgesline = new THREE.LineBasicMaterial({ color: 0xffffff });
        var edgesline_cargo = new THREE.LineBasicMaterial({ color: 0x000000 });
        for (var ii = 0; ii < data.cargos_num.length; ii++) {
            var m = new THREE.MeshLambertMaterial({ color: parseInt(getColor(data.cargos_num[ii].type)) });
            material_c[ii] = m;
        }
        for (var i = 0; i < containers.length; i++) {
            var c = containers[i];
            var cube = new THREE.Mesh(boxgeometry, material);
            cube.position.x = c.center_x;
            cube.position.y = c.center_y;
            cube.position.z = c.center_z;
            scene.add(cube);
            var edges = new THREE.EdgesGeometry(boxgeometry, 1);//设置边框，可以旋转
            var cubeLine = new THREE.LineSegments(edges, edgesline);
            cube.add(cubeLine);
            var cargos = c.cargos;
            for (var j = 0; j < cargos.length; j++) {
                var cg = cargos[j];
                var k = 0;
                for (k; k < cargogeo.length; k++) {
                    if (cg.exchange_x === cargogeo[k].parameters.width && cg.exchange_y === cargogeo[k].parameters.height && cg.exchange_z === cargogeo[k].parameters.depth) break;
                }
                cube_cargo[cube_cargo.length] = new THREE.Mesh(cargogeo[k], material_c[cg._type - 1]);
                position.push({
                    x: cg.center_x,
                    y: cg.center_y,
                    z: cg.center_z
                });
                true_position.push({
                    x: 101000,
                    y: 101000,
                    z: 0
                });
                cube_cargo[cube_cargo.length - 1].position.set(101000, 101000, 0);
                scene.add(cube_cargo[cube_cargo.length - 1]);
                var edge_cargo = new THREE.EdgesGeometry(cargogeo[k], 1);//设置边框，可以旋转
                var cubeLine_cargo = new THREE.LineSegments(edge_cargo, edgesline_cargo);
                cube_cargo[cube_cargo.length - 1].add(cubeLine_cargo);
            }
        }
        for (k = 0; k < cube_cargo.length; k++) {
            true_position[k].x = position[k].x;
            true_position[k].y = position[k].y + cube_cargo[k].geometry.parameters.height / 2;
            true_position[k].z = position[k].z;
            let true_position_t = true_position[k];
            let position_t = position[k];
            let cube_t = cube_cargo[k];
            arr_tween[k] = new TWEEN.Tween(true_position_t).to({ x: position_t.x, y: position_t.y, z: position_t.z }, 1200).onUpdate(function () {
                cube_t.position.set(true_position_t.x, true_position_t.y, true_position_t.z);
            })
                .onStart(function () {
                    tweenIndex++;
                    tweenplay = false;
                })
                .onComplete(function () {
                    tweenplay = true;
                });
            arr_tween_back[k] = new TWEEN.Tween(true_position_t).to({ x: position_t.x, y: position_t.y + cube_t.geometry.parameters.height / 2, z: position_t.z }, 0).onUpdate(function () {
                cube_t.position.set(true_position_t.x, true_position_t.y, true_position_t.z);
            })
                .onComplete(function () {
                    cube_t.position.set(101000, 101000, 0);
                    tweenIndex--;
                    tweenplay = true;
                });
        }
        for (k = 0; k < cube_cargo.length - 1; k++) {
            arr_tween[k].chain(arr_tween[k + 1]);
        }
        //arr_tween[0].start();
    }
    else if (event.data.status === -1) {
        if (tweenIndex > -1) {
            arr_tween[tweenIndex].stop();
            arr_tween_back[tweenIndex].start();
        }
    }
    else if (event.data.status === -2) {
        arr_tween[tweenIndex].stop();
    }
    else if (event.data.status === -3) {
        if (tweenplay) {
            arr_tween[tweenIndex + 1].start();
        }
        else {
            arr_tween[tweenIndex].start();
            tweenIndex--;
        }
    }
    else if (event.data.status === 3) {//正视
        console.clear();
        containers = event.data.msg.containers;
        camera.position.set(containers[0].center_x, containers[0].center_y, -containers[0].exchange_x * 3);
        camera.up.x = 0;//相机以哪个方向为上方
        camera.up.y = 1;
        camera.up.z = 0;
        controls.target = new THREE.Vector3(containers[0].center_x, containers[0].center_y, containers[0].center_z);
    }
    else if (event.data.status === 4) {//俯视
        console.clear();
        containers = event.data.msg.containers;
        camera.position.set(containers[0].center_x, containers[0].exchange_x * 3, containers[0].center_z);
        camera.up.x = 1;//相机以哪个方向为上方
        camera.up.y = 0;
        camera.up.z = 0;
        controls.target = new THREE.Vector3(containers[0].center_x, containers[0].center_y, containers[0].center_z);
    }
    else if (event.data.status === 5) {//侧视
        console.clear();
        containers = event.data.msg.containers;
        camera.position.set(-containers[0].exchange_z * 3, containers[0].center_y, containers[0].center_z);
        camera.up.x = 0;//相机以哪个方向为上方
        camera.up.y = 1;
        camera.up.z = 0;
        controls.target = new THREE.Vector3(containers[0].center_x, containers[0].center_y, containers[0].center_z);
    }
});
