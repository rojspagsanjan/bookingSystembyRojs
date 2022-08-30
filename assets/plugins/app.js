// var base_url = 'http://127.0.0.1:5000/';
var base_url = $('input[name="base_url"]').val();

var search = false;

$(document).ready(function(){
    $('.loader-cont').hide();
    if ($('a.add').attr('data-code') != "") {
        $('a.add').removeClass("d-none");
    }

    // Date Picker
    // $('.datepicker').datepicker({
    //     format: 'mm/dd/yyyy',
    //     autoclose: true,
    //     currentText: "Now"
    // });
    $('.datepicker').datepicker();
    var users_tbl;
    $(document).on('click','.users',function(){
        $('#usersModal').modal('show');
        //users datatable1387
        users_tbl = $('.users_tbl').DataTable({
           "processing": true, //Feature control the processing indicator.
           "serverSide": true, //Feature control DataTables' server-side processing mode.
           "order": [[0,'desc']], //Initial no order.
           "columns":[
                {"data":"name"},
                // {"data":"type"},
                {"data":"type","render": function(data, type, row,meta){
                          var str = '';
                          str += '<button class=" btn btn-default '+(row.type == 3?'active disabled':'')+' user_type" data-id="'+row.user_id+'" data-user-type="3">Member</button>';
                          str += '<button class=" btn btn-default '+(row.type == 2?"active disabled":"")+' user_type" data-id="'+row.user_id+'" data-user-type="2">Leader</button>';
                          str += '<button class=" btn btn-default '+(row.type == 1?"active disabled":"")+' user_type" data-id="'+row.user_id+'" data-user-type="1">Director</button>';
                          return str;
                     }
                }
           ],
           // Load data for the table's content from an Ajax source
           "ajax": {
                "url":base_url+"dashboard/users_datatables/",
                "type": "POST"
           },
           //Set column definition initialisation properties.
           "columnDefs": [
                {
                     "targets": [1], //first column / numbering column
                     "orderable": true, //set not orderable

                 },
            ],
        });
    });


    // Tag Users
    $(document).on('click','.user_type', function(){
        var id = $(this).attr('data-id');
        var type = $(this).attr('data-user-type');
        console.log(id);
        $.ajax({
            url: base_url+'dashboard/tag_users',
            type: 'POST',
            data: {id:id,type:type},
            dataType: 'json',
            success: function (data){

                alertify.set('notifier','position','top-left');
                if(data.status == 'success'){
                    alertify.success('Successfully Updated!');
                    users_tbl.ajax.reload();
                }else{
                    alertify.error('An error occured!');
                }
            }
        });
    });

    // Tooltip
    $(document.body).on('mouseover',function (e) {
        $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });
    });

    // Layout Pre-load
    // var layout_preload = '<div class="layout-preload" style="display:none;position: absolute; background: #fff; border: 1px solid #ccc; border-radius: 5px; padding: 5px; left: 120px; vertical-align: top; height: 200px; width: 200px; overflow: hidden;"><img style="max-width:200px;width:100%;transition: 2s;"></div>';
    $(document).on('mouseover','.layout-id',function (){
        // $(this).append(layout_preload);
        // $(this).children('.layout-preload img').attr("src", $(this).attr("data-thumbnail-src"));
        $(this).children('.layout-preload').css('display','block');
        // $(this).children('.layout-preload img').css('transform','translateY(calc(200px - 100%))');
    });

    $(document).on('mouseout','.layout-id',function(){
        $(this).children('.layout-preload').css('display','none');
    });

    $(document).on('mouseover','.layout-preload',function(){
        $(this).children('img').css('transform','translateY(calc(200px - 100%))');
    });

    $(document).on('mouseout','.layout-preload',function(){
        $(this).children('img').css('transform','translateY(0)');
    });


    // Approval Pop Up (leader and director's end)
    $('body').popover({
        selector: '[data-toggle="popover"]'
    });

    // account used popover

    $(document.body).on('mouseover','.pop-hover', function(){
        $(this).popover();
    });

    $(document.body).on('click', function (e) {
        $('[data-toggle="popover"]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                var bsPopover = $(this).data('bs.popover'); // Here's where the magic happens
                if (bsPopover) bsPopover.hide();
            }
        });
    });

    //Search Module
    var current_url = $(location).attr('href');
    nob_filter(current_url);
    layouts();
    if(current_url.includes('-D') == false && current_url.includes('-U') == false){
        //url no search/filter parameter
        search_data(current_url,'U');
    }

    set_filter_values(current_url);

    //hide add new layout if not by nob
    var islayUrlAll = current_url.includes('/layouts-');
    if(islayUrlAll && current_url.includes('nob_id=') == false){
        $('.add').hide();
        set_table_title(current_url);
    }

    // Layout Pagination
    $(document).on('click','.layout .pagination a', function(){
        var tempUrl = $('input[name="nob_id"]').val();
        var pageId = $(this).attr('data-page-id');
        layouts(tempUrl, pageId);
    });

    // File Upload (Filename Append)
    $(document).on('change','#file-upload', function(){
        var filename = $(this).val().split('\\').pop();
        $('.uploaded-file').val(filename);
    });
    $(document).on('change','#update_layout', function(){
        var filename = $(this).val().split('\\').pop();
        $('.uploaded-file').val(filename);
    });
    $(document).on('change','#actual_layout', function(){
        var filename = $(this).val().split('\\').pop();
        $('.uploaded-file').val(filename);
    });
    $(document).on('change','#resubmit_layout_file', function(){
        var filename = $(this).val().split('\\').pop();
        $('.uploaded-file').val(filename);
    });
    $(document).on('click','.upload-file', function(){
        $(this).children('input[type=file]')[0].click();
    });

    // Add new Layout
    $('form#addNewLayoutForm').validate({
        rules:{
            layout_name:'required',
            layout_file:'required'
        },
        messages:{
            layout_name:'This field is required',
            layout_file:'This field is required'
        }
    });

    $(document).on('submit','form#addNewLayoutForm',function(e){
        e.preventDefault();
        $('#addNewLayout').modal('hide');
        var formData = new FormData($(this)[0]);
        formData.append('nob_id',$('a.add').attr('data-id'));
        formData.append('nob_code',$('a.add').attr('data-code'));
        $.ajax({
            url:base_url+'dashboard/add_newlayout/',
            data: formData,
            processData:false,
            contentType: false,
            type: 'post',
            beforeSend: function(){
                show_loader();
            },
            success: function(data){
                var parseData = JSON.parse(data);
                console.log(parseData.data);
               hide_loader();
               if(parseData.status == "ok"){
                    $('#addNewLayoutForm')[0].reset();
                    alertify.set('notifier','position','top-left');
                    alertify.success('Layout successfully added!');
                    layouts();
                }else if(parseData.status == 'invalid'){
                    alertify.set('notifier','position','top-left');
                    alertify.error('Invalid filetype or your file exceeds 500M');
                }else{
                    alertify.set('notifier','position','top-left');
                    alertify.error('Something went wrong');
                    // alertify.error(data);
                }
            }
        });
    });

    // Download Layout
    $(document).on('click','.download-layout', function(){
        var id = $(this).attr('data-id');
        $.ajax({
            url: base_url+'/dashboard/download_layout',
            data: {id:id},
            type: 'post',
            dataType: 'json',
            success: function(data){
                // window.location.href = base_url+"do_download/"+data[0]['layout_file']+"";
                var a = document.createElement('a');
                  a.href = base_url+'templates/layouts/'+data[0].layout_file;
                  a.download = data[0].layout_file;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);

                var test = base_url+'templates/layouts/'+data[0].layout_file;
                console.log(test);
            }
        });
    });

    // Re-submit Layout
    $(document).on('click','.resubmit-layout', function(){
        var id = $(this).attr('data-id');
        $.ajax({
            url: base_url+'dashboard/layout_details',
            data: {id:id},
            type: 'post',
            dataType: 'json',
            success: function(data){
                $('#resubmitStockLayoutForm input[name=layout_id]').val(data.view_edit.layout_id);
                $('#resubmitStockLayoutForm input[name=specific_nob]').val(data.view_edit.layout_specific_nob);
                $('#resubmitStockLayoutForm input[name=resubmit_layout_name]').val(data.view_edit.layout_name);
                $('#resubmitStockLayout').modal('show');
            }
        });
    });

    $('form#resubmitStockLayoutForm').validate({
        rules:{
            resubmit_layout_file:'required'
        },
        messages:{
            resubmit_layout_file:'This field is required'
        }
    });

    $(document).on('submit','form#resubmitStockLayoutForm',function(e){
        e.preventDefault();
        $('#resubmitStockLayout').modal('hide');
        var formData = new FormData($(this)[0]);

        $.ajax({
            url:base_url+'dashboard/re_submit/',
            data: formData,
            type: 'post',
            contentType: false,
            processData:false,
            dataType: 'json',
            beforeSend: function(){
                show_loader();
            },
            success: function(data){
                hide_loader();
                if(data.status == 'ok'){
                    $('#resubmitStockLayoutForm')[0].reset();
                    alertify.set('notifier','position','top-left');
                    alertify.success('Layout successfully added!');
                    layouts();
                }else if(data.status == 'invalid'){
                    alertify.set('notifier','position','top-left');
                    alertify.error('Invalid filetype');
                }else{
                    alertify.set('notifier','position','top-left');
                    alertify.error(data);
                    // alertify.error('Somehing went wrong');
                }
            }
        });
    });

    // Edit Layout
    $(document).on('click','.edit-layout', function(){
          var id = $(this).attr('data-id');
          $.ajax({
               url: base_url+'dashboard/layout_details',
               data: {id:id},
               type: 'post',
               dataType: 'json',
               success: function(data){
                    console.log(data.view_edit.layout_id);
                    $('#editStockLayout').modal('show');
                    $('#editStockLayoutForm input[name=layout_id]').val(data.view_edit.layout_id);
                    $('#editStockLayoutForm input[name=specific_nob]').val(data.view_edit.layout_specific_nob);
                    $('#editStockLayoutForm input[name=layout_name]').val(data.view_edit.layout_name);

            },error:function(data){
                 console.log(data);
            }
        });
    });
    $('form#editStockLayoutForm').validate({
        rules:{
            layout_name:'required'
        },
        messages:{
            layout_name:'This field is required'
        }
    });

    $(document).on('submit','form#editStockLayoutForm',function(e){
        e.preventDefault();
        $('#editStockLayout').modal('hide');
        var formData = new FormData($(this)[0]);

        $.ajax({
            url:base_url+'dashboard/edit_layout/',
            data: formData,
            type: 'post',
            contentType: false,
            processData:false,
            beforeSend: function(){
                show_loader();
            },
            success: function(data){
                var parseData = JSON.parse(data);
                console.log(parseData.data);
               hide_loader();
               if(parseData.status == "ok"){
                    $('#editStockLayoutForm')[0].reset();
                    alertify.set('notifier','position','top-left');
                    alertify.success('Layout successfully added!');
                    layouts();
                }else if(parseData.status == 'invalid'){
                    alertify.set('notifier','position','top-left');
                    alertify.error('Invalid filetype');
                }else{
                    alertify.set('notifier','position','top-left');
                    alertify.error(data);
                    // alertify.error('Somehing went wrong');
                }
            }
        });
    });

    // Layout Approval
    $(document).on('click','.for-approval',function(){
        var id = $(this).attr('data-layoutId');
        var action = $(this).attr('data-action');
          // alertify.prompt('Comment').setHeader('Disapprove Layout').set('type', 'text');
          $('.popover').hide();
          if(action == '2'){
            alertify.prompt( 'Disapprove Layout', 'Comment', ''
                   , function(evt, comment) {
                     $.ajax({
                         url: base_url+'dashboard/layout_approval',
                         data:{id:id,action:action,comment:comment},
                         type: 'POST',
                         async: false,
                         dataType: 'json',
                         success: function(data){

                             if(data.approval == true){
                                 alertify.set('notifier','position','top-left');
                                 alertify.success('Layout successfully updated!');
                                 layouts();
                             }else{
                                 alertify.set('notifier','position','top-left');
                                 alertify.error('Something went wrong');
                                 layouts();
                             }
                         }
                     });
                 }
                   , function() {
                     alertify.error('Disapprove layout has been cancelled.')
                     layouts();
                   }
            );
            return;
          }else{
            $.ajax({
                url: base_url+'dashboard/layout_approval',
                data:{id:id,action:action},
                type: 'POST',
                dataType: 'json',
                success: function(data){
                    if(data.approval == true){
                        alertify.set('notifier','position','top-left');
                        alertify.success('Layout successfully updated!');
                        layouts();
                    }else{
                        alertify.set('notifier','position','top-left');
                        alertify.error('Somehing went wrong');
                    }
                }
            });
            return;
          }

    });

    // Director Layout Approval
    $(document).on('click','.for-approval-director',function(){
        var id = $(this).attr('data-layoutId');
        var action = $(this).attr('data-action');
        $('#approveModal input[name="id"]').val(id);
        $('#approveModal').modal('show');
        // alert('test');
          // alertify.prompt('Comment').setHeader('Disapprove Layout').set('type', 'text');
          // if(action == '2'){
          //   alertify.prompt( 'Disapprove Layout', 'Comment', ''
          //          , function(evt, comment) {
          //            $.ajax({
          //                url: base_url+'dashboard/layout_approval',
          //                data:{id:id,action:action,comment:comment},
          //                type: 'POST',
          //                async: false,
          //                dataType: 'json',
          //                success: function(data){
          //
          //                    if(data.approval == true){
          //                        alertify.set('notifier','position','top-left');
          //                        alertify.success('Layout successfully updated!');
          //                        layouts();
          //                    }else{
          //                        alertify.set('notifier','position','top-left');
          //                        alertify.error('Something went wrong');
          //                        layouts();
          //                    }
          //                }
          //            });
          //        }
          //          , function() {
          //            alertify.error('Disapprove layout has been cancelled.')
          //            layouts();
          //          }
          //   );
          //   return;
          // }else{
          //
          //      $('#approveModal input[name="id"]').val(id);
          //      $('#approveModal').modal('show');
          //   $.ajax({
          //       url: base_url+'dashboard/layout_approval',
          //       data:{id:id,action:action},
          //       type: 'POST',
          //       dataType: 'json',
          //       success: function(data){
          //           if(data.approval == true){
          //               alertify.set('notifier','position','top-left');
          //               alertify.success('Layout successfully updated!');
          //               layouts();
          //           }else{
          //               alertify.set('notifier','position','top-left');
          //               alertify.error('Somehing went wrong');
          //           }
          //       }
          //   });
          //   return;
          // }

    });

    $(document).on('submit','form#approveForm',function(e){
      e.preventDefault();
      var formData = $(this).serialize();
      $.ajax({
          url:base_url+'dashboard/layout_approval',
          data: formData,
          type: 'POST',
          dataType: 'json',
          beforeSend: function(){
              show_loader();
          },
          success: function(data){
              hide_loader();
              if(data.approval == true){
                  alertify.set('notifier','position','top-left');
                  alertify.success('Layout successfully updated!');
              }else{
                  alertify.set('notifier','position','top-left');
                  alertify.error('Somehing went wrong');
              }
              layouts();
              $('#approveModal').modal('hide');
          }
      });

    });

    // Add actual
    $(document).on('click','.add-actual-account', function(){
        var id = $(this).attr('data-id');
        $('#addActualAccount input[name=layout_id]').val(id);
        $('#addActualAccount').modal('show');
    });

    // var availableTags = [ "asd", "asdf", "asdfg", "asdfgh", "asdfghj", "asdfghjkl", "asdfghjklz", "asdfghjklzxcv", "asdfghjklzxcvbn", "asdfghjklzxcvbnd", "Fortran", "Groovy", "Haskell", "Java", "JavaScript", "Lisp", "Perl", "PHP", "Python", "Ruby", "Scala", "Scheme" ] ;

    $(function() {
        // $( 'input[name=account_name]' ).autocomplete({
        //   source: availableTags
        // });

        $('input[name=account_name]' ).autocomplete({
            source : function(request, response){
              $.ajax({
                url: base_url+'dashboard/client_accounts',
                type:'post',
                dataType: "json",
                data: {
                    keyword: request.term
                },
                success: function( data ) {
                    response($.map(data, function (item) {
                        return {
                            label: item.company,
                            value: item.company
                        }
                    }));
                }
              });
            },
            minLength: 3
        });
      });



      // show specific nobs when adding layout
            $('.js-data-example-ajax').select2({
                width: '80%',
                theme: "classic",
                allowClear: true,
                placeholder: "",
                dropdownParent: $('#addNewLayout'),
                tags: true,
                ajax: {
                    url: base_url+'dashboard/specific_nobs',
                    type:'post',
                    dataType:'json',
                    data: function (params) {
                        var query = {
                            term: params.term
                        }
                      return query;
                    },
                    processResults:function(response){
                        let results = [];
                        $.each(response,function(ind,ele){
                            let obj = {}
                            let children = [];
                            obj.text = ele.header_name;
                            $.each(ele.sub_name,function(i,e){
                                let obj_children = {}
                                obj_children.id = e;
                                obj_children.text = e;
                                children.push(obj_children);
                            });
                            obj.children = children;
                            results.push(obj);
                        });
                        return {results:results};
                    }
                }
            });

            // show specific nobs when editing layout
                  $('.js-data-example-ajax-edit').select2({
                      width: '80%',
                      theme: "classic",
                      allowClear: true,
                      placeholder: "",
                      dropdownParent: $('#editStockLayout'),
                      tags: true,
                      ajax: {
                          url: base_url+'dashboard/edit_specific_nobs',
                          type:'post',
                          dataType:'json',
                          data: function (params) {
                              var query = {
                                  term: params.term
                              }
                            return query;
                          },
                          processResults:function(response){
                              let results = [];
                              $.each(response,function(ind,ele){
                                  let obj = {}
                                  let children = [];
                                  obj.text = ele.header_name;
                                  $.each(ele.sub_name,function(i,e){
                                      let obj_children = {}
                                      obj_children.id = e;
                                      obj_children.text = e;
                                      children.push(obj_children);
                                  });
                                  obj.children = children;
                                  results.push(obj);
                              });
                              return {results:results};
                          }
                      }
                  });

                  // show specific nobs when resubmtting layout
                        $('.js-data-example-ajax-resubmit').select2({
                            width: '80%',
                            theme: "classic",
                            allowClear: true,
                            placeholder: "",
                            dropdownParent: $('#resubmitStockLayout'),
                            tags: true,
                            ajax: {
                                url: base_url+'dashboard/resubmit_specific_nobs',
                                type:'post',
                                dataType:'json',
                                data: function (params) {
                                    var query = {
                                        term: params.term
                                    }
                                  return query;
                                },
                                processResults:function(response){
                                    let results = [];
                                    $.each(response,function(ind,ele){
                                        let obj = {}
                                        let children = [];
                                        obj.text = ele.header_name;
                                        $.each(ele.sub_name,function(i,e){
                                            let obj_children = {}
                                            obj_children.id = e;
                                            obj_children.text = e;
                                            children.push(obj_children);
                                        });
                                        obj.children = children;
                                        results.push(obj);
                                    });
                                    return {results:results};
                                }
                            }
                        });


    $(document).click(function() {
        $('#account-options').css('display','none');
    });

    $(document).on('click','#account-options span', function(){
        $('input[name=account_name]').val($(this).text());
        $('#account-options').css('display','none');
    });

    $('form#addActualAccountForm').validate({
        rules:{
            account_name:'required',
            actual_layout:'required'
        },
        messages:{
            account_name:'This field is required',
            actual_layout:'This field is required'
        }
    });
    $(document).on('submit','form#addActualAccountForm',function(e){
        e.preventDefault();
        $('#addActualAccount').modal('hide');
        var formData = new FormData($(this)[0]);
        $.ajax({
            url:base_url+'dashboard/add_actual',
            data: formData,
            type: 'post',
            contentType: false,
            processData:false,
            beforeSend: function(){
                show_loader();
            },
            success: function(data){
                 var parseData = JSON.parse(data);
                 console.log(parseData.data);
                hide_loader();
                if(parseData.status == "ok"){
                    $('#addActualAccountForm')[0].reset();
                    alertify.set('notifier','position','top-left');
                    alertify.success('Layout successfully added!');
                    layouts();
                }else if(parseData.status == 'invalid'){
                    alertify.set('notifier','position','top-left');
                    alertify.error('Invalid filetype');
                }else{
                    alertify.set('notifier','position','top-left');
                    alertify.error('Somehing went wrong');
                }
            }
        });
    });

    // Navigation Tab Activation
    $(document).on('click', '.nav-menu', function(){
        if($(this).hasClass('active')){
            display_filter_layoutstat($(location).attr('href'), false);
            $(this).removeClass('active');
            layouts();
        }else{
            navAction($(location).attr('href'),$(this).children('a'));
        }
    });

    // Delete Layout
    $(document).on('click', '.delete-layout', function(){
        var id = $(this).attr('data-id');
        alertify.confirm(
            'Delete Layout',
            'Are you sure? Once deleted you will not be able to use this layout',
            function(){
                $.ajax({
                    url: base_url+'dashboard/delete',
                    data: {id:id},
                    type:'POST',
                    dataType: 'json',
                    beforeSend: function(){
                        show_loader();
                    },
                    success: function(data){
                         console.log(data.delete);
                        hide_loader();
                        if(data.delete == true){
                            alertify.set('notifier','position','top-left');
                            alertify.success('Layout Successfully deleted!');
                            layouts();
                        }else{
                            alertify.set('notifier','position','top-left');
                            alertify.error('Something went wrong');
                        }
                    }
                });
            },
            function(){ }
        );
    });

    //Search Module
    $(document).on('click', '.search-btn',function(){
        alert("searched");
        search = true;
        $('[name=nob-filtering-user]').select2("trigger", "select", { data: { id: "all" } });
        $('[name=nob-filtering-id]').select2("trigger", "select", { data: { id: "all" } });
        $('[name=nob-filter-date]').val("");
        $('[name=layout-filtering-status]').val('').trigger('change');
        layouts();
        // alert($('.select2-hidden-accessible').val());
        // var test= $('.select2-hidden-accessible').val();
        // if(current_url.includes('/nob_layout/') == false){
        //     var params = [];
        //     var user = $('.select2-hidden-accessible').val();
        //     // var nob = $('[name=nob-filtering-id]').val();
        //     // var date = $('[name=nob-filter-date]').val();
        //     // var isDummyOrAct = $('[name=layout-filtering-status]').val();
        //     var tabStatusUrl = '';
        //
        //     if(user !='' && user !='A'){
        //
        //         params.push('user='+user);
        //     }
        //     // if(nob !='' && nob !='A')
        //     //     params.push('nob_id='+nob);
        //     // if(date !='')
        //     //     params.push('date='+date);
        //     // if(display_filter_layoutstat(current_url)){ //approved tab
        //     //     if(isDummyOrAct != '')
        //     //     params.push('stat='+isDummyOrAct);
        //     // }
        //
        //     params = params.join('&');
        //     params = (params != '' ? '?'+params :'');
        //     var fnal_url = '';
        //     //check if filtered [approved/pages/for approval/denied]
        //     fnal_url = base_url+'layouts-U-A'+params; //default
        //     // if(current_url.includes('layouts-approved')){
        //     //     fnal_url = base_url+'layouts-approved'+params;
        //     // }else if(current_url.includes('layouts-forapproval')){
        //     //     fnal_url = base_url+'layouts-forapproval'+params;
        //     // }else if(current_url.includes('dashboard/layouts_pages')){
        //     //     fnal_url = base_url+'dashboard/layouts_pages'+params;
        //     // }else if(current_url.includes('layouts-disapproved')){
        //     //     fnal_url = base_url+'layouts-disapproved'+params;
        //     // }
        //
        //     window.location.href = fnal_url;
        // }else{
        //     layouts($('input[name="nob_id"]').val(), 1);
        // }

    });

    $(document).on('click', '.filtering button[type=submit]', function(){
        var nob = $('[name=nob-filtering-id]').val();
        if(current_url.includes('/nob_layout/') == false){
            var params = [];
            var designer = $('[name=nob-filtering-user]').val();
            var nob = $('[name=nob-filtering-id]').val();
            var date = $('[name=nob-filter-date]').val();
            var isDummyOrAct = $('[name=layout-filtering-status]').val();
            var tabStatusUrl = '';

            if(designer !='' && designer !='A')
                params.push('user='+designer);
            if(nob !='' && nob !='A')
                params.push('nob_id='+nob);
            if(date !='')
                params.push('date='+date);
            if(display_filter_layoutstat(current_url)){ //approved tab
                if(isDummyOrAct != '')
                params.push('stat='+isDummyOrAct);
            }

            params = params.join('&');
            params = (params != '' ? '?'+params :'');
            var fnal_url = '';
            //check if filtered [approved/pages/for approval/denied]
            fnal_url = base_url+'layouts-U-A'+params; //default
            if(current_url.includes('layouts-approved')){
                fnal_url = base_url+'layouts-approved'+params;
            }else if(current_url.includes('layouts-forapproval')){
                fnal_url = base_url+'layouts-forapproval'+params;
            }else if(current_url.includes('dashboard/layouts_pages')){
                fnal_url = base_url+'dashboard/layouts_pages'+params;
            }else if(current_url.includes('layouts-disapproved')){
                fnal_url = base_url+'layouts-disapproved'+params;
            }

            search = false;
            layouts(nob,1,'',designer,date);
            alert("Nob:"+nob+"designer:"+designer+"date:"+date)
        }else{
            layouts($('input[name="nob_id"]').val(), 1);
        }
    });

    $(document).on('change', '.search-for', function(){
        search_data($(this).val(),false);
    });

    search_data();

    // For Pages (Status)
    $(document).on('click', '.for-pages', function(){
        var id = $(this).attr('data-id');
        $.ajax({
            url: base_url+'dashboard/layouts_pages',
            data:{id:id},
            type: 'POST',
            dataType: 'json',
            beforeSend: function(){
                show_loader();
            },
            success: function(data){
                 console.log(data);
                hide_loader();
                if(data.forpages == true){
                    alertify.set('notifier','position','top-left');
                    alertify.success('Successfully set status to pages!');
                    layouts();
                }else{
                    alertify.set('notifier','position','top-left');
                    alertify.error('Somehing went wrong');
                }
            }
        });
    });

    // Logout
    $(document).on('click', '.logout-btn', function(){
        $('.menus').toggle();
        if($('.menus').is(':visible')){
            $('.logout-btn').css('background-color',"#00bfbf");
            $('.logout-btn').css('background-image',"url('../images/logout.png') no-repeat 10px 6px");
        }else{
            $('.logout-btn').css('background-color',"#063867");
            $('.logout-btn').css('background-image',"url('../images/logout.png') no-repeat 10px 6px");
        }
    });

    $(document).on('click','.generatedata',function(e){
        $.ajax({
            url: base_url+'dashboard/fetch_data',
            data:{},
            type: 'POST',
            dataType: 'json',
            beforeSend: function(){
                show_loader();
            },
            success: function(data){
                alertify.set('notifier','position','top-left');
                if(data.status == "ok"){
                    alertify.success('Data updated!');
                }else{
                    alertify.error('Something went wrong!');
                }
                hide_loader();
            }
        });
    });

    $('.ui-state-active').css('color','#fff !important');

    $(document).on('click', '.dsaprv-msg', function(){
        $('#commentModal .modal-body').html('<p class="col-md-12">'+$(this).attr('data-comment')+'</p>');
        $('#commentModal').modal('show');
    });

    $(document).on('click', '.sort', function(){
        //set field to sort
        console.log($(this).attr('data-sortby'));
        $('input[name=sortfield]').val($(this).attr('data-sortby'));
        var by = $('input[name=sortby]').val();
        var sort_to = '';
        if(by == 'desc'){
            sort_to = 'asc';
        }else{
            sort_to = 'desc';
        }
        $('input[name=sortby]').val(sort_to);
        layouts($('input[name="nob_id"]').val());
    });

    $(document).on('click', '.save-file', function(){
        var file = $(this).attr('data-file');
        var file_id = $(this).attr('data-id');
        if(file != '' || file != null){
            $(this).remove();
            var win = window.open("http://192.168.1.20/marketplace/ajax/save_file/"+file_id+"?file_name="+encodeURIComponent(file), '_blank');
            if (win) {
                //Browser has allowed it to be opened
                win.focus();
            } else {
                //Browser has blocked it
                alert('Please allow popups for this link');
            }
        }
    });

    // approved page for ALL Layouts
    display_filter_layoutstat(current_url);
    $('.search-field select').select2();
    $('select[name="nob-filtering-user"],select[name="nob-filtering-id"]').select2();
});

