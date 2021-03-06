var asyn_cnt = 0;
var syn_cnt = 0;

$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        xhr.setRequestHeader("X-CSRFtoken", $.cookie("csrftoken"))
    }
});


$(document).ready(function () {

    var folder_fake_name = $("#now_folder_fake_name").val()
    toastr.options = {
        "closeButton": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "showDuration": "100",
        "hideDuration": "1000",
        "timeOut": "2500",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    var aryFiles = Array();
    var GetCount = function () {
        var cnt = syn_cnt;
        if (cnt === 1) {
            return cnt + ' picture uploaded successfully~'
        }
        return cnt + ' pictures uploaded successfully~';
    };
    var GetAsynCount = function () {
        if (asyn_cnt === 1) {
            return asyn_cnt + ' picture uploaded successfully~'
        }
        return asyn_cnt + ' pictures uploaded successfully~';
    }
    $('#upload-input').fileinput({
        theme: "fas",
        //browseClass:"btn btn-primary btn-block",
        //language: 'zh',     // 设置中文，需要引入locales/zh.js文件
        uploadUrl: '/upload_upload_asyn/' + folder_fake_name + "/",     // 上传路径 *****************************************
        maxFileSize: 0,     // 上传文件大小限制，触发 msgSizeTooLarge 提示
        previewFileType: "image",
        browseClass: "browser-btn-solid-lg",
        browseLabel: "",
        browseTitle: "Select Images",
        browseIcon: "<i class=\"fa fa-image\"></i> ",
        removeClass: "remove-btn-solid-lg",
        removeLabel: "",
        removeTitle: "Delete All Images",
        //removeIcon: "<i class=\"fa fa-trash\"></i> ",
        uploadClass: "upload-btn-solid-lg",
        uploadLabel: "",
        //uploadIcon: "<i class=\"fa fa-arrow-up\"></i> ",
        uploadTitle: "Upload All Images",
        cancelClass: "cancel-btn-solid-lg hidden",
        cancelLabel: "",
        cancelTitle: "Cancel Upload",
        allowedFileExtensions: ['jpg', 'jpeg', 'jpe', 'gif', 'png', 'pns', 'bmp', 'png', 'tif', 'tiff', '.gif', '.webp', '.pjp', '.xbm', '.svg', '.ico'],
        // {name}：将被上传的文件名替换，{size}：将被上传的文件大小替换，{maxSize}：将被maxFileSize参数替换。
        //msgSizeTooLarge: '"{name}" ({size} KB) 超过允许的最大上传大小 {maxSize} KB。请重新上传!',
        showPreview: true,  // 展示预览
        showBrowse: true,
        showUpload: true,   // 是否显示上传按钮
        showRemove: true,
        showCaption: true,  // 是否显示文字描述
        showClose: false,   // 隐藏右上角×
        uploadAsync: true, // 是否异步上传 ********************************************
        //initialPreviewShowDelete: true, // 预览中的删除按钮
        autoReplace: true,  // 达到最大上传数时，自动替换之前的附件
        required: true,
        validateInitialCount: true,
        maxFileCount: 20,
        //enctype: 'multipart/form-data',
        //uploadExtraData: function () {  // uploadExtraData携带附加参数，上传时携带csrftoken
        //    return {csrfmiddlewaretoken: $.cookie('csrftoken'), doc_uuid: $('[name=doc_uuid]').val()}
        //},
        initialPreview: [],　　// 默认预览设置，回显时会用到
        initialPreviewConfig: [],　　// 默认预览的详细配置，回显时会用到
    }).on('fileclear', function () {
        // 移除按钮触发的事件，用该事件批量删除
        /*
        return new Promise(function (resolve, reject) {
            $.confirm({
                title: 'Success!',
                content: 'All images has been deleted~',
                type: 'red',
                buttons: {
                    ok: {
                        btnClass: 'btn-danger text-white',
                        keys: ['enter'],
                        action: function () {
                            resolve();
                        }
                    },
                }
            });
        });
         */
    }).on("filepredelete", function (e, key, jqXHR, data) {
        // 预览中删除按钮，删除上传的文件触发的事件
    }).on("fileloaded", function (e, file, previewId) {
        // aryFile.length = 0;
        // 加载预览后触发的事件，将所有文件名添加到全局变量 aryFiles 数组中
        aryFiles.push(file.name);
    }).on('fileuploaded', function (event, data, previewId, index, fileId) {//asyn
        //console.log("status:" + data.response.status)
        if (data.response.status === true) asyn_cnt += 1
    }).on('filebatchuploadcomplete', function (event, preview, config, tags, extraData) {//asyn 和 syn 上传完成都会走
        //console.log("e" + e + "\ndata:" + data.response.status + "\npreviewId:" + previewId + "\nindex:" + index);
        //console.log("count:" + GetCount());
        //console.log("event:" + event);
        //console.log("asyn_cnt" + asyn_cnt);
        //console.log("syn_cnt" + syn_cnt);
        if (asyn_cnt === 0 && syn_cnt === 0) {//不是同步也不是异步上传
            $('#upload-input').fileinput("clear");
            return new Promise(function (resolve, reject) {
                $.confirm({
                    title: 'Error!',
                    content: "Something wrong!",
                    type: 'red',
                    buttons: {
                        ok: {
                            btnClass: 'btn-danger text-white',
                            keys: ['enter'],
                            action: function () {
                                resolve();
                                window.location.href = "";
                            }
                        },
                    }
                });
            });
        } else if (asyn_cnt > 0) {
            return new Promise(function (resolve, reject) {
                $.confirm({
                    title: 'Success!',
                    content: GetAsynCount(),
                    type: 'green',
                    buttons: {
                        continue: {
                            btnClass: 'btn-success text-white',
                            keys: ['enter'],
                            action: function () {
                                resolve();
                                $('#upload-input').fileinput("clear");
                                asyn_cnt = 0;
                            }
                        },
                        complete: {
                            btnClass: 'btn-primary text-white',
                            keys: ['enter'],
                            action: function () {
                                resolve();
                                window.location.href = "?t=i";
                                asyn_cnt = 0;
                            }
                        }
                    }
                });
            });
        } else if (syn_cnt > 0) {
            return new Promise(function (resolve, reject) {
                $.confirm({
                    title: 'Success!',
                    content: GetCount(),
                    type: 'green',
                    buttons: {
                        continue: {
                            btnClass: 'btn-success text-white',
                            keys: ['enter'],
                            action: function () {
                                resolve();
                                $('#upload-input').fileinput("clear");
                                syn_cnt = 0;
                            }
                        },
                        complete: {
                            btnClass: 'btn-primary text-white',
                            keys: ['enter'],
                            action: function () {
                                resolve();
                                window.location.href = "?t=i";
                                syn_cnt = 0;
                            }
                        }
                    }
                });
            });
        }
    }).on("filebatchuploadsuccess ", function (e, data, previewId, index) {//syn
        // 同步上传全部上传完触发的事件，异步上传会每上传一个都调用
        //console.log("e" + e + "\ndata:" + data.response.status + "\npreviewId:" + previewId + "\nindex:" + index);
        //console.log("count:" + GetCount());
        //console.log("asyn_cnt" + asyn_cnt);
        //console.log("status:" + data.response.status)
        //console.log("asyn_cnt" + asyn_cnt);
        //console.log("syn_cnt" + syn_cnt)

        syn_cnt = $('#upload-input').fileinput('getFilesCount')
        /*
        if (data.response.status === false) {
            $('#upload-input').fileinput("clear");
            return new Promise(function (resolve, reject) {
                $.confirm({
                    title: 'Error!',
                    content: "Something wrong!",
                    type: 'red',
                    buttons: {
                        ok: {
                            btnClass: 'btn-danger text-white',
                            keys: ['enter'],
                            action: function () {
                                resolve();
                                window.location.href = "";
                            }
                        },
                    }
                });
            });
        } else if (data.response.status === true) {
            return new Promise(function (resolve, reject) {
                $.confirm({
                    title: 'Success!',
                    content: GetCount(),
                    type: 'green',
                    buttons: {
                        continue: {
                            btnClass: 'btn-success text-white',
                            keys: ['enter'],
                            action: function () {
                                resolve();
                                $('#upload-input').fileinput("clear");
                            }
                        },
                        complete: {
                            btnClass: 'btn-primary text-white',
                            keys: ['enter'],
                            action: function () {
                                resolve();
                                window.location.reload();
                            }
                        }
                    }
                });
            });
        }
         */
    }).on('fileuploaderror', function (event, data, msg) {
        console.log("status:" + data.response.status)
        if (data.response.status === false) {
            return new Promise(function (resolve, reject) {
                $.confirm({
                    title: 'Error!',
                    content: "Something wrong!",
                    type: 'red',
                    buttons: {
                        ok: {
                            btnClass: 'btn-danger text-white',
                            keys: ['enter'],
                            action: function () {
                                resolve();
                                $('#upload-input').fileinput("clear");
                            }
                        },
                    }
                });
            });
        }
    }).on('filebatchuploaderror', function (event, data, msg) {
        console.log("status:" + data.response.status)
        if (data.response.status === false) {
            return new Promise(function (resolve, reject) {
                $.confirm({
                    title: 'Error!',
                    content: "Something wrong!",
                    type: 'red',
                    buttons: {
                        ok: {
                            btnClass: 'btn-danger text-white',
                            keys: ['enter'],
                            action: function () {
                                resolve();
                                $('#upload-input').fileinput("clear");
                                syn_cnt = 0;
                            }
                        },
                    }
                });
            });
        }
    });
});

$("#upload_modal_close").on("click", function () {
    $('#upload-input').fileinput("clear");
    asyn_cnt = 0;
    syn_cnt = 0;
});