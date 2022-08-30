var base_url = $('input[name="base_url"]').val();
$(document).ready(function(){

// add user
$(document).on('submit','form#add_user', function(e){
    e.preventDefault();
    let formData = $(this).serialize();

    $.ajax({
        method:'POST',
        url: base_url + 'usermanagement/addUser',
        data: formData,
        dataType: 'json',
        success: function(response){
            console.log(response);
            if (response.status == true) {
                Swal.fire("Successfully added User!",'Success',"Success")
                .then((result) => {
                  location.reload();
                });
            } else if(response.error){
                Swal.fire("Error",response.error,"error");
            } else if (response.username_error) {
                Swal.fire("Username must atleast 6 characters long!",'error',"Error")
                .then((result) => {
                  location.reload();
                });
            }else if (response.password_error) {
                Swal.fire("Password must atleast 10 characters long!",'error',"Error")
                .then((result) => {
                  location.reload();
                });
            }else {
                  for (var i = 0; i < response.return.input_name.length; i++) {
                      console.log( response.return.input_name[i], response.return.input_error[i]);
                      $("input[name="+response.return.input_name[i]+"]").css('border-color', 'red');
                  }
                  Swal.fire("Please fill out all fields", 'Error', "error");
            }
            $(".user_table").DataTable().ajax.reload();
        }
    })
})

// view edit USERS
$(document).on("click", ".edituser", function(){
    var user_id = $(this).attr('data-id');

    $.ajax({
        method:'POST',
        url: base_url + 'usermanagement/view_all_users',
        dataType: 'json',
        data: {user_id:user_id},
        success: function(data){
            console.log(data);
            $('#Edituser').modal('show');
            $('#Edituser .user_edit_id').val(user_id);
            $('#Edituser input[name="lastname"]').val(data.users.lastname);
            $('#Edituser input[name="firstname"]').val(data.users.firstname);
            $('#Edituser input[name="username"]').val(data.users.username);
            $('#Edituser input[name="password"]').val(data.users.bu_password);
        }
    })

});

$(document).on("click", ".viewuser", function(e){
    e.preventDefault();
    var user_id = $(this).attr('data-id');
    $.ajax({
       method: 'POST',
       url: base_url + 'usermanagement/view_all_users',
       data: { user_id: user_id },
       dataType: "json",
       success: function (data) {
          $("#View_user").modal('show');
          $('.lastname').text(data.users.lastname);
          $('.firstname').text(data.users.firstname);
          $('.username').text(data.users.username);
       }
    })
})
// Submit Edit User
$(document).on("submit","#edituser", function(e){
    e.preventDefault();

    let formData = new FormData($(this)[0]);
    var user_id = $('input[name="user_edit_id"]').val();
    formData.append("user_id", user_id);
    $.ajax({
       method: 'POST',
       url: base_url + 'usermanagement/edit_user',
       data: formData,
       processData: false,
       contentType: false,
       cache: false,
       dataType: 'json',
       success: function (data) {
          if (data.status == "ok") {
             $('#Edituser').modal('hide');
             Swal.fire("User has been updated!", data.success, "success");
             $(".user_table").DataTable().ajax.reload();
          } else if (data.status == 'invalid') {
             Swal.fire("Error", data.status, "invalid");
          }
       }
    })

})

// End Submit Edit User

$(document).on("click", ".disableuser", function (e) {
   e.preventDefault();
   var user_id = $(this).attr('data-id');
   Swal.fire({
      title: 'Are you sure?',
      text: "You want to disable this User, Once Disabled, this user can no longer have the access to the system",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#068101',
      confirmButtonText: 'Yes, Disable User!'
   }).then((result) => {
      if (result.value) {
         Swal.fire(
            'Disabled!',
            'Successfully Disabled User!',
            'success'
         )
         $.ajax({
            type: 'POST',
            url: base_url + 'usermanagement/disable_user',
            data: { user_id: user_id },
            success: function (data) {
               $(".user_table").DataTable().ajax.reload();
            }
         })
      }
   });
});


$(document).on("click", ".enableuser", function (e) {
   e.preventDefault();
   var user_id = $(this).attr('data-id');

   Swal.fire({
      title: 'Are you sure?',
      text: "You want to enable this User",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#068101',
      confirmButtonText: 'Yes, Enable User!'
   }).then((result) => {
      if (result.value) {
         Swal.fire(
            'Enabled!',
            'Successfully Enabled User!',
            'success'
         )
         $.ajax({
            type: 'POST',
            url: base_url + 'usermanagement/enable_user',
            data: { user_id: user_id },
            success: function (data) {
               $(".user_table").DataTable().ajax.reload();
            }
         })
      }
   });
});

$(document).on("click", ".deleteuser", function (e) {
   e.preventDefault();
   var user_id = $(this).attr('data-id');

   Swal.fire({
      title: 'Are you sure?',
      text: "You want to Delete this User",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#068101',
      confirmButtonText: 'Yes, Delete User!'
   }).then((result) => {
      if (result.value) {
         Swal.fire(
            'Deleted!',
            'Successfull Deleted User!',
            'success'
         )
         $.ajax({
            type: 'POST',
            url: base_url + 'usermanagement/delete_user',
            data: { user_id: user_id },
            success: function (data) {
               $(".user_table").DataTable().ajax.reload();
            }
         })
      }
   });
});


})