// function show_dp_search(search = 'U',isLoded = true){
//     $.ajax({
//         url: base_url+'dashboard/getAllMiscData',
//         type: 'POST',
//         data:{
//             search:search
//         },
//         beforeSend: function(){
//             show_loader();
//         },
//         dataType:'json',
//         success: function(data){
//             hide_loader();
//             if(data.response == 'success'){
//                 if(isLoded == false){
//                     alertify.set('notifier','position','top-left');
//                     // alertify.success('Successfully set status to pages!');
//                 }
//                 layouts();
//             }else{
//                 alertify.set('notifier','position','top-left');
//                 alertify.error('Somehing went wrong');
//             }
//             var str = '';
//             if(data.search_options == 'U'){
//                 str += '<option>ALL</option>';
//                 $.each(data.misc_data,function(index,value){
//                     str += '<option value="'+value.user_id+'">'+value.name+'</option>';
//                 });
//             } else {
//                 str += '<option>ALL</option>';
//                 $.each(data.misc_data,function(index,value){
//                     str += '<option value="'+value.dsn_id+'">'+value.dsn_id+'</option>';
//                 });
//             }
//             $(".search-field > select").html(str)
//         }
//     });
// }

function display_filter_layoutstat(current_url, auto = false){
    res = false;

    if ($(location).attr('href').includes("nav_bar") && $(location).attr('href').includes("approved")) {
        $('.layout-status-filter').show();
        res = true;
    }

    if(auto){
        $('.layout-status-filter').show();
        res = true;
    }else{
        if(current_url.includes('/layouts-approved')){
            alert("first");
            $('.layout-status-filter').show();
            res = true;
        }else if (current_url.includes('/approved')) {
            $('.layout-status-filter').show();
        }else{
            $('.layout-status-filter').hide();
        }
    }
    return res;
}


