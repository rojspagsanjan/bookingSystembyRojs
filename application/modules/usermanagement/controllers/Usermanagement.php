<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Usermanagement extends MY_Controller{

    public function index(){

        $this->load_page('usermanagement');
    }
// Add user
    public function addUser(){

        $this->validate_fields();

        $username = $this->input->post('username');
		$parameters['where'] = array('username' => $username);
		$parameters['select'] = 'username';
		$username_exist = $this->MY_Model->getRows('users',$parameters);

        $count_username = count($username_exist);

        if ($count_username) {
            $response = array('username_error' =>  'Username already exists!' );
            echo json_encode($response);
        }elseif (strlen($_POST['username']) < 6) {
            $response = array('username_error' =>  'Username must atleast 6 characters long' );
            echo json_encode($response);
        }elseif (strlen($_POST['password']) <10 ) {
            $response = array('password_error' =>  'Password must atleast 10 characters long' );
            echo json_encode($response);
        }  else {
        $data = array(
            'firstname'                    => $this->input->post('firstname'),
            'lastname'                     => $this->input->post('lastname'),
            'username'                     => $this->input->post('username'),
            'password'                     => password_hash($this->input->post('password'),PASSWORD_DEFAULT),
            'bu_password'                  => $this->input->post('password')
        );


        $insert = $this->MY_Model->insert('users',$data);
          if ($insert) {
                 echo json_encode( array ('status'=>true));
          }
      }

    }

// View User
public function view_users(){
			$limit = $this->input->post('length');
			$offset = $this->input->post('start');
			$search = $this->input->post('search');
			$order = $this->input->post('order');
			$draw = $this->input->post('draw');

			$column_order = array('firstname', 'lastname');
		 	$where = array('status !=' => 3, 'usertype' => 2);
			$join = array();
			$select = "*";

			$list = $this->MY_Model->get_datatables('users',$column_order, $select, $where, $join, $limit, $offset ,$search, $order);

			$output = array(
					"draw" => $draw,
					"recordsTotal" => $list['count_all'],
					"recordsFiltered" => $list['count'],
					"data" => $list['data']
			);

			echo json_encode($output);
}

public function view_all_users(){
        $id = $this->input->post('user_id');

        $data_array = array();
        $parameters['select'] = '*';
        $parameters['where'] = array('user_id' => $id);
        $data = $this->MY_Model->getrows('users',$parameters,'row');

        $data_array['users'] = $data;
        json($data_array);

}

public function edit_user(){

        $user_id = $this->input->post('user_id');

        $post = $this->input->post();
        $result = false;

        if (!empty($post)) {
            $data = array(
                'lastname'                     => $this->input->post('lastname'),
                'firstname'                    => $this->input->post('firstname'),
                'username'                     => $this->input->post('username'),
                'bu_password'                  => $this->input->post('password'),
                'password'                     => password_hash($this->input->post('password'),PASSWORD_DEFAULT),
            );

            $update = $this->MY_Model->update('users', $data, array('user_id' => $user_id));

            if ($update) {
                $response = array('status' => 'ok');
            }else {
                $response = array('status' => 'invalid');
            }
                $result = json_encode($response);
            }
        die($result);
    }

    public function disable_user(){

            $user_id = $this->input->post('user_id');
            $status = 2;
            $data = array(
                'status' => $status
            );

            $datas['delete'] = $this->MY_Model->update('users',$data,array('user_id' => $user_id));
            echo json_encode($datas);
    }

    public function enable_user(){

            $user_id = $this->input->post('user_id');
            $status = 1;
            $data = array(
                'status' => $status
            );
            $datas['delete'] = $this->MY_Model->update('users',$data,array('user_id' => $user_id));
            echo json_encode($datas);
    }

    public function delete_user(){

            $user_id = $this->input->post('user_id');
            $status = 3;
            $data = array(
                'status' => $status
            );
            $datas['delete'] = $this->MY_Model->update('users',$data,array('user_id' => $user_id));
            echo json_encode($datas);
    }



}
 ?>
