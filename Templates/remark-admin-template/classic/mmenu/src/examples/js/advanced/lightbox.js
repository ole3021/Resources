(function(document, window, $) {
  'use strict';

  var Site = window.Site;


  $(document).ready(function($) {
    Site.run();
  });


  // Example Popup Zoom Gallery
  // --------------------------
  $('#exampleZoomGallery').magnificPopup({
    delegate: 'a',
    type: 'image',
    closeOnContentClick: false,
    closeBtnInside: false,
    mainClass: 'mfp-with-zoom mfp-img-mobile',
    image: {
      verticalFit: true,
      titleSrc: function(item) {
        return item.el.attr('title') + ' &middot; <a class="image-source-link" href="' + item.el.attr('data-source') + '" target="_blank">image source</a>';
      }
    },
    gallery: {
      enabled: true
    },
    zoom: {
      enabled: true,
      duration: 300, // don't foget to change the duration also in CSS
      opener: function(element) {
        return element.find('img');
      }
    }
  });


  // Example Popup Gallery
  // ---------------------
  $('#exampleGallery').magnificPopup({
    delegate: 'a',
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    mainClass: 'mfp-img-mobile',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
      titleSrc: function(item) {
        return item.el.attr('title') + '<small>by amazingSurge</small>';
      }
    }
  });


  // Example Popup With Css Animation
  // --------------------------------
  $('.popup-with-css-anim').magnificPopup({
    type: 'image',
    removalDelay: 500,
    preloader: true,
    callbacks: {
      beforeOpen: function() {
        this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
        this.st.mainClass = this.st.el.attr('data-effect');
      }
    },
    closeOnContentClick: true,
    midClick: true
  });


  // Example Popup With Video Rr Map
  // -------------------------------
  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,

    fixedContentPos: false
  });


  // Example Popup With Video Rr Map
  // -------------------------------
  $('#examplePopupForm').magnificPopup({
    type: 'inline',
    preloader: false,
    focus: '#inputName',

    // When elemened is focused, some mobile browsers in some cases zoom in
    // It looks not nice, so we disable it:
    callbacks: {
      beforeOpen: function() {
        if ($(window).width() < 700) {
          this.st.focus = false;
        } else {
          this.st.focus = '#inputName';
        }
      }
    }
  });


  // Example Ajax Popup
  // ------------------
  $('#examplePopupAjaxAlignTop').magnificPopup({
    type: 'ajax',
    alignTop: true,
    overflowY: 'scroll' // as we know that popup content is tall we set scroll overflow by default to avoid jump
  });

  $('#examplePopupAjax').magnificPopup({
    type: 'ajax'
  });


  // Example Popup Modal
  // -------------------
  $('.popup-modal').magnificPopup({
    type: 'inline',
    preloader: false,
    modal: true
  });

  $(document).on('click', '.popup-modal-dismiss', function(e) {
    e.preventDefault();
    $.magnificPopup.close();
  });


  // Example Error Handling
  // ----------------------
  $('#exampleBrokenImage, #exampleBrokenAjax').magnificPopup({});

})(document, window, jQuery);
