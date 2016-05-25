+ function($) {
  'use strict';

  // TAB CLOSE CLASS DEFINITION
  // ==========================

  var dismiss = '[data-close="tab"]'
  var TabClose = function(el) {
    $(el).on('click', dismiss, this.close);
  }

  TabClose.TRANSITION_DURATION = 150

  TabClose.prototype.close = function(e) {
    var $this = $(this);
    var $toggle = $this.closest('[data-toggle="tab"]');
    var selector = $toggle.data('target');
    var $li = $toggle.parent('li');

    if (!selector) {
      selector = $toggle.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');
    }

    if ($li.hasClass('active')) {
      var $next = $li.siblings().eq(0).children('[data-toggle="tab"]');
      if ($next.length > 0) {
        var api = $next.tab().data('bs.tab');
        api.show();
      }
    }

    var $parent = $(selector);
    if (e) e.preventDefault();

    $parent.trigger(e = $.Event('close.bs.tab'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.tab').remove();
      $li.detach().remove();
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
      .one('bsTransitionEnd', removeElement)
      .emulateTransitionEnd(TabClose.TRANSITION_DURATION) :
      removeElement()
  }


  // TAB CLOSE PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function() {
      var $this = $(this)
      var data = $this.data('bs.tab.close')

      if (!data) $this.data('bs.tab.close', (data = new TabClose(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.tabClose

  $.fn.tabClose = Plugin
  $.fn.tabClose.Constructor = TabClose


  // TAB CLOSE NO CONFLICT
  // =====================

  $.fn.tabClose.noConflict = function() {
    $.fn.tabClose = old
    return this
  }


  // TAB CLOSE DATA-API
  // ==================

  $(document).on('click.bs.tab-close.data-api', dismiss, TabClose.prototype.close)

}(jQuery);
