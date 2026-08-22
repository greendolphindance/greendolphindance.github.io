 (function($) {
     // When to show the scroll link
     // higher number = scroll link appears further down the page
     var upperLimit = 1000; // 您可以根据需要调整此值
     
     // Our scroll link element
     var scrollElem = $('#totop');
     
     // Scroll to top speed
     var scrollSpeed = 500;
     
     // Hide the scroll to top link initially
     scrollElem.hide();
     
     $(window).scroll(function () {
         var scrollTop = $(document).scrollTop();
         if (scrollTop > upperLimit) {
             $(scrollElem).stop().fadeIn(300); // fade in
         } else {
             $(scrollElem).stop().fadeOut(300); // fade out and hide
         }
     });
     
     // Scroll to top animation on click
     $(scrollElem).click(function(){
         $('html, body').animate({scrollTop:0}, scrollSpeed); return false;
     });
 })(jQuery);
