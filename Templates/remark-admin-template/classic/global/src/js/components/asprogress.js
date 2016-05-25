$.components.register("progress", {
  mode: "init",
  defaults: {
    bootstrap: true,

    onUpdate: function(n) {
      var per = (n - this.min) / (this.max - this.min);
      if (per < 0.5) {
        this.$target.addClass('progress-bar-success').removeClass('progress-bar-warning progress-bar-danger');
      } else if (per >= 0.5 && per < 0.8) {
        this.$target.addClass('progress-bar-warning').removeClass('progress-bar-success progress-bar-danger');
      } else {
        this.$target.addClass('progress-bar-danger').removeClass('progress-bar-success progress-bar-warning');
      }
    },

    labelCallback: function(n) {
      var label;
      var labelType = this.$element.data("labeltype");

      if (labelType === "percentage") {
        var percentage = this.getPercentage(n);
        label = percentage + '%';
      } else if (labelType === "steps") {
        var total = this.$element.data("totalsteps");
        if (!total) {
          total = 10;
        }
        var step = Math.round(total * (n - this.min) / (this.max - this.min));
        label = step + ' / ' + total;
      } else {
        label = n;
      }

      if (this.$element.parent().hasClass('contextual-progress')) {
        this.$element.parent().find('.progress-label').html(label);
      }

      return label;
    }
  },

  init: function(context) {
    if (!$.fn.asProgress) return;

    var defaults = $.components.getDefaults("progress");

    $('[data-plugin="progress"]', context).each(function() {
      var $this = $(this),
        options = $this.data();

      options = $.extend({}, defaults, options);
      $this.asProgress(options);
    });
  }
});
