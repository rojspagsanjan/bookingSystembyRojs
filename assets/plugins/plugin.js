$(document).ready(function(){
    var db = firebase.firestore();
    var canView = ($('input[name="canView"]').val() == '1') ? 1 : 0;
    var canEdit = ($('input[name="canEdit"]').val() == '1') ? 1 : 0;
    var canDelete = ($('input[name="canDelete"]').val() == '1') ? 1 : 0;
    var base_url = $('input[name="base_url"]').val();
    let tbl_title = "";

    var $uploadCrop,$uploadCrop2;
    $('#view_upload-demo').hide();
    $('#view_remove_btn').hide();
    $('input[name="view_upload_image"]').on('click',function(){
        $('#view_upload-demo').show();
        $('img[name="view_test_profile"]').hide();
        $('#view_remove_btn').show();
    });

    $('#view_remove_btn').on('click',function(){
        $('#view_upload-demo').hide();
        $('#view_upload_image').val('');
        $('img[name="view_test_profile"]').show();
        $('#view_remove_btn').hide();

    });

    function readFile(input,layout) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                if (layout=='view_upload-demo') {
                    $uploadCrop2.croppie('bind', {
                        url: e.target.result
                    });
                }else{
                    $uploadCrop.croppie('bind', {
                        url: e.target.result
                    });
                }
                $(layout).addClass('ready');
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $uploadCrop = $('#upload-demo').croppie({
        viewport: {
            width: 180,
            height: 170,
            type: 'circle'
        },
        boundary: {
            width: 220,
            height: 222
        }
    });

    $uploadCrop2 = $('#view_upload-demo').croppie({
        viewport: {
            width: 180,
            height: 170,
            type: 'circle'
        },
        boundary: {
            width: 220,
            height: 222
        }
    });

    $('#view_upload_image').on('change', function () { readFile(this,'view_upload-demo'); });
    $('#upload_image').on('change', function () { readFile(this,'upload-demo'); });

    $('.datepicker_field').datepicker({
        autoclose: true,
        todayHighlight: true,
        format: 'yyyy-mm-dd',
    });
    setTimeout(function() {
        $( ".nav-item" ).trigger( "click" );
    },10);

    $("select[name='employee_type']").on('change',function(e){
        e.preventDefault();
        if(this.value == 3){
            $("#email_address_emp").hide();
            $("#license_number").hide();
            $("#license_picture").hide();
        }else{
            $("#license_number").show();
            $("#email_address_emp").show();
            $("#license_picture").show();
        }
    });
    $("select[name='view_employee_type']").on('change',function(e){
        e.preventDefault();
        if(this.value == 3){
            $("#email_address_emp2").hide();
            $("#license_number2").hide();
            $("#license_picture2").hide();
        }else{
            $("#license_number2").show();
            $("#email_address_emp2").show();
            $("#license_picture2").show();
        }
    });

    //Employee Table
    $(document).on('click','.nav-item',function(e){
        $('.main-div .employee').each(function () {
            if ($(this).hasClass('active')) {
                tbl_title = $(this).find('.this-myid').attr('id');
                let tbl_type = $(this).find('.this-myid').attr('data-status');
                if (tbl_title == "tbl_employee") {
                    tbl_title = $('#'+tbl_title).DataTable({
                        "processing": true,
                        "retrieve": true,
                        "serverSide": true,
                        "order": [[0,'desc']],
                        "columns":[
                            {"data": "profile_picture","render":function(data, type, row, meta){
                                    var str = '';
                                    str+= '<div class="chat-img d-inline-block"><img src="assets/images/profile_picture/'+row.profile_picture+'" alt="user" class="rounded-circle" width="45"></div>'
                                    return str;
                                }
                            },
                            {"data":"employee_type"},
                            {"data": "employee_id","render":function(data, type, row, meta){
                                    var str = '';
                                    str += row.first_name+' '+row.middle_name+' '+row.last_name;
                                    return str;
                                }
                            },
                            {"data":"email_address"},
                            {"data":"license_number"},
                            {"data":"license_expiration","render":function(data, type, row, meta){
                                var str = '';
                                var x = new Date(row.license_expiration);
                                var today = new Date();
                                var dd = String(today.getDate()).padStart(2, '0');
                                var mm = String(today.getMonth() + 1).padStart(2, '0');
                                var yyyy = today.getFullYear();

                                today = new Date(mm + '/' + dd + '/' + yyyy);

                                if(x <= today){
                                    str +='<div class="alert alert-danger" data-toggle="tooltip" data-placement="top" title="Tooltip on top">'+row.license_expiration+'</div>';
                                }else{
                                    str += row.license_expiration;
                                }
                                return str;
                            }
                        },
                            {"data": "status","render":function(data, type, row, meta){
                                    var str = '';
                                    if(row.status == '1'){
                                        str += 'Active';
                                    } else {
                                        str += 'Inactive';
                                    }
                                    return str;
                                }
                            },
                            {"data": "status","render":function(data, type, row, meta){
                                    var str = '';
                                    str += '<div class="btn-group">';
                                        if(canEdit == 1){
                                            str += '<a href="" class="btn btn-info btn-sm get_employee_details" data-id="'+row.employee_id+'" data-toggle="modal" data-target="#view_edit_employeeModal"><i class="fa fa-edit"></i></a>';
                                        }
                                        if(canDelete == 1){
                                            if(row.status == '1'){
                                                str += '<a href="" class="btn btn-warning btn-sm employee_action_status" data-id="'+row.employee_id+'" data-status="0"><i class="fa fa-lock"></i></a>';
                                            } else {
                                                str += '<a href="" class="btn btn-success btn-sm employee_action_status" data-id="'+row.employee_id+'" data-status="1"><i class="fa fa-unlock"></i></a>';
                                            }
                                        }
                                    str += '</div>';
                                    return str;
                                }
                            },
                        ],
                        "ajax": {
                            "url": base_url+"employee/employee_list/"+tbl_type,
                            "type": "POST"
                        },
                        "columnDefs": [
                            {
                                "targets": [7],
                                "orderable": false,

                            },
                        ],
                    });
                }
            }
        });
    });

    $(document).on('click','.nav-item',function(e){
        $('.main-div .employee').each(function () {
            if ($(this).hasClass('active')) {
                tbl_title = $(this).find('.this-myid').attr('id');
                let tbl_type = $(this).find('.this-myid').attr('data-status');
                if (tbl_title == "tbl_helpers") {
                    tbl_title = $('#'+tbl_title).DataTable({
                        "processing": true,
                        "retrieve": true,
                        "serverSide": true,
                        "order": [[0,'desc']],
                        "columns":[
                            {"data": "profile_picture","render":function(data, type, row, meta){
                                    var str = '';
                                    str+= '<div class="chat-img d-inline-block"><img src="assets/images/profile_picture/'+row.profile_picture+'" alt="user" class="rounded-circle" width="45"></div>'
                                    return str;
                                }
                            },
                            {"data":"employee_type"},
                            {"data": "employee_id","render":function(data, type, row, meta){
                                    var str = '';
                                    str += row.first_name+' '+row.middle_name+' '+row.last_name;
                                    return str;
                                }
                            },
                            {"data": "status","render":function(data, type, row, meta){
                                    var str = '';
                                    if(row.status == '1'){
                                        str += 'Active';
                                    } else {
                                        str += 'Inactive';
                                    }
                                    return str;
                                }
                            },
                            {"data": "status","render":function(data, type, row, meta){
                                    var str = '';
                                    str += '<div class="btn-group">';
                                        if(canEdit == 1){
                                            str += '<a href="" class="btn btn-info btn-sm get_employee_details" data-id="'+row.employee_id+'" data-toggle="modal" data-target="#view_edit_employeeModal"><i class="fa fa-edit"></i></a>';
                                        }
                                        if(canDelete == 1){
                                            if(row.status == '1'){
                                                str += '<a href="" class="btn btn-warning btn-sm employee_action_status" data-id="'+row.employee_id+'" data-status="0"><i class="fa fa-lock"></i></a>';
                                            } else {
                                                str += '<a href="" class="btn btn-success btn-sm employee_action_status" data-id="'+row.employee_id+'" data-status="1"><i class="fa fa-unlock"></i></a>';
                                            }
                                        }
                                    str += '</div>';
                                    return str;
                                }
                            },
                        ],
                        "ajax": {
                            "url": base_url+"employee/employee_list/"+tbl_type,
                            "type": "POST"
                        },
                        "columnDefs": [
                            {
                                "targets": [3],
                                "orderable": false,

                            },
                        ],
                    });
                }
            }
        });
    });



    $(document).on('submit','.employee_registration',function(e){
        e.preventDefault();
        $uploadCrop.croppie('result', {
            type: 'canvas',
            size: 'original'
        }).then(function (resp) {
            $('#imagebase64').val(resp);
        });
        // const validate = form_validation('.employee_registration',{});
        // if(validate){
            var form_data = new FormData($('.employee_registration')[0]);
            var sendAjaxVar = sendAjax({url:base_url+'employee/submitEmployee',data:form_data},false);
            if(sendAjaxVar){
                swal(sendAjaxVar.msg,sendAjaxVar.type);
                tbl_title.ajax.reload();
                $('.employee_registration').trigger('reset');
            // }
        }
    });

    var employee_id = null;

    $(document).on('click','.get_employee_details',function(e){
        employee_id = $(this).data('id');
        var data = sendAjax({url:base_url+'employee/get_employee_details',data:{employee_id:employee_id}});
        if (data.id == 3) {
            $("#email_address_emp2").hide();
        }
        input('input[name="view_first_name"]',data.first_name);
        input('input[name="view_middle_name"]',data.middle_name);
        input('input[name="view_last_name"]',data.last_name);
        input('input[name="view_email_address"]',data.email_address);
        input('input[name="view_contact_number"]',data.contact_number);
        input('input[name="view_license_number"]',data.license_number);
        input('input[name="view_license_expiration"]',data.license_expiration);
        input('input[name="view_address"]',data.address);
        input('input[name="view_birthdate"]',data.date_of_birth);
        input('input[name="view_gender"]',data.gender);
        input('input[name="view_SSS"]',data.sss);
        input('input[name="view_TIN"]',data.tin);
        input('input[name="view_PhilHealth"]',data.philhealth);
        input('input[name="orig_photo"]',base_url+"assets/images/profile_picture/"+data.profile_picture);
        input('input[name="view_license_orig"]',base_url+"assets/images/license_picture/"+data.license_picture);
        $('img[name="view_test_profile"]').attr("src", base_url+"assets/images/profile_picture/"+data.profile_picture);
        $('img[name="view_test_license"]').attr("src", base_url+"assets/images/license_picture/"+data.license_picture);
        $('select[name="view_employee_type"]').val(data.id).trigger('change');
    });

    $(document).on('click','.employee_action_status',function(e){
        e.preventDefault();
        var employee_id = $(this).data('id');
        var status = $(this).data('status');
        confirm_swal('Update status of this employee?','Remove').then(function(val) {
            if(val === true){
                var sendAjaxVar = sendAjax({url:base_url+'employee/update_employee_status',data:{employee_id:employee_id,status:status}});
                swal(sendAjaxVar.msg,sendAjaxVar.type);
                tbl_title.ajax.reload();
            }
        });

    });

    $(document).on('submit','.employee_update',function(e){
        e.preventDefault();
        // const validate = form_validation('.employee_update',{});
        $uploadCrop2.croppie('result', {
            type: 'canvas',
            size: 'original'
        }).then(function (resp) {
            $('#view_imagebase64').val(resp);
        });

        // if(validate){
        setTimeout(function(){
            var form_data = new FormData($('.employee_update')[0]);
            form_data.append('employee_id',employee_id);
            var sendAjaxVar = sendAjax({url:base_url+'employee/update_employee_details',data:form_data},false);
            if(sendAjaxVar){
                swal(sendAjaxVar.msg,sendAjaxVar.type);
                tbl_title.ajax.reload();
            }
        }, 1000);
        // }

    });
    $('img[name="view_test_license"]').on('click', function() {
      $('#overlay')
        .css({backgroundImage: `url(${this.src})`})
        .addClass('open')
        .one('click', function() { $(this).removeClass('open'); });
    });

    // Client table
    // pending
   $.each($('.main-div .clients'),function (index,element) {
        if ($(element).hasClass('active')) {
            tbl_title = $(this).find('.this-myid').attr('id');
            tbl_type = $(this).find('.this-myid').attr('data-status');
            tbl_title = $('#'+tbl_title).DataTable({
                "processing": true,
                "serverSide": true,
                "order": [[0,'desc']],
                "columns":[
                    {"data": "profile_picture","render":function(data, type, row, meta){
                            var str = '';
                            str+= '<div class="chat-img d-inline-block"><img src="assets/images/profile_picture/'+row.profile_picture+'" alt="user" class="rounded-circle" width="45"></div>'
                            return str;
                        }
                    },
                    {"data":"client_company_name"},
                    {"data":"email_address"},
                    {"data":"industry"},
                    {"data":"contact_number"},
                    {"data":"date_created"},
                    {"data": "client_status","render":function(data, type, row, meta){
                            var str = '';
                            str += '<div class="btn-group">';
                                str += '<a href="" class="btn btn-info btn-sm get_client_details" data-id="'+row.client_id+'" data-toggle="modal" data-target="#edit_clientModal"><i class="fa fa-edit"></i></a>';
                                if(row.client_status == '1'){
                                    str += '<a href="" class="btn btn-warning btn-sm client_update_status" data-id="'+row.client_id+'" data-status="0"><i class="fa fa-lock"></i></a>';
                                } else {
                                    str += '<a href="" class="btn btn-success btn-sm client_update_status" data-id="'+row.client_id+'" data-status="1"><i class="fa fa-unlock"></i></a>';
                                }
                            str += '</div>';
                            return str;
                        }
                    },
                ],
                "ajax": {
                    "url": base_url+"clients/clients_list/"+tbl_type,
                    "type": "POST"
                },
                "columnDefs": [
                    {
                        "targets": [6],
                        "orderable": false,

                    },
                ],
            });
        }
    });
    // Client table
    // approvedAndremoved
    $(document).on('click','.nav_clients a',function(e){
        $.each($('.main-div .clients'),function (index,element) {
            if ($(element).hasClass('active')) {

                tbl_title = $(element).find('.this-myid').attr('id');
                tbl_title_con = $(element).find('.this-myid').attr('id');
                tbl_type = $(element).find('.this-myid').attr('data-status');
                tbl_title = $('#'+tbl_title).DataTable({
                    "processing": true,
                    "destroy": true,
                    "serverSide": true,
                    "order": [[0,'desc']],
                    "columns":[
                        {"data": "profile_picture","render":function(data, type, row, meta){
                                var str = '';
                                str+= '<div class="chat-img d-inline-block"><img src="assets/images/profile_picture/'+row.profile_picture+'" alt="user" class="rounded-circle" width="45"></div>'
                                return str;
                            }
                        },
                        {"data":"client_company_name"},
                        {"data":"email_address"},
                        {"data":"industry"},
                        {"data":"contact_number"},
                        {"data":"date_created"},
                        {"data": "client_status","render":function(data, type, row, meta){
                                var str = '';
                                str += '<div class="btn-group">';
                                    str += '<a href="" class="btn btn-info btn-sm get_client_details" data-id="'+row.client_id+'" data-toggle="modal" data-target="#edit_clientModal"><i class="fa fa-edit"></i></a>';
                                    if (tbl_title_con == 'tbl_client_approved'){
                                        if (row.client_status == '1') {
                                            str += '<a href="" class="btn btn-warning btn-sm client_update_status" data-id="' + row.client_id + '" data-status="0"><i class="fa fa-lock"></i></a>';
                                        } else {
                                            str += '<a href="" class="btn btn-success btn-sm client_update_status" data-id="' + row.client_id + '" data-status="1"><i class="fa fa-unlock"></i></a>';
                                        }
                                    }
                                str += '</div>';
                                return str;
                            }
                        },
                    ],
                    "ajax": {
                        "url": base_url+"clients/clients_list/"+tbl_type,
                        "type": "POST"
                    },
                    "columnDefs": [
                        {
                            "targets": [6],
                            "orderable": false,

                        },
                    ],
                });
            }
        });
    });



    $(document).on('submit','.client_registration',function(e){
        e.preventDefault();
        const validate = form_validation('.client_registration',{});
        if(validate){
            var form_data = new FormData($('.client_registration')[0]);
            const sendAjaxVar = sendAjax({url:base_url+'clients/submitClient',data:form_data},false);
            if(sendAjaxVar){
                $('.client_registration').trigger('reset');
                swal(sendAjaxVar.msg,sendAjaxVar.type);
                tbl_client.ajax.reload();
            }
        }
    });

    var client_id = null;

    $(document).on('click','.get_client_details',function(e){
        client_id = $(this).data('id');
        var data = sendAjax({url:base_url+'clients/get_client_edit',data:{client_id:client_id}});
        input('input[name="view_client_name"]',data.client.client_company_name);
        input('input[name="view_email_address"]',data.client.email_address);
        input('input[name="view_contact_number"]',data.client.contact_number);
        input('input[name="view_username"]',data.client.username);
        input('input[name="view_password"]',data.client.password_plain);
        input('input[name="client_id"]',data.client.client_id);
        $('img[name="view_test_profile"]').attr("src", base_url + "assets/images/profile_picture/" + data.client.profile_picture);
        var str = '';
        str += '<div>';
        str += '<div class="col-md-12">';
            if(data.client_incharge.length){
                str += '<h3>Person Incharge</h3>';
            } else {
                str += '<h3>No Person Incharge</h3>';
            }
            str += '</div>';
        str += '</div>';
        $.each(data.client_incharge,function(index,element){
            str += '<div class="row mt-1 mb-2">';
                str += '<div class="col-md-5 input-group">';
                    str += '<div class="input-group-prepend">';
                        str += '<button class="btn btn-danger removePersonInCharge" type="button"><i class="fa fa-times"></i></button>';
                    str += '</div>';
                    str += '<input name="person_incharge_name[]" value="'+element.full_name+'" type="text" class="form-control" placeholder="Please enter contact person name"/>';
                str += '</div>';
                str += '<div class="col-md-4">';
                    str += '<input name="person_incharge_email[]" value="'+element.email_address+'" type="text" class="form-control" placeholder="Please enter contact person email"/>';
                str += '</div>';
                str += '<div class="col-md-3">';
                    str += '<input name="person_incharge_number[]"  value="'+element.contact_number+'" type="text" class="form-control" placeholder="Please enter contact person number"/>';
                str += '</div>';
            str += '</div>';
        });
        $('#incharge_field_view').html(str);
    });
    // update
    $(document).on('submit','.client_update',function(e){
        e.preventDefault();
        // const validate = form_validation('.client_update',{});
        $uploadCrop2.croppie('result', {
            type: 'canvas',
            size: 'original'
        }).then(function (resp) {
            $('#view_imagebase64').val(resp);
        });
        // if(validate){
        setTimeout(function(){
            var form_data = new FormData($('.client_update')[0]);
            const sendAjaxVar = sendAjax({url:base_url+'clients/update_client',data:form_data},false);
            if(sendAjaxVar){
                swal(sendAjaxVar.msg,sendAjaxVar.type);
                tbl_title.ajax.reload();
            }
        }, 1000);
        // }
    });

    $(document).on('click','.client_update_status',function(e){
        e.preventDefault();
        var data_id = $(this).attr('data-id');
        var status = $(this).attr('data-status');
        confirm_swal('Update status of this Client?','Update').then(function(val) {
            if(val === true){
                const sendAjaxVar = sendAjax({
                    url:base_url+'clients/update_status',
                    data:{client_id:data_id,status:status}});
                if(sendAjaxVar){
                    swal(sendAjaxVar.msg,sendAjaxVar.type);
                    tbl_title.ajax.reload();
                }
            }
        });
    });
    // trucks table
    var tbl_trucks = $("#tbl_trucks").DataTable({
        "processing": true,
        "serverSide": true,
        "order": [[0,'desc']],
        "columns":[
            {"data":"plate_number"},
            {"data":"model"},
            {"data":"truck_type"},
            {"data":"net_capacity"},
            {"data":"registration_expiry"},
            {"data": "truck_status","render":function(data, type, row, meta){
                    var str = '';
                    str += '<div class="btn-group">';
                        str += '<a href="" class="btn btn-info btn-sm get_trucks_details" data-id="'+row.truck_id+'" data-toggle="modal" data-target="#edit_truckModal"><i class="fa fa-edit"></i></a>';
                        if(row.truck_status == '1'){
                            str += '<a href="" class="btn btn-warning btn-sm truck_update_status" data-id="'+row.truck_id+'" data-status="0"><i class="fa fa-lock"></i></a>';
                        } else {
                            str += '<a href="" class="btn btn-success btn-sm truck_update_status" data-id="'+row.truck_id+'" data-status="1"><i class="fa fa-unlock"></i></a>';
                        }
                    str += '</div>';
                    return str;
                }
            },
        ],
        "ajax": {
            "url": base_url+"trucks/truck_list",
            "type": "POST"
        },
        "columnDefs": [
            {
                "targets": [5],
                "orderable": false,

            },
        ],
    });

    $(document).on('submit','.truck_registration',function(e){
        e.preventDefault();
        const validate = form_validation('.truck_registration',{});
        if(validate){
            var form_data = new FormData($('.truck_registration')[0]);
            const sendAjaxVar = sendAjax({
                url:base_url+'trucks/insert_truck_type',
                data:form_data},
                false);
            if(sendAjaxVar){
                swal(sendAjaxVar.msg,sendAjaxVar.type);
                tbl_trucks.ajax.reload();
            }
        }
    });
    var truck_id = null;
    $(document).on('click','.get_trucks_details',function(e){
        truck_id = $(this).data('id');
        var data = sendAjax({url:base_url+'trucks/get_truck_edit',data:{truck_id:truck_id}});
        input('input[name="view_model"]',data.model);
        input('input[name="view_plate_number"]',data.plate_number);
        input('input[name="view_net_capacity"]',data.net_capacity);
        input('input[name="view_truck_id"]',data.truck_id);
        input('input[name="view_registration_expiry"]',data.registration_expiry);
        $('select[name="view_truck_type"]').val(data.truck_type_id).trigger('change');
    });
    // update
    $(document).on('submit','.edit_truckModal',function(e){
        e.preventDefault();
        const validate = form_validation('.edit_truckModal',{});
        if(validate){
            var form_data = new FormData($('.edit_truckModal')[0]);
            const sendAjaxVar = sendAjax({
                url:base_url+'trucks/update_truck',
                data:form_data},
                false);
            if(sendAjaxVar){
                swal(sendAjaxVar.msg,sendAjaxVar.type);
                tbl_trucks.ajax.reload();
            }
        }
    });
    $(document).on('click','.truck_update_status',function(e){
        e.preventDefault();
        var data_id = $(this).attr('data-id');
        var status = $(this).attr('data-status');
        confirm_swal('Update status of this Truck?','Update').then(function(val) {
            if(val === true){
                const sendAjaxVar = sendAjax({
                    url:base_url+'trucks/update_status',
                    data:{truck_id:data_id,status:status}});
                if(sendAjaxVar){
                    swal(sendAjaxVar.msg,sendAjaxVar.type);
                    tbl_trucks.ajax.reload();
                }
            }
        });
    });

    //Users Table
    var tbl_users = $("#tbl_users").DataTable({
        "processing": true,
        "serverSide": true,
        "order": [[0,'desc']],
        "columns":[
            {"data": "profile_picture","render":function(data, type, row, meta){
                    var str = '';
                    str+= '<div class="chat-img d-inline-block"><img src="assets/images/profile_picture/'+row.profile_picture+'" alt="user" class="rounded-circle" width="45"></div>'
                    return str;
                }
            },
            {"data": "employee_id","render":function(data, type, row, meta){
                    var str = '';
                    str += row.first_name+' '+row.middle_name+' '+row.last_name;
                    return str;
                }
            },
            {"data":"employee_type"},
            {"data":"username"},
            {"data": "user_status","render":function(data, type, row, meta){
                    var str = '';
                    if(row.user_status == '0'){
                        str += 'Active';
                    } else {
                        str += 'Inactive';
                    }
                    return str;
                }
            },
            {"data": "user_status","render":function(data, type, row, meta){
                    var str = '';
                    str += '<div class="btn-group">';
                        str += '<a href="" class="btn btn-info btn-sm get_user_details" data-id="'+row.user_id+'" data-toggle="modal" data-target="#view_edit_userModal"><i class="fa fa-edit"></i></a>';
                        if(row.user_status == '1'){
                            str += '<a href="" class="btn btn-warning btn-sm user_action_status" data-id="'+row.user_id+'" data-status="0"><i class="fa fa-lock"></i></a>';
                        } else {
                            str += '<a href="" class="btn btn-success btn-sm user_action_status" data-id="'+row.user_id+'" data-status="1"><i class="fa fa-unlock"></i></a>';
                        }
                    str += '</div>';
                    return str;
                }
            },
        ],
        "ajax": {
            "url": base_url+"users/users_list",
            "type": "POST"
        },
        "columnDefs": [
            {
                "targets": [5],
                "orderable": false,

            },
        ],
    });

    $(document).on('submit','.user_registration',function(e){
        e.preventDefault();
        const validate = form_validation('.user_registration',{});
        if(validate){
            var form_data = new FormData($('.user_registration')[0]);
            var sendAjaxVar = sendAjax({url:base_url+'users/submitUsers',data:form_data},false);
            if(sendAjaxVar){
                swal(sendAjaxVar.msg,sendAjaxVar.type);
                tbl_users.ajax.reload();
                $('.user_registration').trigger('reset');
            }
        }
    });

    var user_id = null;
    $(document).on('click','.get_user_details',function(e){
        user_id = $(this).data('id');
        var data = sendAjax({url:base_url+'users/get_user_edit',data:{user_id:user_id}});
        $('p[name="user_name"]').html(data.first_name+" "+data.middle_name+" "+data.last_name);
        input('input[name="view_username"]',data.username);
        input('input[name="view_password"]',data.password_plain);
        input('input[name="user_id"]',data.user_id);
        $('select[name="view_user_type"]').val(data.user_type).trigger('change');
    });
    // update
    $(document).on('submit','.user_update',function(e){
        e.preventDefault();
        const validate = form_validation('.user_update',{});
        if(validate){
            var form_data = new FormData($('.user_update')[0]);
            const sendAjaxVar = sendAjax({
                url:base_url+'users/update_users',
                data:form_data},
                false);
            if(sendAjaxVar){
                swal(sendAjaxVar.msg,sendAjaxVar.type);
                tbl_users.ajax.reload();
            }
        }
    });
    $(document).on('click','.user_action_status',function(e){
        e.preventDefault();
        var data_id = $(this).attr('data-id');
        var status = $(this).attr('data-status');
        confirm_swal('Update status of this User?','Update').then(function(val) {
            if(val === true){
                const sendAjaxVar = sendAjax({
                    url:base_url+'users/update_status',
                    data:{user_id:data_id,user_status:status}});
                if(sendAjaxVar){
                    swal(sendAjaxVar.msg,sendAjaxVar.type);
                    tbl_users.ajax.reload();
                }
            }
        });
    });

    //Authorization
    $(document).on('submit','.authorization_registration',function(e){
        e.preventDefault();
        const validate = form_validation('.authorization_registration',{});
        if(validate){
            var form_data = new FormData($('.authorization_registration')[0]);
            var sendAjaxVar = sendAjax({url:base_url+'authorization/add_authorization',data:form_data},false);
            if(sendAjaxVar){
                swal(sendAjaxVar.msg,sendAjaxVar.type);
                tbl_title.ajax.reload();
            }
        }
    });

    $(document).on('click','.viewAuthorization',function(e){
        e.preventDefault();
        var group_id = $(this).data('id');
        let sendAjaxVar = sendAjax({url:base_url+'authorization/view_authorization',data:{group_id:group_id}});
        var str = '';
        if(sendAjaxVar){
            $('input[name="view_user_group"]').val(sendAjaxVar.group.group_name);
            $.each(sendAjaxVar.authorization,function(index,element){
                var canView     = (element.can_view     == '1') ? 'checked' : '';
                var canAdd      = (element.can_add      == '1') ? 'checked' : '';
                var canEdit     = (element.can_edit     == '1') ? 'checked' : '';
                var canDelete   = (element.can_delete   == '1') ? 'checked' : '';
                str += '<tr>';
                    str += '<td><i class="'+element.menu_icon+'"></i> '+element.menu_name+'</td>';
                    str += '<td style="text-align:center">';
                        str += '<div class="custom-control custom-checkbox">';
                            str += '<input type="checkbox" '+canView+' name="view_menu['+element.menu_id+'][]" class="custom-control-input actionRow" id="view'+index+'" disabled>';
                            str += '<label class="custom-control-label" for="view'+index+'"></label>';
                        str += '</div>';
                    str += '</td>';
                    str += '<td style="text-align:center">';
                        str += '<div class="custom-control custom-checkbox">';
                            str += '<input type="checkbox" '+canAdd+' name="add_menu['+element.menu_id+'][]" class="custom-control-input actionRow" id="add'+index+'" disabled>';
                            str += '<label class="custom-control-label" for="add'+index+'"></label>';
                        str += '</div>';
                    str += '</td>';
                    str += '<td style="text-align:center">';
                        str += '<div class="custom-control custom-checkbox">';
                            str += '<input type="checkbox" '+canEdit+' name="edit_menu['+element.menu_id+'][]" class="custom-control-input actionRow" id="edit'+index+'" disabled>';
                            str += '<label class="custom-control-label" for="edit'+index+'"></label>';
                        str += '</div>';
                    str += '</td>';
                    str += '<td style="text-align:center">';
                        str += '<div class="custom-control custom-checkbox">';
                            str += '<input type="checkbox" '+canDelete+' name="delete_menu['+element.menu_id+'][]" class="custom-control-input actionRow" id="delete'+index+'" disabled>';
                            str += '<label class="custom-control-label" for="delete'+index+'"></label>';
                        str += '</div>';
                    str += '</td>';
                str += '</tr>';
            });
        } else {
            str += '<tr>';
                str += '<td colspan="5" style="text-align:center;">No Data Available</td>';
            str += '</tr>';
        }
        $('#viewAuthorizationModal table tbody').html(str);
    });
    selectTwo('select[name="user_employee"]');
    selectTwo('select[name="user_type"]');
    selectTwo('select[name="view_user_type"]');
    selectTwo('select[name="truck_type"]',{dynamic:true,placeholder:'Select truck type'});
    selectTwo('select[name="view_truck_type"]',{dynamic:true});
    selectTwo('select[name="loading_order_client"]',{placeholder:'Select Client'});
    selectTwo('select[name="loading_oder_truck[]"]',{placeholder:'Select Truck'});
    selectTwo('select[name="loading_order_driver[]"]',{placeholder:'Select Driver'});
    selectTwo('select[name="industry_list_select"]',{placeholder:'Select Industry',dynamic:true});

    $(document).on('change', 'input[name="loading_date"]', function (e) {
        var date_of_loading = $(this).val();
         let sendAjaxVar = sendAjax({
         	url: base_url + 'loading_order/loading_schedule',
         	data: {
         		date_of_loading: date_of_loading
         	}
         });
         $('#driver_trucks_field').show();
         var str_driver = '<option></option>';
         var str_truck = '<option></option>';
         $.each(sendAjaxVar.driver_list,function(index,element){
            str_driver += '<option value="'+element.employee_id+'">'+element.first_name+' '+element.middle_name+' '+element.last_name+'</option>';
         });
         $.each(sendAjaxVar.truck_list, function (index, element) {
            str_truck += '<option value="' + element.truck_id + '">' + element.model + ' ' + element.plate_number + ' </option>';
         });
         $('.loading_order_driver').html(str_driver);
         $('.loading_oder_truck').html(str_truck);
          selectTwo('select[name="loading_oder_truck[]"]', {
          	placeholder: 'Select Truck'
          });
          selectTwo('select[name="loading_order_driver[]"]', {
          	placeholder: 'Select Driver'
          });
    });

    var index_num = 0;
    var last_index = 0;

    var alp = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','AY','AZ'];

    $(document).on('click','.addLocationBtn',function(e){
        e.preventDefault();
        var str = '';
        index_num++;
        str += '<div class="col-md-12 my-1 waypointContainer">';
            str += '<div class="input-group">';
                str += '<input type="text" class="form-control waypoints" name="waypoints[]"autocomplete="off" placeholder="Please enter location "/>';
                str += '<div class="input-group-append">';
                    str += '<button class="btn btn-danger removeWaypoint" type="button"><i class="fa fa-times"></i></button>';
                str += '</div>';
            str += '</div>';
        str += '</div>';
        $('#more_place_container').append(str);
    });

    $(document).on('click','#show_map_btn',function(e){
        var map_container = $('#map_container');
        if(map_container.hasClass('hide_map')){
            $(this).html('<i class="fa fa-eye-slash"></i> Hide Map</i>');
            map_container.removeClass('hide_map').addClass('show_map');
        } else if(map_container.hasClass('show_map')){

            $(this).html('<i class="fa fa-eye"></i>  Show Map');
            map_container.removeClass('show_map').addClass('hide_map');
        }
    });

    $(document).on('click','.addProductsBtn',function(e){
        e.preventDefault();
        var str = '';
        str += '<tr>';
            str += '<td style="width:7%;text-align:center;"><button class="btn-sm btn btn-danger btnRemoveProduct"><i class="fa fa-times"></i></button></td>';
            str += '<td><input type="text" class="form-control" name="product[]" /></td>';
            str += '<td style="width:10%;"><input type="text" class="form-control" name="quantity[]" /></td>';
        str += '</tr>';
        $('#products_container > div > table > tbody').append(str);
    });

    $(document).on('click','.removeWaypoint',function(e){
        e.preventDefault();
        $(this).parents('div.waypointContainer').remove();
    });

    $(document).on('click','.btnRemoveProduct',function(e){
        $(this).parents('tr').remove();
    });

    var tbl_loading_order = $("#tbl_loading_order").DataTable({
        "processing": true,
        "serverSide": true,
        "order": [[0,'desc']],
        "columns":[
            {"data":"transaction_code"},
            {"data":"client_company_name"},
            {"data":"total_kilometers"},
            {"data":"date_of_loading"},
            {"data": "status","render":function(data, type, row, meta){
                    var str = '';
                    if(row.status == '0'){
                        str += 'Pending';
                    } else {
                        str += 'Done';
                    }
                    return str;
                }
            },
            {"data": "status","render":function(data, type, row, meta){
                    var str = '';
                    str += '<div class="btn-group">';
                        str += '<a href="" class="btn btn-info btn-sm get_employee_details" data-id="'+row.transaction_id+'" data-toggle="modal" data-target="#view_edit_employeeModal"><i class="fa fa-edit"></i></a>';
                        if(row.status == '1'){
                            str += '<a href="" class="btn btn-warning btn-sm employee_action_status" data-id="'+row.transaction_id+'" data-status="0"><i class="fa fa-lock"></i></a>';
                        } else {
                            str += '<a href="" class="btn btn-success btn-sm employee_action_status" data-id="'+row.transaction_id+'" data-status="1"><i class="fa fa-unlock"></i></a>';
                        }
                    str += '</div>';
                    return str;
                }
            },
        ],
        "ajax": {
            "url": base_url+"loading_order/loading_order_list",
            "type": "POST"
        },
        "columnDefs": [
            {
                "targets": [4],
                "orderable": false,

            },
        ],
    });

    $(document).on('submit','.loading_order_form',function(e){
        e.preventDefault();
        var form_data = new FormData($('.loading_order_form')[0]);
        var sendAjaxVar = sendAjax({url:$(this).attr('action'),data:form_data},false);
        if(sendAjaxVar){
            swal(sendAjaxVar.msg,sendAjaxVar.type);
            tbl_loading_order.ajax.reload();
            $('.loading_order_form').trigger('reset');
            $('#travel_details').html('');
        }
    });

    $(document).on('click','.btnAddPersonInCharge',function(){
        var str = '';
        str += '<div class="row mt-1 mb-1">';
            str += '<div class="col-md-5 input-group">';
                str += '<div class="input-group-prepend">';
                    str += '<button class="btn btn-danger removePersonInCharge" type="button"><i class="fa fa-times"></i></button>';
                str += '</div>';
                str += '<input name="person_incharge_name[]" type="text" class="form-control" placeholder="Please enter contact person name"/>';
            str += '</div>';
            str += '<div class="col-md-4">';
                str += '<input name="person_incharge_email[]" type="text" class="form-control" placeholder="Please enter contact person email"/>';
            str += '</div>';
            str += '<div class="col-md-3">';
                str += '<input name="person_incharge_number[]" type="text" class="form-control" placeholder="Please enter contact person number"/>';
            str += '</div>';
        str += '</div>';
        $('#incharge_field').append(str);
    });

    $(document).on('click','.removePersonInCharge',function(){
        $(this).parent().parent().parent().remove();
    });

});

