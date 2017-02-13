/**
 * Created by kai.zuo on 2015/12/1.
 */
define(['jquery', 'lightbox', 'window','jquery-fileupload'], function($, lightbox,UIWindow){

    var _options = {
        dataType : 'iframe json',//上传文件，兼容IE8
        acceptFileTypes : /(\.|\/)(gif|jpe?g|png|bmp|pdf)$/i, //验证图片
        maxFileSize : 1024000*10 //10M //最大10M
    };

    var jqUpload = function(){
        var options = arguments[0] || {};
        var selector = options.selector;
        if(!selector){
            $.error("parameter[selector] is null!");
        }
        $.extend(_options, options);
        $(selector).fileupload(_options);
    };

    // 封装的方法，一般不需要改动
    // 显示图片
    var showUploadedFile = function(selector, e, data) {
        /**
         * 这里 _this 是什么取决于 selector参数是什么~
         * 目前是 input[type=file]； 以后有调整请修改注释！！！
         */
        var _this = $(selector);
        var hiddenTypeId = _this.attr('type-id');

        var firstContainer = _this.parents('.empty-item');   // 顶级容器
        firstContainer.removeClass('empty-item').addClass('full-item');   // 切换容器状态

        var text = firstContainer.find('.title').text();   // 图片 title
        var titleSpan = '<span class="title">'+ text +'</span>';
        var deleteBtn = '<a class="delete-btn"><i></i>删除</a>';

        var imgUrl = data.imgUrl;
        //var imgUrl = "/taisteel/images/test.jpg";
        var typePath = data.typePath;
        //使用与父容器相同的样式
        // var img = "<img src='"+ imgUrl + "' class='"+ firstContainer.attr('class') + "' alt='"+text+"'/>";
        var a = "<a href='"+ imgUrl + "' data-lightbox='example-set'><img src='"+ imgUrl + "' alt='"+text+"'/></a>";

        // 如果是 pdf 不提供 “点击大图”  ， 直接 blank 一个 文件地址
        if(imgUrl.substring(imgUrl.lastIndexOf('.')+1) == 'pdf'){
            a = "<a target='_blank' href='"+imgUrl+"'><img src='" +"../../images/base/pdf.png"+"'></a>";
        }

        firstContainer.html('');   // 清空容器
        firstContainer.append(a); // 添加 a标签展示图片     // $(img).wrapAll($(a))
        // 是否添加图片标题span
        var showTitle = true;
        if(data.showTitle !== undefined && data.showTitle !== ""){
            showTitle = data.showTitle;
        }
        if(showTitle){
            firstContainer.append(titleSpan);  // d添加图片标题span
        }
        firstContainer.append(deleteBtn);  // 添加删除按钮

        firstContainer.data('fileUploadInput', _this);  // input[type=file] 存入data中
        // 绑定 删除按钮事件
        firstContainer.on('click', '.delete-btn', function() {
            deleteUploadedFile(firstContainer[0], e, data);
        });

        $('#' + hiddenTypeId).val(typePath).trigger("change",{});  // 处理隐藏域

    };

    // 点击删除的 处理方法
    var deleteUploadedFile = function (selector, e, data) {
        /**
         * 这里 _this 是什么取决于 selector参数是什么~
         * 目前是 整个div容器； 以后有调整请修改注释！！！
          */
        var _this = $(selector);

        var _fileUploadInput = _this.data('fileUploadInput');  // 尝试从 data 中取得 input[type=file]

        // 不行的话就直接构造 input[type=file]
        if(!_fileUploadInput || !_fileUploadInput.length){
            var fileInputTmpl = $('<input type="file" class="file-input">');
            var fileInputTypeId = '';
            var imgPath = _this.find("img").attr("src");
            var imgName = imgPath.substring(imgPath.lastIndexOf("/")+1);
            _this.siblings("input[type=hidden]").each(function(index, domEle){
                var hidImgPath = $(this).val();
                var hidImgName = '';
                if(hidImgPath.indexOf("/") > 0){
                    hidImgName = hidImgPath.substring(hidImgPath.lastIndexOf("/")+1);
                }else{
                    hidImgName = hidImgPath.substring(hidImgPath.lastIndexOf("\\")+1);
                }
                /*if(imgName === hidImgName){
                    fileInputTypeId = $(this).attr("id");
                    return;
                }*/
            });

            fileInputTmpl.attr({
                "name" : data.fileInputName,
                "type-id" : _this.attr('type-id') //  构造的时候从 父级div attr 中取值
            });
            _fileUploadInput = fileInputTmpl;
        }

        _this.removeClass('full-item').addClass('empty-item');  // 切换容器状态

        var text = _this.find('.title').text();   // 图片 title
        var titleSpan = '<span class="title">'+text+'</span>';
        var uploadBox = '<div class="upload-box"></div>';
        var hiddenTypeId = _fileUploadInput.attr('type-id');

        _this.html(''); // 清空容器
        _this.append(uploadBox);
        _this.append(titleSpan);

        var secondContainer = _this.find('.upload-box');  // 重新获取 uploadbox
        // 添加 input[type=file]
        secondContainer.append(_fileUploadInput);

        var uploadInput = _this.find(':file'); // 从新获取 input[type=file]对象，从页面中

        // 绑定上传事件
        var url = _options.url;
        if(data.url !== undefined && data.url !== ""){
            url = data.url;
        }
        jqUpload({
            selector : uploadInput,
            url:url,
            done: function(e, _data) {
                var code = _data.result.code;
                if(code != 0){
                    UIWindow.alert(_data.result.message);
                    return;
                }

                if(data.result){
                    delete data.result;
                }
                $.extend(_data, data);
                var result = eval(_data.result.data);
                _data.imgUrl =  result.urlPath;
                _data.typePath = result.typePath;
                //console.log('_data.imgUrl=' + _data.imgUrl);
                showUploadedFile(this, e, _data);
            }
        });
        $('#' + hiddenTypeId).val('').trigger("change",{});   // 处理隐藏域
    };

    return {
        upload: jqUpload,
        showUploadedFile: showUploadedFile,
        deleteUploadedFile: deleteUploadedFile
    };
});