/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
$.components.register("ace", {
  mode: "init",
  defaults: {},
  init: function(context) {
    if (typeof ace === "undefined") return;

    //ace.config.set("themePath", "../theme");
    ace.config.loadModule("ace/ext/language_tools");

    $('[data-plugin="ace"]', context).each(function() {
      var id = $(this).attr("id"),
        mode = $(this).data("mode"),
        theme = $(this).data("theme"),
        editor = ace.edit(id);

      editor.container.style.opacity = "";
      if (mode) {
        editor.session.setMode("ace/mode/" + mode);
      }
      if (theme) {
        editor.setTheme("ace/theme/" + theme);
      }

      editor.setOption("maxLines", 40);
      editor.setAutoScrollEditorIntoView(true);

      ace.config.loadModule("ace/ext/language_tools", function() {
        editor.setOptions({
          enableSnippets: true,
          enableBasicAutocompletion: true
        });
      });
    });
  }
});

$.components.register("alertify", {
  mode: "api",
  defaults: {
    type: "alert",
    delay: 5000,
    theme: 'bootstrap'
  },
  api: function() {
    if (typeof alertify === "undefined") return;

    var defaults = $.components.getDefaults("alertify");

    $(document).on('click.site.alertify', '[data-plugin="alertify"]', function() {
      var $this = $(this),
        options = $.extend(true, {}, defaults, $this.data());

      if (options.labelOk) {
        options.okBtn = options.labelOk;
      }

      if (options.labelCancel) {
        options.cancelBtn = options.labelCancel;
      }

      if (typeof options.delay !== 'undefined') {
        alertify.delay(options.delay);
      }

      if (typeof options.theme !== 'undefined') {
        alertify.theme(options.theme);
      }

      if (typeof options.cancelBtn !== 'undefined') {
        alertify.cancelBtn(options.cancelBtn);
      }

      if (typeof options.okBtn !== 'undefined') {
        alertify.okBtn(options.okBtn);
      }

      if (typeof options.placeholder !== 'undefined') {
        alertify.delay(options.placeholder);
      }

      if (typeof options.defaultValue !== 'undefined') {
        alertify.delay(options.defaultValue);
      }

      if (typeof options.maxLogItems !== 'undefined') {
        alertify.delay(options.maxLogItems);
      }

      if (typeof options.closeLogOnClick !== 'undefined') {
        alertify.delay(options.closeLogOnClick);
      }

      switch (options.type) {
        case "alert":
          alertify.alert(options.alertMessage);
          break;
        case "confirm":
          alertify.confirm(options.confirmTitle, function() {
            alertify.success(options.successMessage);
          }, function() {
            alertify.error(options.errorMessage);
          });
          break;
        case "prompt":
          alertify.prompt(options.promptTitle, function(str, ev) {
            var message = options.successMessage.replace('%s', str);
            alertify.success(message);
          }, function(ev) {
            alertify.error(options.errorMessage);
          });
          break;
        case "log":
          alertify.log(options.logMessage);
          break;
        case "success":
          alertify.success(options.successMessage);
          break;
        case "error":
          alertify.error(options.errorMessage);
          break;
      }
    });
  }
});

$.components.register("animate-list", {
  mode: 'init',

  defaults: {
    child: '.panel',
    duration: 250,
    delay: 50,
    animate: 'scale-up',
    fill: 'backwards'
  },

  init: function() {
    var self = this;

    $('[data-plugin=animateList]').each(function() {
      var $this = $(this),
        options = $.extend({}, self.defaults, $this.data(), true);


      var animatedBox = function($el, opts) {
        this.options = opts;
        this.$children = $el.find(opts.child);
        this.$children.addClass('animation-' + opts.animate);
        this.$children.css('animation-fill-mode', opts.fill);
        this.$children.css('animation-duration', opts.duration + 'ms');

        var delay = 0,
          self = this;

        this.$children.each(function() {

          $(this).css('animation-delay', delay + 'ms');
          delay += self.options.delay;
        });
      };

      animatedBox.prototype = {
        run: function(type) {
          var self = this;
          this.$children.removeClass('animation-' + this.options.animate);
          if (typeof type !== 'undefined') this.options.animate = type;
          setTimeout(function() {
            self.$children.addClass('animation-' + self.options.animate);
          }, 0);
        }
      };

      $this.data('animateList', new animatedBox($this, options));
    });
  }
});

$.components.register("animsition", {
  mode: "manual",
  defaults: {
    inClass: 'fade-in',
    outClass: 'fade-out',
    inDuration: 800,
    outDuration: 500,
    linkElement: '.animsition-link',
    loading: true,
    loadingParentElement: "body",
    loadingClass: "loader",
    loadingType: "default",
    timeout: false,
    timeoutCountdown: 5000,
    onLoadEvent: true,
    browser: ['animation-duration', '-webkit-animation-duration'],
    overlay: false,
    // random: true,
    overlayClass: 'animsition-overlay-slide',
    overlayParentElement: "body",

    inDefaults: [
      'fade-in',
      'fade-in-up-sm', 'fade-in-up', 'fade-in-up-lg',
      'fade-in-down-sm', 'fade-in-down', 'fade-in-down-lg',
      'fade-in-left-sm', 'fade-in-left', 'fade-in-left-lg',
      'fade-in-right-sm', 'fade-in-right', 'fade-in-right-lg',
      // 'overlay-slide-in-top', 'overlay-slide-in-bottom', 'overlay-slide-in-left', 'overlay-slide-in-right',
      'zoom-in-sm', 'zoom-in', 'zoom-in-lg'
    ],
    outDefaults: [
      'fade-out',
      'fade-out-up-sm', 'fade-out-up', 'fade-out-up-lg',
      'fade-out-down-sm', 'fade-out-down', 'fade-out-down-lg',
      'fade-out-left-sm', 'fade-out-left', 'fade-out-left-lg',
      'fade-out-right-sm', 'fade-out-right', 'fade-out-right-lg',
      // 'overlay-slide-out-top', 'overlay-slide-out-bottom', 'overlay-slide-out-left', 'overlay-slide-out-right'
      'zoom-out-sm', 'zoom-out', 'zoom-out-lg'
    ]
  },
  init: function(context, callback) {
    var options = $.components.getDefaults("animsition");

    if (options.random) {
      var li = options.inDefaults.length,
        lo = options.outDefaults.length;

      var ni = parseInt(li * Math.random(), 0),
        no = parseInt(lo * Math.random(), 0);

      options.inClass = options.inDefaults[ni];
      options.outClass = options.outDefaults[no];
    }

    var $this = $(".animsition", context);

    $this.animsition(options);

    $("." + options.loadingClass).addClass('loader-' + options.loadingType);

    if ($this.animsition('supportCheck', options)) {
      if ($.isFunction(callback)) {
        $this.one('animsition.end', function() {
          callback.call();
        });
      }

      return true;
    } else {
      if ($.isFunction(callback)) {
        callback.call();
      }
      return false;
    }
  }
});

