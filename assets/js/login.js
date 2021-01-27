$(function() {


    //点击去注册
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });

    //点击去登录
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    });



    //获取layUi form属性
    //获取layUi layer属性

    var form = layui.form;
    var layer = layui.layer;


    //自定义密码校验
    form.verify({
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value, item) {
            //获取输入密码
            var pwd = $('.reg-box [name=password]').val();
            //if判断是否一直
            if (value !== pwd) {
                //不一致则提示
                return '两次密码输入不一致';
            }
        }
    });


    //给注册表单绑定提交事件
    $('#form_reg').on('submit', function(e) {
            // 阻止表单默认提交行为
            e.preventDefault();
            // 获取表单数据
            var data = $(this).serialize();
            //发送ajax请求
            $.ajax({
                method: 'POST',
                url: '/api/reguser',
                data: data,
                success: function(res) {
                    // 请求失败
                    if (res.status != 0) {
                        return layer.msg(res.message);
                    }
                    // 请求成功
                    layer.msg(res.message);
                    //跳转到登录窗口
                    $('#link_login').click();

                }
            })

        })
        //给登录表单注册提交事件
    $('#form_login').on('submit', function(e) {
        // 阻止表单默认提交
        e.preventDefault();
        //获取表单中的值
        var data = $(this).serialize();
        //发送ajax请求

        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: data,
            success: function(res) {
                //登陆失败
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //登录成功跳转到index页面
                //保存token到本地
                layer.msg('登陆成功!');
                localStorage.setItem('token', res.token);
                location.href = '/index.html';

            }
        })

    })
})