// view user

var user_table = $('.user_table').DataTable({
   "responsive": true,
   "processing": true,
   "serverside": true,
   "order": [[0, 'desc']],
   "columns": [
      {
          "data": "last_name" ,"render": function(data, type, row, meta){
              var str = '';
              str = row.lastname +' , '+ row.firstname;
              return str;
          }
      },
      {
         "data": "action", "render": function (data, type, row, meta) {
            var str = '';
            str += '<div class="actions">';
            if (row.status == 1) {
              str += '<button data-id="' + row.user_id + '"class="btn btn-sm btn-info viewuser"><abbr title="View User Details"><i class="fas fa-eye"></i></abbr></button>';
               str += '<button data-id="' + row.user_id + '"class="btn btn-sm btn-success edituser"><abbr title="Edit Account"><i class="fas fa-pen"></i></abbr></button>';
               str += '<button data-id="' + row.user_id + '"class="btn btn-sm btn-warning disableuser"><abbr title="Disable User"><i class="fas fa-window-close"></i></abbr></button>';
               str += '<button data-id="' + row.user_id + '"class="btn btn-sm btn-danger deleteuser"><abbr title="Delete Account"><i class="fas fa-trash"></i></abbr></button>';
            } else if (row.status == 2) {
                str += '<button data-id="' + row.user_id + '"class="btn btn-sm btn-info viewuser"><abbr title="View User Details"><i class="fas fa-eye"></i></abbr></button>';
                str += '<button data-id="' + row.user_id + '"class="btn btn-sm btn-warning enableuser"><abbr title="Enable User"><i class="fas fa-window-close"></i></abbr></button>';
                str += '<button data-id="' + row.user_id + '"class="btn btn-sm btn-danger deleteuser"><abbr title="Delete Account"><i class="fas fa-trash"></i></abbr></button>';
            }
            str += '</div>';
            return str;
         }
      },

      {
         "data": "status", "render": function (data, type, row, meta) {
            var str = '';
            if (row.status == 1) {
               str += '<span class="active btn btn-block btn-sm btn-success">Active</button>';
            } else if (row.status == 2) {
               str += '<span class="inactive btn btn-block btn-sm btn-danger">Inactive</button>';
            }
            return str;
         }
      }
   ],

   "ajax": {
      "url": base_url + "usermanagement/view_users/",
      "type": "POST"
   },
   //Set column definition initialisation properties.
   "columnDefs": [
      {
         "targets": [1, 2], //first column / numbering column
         "orderable": false, //set not orderable

      },
   ],
});

function blankVal_users() {
}