$.components.register("breadcrumb", {
  mode: "init",
  defaults: {
    namespace: "breadcrumb"
  },
  init: function(context) {
    if (!$.fn.asBreadcrumbs) return;
    var defaults = $.components.getDefaults("breadcrumb");

    $('[data-plugin="breadcrumb"]', context).each(function() {
      var options = $.extend({}, defaults, $(this).data());

      $(this).asBreadcrumbs(options);
    });
  }
});

$.components.register("asColorPicker", {
  defaults: {
    namespace: "colorInputUi"
  },
  mode: "default"
});

$.components.register("paginator", {
  mode: "init",
  defaults: {
    namespace: "pagination",
    currentPage: 1,
    itemsPerPage: 10,
    disabledClass: "disabled",
    activeClass: "active",

    visibleNum: {
      0: 3,
      480: 5
    },

    tpl: function() {
      return '{{prev}}{{lists}}{{next}}';
    },

    components: {
      prev: {
        tpl: function() {
          return '<li class="' + this.namespace + '-prev"><a href="javascript:void(0)"><span class="icon md-chevron-left"></span></a></li>';
        }
      },
      next: {
        tpl: function() {
          return '<li class="' + this.namespace + '-next"><a href="javascript:void(0)"><span class="icon md-chevron-right"></span></a></li>';
        }
      },
      lists: {
        tpl: function() {
          var lists = '',
            remainder = this.currentPage >= this.visible ? this.currentPage % this.visible : this.currentPage;
          remainder = remainder === 0 ? this.visible : remainder;
          for (var k = 1; k < remainder; k++) {
            lists += '<li class="' + this.namespace + '-items" data-value="' + (this.currentPage - remainder + k) + '"><a href="javascript:void(0)">' + (this.currentPage - remainder + k) + '</a></li>';
          }
          lists += '<li class="' + this.namespace + '-items ' + this.classes.active + '" data-value="' + this.currentPage + '"><a href="javascript:void(0)">' + this.currentPage + '</a></li>';
          for (var i = this.currentPage + 1, limit = i + this.visible - remainder - 1 > this.totalPages ? this.totalPages : i + this.visible - remainder - 1; i <= limit; i++) {
            lists += '<li class="' + this.namespace + '-items" data-value="' + i + '"><a href="javascript:void(0)">' + i + '</a></li>';
          }

          return lists;
        }
      }
    }
  },
  init: function(context) {
    if (!$.fn.asPaginator) return;

    var defaults = $.components.getDefaults("paginator");

    $('[data-plugin="paginator"]', context).each(function() {
      var $this = $(this),
        options = $this.data();

      var total = $this.data("total");

      options = $.extend({}, defaults, options);
      $this.asPaginator(total, options);
    });
  }
});

$.components.register("pieProgress", {
  mode: "init",
  defaults: {
    namespace: "pie-progress",
    speed: 30,
    classes: {
      svg: "pie-progress-svg",
      element: "pie-progress",
      number: "pie-progress-number",
      content: "pie-progress-content"
    }
  },
  init: function(context) {
    if (!$.fn.asPieProgress) return;

    var defaults = $.components.getDefaults("pieProgress");

    $('[data-plugin="pieProgress"]', context).each(function() {
      var $this = $(this),
        options = $this.data();

      options = $.extend(true, {}, defaults, options);

      $this.asPieProgress(options);
    });
  }
});

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

$.components.register("asRange", {
  mode: "default",
  defaults: {
    tip: false,
    scale: false
  }
});

$.components.register("scrollable", {
  mode: "init",
  defaults: {
    namespace: "scrollable",
    contentSelector: "> [data-role='content']",
    containerSelector: "> [data-role='container']"
  },
  init: function(context) {
    if (!$.fn.asScrollable) return;
    var defaults = $.components.getDefaults("scrollable");

    $('[data-plugin="scrollable"]', context).each(function() {
      var options = $.extend({}, defaults, $(this).data());

      $(this).asScrollable(options);
    });
  }
});

$.components.register("asSpinner", {
  mode: "default",
  defaults: {
    namespace: "spinnerUi",
    skin: null,
    min: "-10",
    max: 100,
    mousewheel: true
  }
});

$.components.register("bootbox", {
  mode: "api",
  defaults: {
    message: ""
  },
  api: function() {
    if (typeof bootbox === "undefined") return;
    var defaults = $.components.getDefaults("bootbox");

    $(document).on('click.site.bootbox', '[data-plugin="bootbox"]', function() {
      var $btn = $(this);
      var options = $btn.data();

      options = $.extend(true, {}, defaults, options);
      if (options.classname) {
        options.className = options.classname;
      }

      if (typeof options.callback === "string" && $.isFunction(window[options.callback])) {
        options.callback = window[options.callback];
      }

      if (options.type) {
        switch (options.type) {
          case "alert":
            bootbox.alert(options);
            break;
          case "confirm":
            bootbox.confirm(options);
            break;
          case "prompt":
            bootbox.prompt(options);
            break;
          default:
            bootbox.dialog(options);
        }
      } else {
        bootbox.dialog(options);
      }
    });
  }
});

$.components.register("datepicker", {
  mode: "default",
  defaults: {
    autoclose: true
  }
});

$.components.register("maxlength", {
  mode: "default",
  defaults: {}
});

$.components.register("selectpicker", {
  mode: "default",
  defaults: {
    style: "btn-select",
    iconBase: "icon",
    tickIcon: "md-check"
  }
});

$.components.register("sweetalert", {
  mode: "api",
  api: function() {
    if (typeof swal === "undefined") return;

    var defaults = $.components.getDefaults("sweetalert");

    $(document).on('click.site.sweetalert', '[data-plugin="sweetalert"]', function() {
      var options = $.extend(true, {}, defaults, $(this).data());

      swal(options);
    });
  }
});

$.components.register("tagsinput", {
  defaults: {
    tagClass: "label label-default"
  },
  mode: "default"
});

$.components.register("tokenfield", {
  mode: "default",
  defaults: {}
});

