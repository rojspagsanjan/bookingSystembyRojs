<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-sm-6">
          <h1> Books</h1>
          Library > <span class="active1"> BOOKS </p>
        </div>
        <div class="col-sm-6">
          <button class="users button1 float-sm-right" data-toggle="modal" data-target="#Add_book"><i
              class="fas fa-plus-circle" aria-hidden="true"></i> Add Books </button>
          <!--Add Books Modal -->
          <!-- Modal -->
          <div class="modal fade" id="Add_book" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"aria-hidden="true">\
            <form id="addBook" method="post">
              <div class="modal-dialog modal-s" role="document">
                <div class="modal-content">
                  <div class="modal-header bg-info1">
                    <h5 class="modal-title" id="exampleModalLabel">Add Books</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                  <div class="row">
                    <div class="col-12">
                      <div class="form-group">
                        <label for="title">Title: <span class="required">*</span></label>
                        <input type="text" class="form-control" name="title" value="">
                        <span class="err"></span>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12">
                      <div class="form-group">
                        <label for="author">Author: <span class="required">*</span></label>
                        <input type="text" class="form-control" name="author" value="">
                        <span class="err"></span>
                      </div>
                    </div>
                  </div>
                  <label for="price">Price: <span class="required">*</span></label>
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text">₱</span>
                      </div>
                     <input type="number" class="form-control" name="price" aria-label="Amount (to the nearest dollar)">
                      <span class="err"></span>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <div class="form-group">
                          <label for="stocks">Stocks: <span class="required">*</span></label>
                          <input type="number" class="form-control" name="stocks" value="">
                          <span class="err"></span>
                        </div>
                      </div>
                    </div>
                  <div class="modal-footer">
                    <button type="submit" class="btn btn-primary add">Submit</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
      </div>
          <!-- End Add Books Modal -->

          <!-- Edit Books -->
          <div class="modal fade" id="Editbooks" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"aria-hidden="true">\
            <form id="editbooks" method="post">
              <div class="modal-dialog modal-s" role="document">
                <div class="modal-content">
                  <div class="modal-header bg-info1">
                    <h5 class="modal-title" id="exampleModalLabel">Edit Books</h5>
                    <input type="hidden" class="form-control book_edit_id" name="book_edit_id" value="">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                      <div class="row">
                        <div class="col-12">
                          <div class="form-group">
                            <label for="title">Title: <span class="required">*</span></label>
                            <input type="text" class="form-control" name="title" value="">
                            <span class="err"></span>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-12">
                          <div class="form-group">
                            <label for="author">Author: <span class="required">*</span></label>
                            <input type="text" class="form-control" name="author" value="">
                            <span class="err"></span>
                          </div>
                        </div>
                      </div>
                      <label for="price">Price: <span class="required">*</span></label>
                        <div class="input-group mb-3">
                          <div class="input-group-prepend">
                            <span class="input-group-text">₱</span>
                          </div>
                         <input type="number" class="form-control" name="price" aria-label="Amount (to the nearest dollar)">
                          <span class="err"></span>
                        </div>
                        <div class="row">
                          <div class="col-12">
                            <div class="form-group">
                              <label for="stocks">Stocks: <span class="required">*</span></label>
                              <input type="number" class="form-control" name="stocks" value="">
                              <span class="err"></span>
                            </div>
                          </div>
                        </div>
                  </div>
                  <div class="modal-footer">
                    <button type="submit" class="btn btn-primary add">Submit</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <!-- End Books -->
        </div>
      </div>
    </div><!-- /.container-fluid -->
  </section>

  <!-- Main content -->
  <section class="content">
    <div class="card">
      <!-- /.card-header -->
      <div class="card-body1">
        <div id="example1_wrapper" class="dataTables_wrapper dt-bootstrap4">
          <div class="row">.
            <div class="table-responsive">
              <div class="col-sm-12">
                <table class="table table-bordered table-striped dataTable books_table" role="grid" aria-describedby="example1_info">
                  <thead>
                    <th class="header-title">Title</th>
                    <th class="header-title">Author</th>
                    <th class="header-title">Price (₱)</th>
                    <th class="header-title">Stocks</th>
                    <th class="header-title">Actions</th>
                  </thead>
                  <tbody>

                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
      <!-- /.card-body -->
    </div>
  </section>
  <!-- /.content -->
</div>
<!-- /.content-wrapper -->