function selectTwo(element,option = {}){
    let options = {}
    options.placeholder = (option.placeholder) ?  option.placeholder : 'Select option';
    options.allowClear = true;
    options.tags = (option.dynamic == true) ? true : false;
    options.theme = "classic";
    $(element).select2(options);
}

function sendAjax(param = {},isReturn = true){
    if(isReturn === false){
        var return_response = null;
        $.ajax({
            url:param.url,
            type: 'post',
            data:param.data,
            async:false,
            processData: false,
            contentType: false,
            dataType:'json',
            success:function(response){
                return_response = response;
            },error:function(e){
                console.log(e);
            }
        });
        return return_response;
    } else {
        var return_data = null;
        $.ajax({
            url:param.url,
            type: 'post',
            data:param.data,
            async:false,
            dataType:'json',
            success:function(response){
                return_data = response;
            },error:function(e){
                console.log(e);
            }
        });

        if(isReturn){
            return return_data;
        }
    }
}

function form_validation(selector,parameters = {}){
    var str = '';
    var field_name_holder = [];

    var returnValidation = false;

    str += '<div class="invalid-tooltip">';
        str += '* Required field';
    str += '</div>';

    var form_input_fields = 0;

    $("form"+selector+" input").each(function(index,element){
        form_input_fields += 1;
        var obj = {};
        obj.name = $(element).attr('name');
        obj.isValid = (!$(element).val()) ? false :true ;
        obj.content = ucfirst($(element).attr('name').replace(/\_/g, ' '))+' is required';
        field_name_holder.push(obj);
    });

    var form_required_input_fields = 0;

    $("form"+selector+" input").each(function(index,element){
        if(field_name_holder[index].isValid === false){
            form_required_input_fields -= 1;
            $(element).addClass('is-invalid');
            $('<div class="invalid-tooltip">'+field_name_holder[index].content+'</div>').insertAfter(element);
        } else {
            form_required_input_fields += 1;
            $(element).parent().find('input').removeClass('is-invalid');
            $(element).parent().parent().find('div.invalid-tooltip').remove();
        }
    });

    if(form_input_fields === form_required_input_fields){
        returnValidation = true;
    }

    return returnValidation;
}

function ucfirst(str,force){
    str = force ? str.toLowerCase() : str;
    return str.replace(/(\b)([a-zA-Z])/,function(firstLetter){
        return firstLetter.toUpperCase();
    });
}

function swal(content,response = 'success'){
    Swal.fire("Success",content,response);
}

function confirm_swal(text,confirmBtnText){
    var isSuccess = false;
    return new Promise(function(resolve, reject) {
        Swal.fire({
            title: 'Are you sure?',
            text: text,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: confirmBtnText
        }).then((result) => {
            if (result.value) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
   });
}

function input(element,value){
    $(element).val(value);
}
