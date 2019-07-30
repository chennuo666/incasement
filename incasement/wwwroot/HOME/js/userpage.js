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
        p_items: [],
        p_date: [],
        p_ID: [],
        p_OAtype: [],
        p_name: [],
        centerDialogVisible1: false,
        centerDialogVisible2: false,
        dig_index: 0,
        rename: {
            name: {}
        },
        rules: {
            name: [
                { required: true, message: '不能为空', trigger: 'blur' },
                { min: 1, max: 10, message: '长度应为1-10个字符', trigger: 'blur' }
            ]
        },
        loading: true
    },
    created() {
        var v_cookie = JSON.parse($.cookie('account'));
        var jsondata = {
            db: 'Program',
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
    },
    methods: {
        setdelDig(num) {
            app1.dig_index = num;
            app1.centerDialogVisible1 = true;
        },
        setrenameDig(num) {
            app1.dig_index = num;
            app1.rename.name = app1.p_name[num];
            app1.centerDialogVisible2 = true;
        },
        updateProgramName(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var rename = {
                        status: app1.p_ID[app1.dig_index],
                        reg: [app1.rename.name]
                    };
                    $.ajax({
                        type: "POST",
                        url: "/api/UpdateProgramName",
                        data: JSON.stringify(rename),
                        contentType: 'application/json',
                        async: false,
                        success: function (data) {
                            if (data.status === 1) {
                                app1.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                app1.p_name[app1.dig_index] = data.message;
                                app1.centerDialogVisible2 = false;
                            }
                            else {
                                app1.$message({
                                    message: '修改失败，请重试',
                                    type: 'error'
                                });
                                app1.centerDialogVisible2 = false;
                                return false;
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
                        app1.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        app1.p_items.splice(index, 1);
                        app1.p_date.splice(index, 1);
                        app1.p_ID.splice(index, 1);
                        app1.p_OAtype.splice(index, 1);
                        app1.p_name.splice(index, 1);
                        app1.centerDialogVisible1 = false;
                    }
                    else {
                        app1.$message({
                            showClose: true,
                            message: '删除失败，请重试',
                            type: 'error'
                        });
                        return false;
                    }
                }
            });
        },
        getOAtype(num) {
            switch (num) {
                case 1:
                    return "剩余空间最优化算法";
                case 2:
                    return "遗传算法";
                case 3:
                    return "连续HopField神经网络";
                case 4:
                    return "混合遗传模拟退火算法";
                default:
                    return "剩余空间最优化算法";
            }
        },
        getCalDate(str_date) {
            var len = str_date.indexOf('T');
            return str_date.substring(0, len);
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
        }
    }
});

window.onload = function () {
    var h1 = $('#main2').height();
    var h2 = $('.footer').height();
    $('#main1').height($(window).height() - h1 - h2);
    /*$('.el-card').hover(
        function () {
            $(this).width($(this).width() + 10);
            $(this).css('background-color', '#F2F6FC');
        },
        function () {
            $(this).width($(this).width() - 10);
            $(this).css('background-color', '#ffffff');
        }
    );*/
};
$(window).resize(function () {
    var h1 = $('#main2').height();
    var h2 = $('.footer').height();
    $('#main1').height($(window).height() - h1 - h2);
    $('#Draw').height($('.el-main').height() - 10);
});