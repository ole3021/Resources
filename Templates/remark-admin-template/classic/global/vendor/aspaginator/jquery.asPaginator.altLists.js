/*! jQuery asPaginator - v0.2.1 - 2015-03-17
* https://github.com/amazingSurge/jquery-asPaginator
* Copyright (c) 2015 amazingSurge; Licensed GPL */
// altLists

(function($) {
    "use strict";

    $.asPaginator.registerComponent('altLists', {
        defaults: {
            tpl: function() {
                var lists = '',
                    max = this.totalPages,
                    current = this.currentPage,
                    omit = this.calculate(current, max, this.visible),
                    self = this,
                    i;
                var item = function(i, classes) {
                    if (classes === 'active') {
                        return '<li class="' + self.namespace + '-items ' + self.classes.active + '" data-value="' + i + '"><a href="#">' + i + '</a></li>';
                    } else if (classes === 'omit') {
                        return '<li class="' + self.namespace + '-items ' + self.namespace + '_ellipsis" data-value="ellipsis"><a href="#">...</a></li>';
                    } else {
                        return '<li class="' + self.namespace + '-items" data-value="' + i + '"><a href="#">' + i + '</a></li>';
                    }
                }

                if (omit.left === 0) {
                    for (i = 1; i <= current - 1; i++) {
                        lists += item(i);
                    }
                    lists += item(current, 'active');
                } else {
                    for (i = 1; i <= 2; i++) {
                        lists += item(i);
                    }

                    lists += item(current, 'omit');

                    for (i = current - this.visible + 1; i <= current - 1; i++) {
                        lists += item(i);
                    }

                    lists += item(current, 'active');
                }

                if (omit.right === 0) {
                    for (i = current + 1; i <= max; i++) {
                        lists += item(i);
                    }
                } else {
                    for (i = current + 1; i <= current + this.visible - 1; i++) {
                        lists += item(i);
                    }

                    lists += item(current, 'omit');

                    for (i = max - 1; i <= max; i++) {
                        lists += item(i);
                    }
                }

                return lists;
            }
        },
        init: function(instance) {
            var opts = $.extend({}, this.defaults, instance.options.components.altLists);

            this.opts = opts;
        },
        bindEvents: function(instance) {
            var self = this;
            this.$items = instance.$element.find('.' + instance.namespace + '-items');
            instance.$element.on('click', this.$items, function(e) {
                var page = $(e.target).parent().data('value') || $(e.target).data('value');

                if (page === undefined) {
                    //console.log("wrong page value or prev&&next");
                    return false;
                }

                if (page === 'ellipsis') {
                    return false;
                }

                if (page === '') {
                    return false;
                }

                instance.goTo(page);
            })

            self.render(instance);
            instance.$element.on('asPaginator::change', function() {
                self.render(instance);
            });
        },
        unbindEvents: function(instance) {
            instance.$wrap.off('click', this.$items);
        },
        resize: function(instance) {
            this.render(instance);
        },
        render: function(instance) {
            var self = this,
                array = this.$items.removeClass(instance.classes.active);
            $.each(array, function(i, v) {
                if (i === 0) {
                    $(v).replaceWith(self.opts.tpl.call(instance));
                } else {
                    $(v).remove();
                }
            });
            this.$items = instance.$element.find('.' + instance.namespace + '-items');
        }
    });
})(jQuery);
