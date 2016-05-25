(function(document, window, $) {
  'use strict';

  window.AppContacts = App.extend({
    handleAction: function() {

      var actionBtn = $('.site-action').actionBtn().data('actionBtn');
      var $selectable = $('[data-selectable]');

      $('.site-action-toggle', '.site-action').on('click', function(e) {
        var $selected = $selectable.asSelectable('getSelected');

        if ($selected.length === 0) {
          $('#addUserForm').modal('show');
          e.stopPropagation();
        }
      });

      $('[data-action="trash"]', '.site-action').on('click', function() {
        console.log('trash');
      });

      $('[data-action="folder"]', '.site-action').on('click', function() {
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

    handleEdit: function() {
      $(document).on('click', '[data-toggle=edit]', function() {
        var $button = $(this),
          $panel = $button.parents('.slidePanel'),
          $form = $panel.find('.user-info');

        $button.toggleClass('active');
        $form.toggleClass('active');
      });

      $(document).on('slidePanel::afterLoad', function(e, api) {
        $.components.init('material', api.$panel);
      });

      $(document).on('change', '.user-info .form-group', function(e) {
        var $input = $(this).find('input'),
          $span = $(this).siblings('span');
        $span.html($input.val());
      });

    },

    run: function(next) {
      this.handleAction();
      this.handleEdit();

      $('#addUserForm').modal({
        show: false
      });

      next();
    }
  });

  $(document).ready(function() {
    AppContacts.run();
  });
})(document, window, jQuery);
