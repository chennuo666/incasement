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
            window.location.href = "/HOME/Login";
        }
    }
});
var app2 = new Vue({
    el: '.main2',
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('密码不能为空'));
            }
        };
        var validateUser = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('用户名不能为空'));
            }
        };
        return {
            regForm: {
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
        openLog() {
            window.location.href = "/HOME/Login";
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    console.log('error submit!!');
                    return false;
                }
            });
            var jsondata = {
                userName: this.regForm.user,
                pwd: this.regForm.pass
            };
            $.ajax({
                type: "POST",
                url: "/api/Register",
                data: JSON.stringify(jsondata),
                contentType: 'application/json',
                async: false,
                success: function (data) {
                    switch (data.Result) {
                        case 1:
                            app2.$message({
                                message: '注册成功！跳转页面中..',
                                type: 'success'
                            });
                            window.location.href = "/HOME/Index";
                            break;
                        case 0:
                            app2.$message.error('该用户名已存在,请重新输入');
                            return false;
                        case -1:
                            app2.$message.error('密码不能为空,请重新输入');
                            return false;
                        case -2:
                            app2.$message.error('用户名不能为空，请重新输入');
                            return false;
                    }
                }
            });
        }
    }
});
