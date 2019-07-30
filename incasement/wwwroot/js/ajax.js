window.addEventListener("message", function (event) {
    if (event.data.status === 0) {
        console.clear();
        camera.position.set(1400, 1400, 1400);
        camera.far = 500;
        var cargo_demo = new Array();
        var mc = new Array();
        var cube_demo = new Array();
        mc[0] = new THREE.MeshLambertMaterial({ color: 0xE6E6FA, depthTest: false });
        cargo_demo[0] = new THREE.BoxGeometry(500, 500, 500);
        cargo_demo[1] = new THREE.BoxGeometry(500, 500, 200);
        mc[1] = new THREE.MeshLambertMaterial({ color: 0x007aff }); 
        cargo_demo[2] = new THREE.BoxGeometry(250, 200, 300);
        mc[2] = new THREE.MeshLambertMaterial({ color: 0x607d8b });
        cargo_demo[3] = new THREE.BoxGeometry(250, 500, 300);
        mc[3] = new THREE.MeshLambertMaterial({ color: 0xff2d55 }); 
        cargo_demo[4] = new THREE.BoxGeometry(250, 300, 300);
        mc[4] = new THREE.MeshLambertMaterial({ color: 0xff9500 }); 
        var edgesline_demo = new THREE.LineBasicMaterial({ color: 0xffffff });
        var edgesline_cargo_demo = new THREE.LineBasicMaterial({ color: 0x000000 });
        for (var jj = 0; jj < 5; jj++) {
            cube_demo[jj] = new THREE.Mesh(cargo_demo[jj], mc[jj]);
            var edges_demo = new THREE.EdgesGeometry(cargo_demo[jj], 1);//设置边框，可以旋转
            var cubeLine_demo;
            if (jj === 0) {
                cube_demo[jj].position.x = 250;
                cube_demo[jj].position.y = 250;
                cube_demo[jj].position.z = 250;
                cubeLine_demo = new THREE.LineSegments(edges_demo, edgesline_demo);
            }
            else {
                if (jj === 1) {
                    cube_demo[jj].position.x = 250;
                    cube_demo[jj].position.y = 1500;
                    cube_demo[jj].position.z = -1000;
                }
                else if (jj === 2) {
                    cube_demo[jj].position.x = -500;
                    cube_demo[jj].position.y = -500;
                    cube_demo[jj].position.z = 2100;
                }
                else if (jj === 3) {
                    cube_demo[jj].position.x = 2000;
                    cube_demo[jj].position.y = 250;
                    cube_demo[jj].position.z = 350;
                }
                else if (jj === 4) {
                    cube_demo[jj].position.x = 125;
                    cube_demo[jj].position.y = 1500;
                    cube_demo[jj].position.z = 1500;
                }
                cubeLine_demo = new THREE.LineSegments(edges_demo, edgesline_cargo_demo);
            }
            scene.add(cube_demo[jj]);
            cube_demo[jj].add(cubeLine_demo);
        }
        //补间动画实现
        var pos1 = { x: 250, y: 1500, z: -500 };
        var tween1 = new TWEEN.Tween(pos1).to({ x: 250, y: 250, z: 100 }, 2500).easing(TWEEN.Easing.Bounce.Out).onUpdate(function (pos) {
            cube_demo[1].position.set(pos1.x, pos1.y, pos1.z);
        });
        var pos2 = { x: -500, y: -500, z: 2100 };
        var tween2 = new TWEEN.Tween(pos2).to({ x: 125, y: 100, z: 350 }, 2500).easing(TWEEN.Easing.Bounce.Out).onUpdate(function (pos) {
            cube_demo[2].position.set(pos2.x, pos2.y, pos2.z);
        });
        var pos3 = { x: 2000, y: 250, z: 350 };
        var tween3 = new TWEEN.Tween(pos3).to({ x: 375, y: 250, z: 350 }, 2500).easing(TWEEN.Easing.Bounce.Out).onUpdate(function (pos) {
            cube_demo[3].position.set(pos3.x, pos3.y, pos3.z);
        });
        var pos4 = { x: 125, y: 1500, z: 1500 };
        var tween4 = new TWEEN.Tween(pos4).to({ x: 125, y: 350, z: 350 }, 2500).easing(TWEEN.Easing.Bounce.Out).onUpdate(function (pos) {
            cube_demo[4].position.set(pos4.x, pos4.y, pos4.z);
        });
        var tween_sleep = new TWEEN.Tween({ x: 0 }).to({ x: 0 }, 1000);
        var tween1back = new TWEEN.Tween(pos1).to({ x: 250, y: 1500, z: -500 }, 2500).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function (pos) {
            cube_demo[1].position.set(pos1.x, pos1.y, pos1.z);
        });
        var tween2back = new TWEEN.Tween(pos2).to({ x: -500, y: -500, z: 2100 }, 2500).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function (pos) {
            cube_demo[2].position.set(pos2.x, pos2.y, pos2.z);
        });
        var tween3back = new TWEEN.Tween(pos3).to({ x: 2000, y: 250, z: 350 }, 2500).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function (pos) {
            cube_demo[3].position.set(pos3.x, pos3.y, pos3.z);
        });
        var tween4back = new TWEEN.Tween(pos4).to({ x: 125, y: 1500, z: 1500 }, 2500).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function (pos) {
            cube_demo[4].position.set(pos4.x, pos4.y, pos4.z);
        });
        tween1.chain(tween2);
        tween2.chain(tween3);
        tween3.chain(tween4);
        tween4.chain(tween_sleep);
        tween_sleep.chain(tween1back);
        tween1back.chain(tween3back);
        tween3back.chain(tween4back);
        tween4back.chain(tween2back);
        tween2back.chain(tween1);
        tween1.start();
    }
    else if (event.data.status === 1) {
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
                var cube_cargo = new THREE.Mesh(cargogeo[k], material_c[cg._type - 1]);
                cube_cargo.position.x = cg.center_x;
                cube_cargo.position.y = cg.center_y;
                cube_cargo.position.z = cg.center_z;
                scene.add(cube_cargo);
                var edge_cargo = new THREE.EdgesGeometry(cargogeo[k], 1);//设置边框，可以旋转
                var cubeLine_cargo = new THREE.LineSegments(edge_cargo, edgesline_cargo);
                cube_cargo.add(cubeLine_cargo);
            }
        }
        initDragControls();
        // 向父vue页面发送信息
        window.parent.postMessage({
            status: 1
        }, '*');
    }
    else if (event.data.status === 2) {
        console.clear();
        renderer.render(scene, camera);
        var dataUrl = renderer.domElement.toDataURL("image/png");
        var a = document.createElement("a");
        a.setAttribute('download', '装箱图.png');// download属性
        a.setAttribute('href', dataUrl);// href链接
        a.click();// 自执行点击事件
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
