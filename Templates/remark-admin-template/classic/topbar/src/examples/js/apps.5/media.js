(function(document, window, $) {
  'use strict';

  window.AppMedia = App.extend({
    handleArrangement: function() {
      $('#arrangement-grid').on('click', function() {
        var $this = $(this);
        if ($this.hasClass('active')) {
          return;
        }
        $('#arrangement-list').removeClass('active');
        $this.addClass('active');
        $('.media-list').removeClass('is-list').addClass('is-grid');
        $('.media-list>ul>li').removeClass('animation-fade').addClass('animation-scale-up');

      });

      $('#arrangement-list').on('click', function() {
        var $this = $(this);
        if ($this.hasClass('active')) {
          return;
        }
        $('#arrangement-grid').removeClass('active');
        $this.addClass('active');
        $('.media-list').removeClass('is-grid').addClass('is-list');
        $('.media-list>ul>li').removeClass('animation-scale-up').addClass('animation-fade');
      });
    },

    handleActive: function() {
      $.components.getDefaults('selectable').rowSelector = '.media-item';
    },

    handleAction: function() {
      $('#fileupload').on('click', function(e) {
        e.stopPropagation();
      });

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

      $('[data-action="download"]', '.site-action').on('click', function() {
        console.log('download');
      });

      $selectable.on('asSelectable::change', function(e, api, checked) {
        if (checked) {
          actionBtn.show();
        } else {
          actionBtn.hide();
        }
      });
    },

    handleDropdownAction: function() {
      $('.info-wrap>.dropdown').on('show.bs.dropdown', function() {
        $(this).closest('.media-item').toggleClass('item-active');
      }).on('hidden.bs.dropdown', function() {
        $(this).closest('.media-item').toggleClass('item-active');
      });
      $('.info-wrap .dropdown-menu').on('click', function(e) {
        e.stopPropagation();
      });

    },

    run: function() {
      $('.media-item-actions').on('click', function(e) {
        e.stopPropagation();
      });

      this.handleArrangement();
      this.handleAction();
      this.handleActive();
      this.handleDropdownAction();
    }
  });

  $(document).ready(function() {
    AppMedia.run();
  });
})(document, window, jQuery);
