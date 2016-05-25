/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
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
    },
    handleResize: function() {
      var self = this;

      $(window).on("resize", function() {
        self.handleEdit();
      });
    },
    run: function(next) {
      this.handleAction();
      this.handleEdit();
    }
  });

  $(document).ready(function($) {
    AppNoteBook.run();
  })
}(document, window, jQuery));