function navAction(tempUrl, el){
    //check if clicked is approved layouts $(this).children('a').attr('data-status')
    if(el.attr('data-status') == 1){
        display_filter_layoutstat($(location).attr('href'), true);
    }
    var curUrl = decodeURIComponent(tempUrl);
    var islayUrl = tempUrl.includes('dashboard/get_layouts/');
    var islayUrlAll = tempUrl.includes('dashboard/get_layouts-');
    var isnobUrl = tempUrl.includes('/nob');
    var status = el.attr('data-status');
    var urlExt = '';
    var params = '';

    var _status = '';
    if(status == 0){ _status = 'forapproval'; }
    else if(status == 2){ _status = 'disapproved'; }
    else if(status == 1){ _status = 'approved'; }
    else if(status == 6){ _status = 'pages'; }

    if (tempUrl.includes('?')){
        params = '?'+tempUrl.split('?')[1];
        curUrl = curUrl.split('?')[0];
    }
    if(isnobUrl || islayUrlAll || tempUrl.includes('?')){
        if(tempUrl.includes('-U') || tempUrl.includes('-D')){
            var len = curUrl.split('/').pop().split('-').length;
            urlExt = '-'+curUrl.split('/').pop().split('-')[len-2]+'-'+curUrl.split('/').pop().split('-')[len-1];
        }
        // window.location.href = base_url+"dashboard/get_layouts-"+_status+urlExt+params;
        $('.nav-menu').removeClass('active');
        layouts($('input[name="nob_id"]').val(), 1,_status);

    }else if(islayUrl){
        var liparent = el.parents('li');
        $('.nav-menu').removeClass('active');
        liparent.addClass('active');
        layouts($(location).attr('href'), 1, status);
    }else if($('input[name="homepage_clicked"]').val() == "false" && $('input[name="current_status"]').val() == undefined ){
        window.location.href = base_url+"dashboard/nav_bar/"+_status;
    }else{
        $('input[name="current_status"]').val(_status);
        $('.nav-menu').removeClass('active');
        var designer = $('[name=nob-filtering-user]').val();
        var nob = $('[name=nob-filtering-id]').val();
        var date = $('[name=nob-filter-date]').val();
        var isDummyOrAct = $('[name=layout-filtering-status]').val();
        layouts(_status, 1, status,designer,date);
    }
}

