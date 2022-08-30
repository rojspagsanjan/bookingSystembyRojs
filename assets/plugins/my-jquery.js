
$(document).ready(function() {
    $('#userlist').DataTable({
        responsive: true
    });
    $('#btn_create').on('click' , function() {
        enableInputs();
    })
    // add form Submit
    $('#createUserForm').on("submit" , function(e) {
        e.preventDefault();
        let url = $('#base_url').val();
        let formData = $(this).serialize();
        console.log(url);
        $.ajax({
            method: 'POST',
            url : url + 'users/createUser',
            data : formData,
            success : function(response) {
                let data = JSON.parse(response);
                if(data.form_error){
                    clearError();
                    let keyNames = Object.keys(data.form_error);
                    $(keyNames).each(function(index , value) {
                        $("input[name='"+value+"']").next('.err').text(data.form_error[value]);
                    });
                }else if (data.error) {
                    Swal.fire("Error",data.error, "error");
                }else {
                    $('#add_User').modal('hide');
                    Swal.fire("Success",data.success, "success");
                }
            }
        })
    })

    $('.btn_edit').on('click' , function() {

        let info_id = $(this).attr('info_id'),
        url = $('#base_url').val();

        $.ajax({
            method: 'POST',
            url : url + 'users/getSingleUser',
            data :{info_id : info_id},
            dataType:'json',
            success : function(response) {
                AssignSingleUserData(response);
                sessionStorage.setItem("active_edit_user_id", info_id);
            },
        })
    })

    $('#editeUserForm').on("submit" , function(e) {
        e.preventDefault();
        let url = $('#base_url').val();
        let formData = $(this).serializeArray();
        formData.push({name:'info_id' , value : sessionStorage.getItem('active_edit_user_id')});
        $.ajax({
            method : 'POST',
            url : url + 'users/updateUser',
            data : formData,
            success : function(response){
                let data = JSON.parse(response);
                clearError();
                if (data.form_error) {
                    let keyNames = Object.keys(data.form_error);
                    $(keyNames).each(function(index , value) {
                        $("input[name='"+value+"']").next('.err').text(data.form_error[value]);
                    });
                }else if (data.error) {
                    Swal.fire("Error",data.error, "error");
                }else {
                    Swal.fire("Updated!",data.success, "success");
                }
            }
        })
    })

  // ========================================================================= DELETE USER

    $('.delete-btn').on("click", function(event) {
        event.preventDefault();
        var url = $('#base_url').val();
        var id = $(this).attr('id');
        var $ele = $(this).parent().parent();
        console.log(id);
            if(confirm("Consider first your Life!!!")) {
                $.ajax({
                    type: 'POST',
                    url: url + 'users/deleteUser',
                    data: {id: id},
                    success:function(data) {
                        $ele.closest('tr').fadeOut().remove();
                        console.log('deleted an item');
                    }
                });
            }
            return false;
        });

    // ========================================================================= DELETE Branch
    $('.del-branch').on('click', function() {
      var url = $('#base_url').val();
      var id = $(this).attr('id');
      var $ele = $(this).parent().parent();
      let confirm_del = confirm("This action cant be Undo");
      console.log(id);
      if(confirm_del) {
        $.ajax({
          type: 'POST',
          url: url + 'branch/deleteBranch',
          data: {id:id},
          success:function(data) {
            $ele.closest('tr').fadeOut().remove();
            console.log('deleted an item');
          }
        });
      }
      return false;
    })
    // ========================================================================= END User

    // ========================================================================= Branch Section

    $('#addBranchForm').on("submit" , function(e) {
        e.preventDefault();
        clearError();
        let url = $('#base_url').val(),
            formData = $(this).serialize();

        $.ajax({
            url : url + 'branch/createBranch',
            method: 'POST',
            data : formData,
            success : function(response){
                let data = JSON.parse(response);
                    if (data.form_error) {
                        let keyNames = Object.keys(data.form_error);
                        $(keyNames).each(function(index , value) {
                            $("input[name='"+value+"']").next('.err').text(data.form_error[value]);
                        });
                    }else if (data.error) {
                        Swal.fire("Error",data.error, "error");
                    }else {
                        $('#add_Branch').modal('hide');
                        Swal.fire("Success!",data.success, "success");
                    }
            }
        })
    })

    $('.branch_btn_edit').on('click' , function() {
        let branch_id = $(this).attr('branch_id'),
            url = $('#base_url').val(),
            data = {branch_id :branch_id };
            $.post(url + 'branch/getBranch' , data).done(function(response) {
                sessionStorage.setItem("active_edit_branch_id", branch_id);
                let data = JSON.parse(response);
                AssignSingleBranch(data);
            });
    });

    $('#editBranchForm').on("submit" , function(e) {
        e.preventDefault();
        clearError();
        let url = $('#base_url').val(),
            formData = $(this).serializeArray();
            formData.push({name : 'branch_id' , value : sessionStorage.getItem('active_edit_branch_id')});
            $.post(url + 'branch/updateBranch' , formData).done(function(response) {
                let data = JSON.parse(response);
                if (data.form_error) {
                    let keyNames = Object.keys(data.form_error);
                    $(keyNames).each(function(index , value) {
                        $("input[name='"+value+"']").next('.err').text(data.form_error[value]);
                    });
                }else if (data.error) {
                    Swal.fire("Error",data.error, "error");
                }else{
                    $('#edit_Branch').modal('hide');
                    Swal.fire("Success!",data.success, "success");
                }
            })
    });
})


function enableInputs(){
    $('input[name="fname"]').attr('disabled' , false);
    $('input[name="middlename"]').attr('disabled' , false);
    $('input[name="lname"]').attr('disabled' , false);
    $('input[name="username"]').attr('disabled' , false);
    $('select[name="branch"]').attr('disabled' , false);
    $('select[name="user_type"]').attr('disabled' , false);
    $('input[name="password"]').attr('disabled' , false);
    $('#confirm_password').show();
}

function AssignSingleUserData(data){
    $('#editeUserForm input[name="fname"]').val(data.firstname);
    $('#editeUserForm input[name="middlename"]').val(data.middlename);
    $('#editeUserForm input[name="lname"]').val(data.lastname);
    $('#editeUserForm input[name="username"]').val(data.username);
    $('#editeUserForm select[name="branch"]').val(1);
    $('#editeUserForm select[name="user_type"]').val(data.user_type);
    $('#editeUserForm input[name="password"]').val(data.password);
    $('#editeUserForm input[name="email"]').val(data.email);
}

function AssignSingleBranch(data){
    $('#editBranchForm input[name="bname"]').val(data.branch_name);
    $('#editBranchForm input[name="bcode"]').val(data.branch_code);
    $('#editBranchForm input[name="address"]').val(data.address);
    $('#editBranchForm select[name="status"]').val(data.Status);
}

function clearError(){
    $('.err').text('');
}

// function chckStatus(data){
//     switch (data) {
//         case '0':
//             return 'Guest';
//             break;
//         case '1':
//             return 'Administrator';
//             break;
//         case '2':
//             return 'Super Admin';
//             break;
//         default:
//
//     }
// }
