<form id="form-inquiries" class="font-color-black" method="post" action="<?php bloginfo('stylesheet_directory'); ?>/lib/PHPMailer/_igv_send.php">

  <h4 class="font-color-red u-align-center">Inquiries?</h4>

  <input type="text" name="name" placeholder="name" />
  <input required type="email" name="email" placeholder="email" />
  <textarea name="message" rows="7" placeholder="message"></textarea>
  <button class="u-pointer" type="submit">Send</button>

</form>