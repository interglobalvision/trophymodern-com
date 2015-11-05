<form id="form-inquiries" class="font-color-black" method="post" action="<?php bloginfo('stylesheet_directory'); ?>/lib/PHPMailer/_igv_send.php">
  <input type="hidden" name="hidden" value="M3vd26fg8e804ay">

  <h4 class="font-color-red u-align-center">Inquiries?</h4>

  <div id="form-inquiries-inputs">

    <input type="text" name="name" placeholder="name" />

    <input required type="email" name="email" placeholder="email" />

    <textarea name="message" rows="7" placeholder="message"></textarea>

    <button id="form-inquiries-submit" class="u-pointer" type="submit">Send</button>

  </div>

  <div id="form-inquiries-output">

    Thanks for your inquiry. We will get back to you as soon as possible.

  </div>

</form>