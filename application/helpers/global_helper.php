<?php
	defined('BASEPATH') OR exit('No direct script access allowed');

	if(!function_exists('response')) {
		function response($response = null,$type = '',$msg = ''){
			$_response = array();
			if(is_array($response)){
				$_response['response'] 	= !empty($response['response']) ? $response['response'] : null;
				$_response['type'] 		= !empty($response['type']) ? $response['type'] : null;
				$_response['msg'] 		= !empty($response['msg']) ? $response['msg'] : null;
			} else {
				$_response['response'] 	= $response;
				$_response['type'] 		= $type;
				$_response['msg'] 		= $msg;
			}
			json($_response);
	    }
	}

	//Query Builder

	if(!function_exists('last_query')) {
		function last_query(){
			$ci =& get_instance();
	        echo $ci->db->last_query();
	    }
	}

	if(!function_exists('raw')) {
		function raw($query,$result = 'array'){
			$ci =& get_instance();
	        return $ci->MY_Model->raw($query,$result);
	    }
	}

	if(!function_exists('getrow')) {
		function getrow($table,$options = array(),$result = 'array'){
			$ci =& get_instance();
			return $ci->MY_Model->getRows($table,$options,$result);
		}
	}

	if(!function_exists('datatables')){
		function datatables($table, $column_order, $select = "*", $where = "", $join = array(), $limit, $offset, $search, $order,$group = ''){
			$ci =& get_instance();
			return $ci->MY_Model->get_datatables($table, $column_order, $select, $where, $join, $limit, $offset, $search, $order,$group);
	    }
	}

	if(!function_exists('insert')) {
		function insert($table,$data){
			$ci =& get_instance();
	        return $ci->MY_Model->insert($table,$data);
	    }
	}

	if(!function_exists('batch_insert')) {
		function batch_insert($table,$data){
			global $ci;
	        $ci->MY_Model->batch_insert($table, $data);
	        return true;
	    }
	}

	if(!function_exists('update')) {
		function update($table,$set,$where){
			$ci =& get_instance();
	        $ci->MY_Model->update($table,$set,$where);
	        return true;
	    }
	}

	if(!function_exists('delete')) {
		function delete($table,$where){
			$ci =& get_instance();
	        $ci->MY_Model->delete($table,$where);
	        return true;
	    }
	}

	//End of Query Builder

	if(!function_exists('post')) {
		function post($key,$xss_filter = false){
	        $ci =& get_instance();
			return ($ci->input->post($key)) ? $ci->input->post($key, $xss_filter) : $ci->input->post();
	    }
	}

	if(!function_exists('json')) {
		function json($data,$isJson = true){
			if($isJson){
				echo json_encode($data);
			} else {
				echo "<pre>";
				print_r($data);
				echo "</pre>";
			}
		}
	}

	if (!function_exists('session')) {
		function session($session_key){
			$ci =& get_instance();
			return (!empty($ci->session->$session_key)) ? $ci->session->$session_key : "Session named {$session_key} is not set";
		}
	}

	if(!function_exists('fetch_class')) {
		function fetch_class(){
	        $ci =& get_instance();
			return $ci->router->fetch_class();
	    }
	}

	if(!function_exists('fetch_method')) {
		function fetch_method(){
	        $ci =& get_instance();
			return $ci->router->fetch_method();
	    }
	}

	if ( ! function_exists('userType'))
	{
	    function userType($k = '')
	    {
	        $type = array(
	            1 => 'Admin',
	            2 => 'Encoder',
	            3 => 'Salesman',
	            4 => 'Warehouse Personnel',
	            5 => 'Delivery Personnel'
	        );

	        return $k == '' ? $type : $type[$k];
	    }
	}
?>
