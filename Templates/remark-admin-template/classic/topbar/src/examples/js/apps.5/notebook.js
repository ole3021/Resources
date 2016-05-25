(function(document, window, $) {
  'use strict';

  window.AppNoteBook = App.extend({
    handleAction: function() {
      var $actionBtn = $('.site-action').actionBtn({
        toggleSelector: '.list-group-item',
        listSelector: '.site-action-buttons'
      }).data("actionBtn");

      var $noteList = $(".list-group-item");

      $('.site-action-toggle').on("click", function(e) {
        if (!$noteList.hasClass("active")) {
          $('#addNewNote').modal('show');

          e.stopPropagation();
        }
      })

      $noteList.on("click", function() {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");

        if ($(this).hasClass("active")) {
          $actionBtn.show();

          $(".site-action-toggle").on("click", function() {
            $(".list-group-item").removeClass("active");
            $actionBtn.hide();
          });
        }
      });
    },
    handleEdit: function() {
      $("#mdEdit").markdown({
        autofocus: false,
        savable: false
      });

      var navbarH = $(".site-navbar").outerHeight();
      var mdNavbarH = $(".md-header").outerHeight();
      var footerH = $(".site-footer").outerHeight();
      var mdInputH = $(window).height() - navbarH - mdNavbarH - footerH;

      $("#mdEdit").outerHeight(mdInputH);
    },
    handleScrollable: function() {
      var $scrollBody = $(".list-scrollable-body");

      $scrollBody.asScrollable({
        namespace: 'scrollable',
        skin: 'scrollable',
        contentSelector: '>',
        containerSelector: '>',
        direction: 'vertical'
      });

      $(".page-aside").on("transitionend", function() {
        var api = $scrollBody.data('asScrollable');

        if (api) {
          api.update();
        }
      });
    },
    handleResize: function() {
      $(window).on("resize", function() {
        var navbarH = $(".site-navbar").outerHeight();
        var mdNavbarH = $(".md-header").outerHeight();
        var footerH = $(".site-footer").outerHeight();
        var mdInputH = $(window).height() - navbarH - mdNavbarH - footerH;

        $("#mdEdit").outerHeight(mdInputH);
      });
    },
    run: function(next) {
      this.handleAction();
      this.handleEdit();
      this.handleScrollable();
      this.handleResize();
    }
  });

  $(document).ready(function($) {
    AppNoteBook.run();
  })
}(document, window, jQuery));
