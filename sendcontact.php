<?php
SESSION_START();

// setup the variables
define('DOMAIN','');
define('COMPANY','');
define('EMAIL','');

/* prevent XSS. */
$_GET   = filter_input_array(INPUT_GET, FILTER_SANITIZE_STRING);
$_POST  = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

// prevent direct access
$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND
strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
if(!$isAjax) {
  $user_error = 'Access denied - not an AJAX request...';
  die($user_error);
}

require('../includes/functions.php');
// okay so now we can validate the fields

if($_POST['secure_code'] == $_SESSION['captcha']['code']){
	$_SESSION['errorMsg'] = '';

	variableCheck('name',$_POST['name'],3,'STRING');
	variableCheck('email',$_POST['email'],0,'STRING');
	variableCheck('phone',$_POST['phone'],0,'STRING');
	variableCheck('findus',$_POST['findus'],0,'STRING');
	variableCheck('comment',$_POST['comment'],10,'STRING');

	$_SESSION['email'] = filter_var(trim($_POST['email']),FILTER_SANITIZE_EMAIL);
	if(!filter_var($_SESSION['email'],FILTER_VALIDATE_EMAIL)){
		$_SESSION['errorMsg'] .= '<br/>Email address is not of valid format.';
	}

	if($_SESSION['errorMsg'] == ''){
		// sendemail
		$subject = 'Contact Request From '.COMPANY;
		$to = EMAIL;
		$from = $_SESSION['email'];
		$content .= '<br/><label>Name:</label>'.$_SESSION['name'];
		$content .= '<br/><label>Email:</label>'.$_SESSION['email'];
		$content .= '<br/><label>Phone:</label>'.$_SESSION['phone'];
		$content .= '<br/><label>How did you hear about us?:</label>'.$_SESSION['findus'];
		$content .= '<br/><hr/>';
		$content .= '<br/><label>Message:</label><br/>'.$_SESSION['comment'];
		sendEmail($content,$subject,$to,$from,'message');

		$subject = 'Thank you for contacting '.COMPANY;
		$to = $_SESSION['email'];
		$from = 'website@'.DOMAIN;
		$content = '';
		sendEmail($content,$subject,$to,$from);

		// return success
		$data[0] = 'alert-success';
		$data[1] = '<i class="fa fa-thumbs-up"></i> Many Thanks for your enquiry.<br/>We will be in contact shortly.';
	} else {
		$data[0] = 'alert-danger';
		$data[1] = '<i class="fa fa-thumbs-down"></i> An error has occurred.<br/>'.$_SESSION['errorMsg'].'<br/>Please try again.';
	}
} else {
	$data[0] = 'alert-danger';
	$data[1] = '<i class="fa fa-thumbs-down"></i> An error has occurred.<br/>Captcha Code is Incorrect.<br/>Please try again.';
}

echo json_encode($data);