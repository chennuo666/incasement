window.onload = function () {
    jsondata = [];
    $.ajax({
        type: "POST",
        url: "/api/Login",
        data: JSON.stringify(jsondata),
        contentType: 'application/json',
        async: false,
        success: function (data) {
            if (data.Result === 0) {
                window.location.reload(true);
            }
        }
    });
};

var app1 = new Vue({
    el: '.main1',
    methods: {
        open() {
            this.$alert(`基于多种优化算法的智能装箱平台是一套在线装箱智能优化系统，适用于货柜装箱、集装箱拼箱、纸箱装箱包装等各种装箱方案的优化设计，并展示基于装箱数据的各类可视化图表。它致力于为客户提供高度优化的集装箱装箱方案，帮助客户提高在生产运输等各个环节的工作效率，同时能够有效降低企业运营成本。`,
                '关于装箱系统', {
                confirmButtonText: '确定'
            });
        }
    }
});
var app2 = new Vue({
    el: '.main2',
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } 
        };
        var validateUser = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            }
        };
        return {
            logForm: {
                user: '',
                pass: ''
            },
            rules2: {
                user: [
                    { validator: validateUser, trigger: 'blur' }
                ],
                pass: [
                    { validator: validatePass, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        openReg() {
            window.location.href = "/HOME/Register";
        },
        inputAccount() {
            this.logForm.user = 'user';
            this.logForm.pass = '11';
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    console.log('error submit!!');
                    return false;
                }
            });
            var jsondata = {
                userName: this.logForm.user,
                pwd: this.logForm.pass
            };
            $.ajax({
                type: "POST",
                url: "/api/Login",
                data: JSON.stringify(jsondata),
                contentType: 'application/json',
                async: false,
                success: function (data) {
                    switch (data.Result) {
                        case 1:
                            app2.$message({
                                message: '登录成功！跳转页面中..',
                                type: 'success'
                            });
                            window.location.href = "/HOME";
                            break;
                        case 0:
                            app2.$message({
                                message: '您已登录',
                                type: 'warning'
                            });
                            window.location.href = "/HOME";
                            break;
                        case -1:
                            app2.$message.error('密码错误,请重新输入');
                            return false;
                        case -2:
                            app2.$message.error('无该用户名，请重新输入');
                            return false;
                    }
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
});