$.components.register("TouchSpin", {
  mode: "default",
  defaults: {
    verticalupclass: "md-plus",
    verticaldownclass: "md-minus",
    buttondown_class: "btn btn-default",
    buttonup_class: "btn btn-default"
  }
});

$.components.register("treeview", {
  mode: "init",
  defaults: {
    injectStyle: false,
    expandIcon: "icon md-plus",
    collapseIcon: "icon md-minus",
    emptyIcon: "icon",
    nodeIcon: "icon md-folder",
    showBorder: false,
    // color: undefined, // "#000000",
    // backColor: undefined, // "#FFFFFF",
    borderColor: $.colors("grey", 300),
    onhoverColor: $.colors("grey", 200),
    selectedColor: "#ffffff",
    selectedBackColor: $.colors("primary", 600),

    searchResultColor: $.colors("primary", 600),
    searchResultBackColor: "#ffffff"
  },
  init: function(context) {
    if (!$.fn.treeview) return;

    var defaults = $.components.getDefaults("treeview");

    $('[data-plugin="treeview"]', context).each(function() {
      var $this = $(this);
      var options = $this.data();
      if (typeof options.source === "string" && $.isFunction(window[options.source])) {
        options.data = window[options.source]();
        delete options.source;
      } else if ($.isFunction(options.souce)) {
        options.data = options.source();
        delete options.source;
      }

      options = $.extend(true, {}, defaults, options);
      $this.treeview(options);
    });
  }
});

$.components.register("buttons", {
  mode: "api",
  defaults: {},
  api: function() {
    $(document).on('click.site.loading', '[data-loading-text]', function() {
      var $btn = $(this),
        text = $btn.text(),
        i = 20,
        loadingText = $btn.data('loadingText');

      $btn.text(loadingText + '(' + i + ')').css('opacity', '.6');

      var timeout = setInterval(function() {
        $btn.text(loadingText + '(' + (--i) + ')');
        if (i === 0) {
          clearInterval(timeout);
          $btn.text(text).css('opacity', '1');
        }
      }, 1000);
    });

    $(document).on('click.site.morebutton', '[data-more]', function() {
      var $target = $($(this).data('more'));
      $target.toggleClass('show');
    });
  }
});

$.components.register("card", {
  mode: "init",
  defaults: {

  },
  init: function(context) {
    if (!$.fn.card) return;
    var defaults = $.components.getDefaults("card");

    $('[data-plugin="card"]', context).each(function() {
      var options = $.extend({}, defaults, $(this).data());

      if (options.target) {
        options.container = $(options.target);
      }
      $(this).card(options);
    });
  }
});

$.components.register("clockpicker", {
  mode: "default",
  defaults: {
    donetext: "Done"
  }
});

$.components.register("dataTable", {
  defaults: {
    responsive: true,
    language: {
      "sSearchPlaceholder": "Search..",
      "lengthMenu": "_MENU_",
      "search": "_INPUT_",
      "paginate": {
        "previous": '<i class="icon md-chevron-left"></i>',
        "next": '<i class="icon md-chevron-right"></i>'
      }
    }
  },
  api: function() {
    if (!$.fn.dataTable) return;

    if ($.fn.dataTable.TableTools) {
      // Set the classes that TableTools uses to something suitable for Bootstrap
      $.extend(true, $.fn.dataTable.TableTools.classes, {
        "container": "DTTT btn-group pull-left",
        "buttons": {
          "normal": "btn btn-default btn-flat",
          "disabled": "disabled"
        },
        "print": {
          "body": "site-print DTTT_Print"
        }
      });
    }
  },
  init: function(context) {
    if (!$.fn.dataTable) return;

    var defaults = $.components.getDefaults("dataTable");

    $('[data-plugin="dataTable"]', context).each(function() {
      var options = $.extend(true, {}, defaults, $(this).data());

      $(this).dataTable(options);
    });
  }
});

$.components.register("datepair", {
  mode: "default",
  defaults: {
    startClass: 'datepair-start',
    endClass: 'datepair-end',
    timeClass: 'datepair-time',
    dateClass: 'datepair-date'
  }
});

$.components.register("editableTable", {
  mode: "init",
  init: function(context) {
    if (!$.fn.editableTableWidget) return;

    var defaults = $.components.getDefaults("editableTable");

    $('[data-plugin="editableTable"]', context).each(function() {
      var options = $.extend(true, {}, defaults, $(this).data());

      $(this).editableTableWidget(options);
    });
  }
});

