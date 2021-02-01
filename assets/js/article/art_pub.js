$(function() {
    var layer = layui.layer
    var form = layui.form

    initCate()
        // 初始化富文本编辑器
    initEditor();
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }
})



// 1. 初始化图片裁剪器
var $image = $('#image')

// 2. 裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
}

// 3. 初始化裁剪区域
$image.cropper(options)


$('#coverFile').on('change', function(e) {
    // 获取用户选择的文件
    var filelist = this.files
        //  console.log(filelist);
    if (filelist.length === 0) {
        return layer.msg('请选择照片！')
    }

    // 1. 拿到用户选择的文件
    var file = e.target.files[0]
        // 2. 将文件，转化为路径
    var imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
    $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', imgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
})

$('#btnChooseImage').on('click', function(e) {
    $('#coverFile').click();
})
var art_state = '已发布';

$('#btnSave2').on('click', function() {
    art_state = '草稿'
})

//您qq电话吧 边远程边电话...keyi




// 为表单绑定 submit 提交事件
$('#form-pub').on('submit', function(e) {
    // 1. 阻止表单的默认提交行为
    e.preventDefault()
        // 2. 基于 form 表单，快速创建一个 FormData 对象
    var fd = new FormData($(this)[0])
        // 3. 将文章的发布状态，存到 fd 中
    fd.append('state', art_state)
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        //这是jquery对象
    $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 5. 将文件对象，存储到 fd 中
            fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求

            //遍历formdata
            for (var [a, b] of fd.entries()) {
                console.log(a, b);
            }
            publishArticle(fd);
        })
})



// $('#form-pub').on('submit', function(e) {
//     //1.阻止表单默认提交行为
//     e.preventDefault();
//     //2.获取表单提交数据 
//     var form_data = new FormData($(this)[0]);


//     //form_Data打印不出来 只能通过遍历循环看里面的内容

//     //3.添加新的表单数据
//     // form_data.append('state', art_state);
//     //4将图片的裁剪区域，输出一个文件对象
//     $image
//         .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
//             width: 400,
//             height: 280
//         }).toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
//             // 得到文件对象后，进行后续的操作
//             //5.存储文件form_data 文件中
//             form_data.append('cover_img', blob);
//             form_data.append('state', art_state);
//             //6.发起ajax请求
//             publishArticle(form_data);
//         })


// })

// 上面是发布文章的请求对么 你从主页进去 发布之后你看编辑就知道发布的内容为空 你可以kan 'jia
//您看我给你演示
function publishArticle(fd) {
    $.ajax({
        method: 'POST',
        url: '/my/article/add',
        data: fd,
        // 注意：如果向服务器提交的是 FormData 格式的数据，
        // 必须添加以下两个配置项
        contentType: false,
        processData: false,
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('发布文章失败！')
            }
            layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
            location.href = '/article/art_list.html'
        }
    })
}