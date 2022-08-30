var base_url = $('input[name="base_url"]').val();
    $(document).ready(function(){

        // add books
        $(document).on('submit','form#addBook', function(e){
            e.preventDefault();
            let formData = $(this).serialize();

            $.ajax({
                method:'POST',
                url: base_url + 'books/addBooks',
                data: formData,
                dataType: 'json',
                success: function(response){
                    console.log(response);
                    if (response.status == true) {
                        Swal.fire("Successfully added Book!",'Success',"Success")
                        .then((result) => {
                          location.reload();
                        });
                        blankVal_users();
                    } else if(response.error){
                        Swal.fire("Error",response.error,"error");
                    } else {
                          for (var i = 0; i < response.return.input_name.length; i++) {
                              console.log( response.return.input_name[i], response.return.input_error[i]);
                              $("input[name="+response.return.input_name[i]+"]").css('border-color', 'red');
                          }
                          Swal.fire("Please fill out all fields", 'Error', "error");
                    }
                    $(".books_table").DataTable().ajax.reload();
                }
            })
        })

        // view edit Books
        $(document).on("click", ".editbooks", function(){
            var book_id = $(this).attr('data-id');
            $.ajax({
                method:'POST',
                url: base_url + 'books/view_all_books',
                dataType: 'json',
                data: {book_id:book_id},
                success: function(data){
                    console.log(data);
                    $('#Editbooks').modal('show');
                    $('#Editbooks .book_edit_id').val(book_id);
                    $('#Editbooks input[name="title"]').val(data.books.title);
                    $('#Editbooks input[name="author"]').val(data.books.author);
                    $('#Editbooks input[name="price"]').val(data.books.price);
                    $('#Editbooks input[name="stocks"]').val(data.books.stocks);
                }
            })
        });

        // Submit Edit Books
        $(document).on("submit","#editbooks", function(e){
            e.preventDefault();

            let formData = new FormData($(this)[0]);
            var book_id = $('input[name="book_edit_id"]').val();
            formData.append("book_id", book_id);
            $.ajax({
               method: 'POST',
               url: base_url + 'books/edit_books',
               data: formData,
               processData: false,
               contentType: false,
               cache: false,
               dataType: 'json',
               success: function (data) {
                  if (data.status == "ok") {
                     $('#Editbooks').modal('hide');
                     Swal.fire("Books has been updated!", data.success, "success");
                     $(".books_table").DataTable().ajax.reload();
                  } else if (data.status == 'invalid') {
                     Swal.fire("Error", data.status, "invalid");
                  }
               }
            })

        })

        // delete books
        $(document).on("click", ".deletebooks", function (e) {
           e.preventDefault();
           var book_id = $(this).attr('data-id');

           Swal.fire({
              title: 'Are you sure?',
              text: "You want to Delete this Book",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#068101',
              confirmButtonText: 'Yes, Delete Book!'
           }).then((result) => {
              if (result.value) {
                 Swal.fire(
                    'Deleted!',
                    'Successfull Deleted Book!',
                    'success'
                 )
                 $.ajax({
                    type: 'POST',
                    url: base_url + 'books/delete_books',
                    data: { book_id: book_id },
                    success: function (data) {
                       $(".books_table").DataTable().ajax.reload();
                    }
                 })
              }
           });
        });

    })


    var books_table = $('.books_table').DataTable({
       "responsive": true,
       "processing": true,
       "serverside": true,
       "order": [[0, 'desc']],
       "columns": [
          {"data": "title"},
          {"data": "author"},
          {"data": "price"},
          {"data": "stocks"},
          {
             "data": "action", "render": function (data, type, row, meta) {
                var str = '';
                str += '<div class="actions">';
                   str += '<button data-id="' + row.book_id + '"class="btn btn-sm btn-warning editbooks"><abbr title="Edit Books"><i class="fas fa-pen"></i></abbr></button>';
                   str += '<button data-id="' + row.book_id + '"class="btn btn-sm btn-danger deletebooks"><abbr title="Delete Books"><i class="fas fa-trash"></i></abbr></button>';
                str += '</div>';
                return str;
             }
          },

       ],

       "ajax": {
          "url": base_url + "books/viewbooks_tbl/",
          "type": "POST"
       },
       //Set column definition initialisation properties.
       "columnDefs": [
          {
             "targets": [4], //first column / numbering column
             "orderable": false, //set not orderable

          },
       ],
    });