$.components.register("filterable", {
  mode: "init",
  defaults: {
    animationOptions: {
      duration: 750,
      easing: 'linear',
      queue: false
    }
  },
  init: function(context) {
    if (typeof $.fn.isotope === "undefined") return;

    var defaults = $.components.getDefaults('filterable');

    var callback = function() {
      $('[data-filterable]', context).each(function() {
        var $this = $(this);

        var options = $.extend(true, {}, defaults, $this.data(), {
          filter: '*'
        });

        $this.isotope(options);
      });

      $('[data-filter]', context).click(function(e) {
        var $this = $(this);
        var target = $this.data('target');
        var $li = $this.parent('li');

        if (!target) {
          target = $this.attr('href');
          target = target && target.replace(/.*(?=#[^\s]*$)/, '');
        }

        if ($this.data("toggle") !== 'tab') {
          $li.siblings('.active').each(function() {
            $(this).find('a').attr('aria-expanded', false);
            $(this).removeClass('active');
          });

          $li.addClass('active');
          $this.attr('aria-expanded', true);
        }

        var $list = $(target, context);
        var filter = $this.attr('data-filter');
        if (filter !== '*') {
          filter = '[data-type="' + filter + '"]';
        }
        $list.isotope({
          filter: filter
        });

        e.preventDefault();
      });
    }

    if (context !== document) {
      callback();
    } else {
      $(window).on('load', function() {
        callback();
      });
    }
  }
});

$.components.register("formatter", {
  mode: "init",
  defaults: {
    persistent: true
  },

  init: function(context) {
    if (!$.fn.formatter) return;

    var defaults = $.components.getDefaults("formatter"),
      browserName = navigator.userAgent.toLowerCase(),
      ieOptions;

    if (/msie/i.test(browserName) && !/opera/.test(browserName)) {
      ieOptions = {
        persistent: false
      };
    } else {
      ieOptions = {};
    }

    $('[data-plugin="formatter"]', context).each(function() {

      var options = $.extend({}, defaults, ieOptions, $(this).data());
      if (options.pattern) {
        options.pattern = options.pattern.replace(/\[\[/g, '{{').replace(/\]\]/g, '}}');
      }
      $(this).formatter(options);
    });
  }
});

$.components.register("gauge", {
  mode: "init",
  defaults: {
    lines: 12,
    angle: 0.12,
    lineWidth: 0.4,
    pointer: {
      length: 0.68,
      strokeWidth: 0.03,
      color: $.colors("grey", 500)
    },
    limitMax: true,
    colorStart: $.colors("grey", 300),
    colorStop: $.colors("grey", 300),
    strokeColor: $.colors("primary", 500),
    generateGradient: true
  },
  init: function(context) {
    if (!Gauge) return;

    var defaults = $.components.getDefaults("gauge");

    $('[data-plugin="gauge"]', context).each(function() {
      var $this = $(this),
        options = $this.data(),
        $text = $this.find('.gauge-label'),
        $canvas = $this.find("canvas");

      options = $.extend(true, {}, defaults, options);

      if ($canvas.length === 0) {
        return;
      }

      var gauge = new Gauge($canvas[0]).setOptions(options);

      $this.data("gauge", gauge);

      gauge.animationSpeed = 50;
      gauge.maxValue = $this.data('max-value');

      gauge.set($this.data("value"));

      if ($text.length > 0) {
        gauge.setTextField($text[0]);
      }
    });
  }
});

$.components.register("donut", {
  mode: "init",
  defaults: {
    lines: 12,
    angle: 0.3,
    lineWidth: 0.08,
    pointer: {
      length: 0.9,
      strokeWidth: 0.035,
      color: $.colors("grey", 500)
    },
    limitMax: false, // If true, the pointer will not go past the end of the gauge
    colorStart: $.colors("grey", 300),
    colorStop: $.colors("grey", 300),
    strokeColor: $.colors("primary", 500),
    generateGradient: true
  },
  init: function(context) {
    if (!Gauge) return;

    var defaults = $.components.getDefaults("donut");

    $('[data-plugin="donut"]', context).each(function() {

      var $this = $(this),
        options = $this.data(),
        $text = $this.find('.donut-label'),
        $canvas = $this.find("canvas");

      options = $.extend(true, {}, defaults, options);

      if ($canvas.length === 0) {
        return;
      }

      var donut = new Donut($canvas[0]).setOptions(options);

      $this.data("donut", donut);

      donut.animationSpeed = 50;
      donut.maxValue = $this.data('max-value');

      donut.set($this.data("value"));

      if ($text.length > 0) {
        donut.setTextField($text[0]);
      }
    });
  }
});

$.components.register("gmaps", {
  styles: [{
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [{
      "color": "#ffffff"
    }]
  }, {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [{
      "color": "#ffffff"
    }]
  }, {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": $.colors("grey", "700")
    }]
  }, {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": $.colors("grey", "500")
    }]
  }, {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [{
      "color": $.colors("grey", "400")
    }]
  }, {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [{
      "color": "#e0e0e0"
    }]
  }, {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [{
      "color": $.colors("grey", "300")
    }]
  }, {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#000000"
    }]
  }, {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": $.colors("grey", "500")
    }]
  }, {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [{
      "visibility": "off"
    }]
  }, {
    "featureType": "poi.attraction",
    "elementType": "labels.text.stroke",
    "stylers": [{
      "visibility": "off"
    }]
  }, {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [{
      "visibility": "off"
    }]
  }, {
    "featureType": "road.local",
    "elementType": "all",
    "stylers": [{
      "color": $.colors("grey", "300")
    }, {
      "weight": 0.5
    }]
  }, {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{
      "color": $.colors("grey", "400")
    }]
  }, {
    "featureType": "road.arterial",
    "elementType": "geometry.stroke",
    "stylers": [{
      "visibility": "off"
    }]
  }, {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{
      "visibility": "off"
    }, {
      "color": "#000000"
    }]
  }, {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [{
      "visibility": "off"
    }, {
      "color": "#000000"
    }]
  }, {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [{
      "visibility": "on"
    }, {
      "color": $.colors("grey", "700")
    }]
  }, {
    "featureType": "road.local",
    "elementType": "labels.text",
    "stylers": [{
      "color": $.colors("grey", "700")
    }]
  }, {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [{
      "color": $.colors("grey", "200")
    }]
  }, {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": $.colors("grey", "500")
    }]
  }, {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [{
      "visibility": "off"
    }]
  }, {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": $.colors("grey", "600")
    }]
  }, {
    "featureType": "administrative.neighborhood",
    "elementType": "labels.text",
    "stylers": [{
      "color": $.colors("grey", "700")
    }]
  }, {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [{
      "color": "#ffffff"
    }]
  }, {
    "featureType": "road.highway",
    "elementType": "labels.icon",
    "stylers": [{
      "visibility": "on"
    }, {
      "hue": "#ffffff"
    }, {
      "saturation": -100
    }, {
      "lightness": 50
    }]
  }, {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [{
      "visibility": "on"
    }, {
      "color": "#ffffff"
    }]
  }, {
    "featureType": "administrative.neighborhood",
    "elementType": "labels.text.stroke",
    "stylers": [{
      "color": "#ffffff"
    }]
  }, {
    "featureType": "administrative",
    "elementType": "labels.text.stroke",
    "stylers": [{
      "color": "#ffffff"
    }]
  }, {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": $.colors("grey", "600")
    }]
  }]
});

$.components.register("gridstack", {
  mode: "init",
  defaults: {
    cell_height: 80,
    vertical_margin: 20
  },
  init: function(context) {
    if (!$.fn.gridstack) return;

    var defaults = $.components.getDefaults("gridstack");

    $('[data-plugin="gridstack"]', context).each(function() {
      var options = $.extend(true, {}, defaults, $(this).data());

      $(this).gridstack(options);
    });
  }
});

$.components.register("highlight", {
  mode: "init",
  defaults: {

  },
  init: function(context) {
    if (typeof $.fn.hightlight === "undefined") return;
    var defaults = $.components.getDefaults('highlight');

    // hljs.configure({useBR: true});

    $('[data-plugin="highlight"]', context).each(function(i, block) {
      hljs.highlightBlock(block);
    });
  }
});

$.components.register("sortable", {
  defaults: {},
  mode: "default"
});

$.components.register("iCheck", {
  mode: "default",
  defaults: {}
});

