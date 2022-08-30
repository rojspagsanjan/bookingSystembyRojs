<script src="<?php echo base_url('static/js/jquery.min.js'); ?>"></script>
<script>
    var base_url = '<?php echo base_url(); ?>';
    $(document).ready(function(){
        $(document).on('submit','.login_form',function(e){
            e.preventDefault();
            var fd = new FormData($(this)[0]);
            $.ajax({
                url: $(this).attr('action'),
                data: fd,
                processData: false,
                contentType: false,
                type: 'POST',
                beforeSend: function(){
                    $('button[name="login_btn"]').html('<i class="fa fa-spinner fa-spin"></i> Logging in');
                    $('button[name="login_btn"]').attr('disabled',true);
                },
                success: function(data){
                    var obj = $.parseJSON(data);
                    if(obj.result == '1'){
                        window.location.href=base_url;
                    } else {
                        $('.msg_div').html('<div class="response-div">'+obj.result.msg+'</div>');
                    }
                    $('button[name="login_btn"]').html('Login Now');
                    $('button[name="login_btn"]').attr('disabled',false);
                }
            });
        });
    });
</script>
