$(function() {
    var form = layui.form
        // 文章的状态
    var articleState = ''

    getArticleCates()
    initEditor()

    // 初始化图片裁剪器
    var $image = $('#image')
        // 裁剪选项
    var cropperOption = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 初始化裁剪区域
    $image.cropper(cropperOption)

    // 获取文章分类
    function getArticleCates() {
        $.get('/my/article/cates', function(res) {
            if (res.status !== 0) {
                return layer.msg('获取文章分类列表数据失败！')
            }
            var htmlStr = template('selectArtCates', res)
            $('#art_cate').html(htmlStr)
                // 动态向表单中写入内容之后，必须强制表单重新渲染一下
            form.render()
        })
    }

    // 点击了发布按钮
    $('#btnPublish').on('click', function() {
        articleState = '已发布'
    })

    // 点击了存为草稿按钮
    $('#btnSave').on('click', function() {
        articleState = '草稿'
    })

    // 监听发表文章表单的提交事件
    $('#formAddArticle').on('submit', function(e) {
        e.preventDefault()

        // 由于表单中包含了文件内容，不能再调用 serialize() 函数来序列化表单
        // 需要使用 FormData 对象来保存表单内容
        var fd = new FormData($(this)[0])
            // 得到裁剪之后的 canvas，并且调用 canvas 的 toBlob 函数，
            // 将裁剪之后的图片转化为 blob 对象
        $image
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将裁剪之后的图片，转化为 blob 对象
                fd.append('cover_img', blob)
                fd.append('state', articleState)

                // 发起请求，把文章信息保存到服务器
                $.ajax({
                    method: 'POST',
                    url: '/my/article/add',
                    processData: false,
                    contentType: false,
                    data: fd,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg('发表文章失败！')
                        }
                        // 发表文章成功之后，立即跳转到文章列表页面
                        location.href = '/article/art_list.html'
                    }
                })
            })
    })

    // 选择封面
    $('#btnChooseCoverImage').on('click', function(e) {
        e.preventDefault()
            // 模拟点击
        $('#fileCover').click()
    })

    // 监听文件选择框的 change 事件
    $('#fileCover').on('change', function(e) {
        var files = e.target.files
            // 用户没有选择任何图片封面
        if (files.length === 0) {
            return
        }

        // 将选择的图片转化为临时路径
        var tempURL = URL.createObjectURL(files[0])
            // 重置图片裁剪器
        $image
            .cropper('destroy')
            .attr('src', tempURL)
            .cropper(cropperOption)
    })
})