$.components.register("input-group-file", {
  api: function() {
    $(document).on("change", ".input-group-file [type=file]", function() {
      var $this = $(this);
      var $text = $(this).parents('.input-group-file').find('.form-control');
      var value = "";

      $.each($this[0].files, function(i, file) {
        value += file.name + ", ";
      });
      value = value.substring(0, value.length - 2);

      $text.val(value);
    });
  }
});

$.components.register("isotope", {
  mode: "init",
  defaults: {},
  init: function(context) {
    if (typeof $.fn.isotope === "undefined") return;
    var defaults = $.components.getDefaults('isotope');

    var callback = function() {
      $('[data-plugin="isotope"]', context).each(function() {
        var $this = $(this),
          options = $.extend(true, {}, defaults, $this.data());

        $this.isotope(options);
      });
    }
    if (context !== document) {
      callback();
    } else {
      $(window).on('load', function() {
        callback();
      });
    }
  }
});

$.components.register("appear", {
  defaults: {},
  api: function(context) {
    if (!$.fn.appear) return;

    $(document).on("appear", '[data-plugin="appear"]', function() {
      var $item = $(this),
        animate = $item.data("animate");

      if ($item.hasClass('appear-no-repeat')) return;
      $item.removeClass("invisible").addClass('animation-' + animate);

      if ($item.data("repeat") === false) {
        $item.addClass('appear-no-repeat');
      }
    });

    $(document).on("disappear", '[data-plugin="appear"]', function() {
      var $item = $(this),
        animate = $item.data("animate");

      if ($item.hasClass('appear-no-repeat')) return;

      $item.addClass("invisible").removeClass('animation-' + animate);
    });
  },

  init: function(context) {
    if (!$.fn.appear) return;

    var defaults = $.components.getDefaults("appear");

    $('[data-plugin="appear"]', context).appear(defaults);
    $('[data-plugin="appear"]', context).not(':appeared').addClass("invisible");
  }
});

$.components.register("floatThead", {
  mode: "default",
  defaults: {
    top: function() {
      return $('.site-navbar').outerHeight();
    },
    position: 'absolute'
  }
});

$.components.register("knob", {
  mode: "default",
  defaults: {
    min: -50,
    max: 50,
    width: 120,
    height: 120,
    thickness: ".1"
  }
});

$.components.register("labelauty", {
  mode: "default",
  defaults: {
    same_width: true
  }
});

$.components.register("placeholder", {
  mode: "init",
  init: function(context) {
    if (!$.fn.placeholder) return;

    $('input, textarea', context).placeholder();
  }
});

$.components.register("strength", {
  mode: "default",
  defaults: {
    showMeter: true,
    showToggle: false,

    templates: {
      toggle: '<div class="checkbox-custom checkbox-primary show-password-wrap"><input type="checkbox" class="{toggleClass}" title="Show/Hide Password" id="show_password" /><label for="show_password">Show Password</label></div>',
      meter: '<div class="{meterClass}">{score}</div>',
      score: '<div class="{scoreClass}"></div>',
      main: '<div class="{containerClass}">{input}{meter}{toggle}</div>'
    },

    classes: {
      container: 'strength-container',
      status: 'strength-{status}',
      input: 'strength-input',
      toggle: 'strength-toggle',
      meter: 'strength-meter',
      score: 'strength-score'
    },

    scoreLables: {
      invalid: 'Invalid',
      weak: 'Weak',
      good: 'Good',
      strong: 'Strong'
    },

    scoreClasses: {
      invalid: 'strength-invalid',
      weak: 'strength-weak',
      good: 'strength-good',
      strong: 'strength-strong'
    }
  }
});

$.components.register("wizard", {
  mode: "default",
  defaults: {
    step: ".steps .step, .pearls .pearl",
    templates: {
      buttons: function() {
        var options = this.options;
        return '<div class="wizard-buttons">' +
          '<a class="btn btn-default" href="#' + this.id + '" data-wizard="back" role="button">' + options.buttonLabels.back + '</a>' +
          '<a class="btn btn-primary pull-right" href="#' + this.id + '" data-wizard="next" role="button">' + options.buttonLabels.next + '</a>' +
          '<a class="btn btn-success pull-right" href="#' + this.id + '" data-wizard="finish" role="button">' + options.buttonLabels.finish + '</a>' +
          '</div>';
      }
    }
  }
});

$.components.register("timepicker", {
  mode: "default",
  defaults: {}
});

$.components.register("vectorMap", {
  mode: "default",
  defaults: {
    map: "world_mill_en",
    backgroundColor: '#fff',
    zoomAnimate: true,
    regionStyle: {
      initial: {
        fill: $.colors("primary", 600)
      },
      hover: {
        fill: $.colors("primary", 500)
      },
      selected: {
        fill: $.colors("primary", 800)
      },
      selectedHover: {
        fill: $.colors("primary", 500)
      }
    },
    markerStyle: {
      initial: {
        r: 8,
        fill: $.colors("red", 600),
        "stroke-width": 0
      },
      hover: {
        r: 12,
        stroke: $.colors("red", 600),
        "stroke-width": 0
      }
    }
  }
});

$.components.register("ladda", {
  mode: "init",
  defaults: {
    timeout: 2000
  },
  init: function() {
    if (typeof Ladda === "undefined") return;

    var defaults = $.components.getDefaults("ladda");
    Ladda.bind('[data-plugin="ladda"]', defaults);
  }
});

$.components.register("laddaProgress", {
  mode: "init",
  defaults: {
    init: function(instance) {
      var progress = 0;
      var interval = setInterval(function() {
        progress = Math.min(progress + Math.random() * 0.1, 1);
        instance.setProgress(progress);

        if (progress === 1) {
          instance.stop();
          clearInterval(interval);
        }
      }, 200);
    }
  },
  init: function() {
    if (typeof Ladda === 'undefined') return;

    var defaults = $.components.getDefaults("laddaProgress");
    // Bind progress buttons and simulate loading progress
    Ladda.bind('[data-plugin="laddaProgress"]', defaults);
  }
});

$.components.register("magnificPopup", {
  mode: "default",
  defaults: {
    type: "image",
    closeOnContentClick: true,
    image: {
      verticalFit: true
    }
  }
});

$.components.register("masonry", {
  mode: "init",
  defaults: {
    itemSelector: ".masonry-item"
  },
  init: function(context) {
    if (typeof $.fn.masonry === "undefined") return;
    var defaults = $.components.getDefaults('masonry');

    var callback = function() {
      $('[data-plugin="masonry"]', context).each(function() {
        var $this = $(this),
          options = $.extend(true, {}, defaults, $this.data());

        $this.masonry(options);
      });
    }
    if (context !== document) {
      callback();
    } else {
      $(window).on('load', function() {
        callback();
      });
    }
  }
});

