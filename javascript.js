// ================================
    // Contact Form Ajax and Validation
    // ================================
        function isValidEmailAddress(emailAddress) {
            var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
            return pattern.test(emailAddress);
        };

        $('#contactSubmit').click(function(e){
            var error = 0;
            var msg = 'The following Errors Have Occured:\n\n';

            // check input fields
            $(':input[required]',$(this).closest('form')).each(function(){
                $(this).closest('.form-group').removeClass('has-error');
                reqdL = $(this).attr('minlength');
                if(reqdL == null) { reqdL == 1 }
                if($(this).val().length < reqdL){
                    $(this).closest('.form-group').addClass('has-error');
                    msg += '\n' + $(this).attr('placeholder') + ' Is A Required Field of at least '+ reqdL + ' Characters';
                    error++;
                }
            });

            // check email box
            if(!isValidEmailAddress($('#email').val())) {
                $(this).closest('.form-group').addClass('has-error');
                msg += '\n' + 'Email Address appears to be invalid';
                error++;
            } else {
                $(this).closest('.form-group').removeClass('has-error');
            }

            // check select boxes
            $('select',$(this).closest('form')).each(function(){
                $(this).closest('.form-group').removeClass('has-error');
                if($(this).val().length < 2){
                    $(this).closest('.form-group').addClass('has-error');
                    msg += '\n' + 'Please choose an option from '+ $(this).attr('placeholder');
                    error++;
                }
            });

            // check text area
            $('textarea',$(this).closest('form')).each(function(){
                $(this).closest('.form-group').removeClass('has-error');
                if($(this).val().length < 10){
                    $(this).closest('.form-group').addClass('has-error');
                    msg += '\n' + 'Please add text to the '+ $(this).attr('placeholder') + ' text box.';
                    error++;
                }
            });

            if(error != 0){
               alert(msg);
               return false;
            } else {
                // form is good to submit
                // return True // Use if submitting normally
                e.preventDefault(); // use if ajaxing the form
                $('#contactSubmit').html('Sending.. <i class="fa fa-refresh fa-spin"></i>');
                $.ajax({
                    url : 'ajax/sendcontact.php',
                    type: 'post',
                    dataType:'JSON',
                    data: $(this).closest('form').serialize(),
                    success:function(data){
                        $('#submitArea').hide().html('<div class="alert '+data[0]+'">' + data[1] + '</div>').slideDown('slow');
                        if(data[0] == 'alert-success'){
                            $('#contactSubmit').hide();
                        } else {
                            $('#contactSubmit').html('Submit Question. <i class="fa fa-envelope"></i>');
                        }
                    }
                });
            }
    });