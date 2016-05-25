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
          return '<li class="' + this.namespace + '-prev"><a href="javascript:void(0)"><span class="icon wb-chevron-left-mini"></span></a></li>';
        }
      },
      next: {
        tpl: function() {
          return '<li class="' + this.namespace + '-next"><a href="javascript:void(0)"><span class="icon wb-chevron-right-mini"></span></a></li>';
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