$.components.register("matchHeight", {
  mode: "init",
  defaults: {},
  init: function(context) {
    if (typeof $.fn.matchHeight === "undefined") return;
    var defaults = $.components.getDefaults('matchHeight');

    $('[data-plugin="matchHeight"]', context).each(function() {
      var $this = $(this),
        options = $.extend(true, {}, defaults, $this.data()),
        matchSelector = $this.data('matchSelector');

      if (matchSelector) {
        $this.find(matchSelector).matchHeight(options);
      } else {
        $this.children().matchHeight(options);
      }

    });
  }
});

$.components.register("material", {
  init: function(context) {
    $('.form-material', context).each(function() {
      var $this = $(this);

      if ($this.data('material') === true) {
        return;
      }

      var $control = $this.find('.form-control');

      // Add hint label if required
      if ($control.attr("data-hint")) {
        $control.after("<div class=hint>" + $control.attr("data-hint") + "</div>");
      }

      if ($this.hasClass("floating")) {
        // Add floating label if required
        if ($control.hasClass("floating-label")) {
          var placeholder = $control.attr("placeholder");
          $control.attr("placeholder", null).removeClass("floating-label");
          $control.after("<div class=floating-label>" + placeholder + "</div>");
        }

        // Set as empty if is empty
        if ($control.val() === null || $control.val() == "undefined" || $control.val() === "") {
          $control.addClass("empty");
        }
      }

      // Support for file input
      if ($control.next().is("[type=file]")) {
        $this.addClass('form-material-file');
      }

      $this.data('material', true);
    });
  },
  api: function() {
    function _isChar(e) {
      if (typeof e.which == "undefined") {
        return true;
      } else if (typeof e.which == "number" && e.which > 0) {
        return !e.ctrlKey && !e.metaKey && !e.altKey && e.which != 8 && e.which != 9;
      }
      return false;
    }

    $(document).on("keydown.site.material paste.site.material", ".form-control", function(e) {
        if (_isChar(e)) {
          $(this).removeClass("empty");
        }
      }).on("keyup.site.material change.site.material", ".form-control", function() {
        var $this = $(this);
        if ($this.val() === "" && (typeof $this[0].checkValidity != "undefined" && $this[0].checkValidity())) {
          $this.addClass("empty");
        } else {
          $this.removeClass("empty");
        }
      }).on("focus", ".form-material-file", function() {
        $(this).find("input").addClass("focus");
      })
      .on("blur", ".form-material-file", function() {
        $(this).find("input").removeClass("focus");
      })
      .on("change", ".form-material-file [type=file]", function() {
        var value = "";
        $.each($(this)[0].files, function(i, file) {
          value += file.name + ", ";
        });
        value = value.substring(0, value.length - 2);
        if (value) {
          $(this).prev().removeClass("empty");
        } else {
          $(this).prev().addClass("empty");
        }
        $(this).prev().val(value);
      });
  }
});

$.components.register("multiSelect", {
  mode: "default",
  defaults: {}
});

$.components.register("nestable", {
  mode: "default"
});

$.components.register("nprogress", {
  mode: "init",
  defaults: {
    minimum: 0.15,
    trickleRate: .07,
    trickleSpeed: 360,
    showSpinner: false,
    template: '<div class="bar" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
  },
  init: function() {
    if (typeof NProgress === "undefined") return;
    var defaults = $.components.getDefaults('nprogress');
    NProgress.configure(defaults);
  }
});

$.components.register("owlCarousel", {
  mode: "default",
  defaults: {
    loop: true,
    nav: true,
    dots: false,
    dotsClass: "owl-dots owl-dots-fall",
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 3
      }
    }
  }
});

$.components.register("panel", {
  api: function() {
    $(document).on('click.site.panel', '[data-toggle="panel-fullscreen"]', function(e) {
      e.preventDefault();
      var $this = $(this),
        $panel = $this.closest('.panel');

      var api = $panel.data('panel-api');
      api.toggleFullscreen();
    });

    $(document).on('click.site.panel', '[data-toggle="panel-collapse"]', function(e) {
      e.preventDefault();
      var $this = $(this),
        $panel = $this.closest('.panel');

      var api = $panel.data('panel-api');
      api.toggleContent();
    });

    $(document).on('click.site.panel', '[data-toggle="panel-close"]', function(e) {
      e.preventDefault();
      var $this = $(this),
        $panel = $this.closest('.panel');

      var api = $panel.data('panel-api');
      api.close();
    });

    $(document).on('click.site.panel', '[data-toggle="panel-refresh"]', function(e) {
      e.preventDefault();
      var $this = $(this);
      var $panel = $this.closest('.panel');

      var api = $panel.data('panel-api');
      var callback = $this.data('loadCallback');

      if ($.isFunction(window[callback])) {
        api.load(window[callback]);
      } else {
        api.load();
      }
    });
  },

  init: function(context) {
    $('.panel', context).each(function() {
      var $this = $(this);

      var isFullscreen = false;
      var isClose = false;
      var isCollapse = false;
      var isLoading = false;

      var $fullscreen = $this.find('[data-toggle="panel-fullscreen"]');
      var $collapse = $this.find('[data-toggle="panel-collapse"]');
      var $loading;
      var self = this;

      if ($this.hasClass('is-collapse')) {
        isCollapse = true;
      }

      var api = {
        load: function(callback) {
          var type = $this.data('load-type');
          if (!type) {
            type = 'blue-only';
          }

          $loading = $('<div class="panel-loading">' +
            '<div class="loader-wrapper active">' +
            '<div class="loader-layer loader-' + type + '">' +
            '<div class="loader-circle-left">' +
            '<div class="circle"></div>' +
            '</div>' +
            '<div class="loader-circle-gap"></div>' +
            '<div class="loader-circle-right">' +
            '<div class="circle"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>');

          $loading.appendTo($this);

          $this.addClass('is-loading');
          $this.trigger('loading.uikit.panel');
          isLoading = true;

          if ($.isFunction(callback)) {
            callback.call(self, this.done);
          }
        },
        done: function() {
          if (isLoading === true) {
            $loading.remove();
            $this.removeClass('is-loading');
            $this.trigger('loading.done.uikit.panel');
          }
        },
        toggleContent: function() {
          if (isCollapse) {
            this.showContent();
          } else {
            this.hideContent();
          }
        },

        showContent: function() {
          if (isCollapse !== false) {
            $this.removeClass('is-collapse');

            if ($collapse.hasClass('md-plus')) {
              $collapse.removeClass('md-plus').addClass('md-minus');
            }

            $this.trigger('shown.uikit.panel');

            isCollapse = false;
          }
        },

        hideContent: function() {
          if (isCollapse !== true) {
            $this.addClass('is-collapse');

            if ($collapse.hasClass('md-minus')) {
              $collapse.removeClass('md-minus').addClass('md-plus');
            }

            $this.trigger('hidden.uikit.panel');
            isCollapse = true;
          }
        },

        toggleFullscreen: function() {
          if (isFullscreen) {
            this.leaveFullscreen();
          } else {
            this.enterFullscreen();
          }
        },
        enterFullscreen: function() {
          if (isFullscreen !== true) {
            $this.addClass('is-fullscreen');

            if ($fullscreen.hasClass('md-fullscreen')) {
              $fullscreen.removeClass('md-fullscreen').addClass('md-fullscreen-exit');
            }

            $this.trigger('enter.fullscreen.uikit.panel');
            isFullscreen = true;
          }
        },
        leaveFullscreen: function() {
          if (isFullscreen !== false) {
            $this.removeClass('is-fullscreen');

            if ($fullscreen.hasClass('md-fullscreen-exit')) {
              $fullscreen.removeClass('md-fullscreen-exit').addClass('md-fullscreen');
            }

            $this.trigger('leave.fullscreen.uikit.panel');
            isFullscreen = false;
          }
        },
        toggle: function() {
          if (isClose) {
            this.open();
          } else {
            this.close();
          }
        },
        open: function() {
          if (isClose !== false) {
            $this.removeClass('is-close');
            $this.trigger('open.uikit.panel');

            isClose = false;
          }
        },
        close: function() {
          if (isClose !== true) {

            $this.addClass('is-close');
            $this.trigger('close.uikit.panel');

            isClose = true;
          }
        }
      };

      $this.data('panel-api', api);
    });
  }
});

