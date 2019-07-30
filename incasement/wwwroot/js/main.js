var app2 = new Vue({
    el: '#main2',
    data: {
    },
    methods: {
        guidePath(num) {
            switch (num) {
                case 0:
                    window.location.href = '/HOME';
                    break;
                case 1:
                    window.location.href = '/HOME';
                    break;
                case 2:
                    window.location.href = '/HOME/Intro';
                    break;
                case 3:
                    window.location.href = '/HOME/UserPage';
                    break;
            }
        },
        getUserName() {
            $.ajax({
                type: "GET",
                url: "/api/Login",
                //data: JSON.stringify(jsondata),
                //contentType: 'application/json',
                async: false
            });
            var v_cookie = JSON.parse($.cookie('account'));
            return v_cookie.userName;
        },
        LogOut() {
            $.ajax({
                type: "POST",
                url: "/api/LogOut",
                //data: JSON.stringify(jsondata),
                //contentType: 'application/json',
                async: false,
                success: function (data) {
                    if (data.Result === 1) {
                        app2.$message({
                            message: '退出成功！跳转页面中..',
                            type: 'success'
                        });
                        window.location.href = "/HOME/Login";
                    }
                    else {
                        app2.$message.error('退出失败，请重试');
                        return false;
                    }
                }
            });
        }
    }
});
var app1 = new Vue({
    el: '#main1',
    data: {
        timer: null,
        iframeWin: {},
        p_items: [],
        p_date: [],
        p_ID: [],
        p_OAtype: [],
        p_name: [],
        c_items:[],
        now_Draw: {},
        show_Draw: false,
        show_Animate: false,
        switch_change: true,
        switchstatus:'点击关闭智能选择',
        radio_open: true,
        addDialogVisible: false,
        load_open: false,
        export_excel_program: {},
        programinfo: {
            visible: false,
            name: '',
            OA: '',
            containers: [],
            cargos_num: [],
            Container_num:0
        },
        container: {
            name:'',
            length: '',
            width: '',
            height: '',
            weight:''
        },
        cargos: [{
            length: '',
            width: '',
            height: '',
            num: 1,
            type: 1,
            weight:''
        }],
        radio_num:'0',
        rules1: {
            length: [
                { required: true, message: '不能为空', trigger: 'blur' },
                { type: 'number', message: '必须为数字值', trigger: ['change', 'blur'] }
            ],
            width: [
                { required: true, message: '不能为空', trigger: 'blur' },
                { type: 'number', message: '必须为数字值', trigger: ['change', 'blur'] }
            ],
            height: [
                { required: true, message: '不能为空', trigger: 'blur' },
                { type: 'number', message: '必须为数字值', trigger: ['change', 'blur'] }
            ],
            name: [
                { required: true, message: '不能为空', trigger: 'blur' },
                { min: 1, max: 10, message: '长度应为1-10个字符', trigger: 'blur'}
            ],
            weight: [
                { required: true, message: '不能为空', trigger: 'blur' },
                { type: 'number', message: '必须为数字值', trigger: ['change', 'blur'] }
            ]
        },
        animateplay: false,
        visibletitle1: false,
        visibletitle2: false,
        loading:true
    },
    created() {
        clearInterval(this.timer);
        this.timer = null;
        this.setTimer();
        var v_cookie = JSON.parse($.cookie('account'));
        this.getCalProgram();
        var jsondata = {
            db: 'Program',
            condition: ' where userID=' + v_cookie.ID
        };
        $.ajax({
            type: "POST",
            url: "/api/Query",
            data: JSON.stringify(jsondata),
            contentType: 'application/json',
            async:true,
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var tt = JSON.parse(data[i].program);
                    app1.p_items.unshift(tt);
                    app1.p_date.unshift(app1.getCalDate(data[i].starttime));
                    app1.p_ID.unshift(data[i].ID);
                    app1.p_OAtype.unshift(data[i].OAtype);
                    app1.p_name.unshift(data[i].programName);
                }
                app1.loading = false;
            }
        });
        jsondata = {
            db: 'TempProgram',
            condition: ' where userID=' + v_cookie.ID
        };
        $.ajax({
            type: "POST",
            url: "/api/Query",
            data: JSON.stringify(jsondata),
            contentType: 'application/json',
            async: true,
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var item = {
                        id: data[i].ID,
                        name: data[i].programName
                    };
                    app1.c_items.unshift(item);
                }
            }
        });
    },
    methods: {
        handleCommand(command) {
            switch (command) {
                case '1':
                    app1.container.length = 5900;
                    app1.container.width = 2340;
                    app1.container.height = 2370;
                    app1.container.weight = 27;
                    break;
                case '2':
                    app1.container.length = 11900;
                    app1.container.width = 2340;
                    app1.container.height = 2370;
                    app1.container.weight = 25;
                    break;
                case '3':
                    app1.container.length = 11900;
                    app1.container.width = 2340;
                    app1.container.height = 2670;
                    app1.container.weight = 25;
                    break;
                case '4':
                    app1.container.length = 13556;
                    app1.container.width = 2352;
                    app1.container.height = 2698;
                    app1.container.weight = 24;
                    break;
                case '5':
                    app1.container.length = 5898;
                    app1.container.width = 2352;
                    app1.container.height = 2342;
                    app1.container.weight = 20;
                    break;
                case '6':
                    app1.container.length = 12034;
                    app1.container.width = 2352;
                    app1.container.height = 2330;
                    app1.container.weight = 30.5;
                    break;
            }
        },
        btn_addProgram() {
            this.addDialogVisible = true;
        },
        getCalDate(str_date) {
            var len = str_date.indexOf('T');
            return str_date.substring(0, len);
        },
        getCalProgram() {
            $.ajax({
                type: "POST",
                url: "/api/CalProgram",
                async: true,
                success: function (data) {
                    if (data.length === 0) {
                        app1.c_items = [];
                        return false;
                    }
                    if (data[0].status === -10) {
                        app1.$message.error('请先登录');
                        window.location.href = "/HOME/Login";
                        return false;
                    }
                    for (var i = 0; i < data.length; i++) {
                        switch (data[i].status) {
                            case 0:
                                break;
                            case -2:
                                app1.$message.error(data[i].message);
                                for (var j = 0; j < app1.c_items.length; j++) {
                                    if (app1.c_items[j].ID === data[i].reg[0]) {
                                        app1.c_items.splice(j, 1);
                                        break;
                                    }
                                }
                                break;
                            default:
                                app1.$notify({
                                    title: '成功',
                                    message: '您有新方案已完成，请注意查看',
                                    type: 'success'
                                });
                                app1.p_items.unshift(JSON.parse(data[i].message));
                                app1.p_date.unshift('刚刚');
                                app1.p_ID.unshift(data[i].status);
                                app1.p_OAtype.unshift(parseInt(data[i].reg[0]));
                                app1.p_name.unshift(data[i].reg[1]);
                                for (j = 0; j < app1.c_items.length; j++) {
                                    if (app1.c_items[j].id === parseInt(data[i].reg[2])) {
                                        app1.c_items.splice(j, 1);
                                        break;
                                    }
                                }
                                break;
                        }
                    }
                    return data.status;
                }
            });
        },
        setTimer() {
            if (this.timer === null) {
                this.timer = setInterval(() => {
                    this.getCalProgram();
                }, 10000);
            }
        },
        drawProgram(item,num) {
            console.clear();
            app1.export_excel_program = {
                index: num,
                program: item
            };
            document.getElementById('Draw').src = 'Draw.html';
            var msg = {
                status: 1,
                msg: item
            };
            var iframe = document.getElementById("Draw");
            if (iframe.attachEvent) {
                iframe.attachEvent("onload", function () {
                    //iframe加载完成后你需要进行的操作
                    app1.iframeWin.postMessage(msg, '*');
                });
            } else {
                iframe.onload = function () {
                    //iframe加载完成后你需要进行的操作
                    app1.iframeWin.postMessage(msg, '*');
                };
            }
            $("#Animate_title").addClass("drawiframe_close");
            $("#Draw_title").removeClass("drawiframe_close");
            $('#Draw').height($('.el-main').height() - 10);
            $("#Draw").removeClass("drawiframe_close");
            app1.show_Animate = false;
            app1.show_Draw = true;
            $(".el-main").css("opacity", "1");
            app1.now_Draw = item;
        },
        animateProgram(item, num) {
            console.clear();
            app1.export_excel_program = {
                index: num,
                program: item
            };
            app1.animateplay = false;
            document.getElementById('Draw').src = 'LoadAnimation.html';
            var msg = {
                status: 1,
                msg: item
            };
            var iframe = document.getElementById("Draw");
            if (iframe.attachEvent) {
                iframe.attachEvent("onload", function () {
                    //iframe加载完成后你需要进行的操作
                    document.getElementById('Draw').contentWindow.postMessage(msg, '*');
                });
            } else {
                iframe.onload = function () {
                    //iframe加载完成后你需要进行的操作
                    document.getElementById('Draw').contentWindow.postMessage(msg, '*');
                };
            }
            $("#Draw_title").addClass("drawiframe_close");
            $("#Animate_title").removeClass("drawiframe_close");
            $('#Draw').height($('.el-main').height() - 10);
            app1.show_Draw = false;
            app1.show_Animate = true;
            app1.now_Draw = item;
        },
        animateBack() {
            app1.animateplay = false;
            var msg = {
                status: -1,
                msg: {}
            };
            document.getElementById('Draw').contentWindow.postMessage(msg, '*');
        },
        animateStart() {
            var msg = {
                status: 0,
                msg: {}
            };
            if (app1.animateplay) {
                app1.animateplay = !app1.animateplay;
                msg.status = -2;
            }
            else {
                app1.animateplay = !app1.animateplay;
                msg.status = -3;
            }
            document.getElementById('Draw').contentWindow.postMessage(msg, '*');
        },
        exportExcel() {
            let str = ` ${app1.p_name[app1.export_excel_program.index]} 方案具体数据\n`;
            str += `说明：,1.本表中，长度单位均为毫米，重量单位均为吨.\n`;
            str += ` ,2.表中所述三维坐标系，X轴正方向指向右方，Y轴正方向指向上方，Z轴正方向为由屏幕内指向屏幕外\n`;
            str += ` ,3.我们将货箱的最长边与X轴平行，次长边与Z轴平行，最短边与Y轴平行.\n`;
            str += ` ,4.设货箱1的顶点坐标1为原点(0，0，0)\n`;
            str += ` ,5.所有货箱和货物都沿X、Y、Z轴正方向摆放，即坐标值都为0或正值\n\n`;
            str += `箱型：,长,宽,高,配重\n`;
            str += ` ,${app1.export_excel_program.program.containers[0]._nominal_length},${app1.export_excel_program.program.containers[0]._nominal_width},${app1.export_excel_program.program.containers[0]._nominal_height},${app1.export_excel_program.program.containers[0].weight}\n`;
            str += '\n';
            str += `货物类型,长,宽,高,重量,数目\n`;
            for (var i = 0; i < app1.export_excel_program.program.cargos_num.length; i++) {
                str += `货物${app1.export_excel_program.program.cargos_num[i].type},`;
                str += `${app1.export_excel_program.program.cargos_num[i].length},`;
                str += `${app1.export_excel_program.program.cargos_num[i].width},`;
                str += `${app1.export_excel_program.program.cargos_num[i].height},`;
                str += `${app1.export_excel_program.program.cargos_num[i].weight},`;
                str += `${app1.export_excel_program.program.cargos_num[i].num}\n`;
            }
            str += '\n';
            for (i = 0; i < app1.export_excel_program.program.Container_num; i++) {
                str += `箱${(i + 1)}参数：,X轴上长度,Y轴上长度,Z轴上长度,顶点坐标1,顶点坐标2,顶点坐标3,顶点坐标4,顶点坐标5,顶点坐标6,顶点坐标7,顶点坐标8\n`;
                str += ` ,`;
                str += `${app1.export_excel_program.program.containers[i].exchange_x},`;
                str += `${app1.export_excel_program.program.containers[i].exchange_y},`;
                str += `${app1.export_excel_program.program.containers[i].exchange_z},`;
                str += `(${app1.export_excel_program.program.containers[i]._x + '\t'}，${app1.export_excel_program.program.containers[i]._y + '\t'}，${app1.export_excel_program.program.containers[i]._z + '\t'}),`;
                str += `(${app1.export_excel_program.program.containers[i]._x + '\t'}，${app1.export_excel_program.program.containers[i]._y + '\t'}，${(app1.export_excel_program.program.containers[i]._z + app1.export_excel_program.program.containers[i].exchange_z) + '\t'}),`;
                str += `(${app1.export_excel_program.program.containers[i]._x + '\t'}，${(app1.export_excel_program.program.containers[i]._y + app1.export_excel_program.program.containers[i].exchange_y) + '\t'}，${(app1.export_excel_program.program.containers[i]._z + app1.export_excel_program.program.containers[i].exchange_z) + '\t'}),`;
                str += `(${app1.export_excel_program.program.containers[i]._x + '\t'}，${(app1.export_excel_program.program.containers[i]._y + app1.export_excel_program.program.containers[i].exchange_y) + '\t'}，${app1.export_excel_program.program.containers[i]._z + '\t'}),`;
                str += `(${(app1.export_excel_program.program.containers[i]._x + app1.export_excel_program.program.containers[i].exchange_x) + '\t'}，${app1.export_excel_program.program.containers[i]._y + '\t'}，${app1.export_excel_program.program.containers[i]._z + '\t'}),`;
                str += `(${(app1.export_excel_program.program.containers[i]._x + app1.export_excel_program.program.containers[i].exchange_x) + '\t'}，${app1.export_excel_program.program.containers[i]._y + '\t'}，${(app1.export_excel_program.program.containers[i]._z + app1.export_excel_program.program.containers[i].exchange_z) + '\t'}),`;
                str += `(${(app1.export_excel_program.program.containers[i]._x + app1.export_excel_program.program.containers[i].exchange_x) + '\t'}，${(app1.export_excel_program.program.containers[i]._y + app1.export_excel_program.program.containers[i].exchange_y) + '\t'}，${(app1.export_excel_program.program.containers[i]._z + app1.export_excel_program.program.containers[i].exchange_z) + '\t'}),`;
                str += `(${(app1.export_excel_program.program.containers[i]._x + app1.export_excel_program.program.containers[i].exchange_x) + '\t'}，${(app1.export_excel_program.program.containers[i]._y + app1.export_excel_program.program.containers[i].exchange_y) + '\t'}，${app1.export_excel_program.program.containers[i]._z + '\t'})\n`;
                str += `箱${(i + 1)}中货物：,货物序号,货物类型,X轴上长度,Y轴上长度,Z轴上长度,顶点坐标1,顶点坐标2,顶点坐标3,顶点坐标4,顶点坐标5,顶点坐标6,顶点坐标7,顶点坐标8\n`;
                for (var j = 0; j < app1.export_excel_program.program.containers[i].cargos.length; j++) {
                    str += ` ,`;
                    str += `${(j + 1)},`;
                    str += `货物${app1.export_excel_program.program.containers[i].cargos[j]._type},`;
                    str += `${app1.export_excel_program.program.containers[i].cargos[j].exchange_x},`;
                    str += `${app1.export_excel_program.program.containers[i].cargos[j].exchange_y},`;
                    str += `${app1.export_excel_program.program.containers[i].cargos[j].exchange_z},`;
                    str += `(${app1.export_excel_program.program.containers[i].cargos[j]._x + '\t'}，${app1.export_excel_program.program.containers[i].cargos[j]._y + '\t'}，${app1.export_excel_program.program.containers[i].cargos[j]._z + '\t'}),`;
                    str += `(${app1.export_excel_program.program.containers[i].cargos[j]._x + '\t'}，${app1.export_excel_program.program.containers[i].cargos[j]._y + '\t'}，${(app1.export_excel_program.program.containers[i].cargos[j]._z + app1.export_excel_program.program.containers[i].cargos[j].exchange_z) + '\t'}),`;
                    str += `(${app1.export_excel_program.program.containers[i].cargos[j]._x + '\t'}，${(app1.export_excel_program.program.containers[i].cargos[j]._y + app1.export_excel_program.program.containers[i].cargos[j].exchange_y) + '\t'}，${(app1.export_excel_program.program.containers[i].cargos[j]._z + app1.export_excel_program.program.containers[i].cargos[j].exchange_z) + '\t'}),`;
                    str += `(${app1.export_excel_program.program.containers[i].cargos[j]._x + '\t'}，${(app1.export_excel_program.program.containers[i].cargos[j]._y + app1.export_excel_program.program.containers[i].cargos[j].exchange_y) + '\t'}，${app1.export_excel_program.program.containers[i].cargos[j]._z + '\t'}),`;
                    str += `(${(app1.export_excel_program.program.containers[i].cargos[j]._x + app1.export_excel_program.program.containers[i].cargos[j].exchange_x) + '\t'}，${app1.export_excel_program.program.containers[i].cargos[j]._y + '\t'}，${app1.export_excel_program.program.containers[i].cargos[j]._z + '\t'}),`;
                    str += `(${(app1.export_excel_program.program.containers[i].cargos[j]._x + app1.export_excel_program.program.containers[i].cargos[j].exchange_x) + '\t'}，${app1.export_excel_program.program.containers[i].cargos[j]._y + '\t'}，${(app1.export_excel_program.program.containers[i].cargos[j]._z + app1.export_excel_program.program.containers[i].cargos[j].exchange_z) + '\t'}),`;
                    str += `(${(app1.export_excel_program.program.containers[i].cargos[j]._x + app1.export_excel_program.program.containers[i].cargos[j].exchange_x) + '\t'}，${(app1.export_excel_program.program.containers[i].cargos[j]._y + app1.export_excel_program.program.containers[i].cargos[j].exchange_y) + '\t'}，${(app1.export_excel_program.program.containers[i].cargos[j]._z + app1.export_excel_program.program.containers[i].cargos[j].exchange_z) + '\t'}),`;
                    str += `(${(app1.export_excel_program.program.containers[i].cargos[j]._x + app1.export_excel_program.program.containers[i].cargos[j].exchange_x) + '\t'}，${(app1.export_excel_program.program.containers[i].cargos[j]._y + app1.export_excel_program.program.containers[i].cargos[j].exchange_y) + '\t'}，${app1.export_excel_program.program.containers[i].cargos[j]._z + '\t'})\n`;
                }
                str += '\n';
            }
            let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
            //通过创建a标签实现
            let link = document.createElement("a");
            link.href = uri;
            //对下载的文件命名
            link.download = app1.p_name[app1.export_excel_program.index]+" 方案具体数据.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        screenshot() {
            var msg = {
                status: 2,
                msg: {}
            };
            app1.iframeWin.postMessage(msg, '*');
        },
        cameraAngle(num) {
            if (app1.now_Draw !== {}) {
                var msg = {
                    status: 0,
                    msg: app1.now_Draw
                };
                msg.status = num;
                app1.iframeWin.postMessage(msg, '*');
            }
            else {
                app1.$message.error('无效操作，请重试');
            }
        },
        getBadgeValue(status) {
            if (status === 0) {
                return 'color : #ff0000';
            }
            else return 'color : rgba(255,255,255,0)';
        },
        addCargo() {
            this.cargos.push({
                length: '',
                width: '',
                height: '',
                num: 1,
                type: this.cargos.length+1
            });
        },
        removeCargo(item) {
            var index = this.cargos.indexOf(item);
            if (index !== -1 && this.cargos.length > 1) {
                this.cargos.splice(index, 1);
            }
            else {
                this.$message.error('至少需保留一种货物');
            }
        },
        addProgram(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var a_input = {
                        ct: {
                            length: this.container.length,
                            width: this.container.width,
                            height: this.container.height,
                            weight: app1.container.weight
                        },
                        cn: this.cargos,
                        type: this.radio_num,
                        name:this.container.name
                    };
                    var arr_ct = [a_input.ct.length, a_input.ct.width, a_input.ct.height, a_input.ct.weight];
                    arr_ct.sort();
                    for (i = 0; i < a_input.cn.length; i++) {
                        var arr_cn = [a_input.cn[i].length, a_input.cn[i].width, a_input.cn[i].height, a_input.cn[i].weight];
                        arr_cn.sort();
                        if (arr_cn[0] > arr_ct[0] || arr_cn[1] > arr_ct[1] || arr_cn[2] > arr_ct[2]) {
                            app1.$message.error('输入数据有问题，第'+(i+1)+'个货物尺寸大于货箱尺寸，请检查后重试');
                            return false;
                        }
                        if (a_input.cn[i].weight > a_input.ct.weight) {
                            app1.$message.error('输入数据有问题，第'+(i+1)+'个货物重量大于货箱限重，请检查后重试');
                            return false;
                        }
                    }
                    $.ajax({
                        type: "POST",
                        url: "/api/OA",
                        data: JSON.stringify(a_input),
                        contentType: 'application/json',
                        async: true,
                        success: function (data) {
                            switch (data) {
                                case -10:
                                    app1.$message.error('未登录，跳转至登录界面');
                                    window.location.href = '/HOME/Login';
                                    break;
                                case 0:
                                    app1.$message.error('方案添加出错，请重试');
                                    return false;
                                case -1:
                                    app1.$message.error('您已有方案计算中，请稍后重试');
                                    return false;
                                default:
                                    app1.c_items.unshift({
                                        id:data,
                                        name: a_input.name
                                    });
                                    app1.addDialogVisible = false;
                            }
                        }
                    });
                }
                else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        delProgram(index) {
            var jsondata = {
                Result: this.p_ID[index]
            };
            $.ajax({
                type: "POST",
                url: "/api/DeleteProgram",
                data: JSON.stringify(jsondata),
                contentType: 'application/json',
                async: false,
                success: function (data) {
                    if (data.Result === 1) {
                        app1.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                        app1.p_items.splice(index, 1);
                        app1.p_date.splice(index, 1);
                        app1.p_ID.splice(index, 1);
                        app1.p_OAtype.splice(index, 1);
                        app1.p_name.splice(index, 1);
                    }
                    else {
                        app1.$notify.error({
                            title: '错误',
                            message: '删除失败，请重试'
                        });
                        return false;
                    }
                }
            });
        },
        getOAtype(num) {
            switch (num) {
                case 1:
                    return "剩余空间最优化算法(RSO)";
                case 2:
                    return "遗传算法(GA)";
                case 3:
                    return "连续HopField神经网络算法(CHNN)";
                case 4:
                    return "混合遗传模拟退火算法(HGSAA)";
                default:
                    return "剩余空间最优化算法(RSO)";
            }
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.cargos.splice(1, this.cargos.length - 1);
            var c_1 = {
                length: '',
                width: '',
                height: '',
                num: 1
            };
            this.cargos.splice(0, 1, c_1);
        },
        cargoColor: function (type) {
            var color = parseInt(0x98FB98);
            color += (parseInt(type) - 1) * 89999 * Math.pow(parseInt(type) - 1, 2);
            return "#" + color.toString(16).substr(-6);
        },
        changeSwitch() {
            if (app1.switch_change === false) {
                app1.switchstatus = '点击开启智能选择';
                app1.radio_num = '1';
                app1.radio_open = false;
            }
            else {

                app1.switchstatus = '点击关闭智能选择';
                app1.radio_num = '0';
                app1.radio_open = true;
            }
        },
        getLoadTemplate() {
            var downloadurl = 'Files/LoadTemplate.xlsx';
            let link = document.createElement("a");
            link.href = downloadurl;
            //对下载的文件命名
            link.download = '导入模板.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        handleChange(file, fileList) {
            var suffix = file.name.split(".")[1];
            if (suffix !== 'xls' && suffix !== 'xlsx') {
                app1.$message.error('只能上传xls/xlsx文件');
                return;
            }
            var reader = new FileReader();
            reader.onload = function (ev) {
                try {
                    var data = ev.target.result;
                    var workbook = XLSX.read(data, {
                        type: 'binary'
                    }); // 以二进制流方式读取得到整份excel表格对象
                } catch (e) {
                    app1.$message.error('文件类型不正确');
                    return;
                }
                var sheet_json;
                for (var sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        sheet1 = workbook.Sheets[sheet]['!ref'];
                        sheet_json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                        break; // 如果只取第一张表，就取消注释这行
                    }
                }
                app1.cargos = [{
                    length: '',
                    width: '',
                    height: '',
                    num: 1,
                    type: 1,
                    weight:''
                }];
                var type1 = 1;
                for (var i = 0; i < sheet_json.length; i++) {
                    if (i === 0) {
                        if (sheet_json[i].hasOwnProperty("长")) app1.container.length = parseFloat(sheet_json[i].长);
                        else app1.container.length = 0;
                        if (sheet_json[i].hasOwnProperty("宽")) app1.container.width = parseFloat(sheet_json[i].宽);
                        else app1.container.width = 0;
                        if (sheet_json[i].hasOwnProperty("高")) app1.container.height = parseFloat(sheet_json[i].高);
                        else app1.container.height = 0;
                        if (sheet_json[i].hasOwnProperty("限重")) app1.container.weight = parseFloat(sheet_json[i].限重);
                        else app1.container.weight = 0;
                        if (sheet_json[i].hasOwnProperty("方案名")) app1.container.name = sheet_json[i].方案名;
                        else app1.container.name = '';
                        if (sheet_json[i].hasOwnProperty("选择算法")&&(sheet_json[i].选择算法.toString() === '1' || sheet_json[i].选择算法.toString() === '2' || sheet_json[i].选择算法.toString() === '3' || sheet_json[i].选择算法.toString() === '4')) {
                            app1.switch_change = false;
                            app1.radio_open = false;
                            app1.radio_num = sheet_json[i].选择算法.toString();
                        }
                        else{
                            app1.switch_change = true;
                            app1.radio_num = '0';
                        }
                        if (sheet_json[i].hasOwnProperty("货物长")) app1.cargos[0].length = parseFloat(sheet_json[i].货物长);
                        else app1.cargos[0].length = 0;
                        if (sheet_json[i].hasOwnProperty("货物宽")) app1.cargos[0].width = parseFloat(sheet_json[i].货物宽);
                        else app1.cargos[0].width = 0;
                        if (sheet_json[i].hasOwnProperty("货物高")) app1.cargos[0].height = parseFloat(sheet_json[i].货物高);
                        else app1.cargos[0].height = 0;
                        if (sheet_json[i].hasOwnProperty("重量")) app1.cargos[0].weight = parseFloat(sheet_json[i].重量);
                        else app1.cargos[0].weight = 0;
                        if (sheet_json[i].hasOwnProperty("数目")) app1.cargos[0].num = parseInt(sheet_json[i].数目);
                        else app1.cargos[0].num = 1;
                        app1.cargos[0].type = type1++;
                    }
                    else
                    {
                        var item = {
                            type: type1++,
                            length: 0,
                            width: 0,
                            height: 0,
                            num: 1,
                            weight:0
                        };
                        if (sheet_json[i].hasOwnProperty("货物长")) {
                            item.length = parseFloat(sheet_json[i].货物长);
                            if (sheet_json[i].hasOwnProperty("货物宽")) item.width = parseFloat(sheet_json[i].货物宽);
                            else item.width = 0;
                            if (sheet_json[i].hasOwnProperty("货物高")) item.height = parseFloat(sheet_json[i].货物高);
                            else item.height = 0;
                            if (sheet_json[i].hasOwnProperty("重量")) item.weight = parseFloat(sheet_json[i].重量);
                            else item.weight = 0;
                            if (sheet_json[i].hasOwnProperty("数目")) item.num = parseInt(sheet_json[i].数目);
                            else item.num = 1;
                            app1.cargos.push(item);
                        }
                        else continue;
                    }
                }
            };
            reader.readAsBinaryString(file.raw);
            this.$refs['excel-upload'].clearFiles();
            app1.load_open = false;
        },
        openDetailProgram(item, index_num) {
            app1.programinfo.containers = item.containers;
            app1.programinfo.Container_num = item.Container_num;
            app1.programinfo.cargos_num = item.cargos_num;
            app1.programinfo.name = app1.p_name[index_num];
            app1.programinfo.OA = this.getOAtype(app1.p_OAtype[index_num]);
            app1.programinfo.visible = true;
            Vue.nextTick(function () {
                var option11 = {
                    title: {
                        text: '货物数量分布统计',
                        left:'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c}个 ({d}%)"
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: { show: true }
                        }
                    },
                    series: [
                        {
                            name: '货物数量',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: []
                        }
                    ]
                };
                var option12 = {
                    title: {
                        text: '货物体积占比分布统计',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}mm³ ({d}%)"
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: { show: true }
                        }
                    },
                    calculable: true,
                    series: [
                        {
                            name: '单种货物总体积',
                            type: 'pie',
                            radius: [20, 110],
                            center: ['50%', '50%'],
                            avoidLabelOverlap: true,
                            roseType: 'radius',
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                },
                                smooth: 0.2,
                                length: 10
                            },
                            
                            data: [].sort(function (a, b) { return a.value - b.value; })
                        }
                    ]
                };
                for (var i = 0; i < app1.programinfo.cargos_num.length; i++){
                    option11.series[0].data.push({
                        value: app1.programinfo.cargos_num[i].num,
                        name: '货物' + app1.programinfo.cargos_num[i].type
                    });
                    option12.series[0].data.push({
                        value: app1.programinfo.cargos_num[i].num * app1.programinfo.cargos_num[i].vol,
                        name: '货物' + app1.programinfo.cargos_num[i].type
                    });
                }
                option12.series[0].data.sort(function (a, b) { return a.value - b.value; });
                var myChart = echarts.init(document.getElementById('pi_1_1'), 'light');
                myChart.clear();
                myChart.setOption(option11);
                myChart = echarts.init(document.getElementById('pi_1_2'), 'light');
                myChart.clear();
                myChart.setOption(option12);
                var cargo_in_container = [];
                for (i = 0; i < app1.programinfo.containers.length; i++) {
                    var option = {
                        title: {
                            text: '箱' + (i + 1) + '货物体积与数量分布统计',
                            x: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b}: {c} ({d}%)"
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                saveAsImage: { show: true }
                            }
                        },
                        series: [
                            {
                                name: '单种货物总体积',
                                type: 'pie',
                                selectedMode: 'single',
                                radius: [0, '30%'],

                                label: {
                                    normal: {
                                        position: 'inner'
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: []
                            },
                            {
                                name: '货物数量',
                                type: 'pie',
                                radius: ['40%', '55%'],
                                label: {
                                    normal: {
                                        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                                        backgroundColor: '#fff',
                                        borderColor: '#aaa',
                                        borderWidth: 1,
                                        borderRadius: 4,
                                        rich: {
                                            a: {
                                                color: '#000',
                                                lineHeight: 22,
                                                align: 'center'
                                            },
                                            hr: {
                                                borderColor: '#aaa',
                                                width: '100%',
                                                borderWidth: 0.5,
                                                height: 0
                                            },
                                            b: {
                                                fontSize: 16,
                                                lineHeight: 33
                                            },
                                            per: {
                                                color: '#eee',
                                                backgroundColor: '#334455',
                                                padding: [2, 4],
                                                borderRadius: 2
                                            }
                                        }
                                    }
                                },
                                data: []
                            }
                        ]
                    };
                    var cargolist = [];
                    for (var j = 0; j < app1.programinfo.containers[i].cargos.length; j++) {
                        if (cargolist.length === 0) {
                            cargolist.push({
                                type: app1.programinfo.containers[i].cargos[j]._type,
                                num: 1,
                                vol: app1.programinfo.containers[i].cargos[j].vol,
                                weight: app1.programinfo.containers[i].cargos[j].weight
                            });
                        }
                        else {
                            var isfind = false;
                            for (var k = 0; k < cargolist.length; k++) {
                                if (cargolist[k].type === app1.programinfo.containers[i].cargos[j]._type) {
                                    cargolist[k].num += 1;
                                    isfind = true;
                                }
                            }
                            if (isfind === false) {
                                cargolist.push({
                                    type: app1.programinfo.containers[i].cargos[j]._type,
                                    num: 1,
                                    vol: app1.programinfo.containers[i].cargos[j].vol,
                                    weight: app1.programinfo.containers[i].cargos[j].weight
                                });
                            }
                        }
                    }
                    cargo_in_container.push(cargolist);
                    var sum_vol = 0;
                    for (j = 0; j < cargolist.length; j++) {
                        option.series[0].data.push({
                            value: cargolist[j].vol * cargolist[j].num,
                            name: '货物' + cargolist[j].type
                        });
                        option.series[1].data.push({
                            value: cargolist[j].num,
                            name: '货物' + cargolist[j].type
                        });
                        sum_vol += cargolist[j].vol * cargolist[j].num;
                    }
                    var ct_vol = app1.programinfo.containers[0]._nominal_length * app1.programinfo.containers[0]._nominal_width * app1.programinfo.containers[0]._nominal_height;
                    option.series[0].data.push({
                        value: ct_vol - sum_vol,
                        name: '未利用空间'
                    });
                    myChart = echarts.init(document.getElementById('pi_' + (i + 2)), 'light');
                    myChart.clear();
                    myChart.setOption(option);
                }
                var optionCargo = {
                    title: {
                        text:'货物在货箱中的分布统计',
                        x: 'center'
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        y:'top'
                    },
                    tooltip: {},
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: { show: true }
                        }
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            xAxisIndex: 0,
                            start: 0,
                            end: 100
                        },
                        {
                            type: 'inside',
                            xAxisIndex: 0,
                            start: 0,
                            end: 100
                        }
                    ],
                    dataset: {
                        dimensions: ['name'],
                        source: []
                    },
                    xAxis: { type: 'category' },
                    yAxis: {
                        axisLabel: { formatter: '{value} 个' }
                    },
                    series: []
                };
                for (i = 0; i < cargo_in_container.length; i++) {
                    optionCargo.dataset.dimensions.push('箱' + (i + 1));
                    optionCargo.series.push({ type: 'bar' });
                }
                for (i = 0; i < app1.programinfo.cargos_num.length; i++) {
                    var item = {
                        name: '货物' + app1.programinfo.cargos_num[i].type
                    };
                    for (j = 0; j < cargo_in_container.length; j++) {
                        var check = false;
                        for (k = 0; k < cargo_in_container[j].length; k++) {
                            if (item.name === '货物' + cargo_in_container[j][k].type) {
                                item['箱' + (j + 1)] = cargo_in_container[j][k].num;
                                check = true;
                                break;
                            }
                        }
                        if (!check) item['箱' + (j + 1)] = 0;
                    }
                    optionCargo.dataset.source.push(item);
                }
                myChart = echarts.init(document.getElementById('pi_allcargo'), 'light');
                myChart.clear();
                myChart.setOption(optionCargo);
                //货物重量占比统计
                var optionWeight = {
                    title: {
                        text: '货箱重量分布统计',
                        x: 'center'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: { show: true }
                        }
                    },
                    tooltip: {
                        formatter: "{b} : {c}吨"
                    },
                    series: [{
                        name:'货箱重量分布',
                        type: 'treemap',
                        visibleMin: 0.0001,
                        label: {
                            show: true,
                            formatter: '{b}'
                        },
                        upperLabel: {
                            normal: {
                                show: true,
                                height: 30
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#fff'
                            }
                        },
                        levels: getLevelOption(),
                        data: []
                    }]
                };
                function getLevelOption() {
                    return [
                        {
                            itemStyle: {
                                normal: {
                                    borderColor: '#fff',
                                    borderWidth: 0,
                                    gapWidth: 1
                                }
                            },
                            upperLabel: {
                                normal: {
                                    show: false
                                }
                            }
                        },
                        {
                            itemStyle: {
                                normal: {
                                    borderColor: '#cccccc',
                                    borderWidth: 5,
                                    gapWidth: 1
                                },
                                emphasis: {
                                    borderColor: '#ddd'
                                }
                            }
                        },
                        {
                            colorSaturation: [0.35, 0.5],
                            itemStyle: {
                                normal: {
                                    borderWidth: 5,
                                    gapWidth: 1,
                                    borderColorSaturation: 0.6
                                }
                            }
                        }
                    ];
                }
                for (i = 0; i < cargo_in_container.length; i++) {
                    optionWeight.series[0].data.unshift({
                        name: '箱' + (i + 1) + '配重',
                        value: app1.programinfo.containers[i].weight,
                        children: [{
                            name: '未占用重量',
                            value: app1.programinfo.containers[i].weight - app1.programinfo.containers[i].loadweight
                        }]
                    });
                    for (j = 0; j < cargo_in_container[i].length; j++) {
                        optionWeight.series[0].data[0].children.push({
                            name: '货物' + cargo_in_container[i][j].type,
                            value: cargo_in_container[i][j].num * cargo_in_container[i][j].weight
                        });
                    }
                }
                myChart = echarts.init(document.getElementById('pi_weight'), 'light');
                myChart.clear();
                myChart.setOption(optionWeight);
            });
        }
    },
    destroyed: function () {
        // 每次离开当前界面时，清除定时器
        clearInterval(this.timer);
        this.timer = null;
    },
    mounted() {
        // 在外部vue的window上添加postMessage的监听，并且绑定处理函数handleMessage
        window.addEventListener('message', this.handleMessage);
        this.iframeWin = this.$refs.drawiframe.contentWindow;
    },
    handleMessage(event) {
        
    }
});
$(function () {
    var h1 = $('#main2').height();
    var h2 = $('.footer').height();
    $('#main1').height($(window).height() - h1 - h2-10);
    $('#Draw').height($('.el-main').height() - 10);
    var msg = {
        status: 0,
        msg: {}
    };
    var iframe = document.getElementById("Draw");
    if (iframe.attachEvent) {
        iframe.attachEvent("onload", function () {
            document.getElementById('Draw').contentWindow.postMessage(msg, '*');  
        });
    } else {
        iframe.onload = function () {
            document.getElementById('Draw').contentWindow.postMessage(msg, '*');
        };
    }
});
$(window).resize(function () {
    var h1 = $('#main2').height();
    var h2 = $('.footer').height();
    $('#main1').height($(window).height() - h1 - h2 - 10);
    $('#Draw').height($('.el-main').height() - 10);
});

