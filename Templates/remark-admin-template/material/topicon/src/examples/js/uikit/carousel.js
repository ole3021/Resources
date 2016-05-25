(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();

    // Example Slick Single Item
    // -------------------------
    $('#exampleSingleItem').slick();


    // Example Slick Multiple Items
    // ----------------------------
    $('#exampleMultipleItems').slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 3
    });

    // Example Slick Responsive Display
    // --------------------------------
    $('#exampleResponsive').slick({
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      responsive: [{
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        }, {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        }, {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });

    // Example Slick Variable Width
    // ----------------------------
    $('#exampleVariableWidth').slick({
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      centerMode: true,
      variableWidth: true
    });

    // Example Slick Adaptive Height
    // -----------------------------
    $('#exampleAdaptiveHeight').slick({
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      adaptiveHeight: true
    });


    // Example Slick Data Attribute Settings
    // -----------------------------
    $('#exampleData').slick();


    // Example Slick Center Mode
    // -------------------------
    $('#exampleCenter').slick({
      centerMode: true,
      centerPadding: '60px',
      slidesToShow: 3,
      responsive: [{
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 3
        }
      }, {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 1
        }
      }]
    });

    // Example Slick Lazy Loading
    // --------------------------

    $('#exampleLazy').slick({
      lazyLoad: 'ondemand',
      slidesToShow: 3,
      slidesToScroll: 1
    });


    // Example Slick Autoplay
    // ----------------------
    $('#exampleAutoplay').slick({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000
    });

    // Example Slick Fade
    // ------------------
    $('#exampleFade').slick({
      dots: true,
      infinite: true,
      speed: 500,
      fade: true,
      slide: 'div',
      cssEase: 'linear'
    });


    // Example Slick Add & Remove
    // --------------------------
    var slideIndex = 1;
    $('#exampleAddRemove').slick({
      dots: true,
      slidesToShow: 3,
      speed: 500,
      slidesToScroll: 3
    });

    $('#exampleAddSlide').on('click', function() {
      slideIndex++;
      $('#exampleAddRemove').slick('slickAdd', '<div><h3>' + slideIndex + '</h3></div>');
    });

    $('#exampleRemoveSlide').on('click', function() {
      $('#exampleAddRemove').slick('slickRemove', slideIndex - 1);
      if (slideIndex !== 0) {
        slideIndex--;
      }
    });


    // Example Slick Filtering
    // -----------------------
    $('#exampleFiltering').slick({
      slidesToShow: 4,
      slidesToScroll: 4
    });

    var filtered = false;
    $('#exampleFilter').on('click', function() {
      if (filtered === false) {
        $('#exampleFiltering').slick('slickFilter', ':even');
        $(this).text('Unfilter Slides');
        filtered = true;
      } else {
        $('#exampleFiltering').slick('slickUnfilter');
        $(this).text('Filter Slides');
        filtered = false;
      }
    });

  });

})(document, window, jQuery);