$.components.register("peityBar", {
  mode: "init",
  defaults: {
    delimiter: ",",
    fill: [$.colors("primary", 400)],
    height: 22,
    max: null,
    min: 0,
    padding: 0.1,
    width: 44
  },
  init: function(context) {
    if (!$.fn.peity) return;

    var defaults = $.components.getDefaults("peityBar");

    $('[data-plugin="peityBar"]', context).each(function() {
      var $this = $(this),
        options = $this.data();

      if (options.skin) {
        if ($.colors(options.skin)) {
          var skinColors = $.colors(options.skin);
          defaults.fill = [skinColors[400]];
        }
      }

      options = $.extend(true, {}, defaults, options);

      $this.peity('bar', options);
    });
  }
});

$.components.register("peityDonut", {
  mode: "init",
  defaults: {
    delimiter: null,
    fill: [$.colors("primary", 700), $.colors("primary", 400), $.colors("primary", 200)],
    height: null,
    innerRadius: null,
    radius: 11,
    width: null
  },
  init: function(context) {
    if (!$.fn.peity) return;

    var defaults = $.components.getDefaults("peityDonut");

    $('[data-plugin="peityDonut"]', context).each(function() {
      var $this = $(this),
        options = $this.data();

      if (options.skin) {
        if ($.colors(options.skin)) {
          var skinColors = $.colors(options.skin);
          defaults.fill = [skinColors[700], skinColors[400], skinColors[200]];
        }
      }

      options = $.extend(true, {}, defaults, options);

      $this.peity('donut', options);
    });
  }
});

$.components.register("peityLine", {
  mode: "init",
  defaults: {
    delimiter: ",",
    fill: [$.colors("primary", 200)],
    height: 22,
    max: null,
    min: 0,
    stroke: $.colors("primary", 600),
    strokeWidth: 1,
    width: 44
  },
  init: function(context) {
    if (!$.fn.peity) return;

    var defaults = $.components.getDefaults("peityLine");

    $('[data-plugin="peityLine"]', context).each(function() {
      var $this = $(this),
        options = $this.data();

      if (options.skin) {
        if ($.colors(options.skin)) {
          var skinColors = $.colors(options.skin);
          defaults.fill = [skinColors[200]];
          defaults.stroke = skinColors[600];
        }
      }

      options = $.extend(true, {}, defaults, options);

      $this.peity('line', options);
    });
  }
});

$.components.register("peityPie", {
  mode: "init",
  defaults: {
    delimiter: null,
    fill: [$.colors("primary", 700), $.colors("primary", 400), $.colors("primary", 200)],
    height: null,
    radius: 11,
    width: null
  },
  init: function(context) {
    if (!$.fn.peity) return;

    var defaults = $.components.getDefaults("peityPie");

    $('[data-plugin="peityPie"]', context).each(function() {

      var $this = $(this),
        options = $this.data();

      if (options.skin) {
        if ($.colors(options.skin)) {
          var skinColors = $.colors(options.skin);
          defaults.fill = [skinColors[700], skinColors[400], skinColors[200]];
        }
      }

      options = $.extend(true, {}, defaults, options);

      $this.peity('pie', options);
    });
  }
});

$.components.register("plyr", {
  mode: "init",
  init: function() {
    if (typeof plyr === "undefined") return;

    (function(d, u) {
      var a = new XMLHttpRequest(),
        b = d.body;

      // Check for CORS support
      if ("withCredentials" in a) {
        a.open("GET", u, true);
        a.send();
        a.onload = function() {
          var c = d.createElement("div");
          c.style.display = "none";
          c.innerHTML = a.responseText;
          b.insertBefore(c, b.childNodes[0]);
        }
      }
    })(document, "https://cdn.plyr.io/1.1.5/sprite.svg");

    plyr.setup();
  }
});

$.components.register("rating", {
  mode: "init",
  defaults: {
    targetKeep: true,
    icon: "font",
    starType: "i",
    starOff: "icon md-star",
    starOn: "icon md-star orange-600",
    cancelOff: "icon md-minus-circle",
    cancelOn: "icon md-minus-circle orange-600",
    starHalf: "icon md-star-half orange-500"
  },
  init: function(context) {
    if (!$.fn.raty) return;

    var defaults = $.components.getDefaults("rating");

    $('[data-plugin="rating"]', context).each(function() {
      var $this = $(this);
      var options = $.extend(true, {}, defaults, $this.data());

      if (options.hints) {
        options.hints = options.hints.split(',');
      }

      $this.raty(options);
    });
  }
});