function layouts(nob_id = $('input[name="nob_id"]').val(), page = 1, layoutStat = '', user = '', date = '',clicked = ''){
    var base_url = $('input[name="base_url"]').val();
    var tempUrl = base_url+'dashboard/get_layouts/'+nob_id;
    var curUrl = decodeURIComponent(tempUrl);
    var islayUrl = tempUrl.includes('dashboard/get_layouts');
    var srchtype = 'A';
    var srchkyword = '';
    if(search){
        srchtype = $('.search-for option:selected').val();
        srchkyword = $('.search-field option:selected').val();
        var tempUrl = base_url+'dashboard/get_layouts/'+srchtype+"-"+srchkyword;
    }

    var sortby = $('input[name=sortby]').val();
    var sortfield = $('input[name=sortfield]').val();

    //filter
    var _uid = $('[name=nob-filtering-user]').val();
    var date = $('[name=nob-filter-date]').val();
    var stat = $('[name=layout-filtering-status]').val();
    user = (typeof(_uid) != 'undefined' && _uid != 'all' && _uid != 'A') ? _uid : '';

    $('.navigation ul li').each(function(){
        if($(this).hasClass('active')){
            layoutStat = $(this).children('a').attr('data-status');
            return;
        }
    });

    if(islayUrl){
        var nob_id = getParam(curUrl, 'nob_id');
        if(typeof nob_id == 'undefined'){
            nob_id = $('input[name="nob_id"]').val();
            _layoutStat = curUrl.split('/').pop().split('-').pop();
            if(_layoutStat == 'forapproval'){layoutStat = 0;}
            if(_layoutStat == 'approved'){layoutStat = 1;}
            if(_layoutStat == 'disapproved'){layoutStat = 2;}
            if(_layoutStat == 'pages'){layoutStat = 6;}
        }

        if ($('[name=current_status]').val() != undefined) {
            nob_id = $('[name=nob-filtering-id]').val();
        }
        // alert(nob_id);
        $.ajax({
            url: tempUrl,
            type: 'POST',
            data: {rqstType:'ajax', nob_id:nob_id, page:page, layout_status:layoutStat, srchtype:srchtype, srchkyword:srchkyword,user:user,date:date,stat:stat,sortby:sortby,sortfield:sortfield,clicked:clicked,current_page:$('input[name="current_status"]').val()},
            async: false,
            dataType: 'json',
            success: function(res){
                var tblhead = '<tr><th></th><th class="colwid-295"><a class="sort" style="word-break: break-word;" data-sortby="0" href="javascript:;">Layout ID</a></th><th><a class="sort" data-sortby="1" href="javascript:;">DSN</a></th><th><a class="sort" data-sortby="2" href="javascript:;">Accounts Used</a></th><th class="colwid-120"><a class="sort" data-sortby="3" href="javascript:;">Name</a></th><th class="colwid-200"><a class="sort" data-sortby="4" href="javascript:;">Date Added</a></th><th class="colwid-150">Options</th><th colspan="2">Status</th><th></th></tr>';
                var tblbody = '';
                var paginate = '';
                tblbody += '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
                if(res.user != 3 && res.datas.length > 0){
                    tblbody += '<td class="spec-cat leader">LEADER</td><td class="spec-cat director">DIRECTOR</td>';
                }else{
                    tblbody += '<td colspan="2"></td>';
                }
                tblbody += '<td></td></tr>';
                
                if(res.datas.length > 0){
                    $.each(res.datas, function(key,val){
                        var isActual = false;
                        var isPages = false;
                        var has_actual = '';
                        var resubmit_layout_name = '';

                        // for approved layouts with used by agent/not used only
                        var star_icon_color = 'icon-bg-blue';
                        var star_shadow = '<img src="'+base_url+'/static/images/star-shadow-blue-icon.png" alt="Used">';
                        if(val.used_by_agent == 1){
                            star_icon_color = 'icon-bg-violet';
                            star_shadow = '';
                        }

                        // has actual
                        // console.log(val.actual_id);
                        if(val.actual_id > 0){
                        //     $.each(val.actual, function(ak, av){
                                if(val.actual_status == 1 || val.actual_status == 2){
                                    has_actual += '<hr> <div class="actual"> <a class="add-actual text-center" href="javascript:;">Actual Account:</a> <span>'+val.account_name+'</span> <a class="view-actual text-center" href="'+base_url+'templates/actual_accounts/'+val.actual_file.split(".")[0]+'" target="_blank">View Actual Account</a> </div>';
                                }
                        //     });
                        }
                        // Re submit indicator
                        resubmit_layout_name = (val.resubmit_status == 1)?"re-submitted-layout":"";

                        var layout_name = ' <a class="pop-hover" data-trigger="hover" href="#" data-content="'+(val.layout_specific_nob != '' ? val.layout_specific_nob : 'Not available')+'" rel="popover" data-placement="bottom">'+val.layout_name+'</a>';
                        var date = moment(val.date_added).format('LL');
                        tblbody += '<tr><td></td> <td class="'+resubmit_layout_name+'" ><a href="'+base_url+'templates/layouts/'+val.layout_file.split(".")[0]+'" target="_blank" class="layout-id">'+val.layout_disp_id+'<div class="layout-preload" style="display:none;position: absolute; background: #fff; border: 1px solid #ccc; border-radius: 5px; padding: 5px; left: 120px; vertical-align: top; height: 200px; width: 200px; overflow: hidden;"><img style="max-width:200px;width:100%;transform: translateY(0);transition: 2s;" src="'+base_url+'static/layouts/'+val.layout_file.split('.zip')[0]+'.png" alt="'+val.layout_disp_id+'"></div></a></td><td class="'+resubmit_layout_name+'">'+val.dsn_id+'</td><td class="'+resubmit_layout_name+'"> '+layout_name+' '+has_actual+'</td><td class="'+resubmit_layout_name+'">'+val.name+'</td><td class="'+resubmit_layout_name+'">'+date+'</td><td class="text-center '+resubmit_layout_name+'">';

                        // Options
                        if(res.user != 3){
                            tblbody += '<button type="button" class="btn btn-info icon icon-bg-skyblue delete-layout" data-id="'+val.l_id+'" name="button" data-toggle="tooltip" title="Remove"> <img src="'+base_url+'static/images/delete-icon.png" alt="Remove"> <img src="'+base_url+'static/images/delete-shadow-icon.png" alt="Remove"> </button>';
                        }
                        if(val.added_by == res.users || res.user == 1){

                            //edit button
                            if(val.director_approved_status == 2){

                                 tblbody += '<button type="button" class="btn btn-info icon icon-bg-skyblue resubmit-layout" data-id="'+val.l_id+'" name="button" data-toggle="tooltip" title="Edit"> <img src="'+base_url+'static/images/edit-icon.png" alt="Edit"> <img src="'+base_url+'static/images/edit-shadow-icon.png" alt="Edit"> </button>';
                            }else{
                                 tblbody += '<button type="button" class="btn btn-info icon icon-bg-skyblue edit-layout" data-id="'+val.l_id+'" name="button" data-toggle="tooltip" title="Edit"> <img src="'+base_url+'static/images/edit-icon.png" alt="Edit"> <img src="'+base_url+'static/images/edit-shadow-icon.png" alt="Edit"> </button>';
                            }

                        }
                        //download button
                        if(val.director_approved_status != 2){
                            tblbody += '<button type="button" class="btn btn-info icon icon-bg-skyblue download-layout" data-id="'+val.l_id+'" name="button" data-toggle="tooltip" title="Download"> <img src="'+base_url+'static/images/download-icon.png" alt="Download"> <img src="'+base_url+'static/images/download-shadow-icon.png" alt="Download"> </button>';
                        }
                        var actualBtn = '<button type="button" class="btn btn-default icon icon-bg-gray" name="button" data-toggle="tooltip" title="For Approval"> <img src="'+base_url+'static/images/default-star-icon.png" alt="For Approval"> <img src="'+base_url+'static/images/default-star-shadow-icon.png" alt="For Approval"> </button>';

                        if((val.leader_approved_status != '' || val.director_approved_status != '')){
                            var acid = '';


                            if(val.actual_id > 0){
                                // $.each(val.actual_id, function(ak, av){
                                     // console.log(av);
                                    if(val.actual_status == 1){ // used to an actual account
                                        isActual = true;
                                        acid = val.actual_id;
                                    }
                                    if(val.actual_status == 2){ // used to an actual account and tagged as page
                                        isPages = true;
                                    }
                                // });
                                if(isActual && !isPages){
                                    // actualBtn = '<button type="button" class="btn btn-info icon icon-bg-blue" name="button" data-toggle="tooltip" title="Used"> <img src="/static/images/star-icon.png" alt="Used"> <img src="/static/images/star-shadow-blue-icon.png" alt="Used"> </button>';
                                    actualBtn = '<button type="button" class="btn btn-info icon '+star_icon_color+'" name="button" data-toggle="tooltip" title="Used"> <img src="'+base_url+'static/images/star-icon.png" alt="Used"> '+star_shadow+' </button>';
                                    if(res.user != 3){
                                        // actualBtn += '<button type="button" class="btn btn-info icon icon-bg-skyblue for-pages" data-id = "'+acid+'" name="button" data-toggle="tooltip" title="For Pages"> <img src="/static/images/pages-icon.png" alt="Pages"> <img src="/static/images/pages-shadow-icon.png" alt="Pages"> </button>';
                                        actualBtn += '<button type="button" class="btn btn-info icon icon-bg-skyblue for-pages" data-id = "'+acid+'" name="button" data-toggle="tooltip" title="For Pages"> <img src="'+base_url+'static/images/pages-icon.png" alt="Pages"> <img src="'+base_url+'static/images/pages-shadow-icon.png" alt="Pages"> </button>';
                                    }

                                }else if(!isActual && isPages){
                                    // actualBtn = '<button type="button" class="btn btn-info icon icon-bg-blue " name="button" data-toggle="tooltip" title="Used"> <img src="/static/images/star-icon.png" alt="Used"> <img src="/static/images/star-shadow-blue-icon.png" alt="Used"> </button>';
                                    // if(res.utype != 3){
                                    //     actualBtn += '<button type="button" class="btn btn-info icon icon-bg-redorange" name="button" data-toggle="tooltip" title="Pages"> <img src="/static/images/pages-icon.png" alt="Pages"> <img src="/static/images/paged-shadow-icon.png" alt="Pages"> </button>';
                                    // }
                                    actualBtn = '<button type="button" class="btn btn-info icon '+star_icon_color+' " name="button" data-toggle="tooltip" title="Used"> <img src="'+base_url+'static/images/star-icon.png" alt="Used"> '+star_shadow+' </button>';
                                    if(res.user != 3){
                                        actualBtn += '<button type="button" class="btn btn-info icon icon-bg-redorange" name="button" data-toggle="tooltip" title="Pages"> <img src="'+base_url+'static/images/pages-icon.png" alt="Pages"> <img src="'+base_url+'static/images/paged-shadow-icon.png" alt="Pages"> </button>';
                                    }
                                }
                            }else{
                                if (val.director_approved_status != 1){
                                    actualBtn = '<button type="button" class="btn btn-info icon icon-bg-gray" name="button" data-toggle="tooltip" title="Can be used for actual"> <img src="'+base_url+'static/images/default-star-icon.png" alt="Can be used for Actual"> <img src="'+base_url+'static/images/default-star-shadow-icon.png" alt="Can be used for Actual"> </button>';
                                }else{
                                    star_icon_color = 'icon-bg-orange';
                                    star_shadow = '<img src="'+base_url+'static/images/star-shadow-orange-icon.png" alt="Can be used for Actual2">';
                                    var actual_action = 'add-actual-account';
                                    var actual_title = 'Actual';
                                    if(val.used_by_agent == 1){
                                        star_icon_color = 'icon-bg-violet';
                                        star_shadow = '';
                                        actual_action = '';
                                        actual_title = 'Used';
                                    }
                                    var add_actual = (res.user == 3)?'add-actual-account':'';
                                    actualBtn = '<button type="button" class="btn btn-info icon '+star_icon_color+' '+actual_action+'" data-id="'+val.l_id+'" name="button" data-toggle="tooltip" title="'+actual_title+'"> <img src="'+base_url+'static/images/star-icon.png" alt="Can be used for Actual222"> '+star_shadow+' </button>';
                                }
                            }
                        }
                        if(val.director_approved_status != 2){
                            tblbody += actualBtn;
                        }

                        tblbody +='</td>';
                        if(res.user != 3){
                            tblbody +='<td class="text-center '+resubmit_layout_name+'">';
                            // Status
                            var leaderStatusBtn = '';
                            if(val.leader_approved_status == 1){
                                //layout approved
                                leaderStatusBtn = '<button type="button" class="btn btn-info icon icon-bg-green" name="button" data-toggle="tooltip" title="Approved"> <img src="'+base_url+'static/images/approved-icon.png" alt="Approved"> </button>';
                            }else if(val.leader_approved_status == 2){
                                //layout disapproved
                                leaderStatusBtn = '<button type="button" class="btn btn-info icon icon-bg-red dsaprv-msg" name="button" data-toggle="tooltip" data-comment="'+(val.disapprove_comment != '' && val.disapprove_comment != null ? val.disapprove_comment : 'No comment')+'" title="Disapproved"> <img src="'+base_url+'static/images/disapproved-icon.png" alt="Disapproved"> <img src="'+base_url+'static/images/disapproved-shadow-icon.png" alt="Disapproved"> </button>';
                            }else{
                                if(val.leader_approved_status == 0){
                                    leaderStatusBtn = "<button type=\"button\" class=\"btn btn-default icon icon-bg-gray\" name=\"button\" data-toggle=\"tooltip\" title=\"For Approval\"> <img src=\""+base_url+"static/images/for-approval-icon.png\" alt=\"For Approval\"></button>";
                                    if(res.user == 2){ //leader

                                        leaderStatusBtn = "<button type=\"button\" class=\"btn btn-default icon icon-bg-gray\" name=\"button\" data-toggle=\"popover\" data-html=\"true\"  title=\"For Approval\" data-content=\"<button type='button' class='btn btn-info icon icon-bg-gray for-approval' name='button' data-action='1' data-layoutId='"+val.l_id+"' data-toggle='tooltip' title='Approve'> <img src='"+base_url+"static/images/approved-icon.png' alt='Approve' data-toggle='tooltip'   title='Approve'> <img src='"+base_url+"static/images/for-approval-shadow-icon.png' alt='Approve'> </button> <button type='button' class='btn btn-info icon icon-bg-gray for-approval' name='button' data-action='2' data-layoutId='"+val.l_id+"' data-toggle='tooltip' title='Disapprove'> <img src='"+base_url+"static/images/disapproved-icon.png' alt='Disapprove'> <img src='"+base_url+"static/images/for-disapproval-shadow-icon.png' alt='For Disapproval'> </button>\"><img src=\""+base_url+"static/images/for-approval-icon.png\" alt=\"For Approval\"> </button>";
                                    }
                                }
                            }

                            tblbody += leaderStatusBtn;
                            tblbody +='</td>';
                            tblbody +='<td class="text-center '+resubmit_layout_name+'">';
                            // Status
                            var directorStatusBtn = '';
                            if(val.director_approved_status == 1){
                                //layout approved
                                directorStatusBtn = '<button type="button" class="btn btn-info icon icon-bg-green" name="button" data-toggle="tooltip" title="Approved"> <img src="'+base_url+'static/images/approved-icon.png" alt="Approved" > </button>';
                                if(val.save_status == '' || val.save_status == null){
                                    if(res.user == 1){
                                        directorStatusBtn += '<button type="button" class="btn btn-info icon icon-bg-orange save-file" data-id="'+val.l_id+'" data-file="'+val.layout_file+'" name="button" data-toggle="tooltip" title="Save file to web2"> <i class="fa fa-save"> </button>';
                                    }
                                }
                            }else if(val.director_approved_status == 2){
                                //layout disapproved
                                directorStatusBtn = '<button type="button" class="btn btn-info icon icon-bg-red dsaprv-msg" name="button" data-comment="'+(val.disapprove_comment != '' && val.disapprove_comment != null ? val.disapprove_comment : 'No comment')+'"> <img src="'+base_url+'static/images/disapproved-icon.png" alt="Disapproved" data-toggle="tooltip" title="Disapproved"> <img src="'+base_url+'static/images/disapproved-shadow-icon.png" alt="Disapproved"> </button>';
                            }else{
                                if(val.director_approved_status == 0){
                                    directorStatusBtn = "<button type=\"button\" class=\"btn btn-default icon icon-bg-gray\" name=\"button\" data-toggle=\"tooltip\" title=\"For Approval\"> <img src=\""+base_url+"static/images/for-approval-icon.png\" alt=\"For Approval\"></button>";
                                    if(res.user == 1){ //director
                                        directorStatusBtn = "<button type=\"button\" class=\"btn btn-default icon icon-bg-gray\" name=\"button\" data-toggle=\"popover\" data-html=\"true\"  title=\"For Approval\" data-content=\"<button type='button' class='btn btn-info icon icon-bg-gray for-approval-director' data-layoutId='"+val.l_id+"' name='button' data-action='1' data-toggle='tooltip' title='Approve'> <img src='"+base_url+"static/images/approved-icon.png' alt='Approve'> <img src='"+base_url+"static/images/for-approval-shadow-icon.png' alt='Approve'> </button> <button type='button' class='btn btn-info icon icon-bg-gray for-approval' data-layoutId='"+val.l_id+"' name='button' data-action='2' data-toggle='tooltip' title='Disapprove'> <img src='"+base_url+"static/images/disapproved-icon.png' alt='Disapprove'> <img src='"+base_url+"static/images/for-disapproval-shadow-icon.png' alt='For Disapproval'> </button>\"><img src=\""+base_url+"static/images/for-approval-icon.png\"   alt=\"For Approval\"> </button>";
                                    }
                                }
                            }
                            tblbody += directorStatusBtn;
                        }else{
                            if(val.leader_approved_status == 2 || val.director_approved_status == 2){
                                tblbody += '<td colspan="2" class="'+resubmit_layout_name+'"><button type="button" class="btn btn-info icon icon-bg-red dsaprv-msg" data-comment="'+(val.disapprove_comment != '' && val.disapprove_comment != null ? val.disapprove_comment : 'No comment')+'" name="button" data-toggle="tooltip" title="Disapproved"> <img src="'+base_url+'static/images/disapproved-icon.png" alt="Disapproved"> <img src="'+base_url+'static/images/disapproved-shadow-icon.png" alt="Disapproved"> </button></ td>'
                            }else if(val.director_approved_status == 0 || (val.leader_approved_status == 1 && val.director_approved_status == 0)){
                                tblbody +='<td colspan="2" class="'+resubmit_layout_name+'"><button type="button" class="btn btn-default icon icon-bg-gray" name="button" data-toggle="tooltip" title="For Approval"> <img src="'+base_url+'static/images/for-approval-icon.png" alt="For Approval"> <img src="'+base_url+'static/images/default-star-shadow-icon.png" alt="For Approval"> </button></td>';
                            }else if(val.director_approved_status == 1){
                                tblbody +='<td colspan="2" class="'+resubmit_layout_name+'"><button type="button" class="btn btn-info icon icon-bg-green" name="button" data-toggle="tooltip" title="Approved"> <img src="'+base_url+'static/images/approved-icon.png" alt="Approved"> </button></td>';
                            }
                        }

                        tblbody +='</td><td></td></tr>';

                    });
                }else{
                    tblbody +='<tr><td colspan="10">No available layouts</td></tr>';
                }

                tblbody +='<tr> <td colspan="10"></td> </tr>';

                // var nob_heading = ''
                // nob_heading = res.nob_details[0].nob_sub_name != '' ? res.nob_details[0].nob_name+' <span class="font-bold nob-subheading">('+res.nob_details[0].nob_sub_name+')</span>' : res.nob_details[0].nob_name;

                $('.layout-table thead').html(tblhead);
               $('.layout-table tbody').html(tblbody);

               // alert(res.datas[0].nav_data);
               if (res.datas.length != 0) {
                    if (typeof res.datas[0].nav_data != 'undefined') {
                        $('.total').children('span').text(pad(res.datas[0].nav_data, 5));
                    }
                }else{
                    $('.total').children('span').text(pad("0", 5));
                }
                // $('.total h4').text(pad(res.total_data.all, 5));
                if (res.nav_count.length != 0) {
                    if (typeof res.nav_count[0].pages != 'undefined') {
                        $('.pages').children('span').text(pad(res.nav_count[0].pages, 5));
                    }
                    if (typeof res.nav_count[0].approved != 'undefined') {
                        $('.approved').children('span').text(pad(res.nav_count[0].approved, 5));
                    }
                    if (typeof res.nav_count[0].forapproval != 'undefined') {
                        $('.forapproval').children('span').text(pad(res.nav_count[0].forapproval, 5));
                    }
                    if (typeof res.nav_count[0].disapproved != 'undefined') {
                        $('.denied').children('span').text(pad(res.nav_count[0].disapproved, 5));
                    }
                }

                // $('.nob-heading').html(nob_name);
                // $('.total').children('span').text(pad(res.total_data.data, 5));
                // $('.total h4').text(pad(res.total_data.all, 5));
                // $('.pages').children('span').text(pad(res.total_data.pgcount, 5));
                // $('.approved').children('span').text(pad(res.total_data.aprvcount, 5));
                // $('.forapproval').children('span').text(pad(res.total_data.fraprvcount, 5));
                // $('.denied').children('span').text(pad(res.total_data.dsaprvcount, 5));

                //set filter values
                var fnal_url = tempUrl;
                if(fnal_url.includes('?')){
                    fnal_url = fnal_url.split('?')[0]; //for filter all layouts
                }

                var params = fnal_url.split('/').pop().split('-');
                var _urlparamslen = params.length;

                if(fnal_url.includes('-D') || fnal_url.includes('-U')){
                    $('.search-for option[value='+params[_urlparamslen-2]+']').prop("selected", true).click();
                    // search_data(fnal_url,params[_urlparamslen-2]);
                    $('.search-field select option[value='+params[_urlparamslen-1]+']').prop("selected", true).click();
                }
                // //must be after searchdata call
                if ($('input[name="current_status"]').val()) {
                    nav_active($('input[name="current_status"]').val());
                }else{
                    nav_active(layoutStat);
                }

                if(res.search != undefined ){
                    $('.nob-heading').text(res.search);
                    $('.font-bold').text(res.data_count);
                }



                if(res.current_layout != undefined){
                    $('.nob-heading').text(res.current_layout);
                }
                console.log(res.nob_status);
                if (res.nob_status != undefined) {
                    if (res.nob_status == 'true') {
                        $('a.add').removeClass("d-none");
                        $('a.add').attr('data-code',res.nobs[0]['nob_code']);
                        $('a.add').attr('data-id',res.nobs[0]['nob_id']);
                    }else{
                        $('a.add').addClass("d-none");
                    }
                }

                generatePagingLinks(tempUrl, Math.ceil(res.data_count / 10), page);

                //
                // if(tempUrl.includes('layouts-') && tempUrl.includes('nob_id=')){
                //
                // }
                // $('.search-field select').select2();
            },
            error: function(){
                // alertify.error('Somehing went wrong');
            }
        })
    }
}

