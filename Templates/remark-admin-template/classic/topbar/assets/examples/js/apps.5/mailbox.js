/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
(function(document, window, $) {
  'use strict';

  window.AppMailbox = App.extend({
    handleAction: function() {
      var actionBtn = $('.site-action').actionBtn().data('actionBtn');
      var $selectable = $('[data-selectable]');

      $('.site-action-toggle', '.site-action').on('click', function(e) {
        var $selected = $selectable.asSelectable('getSelected');

        if ($selected.length === 0) {
          $('#addMailForm').modal('show');
          e.stopPropagation();
        }
      });

      $('[data-action="trash"]', '.site-action').on('click', function() {
        console.log('trash');
      });

      $('[data-action="inbox"]', '.site-action').on('click', function() {
        console.log('folder');
      });

      $selectable.on('asSelectable::change', function(e, api, checked) {
        if (checked) {
          actionBtn.show();
        } else {
          actionBtn.hide();
        }
      });
    },
    run: function(next) {
      this.handleAction();

      $('#addMailForm').modal({
        show: false
      });
      $('.checkbox-important').on('click', function(e) {
        e.stopPropagation();
      });
      this.handleMultiSelect();
      next();
    }
  });

  $(document).ready(function() {
    AppMailbox.run();
  });
})(document, window, jQuery);