$.components.register("select2", {
  mode: "init",
  defaults: {
    theme: "material"
  },
  init: function(context) {
    if (!$.fn.select2) return;
    var defaults = $.components.getDefaults("select2");

    $('[data-plugin="select2"]', context).each(function() {
      var options = $.extend({}, defaults, $(this).data());

      $(this).select2(options);
    });
  }
});

$.components.register("selectable", {
  mode: "init",
  defaults: {
    allSelector: '.selectable-all',
    itemSelector: '.selectable-item',
    rowSelector: 'tr',
    rowSelectable: false,
    rowActiveClass: 'active',
    onChange: null
  },
  init: function(context) {
    if (!$.fn.asSelectable) return;
    var defaults = $.components.getDefaults('selectable');

    $('[data-plugin="selectable"], [data-selectable="selectable"]', context).each(function() {
      var options = $.extend({}, defaults, $(this).data());
      $(this).asSelectable(options);
    });
  }
});

$.components.register("slidePanel", {
  mode: "manual",
  defaults: {
    closeSelector: '.slidePanel-close',
    mouseDragHandler: '.slidePanel-handler',
    loading: {
      template: function(options) {
        return '<div class="' + options.classes.loading + '">' +
          '<div class="loader loader-default"></div>' +
          '</div>';
      },
      showCallback: function(options) {
        this.$el.addClass(options.classes.loading + '-show');
      },
      hideCallback: function(options) {
        this.$el.removeClass(options.classes.loading + '-show');
      }
    }
  }
});

$.components.register("summernote", {
  mode: "default",
  defaults: {
    height: 300
  }
});

$.components.register("switchery", {
  mode: "init",
  defaults: {
    color: $.colors("primary", 600)
  },
  init: function(context) {
    if (typeof Switchery === "undefined") return;

    var defaults = $.components.getDefaults("switchery");

    $('[data-plugin="switchery"]', context).each(function() {
      var options = $.extend({}, defaults, $(this).data());

      new Switchery(this, options);
    });
  }
});

$.components.register("table", {
  mode: "api",
  api: function(context) {
    /* section */
    $(document).on('click', '.table-section', function(e) {
      if ("checkbox" !== e.target.type && "button" !== e.target.type && "a" !== e.target.tagName.toLowerCase() && !$(e.target).parent("div.checkbox-custom").length) {
        if ($(this).hasClass("active")) {
          $(this).removeClass("active")
        } else {
          $(this).siblings('.table-section').removeClass("active");
          $(this).addClass("active");
        }
      }
    });
  }
});

$.components.register("verticalTab", {
  mode: "init",
  init: function(context) {
    if (!$.fn.matchHeight) return;

    $('.nav-tabs-vertical', context).each(function() {
      $(this).children().matchHeight();
    });
  }
});

$.components.register("horizontalTab", {
  mode: "init",
  init: function(context) {
    if (!$.fn.responsiveHorizontalTabs) return;

    $('.nav-tabs-horizontal', context).responsiveHorizontalTabs();
  }
});

$.components.register("navTabsLine", {
  mode: "init",
  defaults: {
    speed: '0.5s, 1s',
    animate: 'cubic-bezier(0.4, 0, 0.2, 1), cubic-bezier(0.4, 0, 0.2, 1)',
    tpl: function() {
      return '<li class="nav-tabs-autoline"></li>';
    }
  },
  init: function(context) {
    var defaults = $.components.getDefaults('navTabsLine');

    $('.nav-tabs-line', context).each(function() {
      var $this = $(this);
      var options = $.extend({}, defaults, $this.data());
      var $parent = $this.parent();
      var $active = $this.find('.active');

      var $autoLineTpl = $(options.tpl()).css({
        "-webkit-transition-duration": options.speed,
        "transition-duration": options.speed,
        "-webkit-transition-timing-function": options.animate,
        "transition-timing-function": options.animate
      });
      $autoLineTpl.appendTo($this);

      var horizontalLine = function($this) {
        var left = $this.position().left;
        var lineWidth = $this.width();

        $autoLineTpl.css({
          "left": left,
          "width": lineWidth
        });
      };

      var verticalLine = function($this) {
        var top = $this.position().top;
        var lineHeight = $this.height();

        $autoLineTpl.css({
          "top": top,
          "height": lineHeight
        });
      };

      var change = function($this) {
        if ($parent.hasClass('nav-tabs-vertical')) {
          verticalLine($this);
        } else {
          horizontalLine($this);
        }
      };

      $this.on('shown.bs.tab', 'a[data-toggle="tab"]', function() {
        change($(this).parent());
      });

      change($active);
    });
  }
});

$.components.register("taskList", {
  mode: "api",
  api: function() {
    $(document).on('change.site.task', '[data-role="task"]', function() {
      var $list = $(this),
        $checkbox = $list.find('[type="checkbox"]');
      if ($checkbox.is(':checked')) {
        $list.addClass('task-done');
      } else {
        $list.removeClass('task-done');
      }
    });

    $('[data-role="task"]').trigger('change.site.task');
  }
});

$.components.register("toastr", {
  mode: "api",
  api: function() {
    if (typeof toastr === "undefined") return;
    var defaults = $.components.getDefaults("toastr");

    $(document).on('click.site.toastr', '[data-plugin="toastr"]', function(e) {
      e.preventDefault();

      var $this = $(this);
      var options = $.extend(true, {}, defaults, $this.data());
      var message = options.message || '';
      var type = options.type || "info";
      var title = options.title || undefined;

      switch (type) {
        case "success":
          toastr.success(message, title, options);
          break;
        case "warning":
          toastr.warning(message, title, options);
          break;
        case "error":
          toastr.error(message, title, options);
          break;
        case "info":
          toastr.info(message, title, options);
          break;
        default:
          toastr.info(message, title, options);
      }
    });
  }
});

$.components.register("toolbar", {
  mode: "init",
  init: function(context) {
    if (!$.fn.toolbar) return;

    var defaults = $.components.getDefaults("toolbar");

    $('[data-plugin="toolbar"]', context).each(function() {
      var $this = $(this);
      var content = $this.data("toolbar");

      var options = $.extend(true, {}, defaults);

      if (content) {
        options.content = content;
      }

      $this.toolbar(options);
    });
  }
});

$.components.register("webuiPopover", {
  mode: "default",
  defaults: {
    trigger: "click",
    width: 320,
    multi: true,
    cloaseable: false,
    style: "",
    delay: 300,
    padding: true
  }
});