// function for generating paging links
function generatePagingLinks(tempUrl, pageLen, curPage) {
    var item = [];
    var first = false;
    for(var i = 1; i<=pageLen;i++){
        item.push(i);
    }
    if(curPage == 1){
        first = true;
    }
    render(tempUrl, pageLen, curPage, item, first);
}

function render(tempUrl, pageLen, curPage, item, first ) {
    var html = '', separatorAdded = false;
    for(var i in item){
        if(curPage == 1 && item[i] < 6){
            html += '<li><a href="javascript:;" data-url="'+tempUrl+'" data-page-id="'+item[i]+'">'+item[i]+'</a></li>';
        }else{
            if ( isPageInRange( curPage, i, pageLen, 2, 2 ) ) {
                html += '<li><a href="javascript:;" data-url="'+tempUrl+'" data-page-id="'+item[i]+'">'+item[i]+'</a></li>';
                // as we added a page, we reset the separatorAdded
                separatorAdded = false;
            } else {
                if (!separatorAdded) {
                    // only add a separator when it wasn't added before
                    html += '<li class="separator">...';
                    separatorAdded = true;
                }
            }
        }
    }

    $('.pagination').html(html);

    $('.pagination a[data-page-id='+curPage+']').parents('li').addClass('active');
}

function isPageInRange( curPage, index, maxPages, pageBefore, pageAfter ) {
    if (index <= 1) {
        // first 2 pages
        return true;
    }
    if (index >= maxPages - 2) {
        // last 2 pages
        return true;
    }
    if (index >= parseFloat(curPage) - parseFloat(pageBefore) && index <= parseFloat(curPage) + parseFloat(pageAfter)) {
        return true;
    }

    return false;
}

