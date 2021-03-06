$(document).ready(function () {
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
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFtoken", $.cookie("csrftoken"))
        }
    });
});

var max_proc = Math.random() * 9 + 90
var base_time = 50
var gap_time = 50

var now_folder_fake_name = $("#now_folder_fake_name").val()

$(".delete_one").click(function () {
    var downloadOneForm = $(this).closest('.downloadOneForm');
    return new Promise(function (resolve, reject) {
        $.confirm({
            title: 'Confirm!',
            content: "Are you sure to delete ?",
            type: 'red',
            buttons: {
                yes: {
                    btnClass: 'btn-danger text-white',
                    keys: ['enter'],
                    action: function () {
                        toastr.info("Deleting ...");
                        resolve();

                        $("#delete-img-process").modal("show");

                        var is_complete = false
                        var now_time = Math.random() * gap_time + base_time
                        var index = Math.round(Math.random() * 15 + 33)
                        var delete_img_process = setInterval(function () {
                            now_time = Math.random() * gap_time + base_time
                            if (is_complete || index > max_proc) {
                                clearInterval(delete_img_process)
                            } else {
                                let now = index.toString() + "%"
                                $("#delete_img_process_bar").css("width", now).text(now)
                                index++
                            }
                        }, now_time);

                        $.ajax({
                            url: "/delete_img/" + now_folder_fake_name + "/",
                            type: "POST",
                            data: downloadOneForm.serialize(),
                            dataType: "json",
                            success: function (data) {
                                is_complete = true
                                $("#delete_img_process_bar").css("width", "100%").text("100%");
                                setTimeout(function () {
                                    $("#delete-img-process").modal("hide");
                                }, 500);
                                setTimeout(function () {
                                    $("#delete_img_process_bar").css("width", "0.1%").text("0.1%");
                                }, 600);
                                setTimeout(function () {
                                    var delete_status = data["delete_status"];
                                    if (delete_status === "false") {
                                        toastr.warning("Image Delete Failed !");
                                    } else if (delete_status === "true") {
                                        toastr.success("Delete Successfully ~");
                                        setTimeout(function () {
                                            window.location.href = "?t=i";
                                        }, 500);
                                    }
                                }, 500);
                            },
                            error: function () {
                                is_complete = true
                                $("#delete-img-process").modal("hide");
                                $("#delete_img_process_bar").css("width", "0.1%").text("0.1%");
                                toastr.error("Error , Please Try again !");
                            }
                        });
                    }
                },
                no: {
                    btnClass: 'btn-default text-black',
                    keys: ['enter'],
                    action: function () {
                        resolve();
                    }
                }
            }
        });
    });
});

$("#imgs_delete_few").click(function () {
    if ($("#select_img_cnt").val() === "0") {
        toastr.info("No Images Selected !");
    } else {
        return new Promise(function (resolve, reject) {
            $.confirm({
                title: 'Confirm!',
                content: "Are you sure to delete ?",
                type: 'red',
                buttons: {
                    yes: {
                        btnClass: 'btn-danger text-white',
                        keys: ['enter'],
                        action: function () {
                            toastr.info("Deleting ...");
                            resolve();

                            $("#delete-img-process").modal("show");

                            var is_complete = false
                            var now_time = Math.random() * gap_time + base_time
                            var index = 1
                            var delete_img_process = setInterval(function () {
                                now_time = Math.random() * gap_time + base_time
                                if (is_complete || index > max_proc) {
                                    clearInterval(delete_img_process)
                                } else {
                                    let now = index.toString() + "%"
                                    $("#delete_img_process_bar").css("width", now).text(now)
                                    index++
                                }
                            }, now_time);

                            $.ajax({
                                url: "/delete_select_img/" + now_folder_fake_name + "/",
                                type: "POST",
                                data: $("#imageFewForm").serialize(),
                                dataType: "json",
                                success: function (data) {
                                    is_complete = true
                                    $("#delete_img_process_bar").css("width", "100%").text("100%");
                                    setTimeout(function () {
                                        $("#delete-img-process").modal("hide");
                                    }, 500);
                                    setTimeout(function () {
                                        $("#delete_img_process_bar").css("width", "0.1%").text("0.1%");
                                    }, 600);
                                    setTimeout(function () {
                                        var delete_cnt = data["delete_cnt"],
                                            delete_status = data["delete_status"],
                                            select_cnt = data["select_cnt"];
                                        if (delete_status == "false") {
                                            toastr.warning("Failed to Delete " + select_cnt.toString() + " Image(s) !");
                                        } else if (delete_status == "true") {
                                            toastr.success(delete_cnt.toString() + " Image(s) Delete Successfully ~");
                                            setTimeout(function () {
                                                window.location.href = "?t=i";
                                            }, 500);
                                        } else if (delete_status == null) {
                                            toastr.info("No Images Selected !");
                                        }
                                    }, 500);
                                },
                                error: function () {
                                    is_complete = true
                                    $("#delete-img-process").modal("hide");
                                    $("#delete_img_process_bar").css("width", "0.1%").text("0.1%");
                                    toastr.error("Error , Please Try again !");
                                }
                            });
                        }
                    },
                    no: {
                        btnClass: 'btn-default text-black',
                        keys:
                            ['enter'],
                        action: function () {
                            resolve();
                        }
                    }
                }
            });
        });
    }
});