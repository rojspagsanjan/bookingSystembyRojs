<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-sm-6">
          <h1> Users</h1>
          User Management > <span class="active1"> USERS </p>
        </div>
        <div class="col-sm-6">
          <button class="users button1 float-sm-right" data-toggle="modal" data-target="#Add_hr_user"><i
              class="fas fa-plus-circle" aria-hidden="true"></i> Add User </button>

          <!--Add User Modal -->
          <!-- Modal -->
          <div class="modal fade" id="Add_hr_user" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"aria-hidden="true">\
            <form id="add_user" method="post">
              <div class="modal-dialog modal-s" role="document">
                <div class="modal-content">
                  <div class="modal-header bg-info1">
                    <h5 class="modal-title" id="exampleModalLabel">Add User</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                  <div class="row">
                    <div class="col-12">
                      <div class="form-group">
                        <label for="firstname">First Name: <span class="required">*</span></label>
                        <input type="text" class="form-control" name="firstname" value="">
                        <span class="err"></span>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12">
                      <div class="form-group">
                        <label for="lastname">Last Name: <span class="required">*</span></label>
                        <input type="text" class="form-control" name="lastname" value="">
                        <span class="err"></span>
                      </div>
                    </div>
                  </div>
                    <div class="row">
                      <div class="col-12">
                        <div class="form-group">
                          <label for="username">Username: <span class="required">*</span></label>
                          <input type="text" class="form-control" name="username" value="">
                          <span class="err"></span>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <div class="form-group">
                          <label for="password">Password: <span class="required">*</span></label>
                          <input type="password" class="form-control" name="password" value="">
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
          <!-- End Add user Modal -->

          <!-- Edit User -->
          <div class="modal fade" id="Edituser" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"aria-hidden="true">\
            <form id="edituser" method="post">
              <div class="modal-dialog modal-s" role="document">
                <div class="modal-content">
                  <div class="modal-header bg-info1">
                    <h5 class="modal-title" id="exampleModalLabel">Edit User</h5>
                    <input type="hidden" class="form-control user_edit_id" name="user_edit_id" value="">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                      <div class="row">
                        <div class="col-12">
                          <div class="form-group">
                            <label for="firstname">First Name:</label>
                            <input type="text" class="form-control" name="firstname" value="">
                            <span class="err"></span>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-12">
                          <div class="form-group">
                            <label for="lastname">Last Name: </label>
                            <input type="text" class="form-control" name="lastname" value="">
                            <span class="err"></span>
                          </div>
                        </div>
                      </div>
                        <div class="row">
                          <div class="col-12">
                            <div class="form-group">
                              <label for="username">Username:</label>
                              <input type="text" class="form-control" name="username" value="">
                              <span class="err"></span>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-12">
                            <div class="form-group">
                              <label for="password">Password: </label>
                              <input type="text" class="form-control" name="password" value="">
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
          <!-- End User -->

          <!-- View User Details -->
          <div class="modal fade" id="View_user" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"aria-hidden="true">\
            <form id="view_user" method="post">
              <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                  <div class="modal-header bg-info1">
                    <h5 class="modal-title" id="exampleModalLabel">View User Details</h5>
                    <input type="hidden" class="form-control edit_id" name="edit_id" value="">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                      <div class="row equal">
                          <div class="col-md-12">
                              <div class="box">
                                  <div class="box-body">
                                      <table class="table table-condensed">
                                          <tbody>
                                              <tr><td class="field-label">Last Name</td><td class="lastname"></td></tr>
                                              <tr><td class="field-label">First Name</td><td class="firstname"></td></tr>
                                              <tr><td class="field-label">Username</td><td class="username"></td></tr>
                                              <tr><td class="field-label">Password</td><td class="password"></td></tr>
                                          </tbody>
                                      </table>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <!-- End View User Details -->

          <!-- End Add Delete Modal -->
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
                <table class="table table-bordered table-striped dataTable user_table" role="grid" aria-describedby="example1_info">
                  <thead>
                    <th class="header-title">Name</th>
                    <th class="header-title">Action</th>
                    <th class="header-title">Status</th>
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
