//在发送ajax请求前会先执行ajaxPrefilter这个函数
$.ajaxPrefilter(function(options) {
    // 在这个函数中，可以拿到我们给Ajax提供的配置对象
    // http://ajax.frontend.itheima.net
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
})