function getParam(url, param){
    var check = "" + param;
    if(url.search(check )>=0){
        return url.substring(url.search(check )).split('&')[0].split('=')[1];
    }
}

function show_loader(){
    $('.loader-cont').show();
}

function hide_loader(){
    $('.loader-cont').hide();
}

//put leading zeros
function pad (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

function search_data(type='U',isLoded = true){
    // var curUrl = decodeURIComponent(tempUrl);
    // var islayUrl = tempUrl.includes('dashboard/get_layouts/');
    // console.log(tempUrl);
    // var islayUrl = tempUrl.includes('/dashboard/get_layouts');
    // var isnobUrl = tempUrl.includes('/nob');
    // if(islayUrl || isnobUrl){

    $.ajax({
            url: base_url+'dashboard/search_values',
            type: 'POST',
            data:{
                type:type
            },
            beforeSend: function(){
                show_loader();
            },
            dataType:'json',
            success: function(data){
                hide_loader();
                if(data.response == 'success'){
                    if(isLoded == false){
                        alertify.set('notifier','position','top-left');
                        // alertify.success('Successfully set status to pages!');
                    }
                    layouts();
                }else{
                    alertify.set('notifier','position','top-left');
                    alertify.error('Somehing went wrong');
                }
                var str = '';
                if(data.search_options == 'U'){
                    str += '<option>ALL</option>';
                    $.each(data.misc_data,function(index,value){
                        str += '<option value="'+value.user_id+'">'+value.name+'</option>';
                    });
                } else {
                    str += '<option>ALL</option>';
                    $.each(data.misc_data,function(index,value){
                        str += '<option value="'+value.dsn_id+'">'+value.dsn_id+'</option>';
                    });
                }
                $(".search-field > select").html(str)
            }
        });

    // }
}

function nob_filter(tempUrl){
    var isnobUrl = tempUrl.includes('nav_bar');
    if(isnobUrl){
        //display nob filter
        $('.nob-filter').removeClass('d-none');
    }
}

function nav_active(tempUrl){
    if(tempUrl == 'pages')
        $('.nav-menu a[data-status=6]').parents('.nav-menu').addClass('active');
    if(tempUrl == 'approved')
        $('.nav-menu a[data-status=1]').parents('.nav-menu').addClass('active');
    if(tempUrl == 'forapproval')
        $('.nav-menu a[data-status=0]').parents('.nav-menu').addClass('active');
    if(tempUrl == 'disapproved')
        $('.nav-menu a[data-status=2]').parents('.nav-menu').addClass('active');
}

function set_filter_values(tempUrl){
    if(tempUrl.includes('user='))
        $('[name=nob-filtering-user] option[value="'+getParam(tempUrl, 'user')+'"]').prop("selected", true).click();
    if(tempUrl.includes('nob_id='))
        $('[name=nob-filtering-id] option[value='+getParam(tempUrl, 'nob_id')+']').prop("selected", true).click();
    if(tempUrl.includes('date='))
        // $('.datepicker').datepicker({
        //     format: 'mm/dd/yyyy',
        //     autoclose: true,
        //     currentText: "Now"
        // }).datepicker("setDate", getParam(tempUrl, 'date'));
        $('.datepicker').datepicker({
             language: 'en',
        });
    if(tempUrl.includes('stat='))
        $('[name=layout-filtering-status] option[value='+getParam(tempUrl, 'stat')+']').prop("selected", true).click();
}

function set_table_title(tempUrl){
    if(tempUrl.includes('-pages'))
        $('.nob-heading').text('PAGES LAYOUTS');
    else if(tempUrl.includes('-approved'))
        $('.nob-heading').text('APPROVED LAYOUTS');
    else if(tempUrl.includes('-forapproval'))
        $('.nob-heading').text('FOR APPROVAL LAYOUTS');
    else if(tempUrl.includes('-disapproved'))
        $('.nob-heading').text('DENIED LAYOUTS');
    else if(tempUrl.includes('-U-ALL'))
        $('.nob-heading').text('ALL LAYOUTS');
}
