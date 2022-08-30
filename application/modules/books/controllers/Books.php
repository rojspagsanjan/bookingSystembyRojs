<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Books extends MY_Controller{

    public function index(){
        $this->load_page('books');
    }

    public function addBooks(){
        $userdata = $this->session->userdata('username');
        $this->validate_fields();

        $data = array(
            'title'                         => $this->input->post('title'),
            'author'                        => $this->input->post('author'),
            'price'                         => $this->input->post('price'),
            'stocks'                        => $this->input->post('stocks'),
            'addedby'                       => $userdata
        );

        $insert = $this->MY_Model->insert('books',$data);
          if ($insert) {
                 echo json_encode( array ('status'=>true));
          }

    }

    public function viewbooks_tbl(){
        $userdata = $this->session->userdata('username');
		$limit = $this->input->post('length');
		$offset = $this->input->post('start');
		$search = $this->input->post('search');
		$order = $this->input->post('order');
		$draw = $this->input->post('draw');

		$column_order = array('title', 'author', 'price', 'stocks');
	 	$where = array('status' => 1, 'addedby' => $userdata);
		$join = array();
		$select = "*";

		$list = $this->MY_Model->get_datatables('books',$column_order, $select, $where, $join, $limit, $offset ,$search, $order);

		$output = array(
				"draw" => $draw,
				"recordsTotal" => $list['count_all'],
				"recordsFiltered" => $list['count'],
				"data" => $list['data']
		);

		echo json_encode($output);
    }


    public function view_all_books(){
        $id = $this->input->post('book_id');

        $data_array = array();
        $parameters['select'] = '*';
        $parameters['where'] = array('book_id' => $id);
        $data = $this->MY_Model->getrows('books',$parameters,'row');

        $data_array['books'] = $data;
        json($data_array);

    }

    public function edit_books(){

        $book_id = $this->input->post('book_id');
        $post = $this->input->post();
        $result = false;

        if (!empty($post)) {
            $data = array(
                'title'                         => $this->input->post('title'),
                'author'                        => $this->input->post('author'),
                'price'                         => $this->input->post('price'),
                'stocks'                        => $this->input->post('stocks'),
            );

            $update = $this->MY_Model->update('books', $data, array('book_id' => $book_id));

            if ($update) {
                $response = array('status' => 'ok');
            }else {
                $response = array('status' => 'invalid');
            }

            $result = json_encode($response);
        }
        die($result);
    }

    public function delete_books(){
        $book_id = $this->input->post('book_id');
        $status = 2;
        $data = array(
            'status' => $status
        );
        $datas['delete'] = $this->MY_Model->update('books',$data,array('book_id' => $book_id));
        echo json_encode($datas);
    }



}
 ?>
