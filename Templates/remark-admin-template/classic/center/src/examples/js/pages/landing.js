(function(document, window, $) {

  $(document).ready(function() {
    $.components.init('appear');

    var slider_messages = $(".slider-messages"),
      slider_nav = $(".slider-nav");

    slider_messages.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: '.slider-nav'
    });

    slider_nav.slick({
      dots: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      focusOnSelect: true,
      asNavFor: '.slider-messages',
      responsive: [{
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      }, {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }, {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }]
    });
  });


  $('body').asScroll();

  $('#landingNav a').on('click', function() {
    var target = $(this).attr('href').replace('#', '');
    $('body').data('asScroll').scrollYToTarget(target);
  });

  $('#landingNav').on('hide.bs.collapse', function() {
    $(this).removeClass('nav-open');
  });
  $('#landingNav').on('show.bs.collapse', function() {
    $(this).addClass('nav-open');
  });

  var homeHeight = $('.home').height();

  function updateNav() {
    var scrollTop = window.scrollY;
    if (scrollTop > (homeHeight / 10)) {
      $('#landingNav').addClass('is-scroll');
    } else {
      $('#landingNav').removeClass('is-scroll');
    }
  }

  updateNav();
  $(window).on('scroll', function() {
    updateNav();
  });

  if (!$('html').hasClass('touch')) {
    $(window).on('scroll', function() {
      var scrollTop = $('body')[0].scrollTop;
      if (scrollTop > homeHeight) return;

      $('.home').css('background-position-y', scrollTop);
    });
  }

})(document, window, jQuery);
