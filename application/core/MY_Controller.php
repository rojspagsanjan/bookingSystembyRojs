<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MY_Controller extends MX_Controller {

	public function __construct(){
		$route = $this->router->fetch_class();
		$userlogged = $this->session->userdata();

		if($route == 'login'){
			if($this->session->has_userdata('logged_in')){
				redirect(base_url());
			}
		} else {
			if(!$this->session->has_userdata('logged_in')){
				redirect(base_url('login'));
			}
		}
	}

	public function load_page($page, $data = array()){
      	$this->load->view('includes/head',$data);
      	$this->load->view($page,$data);
      	$this->load->view('includes/footer',$data);
     }

		 public function load_login_page($page, $data = array()){
	       	$this->load->view('includes/login_head',$data);
	       	$this->load->view($page,$data);
	       	$this->load->view('includes/login_footer',$data);
	      }

		  public function validate_fields(){
			  $data['input_name']=array();
			  $data['input_error']=array();
			  $data['validation_status']=true;

			  foreach ($_POST as $key => $value) {
				  if ($value  ==  "") {
					  $data['input_name'][]       =  $key;
					  $data['input_error'][]      =  'Please enter '.ucfirst($key);
					  $data['validation_status']  =  false;
				  }
			  }
			  if ($data['validation_status']===false) {
				  $response = $this->response(false,'Something went wrong.',$data);
				  echo json_encode($response);
				  exit;
			  }
		  }

		  public function response($response_type,$msg='',$data=array()){
				  $response = array(
						 'response_status' => $response_type,
						 'message' => $msg,
						 'return'  => $data
				  );
				  return $response;
		  }

}
