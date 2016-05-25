/*! jQuery asPaginator - v0.2.1 - 2015-03-17
* https://github.com/amazingSurge/jquery-asPaginator
* Copyright (c) 2015 amazingSurge; Licensed GPL */
(function($) {
    "use strict";

    $.asPaginator.registerComponent('info', {
        defaults: {
            tpl: function() {
                return '<li class="' + this.namespace + '-info">' +
                    '<a href="javascript:void(0);">' +
                    '<span class="' + this.namespace + '-current">' +
                    '</span> / <span class="' + this.namespace + '-total"></span>' +
                    '</a>' +
                    '</li>';
            }
        },
        init: function(instance) {
            var opts = $.extend({}, this.defaults, instance.options.components.info);

            this.opts = opts;
        },
        bindEvents: function(instance) {
            var $info = instance.$element.find('.' + instance.namespace + '-info'),
                $current = $info.find('.' + instance.namespace + '-current');
            $info.find('.' + instance.namespace + '-total').text(instance.totalPages);

            $current.text(instance.currentPage);
            instance.$element.on('asPaginator::change', function() {
                $current.text(instance.currentPage);
            });
        }
    });
})(jQuery);
