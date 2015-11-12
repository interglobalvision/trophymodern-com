<?php

// basic check if submission is from correct address [not solid but added security layer]
  if (isset($_SERVER['HTTP_ORIGIN'])) {
    if (strpos($_SERVER['SERVER_NAME'], $_SERVER['HTTP_ORIGIN'])) {

      header('content-type: application/json; charset=utf-8');
      $json = json_encode(array('code' => 7));
      echo isset($_GET['callback'])
        ? "{$_GET['callback']}($json)"
        : $json;
      exit();

    }
  }

// check submission form send button value as hidden value [not solid but added security layer]
  if ($_POST['hidden'] != 'M3vd26fg8e804ay') {

    header('content-type: application/json; charset=utf-8');
    $json = json_encode(array('code' => 3));
    echo isset($_GET['callback'])
      ? "{$_GET['callback']}($json)"
      : $json;
    exit();

  };

// get secure details from php kept out of git
  require('../../../../wp-load.php');

  $mail_server = IGV_get_option('_igv_email_server');
  $mail_username = IGV_get_option('_igv_email_account');
  $mail_password = IGV_get_option('_igv_email_password');
  $mail_delivery = IGV_get_option('_igv_email_delivery');

  if (empty($mail_server) || empty($mail_username) || empty($mail_password) || empty($mail_delivery)) {

    header('content-type: application/json; charset=utf-8');
    $json = json_encode(array('code' => 11));
    echo isset($_GET['callback'])
      ? "{$_GET['callback']}($json)"
      : $json;
    exit();

  }

  if (empty($_POST['name']) || empty($_POST['email']) || empty($_POST['message'])) {

    header('content-type: application/json; charset=utf-8');
    $json = json_encode(array('code' => 666));
    echo isset($_GET['callback'])
      ? "{$_GET['callback']}($json)"
      : $json;
    exit();

  }

// load mailer lib
  require('PHPMailer/PHPMailerAutoload.php');

// set values from _POST
  if (!empty($_POST['name'])) {
    $name = strip_tags($_POST['name']);
  }
  if (!empty($_POST['email'])) {
    $email = strip_tags($_POST['email']);
  }
  if (!empty($_POST['message'])) {
    $message = strip_tags($_POST['message']);
  }

  $mail = new PHPMailer;

//  $mail->SMTPDebug = 3;                                 // Enable verbose debug output
  $mail->isSMTP();                                      // Set mailer to use SMTP
  $mail->Host = $mail_server . ';' . $mail_server;      // Specify main and backup SMTP servers
  $mail->SMTPAuth = true;                               // Enable SMTP authentication
  $mail->Username = $mail_username;                     // SMTP username
  $mail->Password = $mail_password;                     // SMTP password
  $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
  $mail->Port = 587;                                    // TCP port to connect to

  $mail->setFrom($email, $name);
  $mail->addAddress($mail_delivery, 'Trophy Modern Webform');     // Add a recipient
  $mail->addReplyTo($email, $name);

  $mail->isHTML(true);                                  // Set email format to HTML

  $mail->Subject = 'Trophy Modern Inquiries from ' . $name;
  $mail->Body    = $message;
  $mail->AltBody = $message;

  if (!$mail->send()) {

    header('content-type: application/json; charset=utf-8');
    $json = json_encode(array('code' => 5, 'error' => $mail->ErrorInfo));
    echo isset($_GET['callback'])
      ? "{$_GET['callback']}($json)"
      : $json;

  } else {

    header('content-type: application/json; charset=utf-8');
    $json = json_encode(array('code' => 1));
    echo isset($_GET['callback'])
      ? "{$_GET['callback']}($json)"
      : $json;

  }