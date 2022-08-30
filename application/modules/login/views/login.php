<div class="limiter">
		<div class="container-login100">
			<div class="wrap-login100">
        <div class="login-left">
  				<div class="login100-pic js-tilt" data-tilt>
  					<img src="<?php echo base_url('assets/dist/img/logo-ipad.png'); ?>" alt="IMG">
  				</div>
      </div>

        <div class="login-right">
            <?php echo form_open('auth',array('class' => 'login100-form validate-form')); ?>
          <span class="login100-form-title1">
            <img src="<?php echo base_url('assets/dist/img/logo-ipad.png'); ?>"
            class="logo-login" alt="Cloud Panda Logo">
          </span>
          <span class="login100-form-title">
             Login
            </span>

            <?php if(!empty($success)){ ?>
                 <div class="success" style="border: 1px solid rgba(0,0,0,0.2);border-radius: 1px;padding: 12px;width: 100%;margin-bottom: 15px;background-color: #fff;border-left: 9px solid #09691d;background-color: #85ca68;color: white;">
                      <?php echo $success; ?>
                 </div>
            <?php } ?>
           <?php if(!empty($msg)): ?>
                <div class="response-div">
                     <?php echo $msg; ?>
                </div>
           <?php endif; ?>

					<div class="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
						<input class="input100" type="text" id="username" name="username" placeholder="Username">
						<span class="focus-input100"></span>
						<span class="symbol-input100">
							<i class="fa fa-user" aria-hidden="true"></i>
						</span>
					</div>

					<div class="wrap-input100 validate-input" data-validate = "Password is required">
						<input class="input100" type="password" id="password" name="password" placeholder="Password">
						<span class="focus-input100"></span>
						<span class="symbol-input100">
							<i class="fa fa-lock" aria-hidden="true"></i>
						</span>
					</div>

					<div class="container-login100-form-btn">
						<button class="login100-form-btn" type="submit">
							Login
						</button>
					</div>

					<div class="text-center p-t-12">
					</div>

					<div class="text-center p-t-136">
					</div>
				</form>
      </div>
			</div>
		</div>
	</div>
