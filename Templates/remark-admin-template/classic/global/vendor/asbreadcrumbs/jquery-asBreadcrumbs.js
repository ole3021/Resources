/*! jQuery asBreadcrumbs - v0.1.0 - 2015-05-08
* https://github.com/amazingSurge/jquery-asBreadcrumbs
* Copyright (c) 2015 amazingSurge; Licensed GPL */
(function($, document, window, undefined) {
    "use strict";

    var pluginName = 'asBreadcrumbs';

    var Plugin = $[pluginName] = function(element, options) {
        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, Plugin.defaults, options, this.$element.data());

        this._plugin = pluginName;
        this.namespace = this.options.namespace;

        this.$element.addClass(this.namespace);
        // flag
        this.disabled = false;
        this.initialized = false;

        this._trigger('init');
        this.init();
    };

    Plugin.prototype = {
        constructor: Plugin,
        init: function() {
            var self = this;

            this.createDropList = false;
            this.childrenWithWidths = [];
            this.current = 0;
            this.dropdownWidth = 0;

            var children = this.options.getItem(this.$element);
            children.each(function() {
                self.childrenWithWidths.push([$(this), $(this).outerWidth()]);
            });
            this.length = this.childrenWithWidths.length;

            this.$element.addClass(this.namespace + '-' + this.options.overflow);

            // In order to get the dropdownWidth
            this.createDropdown();
            this.deleteDropdown();

            this.calculate();

            if (this.options.responsive) {
                $(window).on('resize', this._throttle(function() {
                    self.resize.call(self);
                }, 250));
            }

            this.initialized = true;
            this._trigger('ready');
        },
        _trigger: function(eventType) {
            var method_arguments = Array.prototype.slice.call(arguments, 1),
                data = [this].concat(method_arguments);

            // event
            this.$element.trigger(pluginName + '::' + eventType, data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;
            if (typeof this.options[onFunction] === 'function') {
                this.options[onFunction].apply(this, method_arguments);
            }
        },
        createDropdown: function() {
            if (this.createDropList === true) {
                return;
            }
            var dropdown = this.options.dropdown();
            this.$dropdownWrap = this.$element.children().eq(0).clone().removeClass().addClass(this.namespace + '-dropdown').html(dropdown);

            if (this.options.ellipsis) {
                this.$ellipsis = this.$element.children().eq(0).clone().removeClass().addClass(this.namespace + '-ellipsis').html(this.options.ellipsis);
            }

            if (this.options.overflow === 'right') {
                this.$dropdownWrap.appendTo(this.$element);

                if (this.options.ellipsis) {
                    this.$ellipsis.insertBefore(this.$dropdownWrap);
                }
            } else {
                this.$dropdownWrap.prependTo(this.$element);

                if (this.options.ellipsis) {
                    this.$ellipsis.insertAfter(this.$dropdownWrap);
                }
            }

            this.dropdownWidth = this.$dropdownWrap.outerWidth() + (this.options.ellipsis ? this.$ellipsis.outerWidth() : 0);
            this.createDropList = true;
        },
        deleteDropdown: function() {
            if (this.current > 1) {
                return;
            }

            this.$element.find('.' + this.namespace + '-dropdown').remove();
            if (this.options.ellipsis) {
                this.$element.find('.' + this.namespace + '-ellipsis').remove();
            }
            this.createDropList = false;
        },
        _getParameters: function() {
            var width = 0;
            this.$element.children().each(function() {
                if ($(this).css('display') === 'inline-block' && $(this).css('float') === 'none') {
                    width += 6;
                }
            });
            this.width = this.$element.width() - width;
            if (this.createDropList) {
                this.childrenWidthTotal = this.$dropdownWrap.outerWidth() + (this.options.ellipsis ? 0 : this.$ellipsis.outerWidth());
            } else {
                this.childrenWidthTotal = 0;
            }
        },
        calculate: function() {
            this._getParameters();

            var real, reverse;
            for (var i = 0; i < this.length; i++) {
                this.current = this.$element.find('.' + this.namespace + '-menu').children().length;
                if (this.options.overflow === "left") {
                    real = this.length - i - 1;
                    reverse = this.current - 1;
                } else {
                    real = i;
                    reverse = this.length - this.current;
                }

                this.childrenWidthTotal += this.childrenWithWidths[real][1];
                if (this.childrenWidthTotal + this.dropdownWidth > this.width) {
                    this.createDropdown();
                    $(this.childrenWithWidths[real][0]).appendTo(this.$element.find('.' + this.namespace + '-menu'));
                } else if (real === reverse && this.childrenWidthTotal + this.dropdownWidth < this.width) {
                    if (this.options.overflow === "left") {
                        if (this.options.ellipsis) {
                            $(this.childrenWithWidths[reverse][0].insertAfter(this.$ellipsis));
                        } else {
                            $(this.childrenWithWidths[reverse][0].insertAfter(this.$dropdownWrap));
                        }
                    } else {
                        if (this.options.ellipsis) {
                            $(this.childrenWithWidths[reverse][0].insertBefore(this.$ellipsis));
                        } else {
                            $(this.childrenWithWidths[reverse][0].insertBefore(this.$dropdownWrap));
                        }
                    }
                    this.deleteDropdown();
                }
            }
        },
        resize: function() {
            this._trigger('resize');

            this.calculate();
        },
        _throttle: function(func, wait) {
            var _now = Date.now || function() {
                return new Date().getTime();
            };
            var context, args, result;
            var timeout = null;
            var previous = 0;
            var later = function() {
                previous = _now();
                timeout = null;
                result = func.apply(context, args);
                context = args = null;
            };
            return function() {
                var now = _now();
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                    context = args = null;
                } else if (!timeout) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        destory: function() {
            // detached events first
            // then remove all js generated html
            this.$element.data(pluginName, null);
            this._trigger('destory');
        }
    };

    Plugin.defaults = {
        namespace: pluginName,
        overflow: "left",
        ellipsis: "&#8230;",
        dropicon: "caret",
        responsive: true,

        dropdown: function() {
            return '<div class=\"dropdown\">' +
                '<a href=\"javascript:void(0);\" class=\"' + this.namespace + '-toggle\" data-toggle=\"dropdown\"><i class=\"' + this.dropicon + '\"></i></a>' +
                '<ul class=\"' + this.namespace + '-menu dropdown-menu\"></ul>' +
                '</div>';
        },

        getItem: function($parent) {
            return $parent.children();
        },

        // callback
        onInit: null,
        onReady: null
    };

    $.fn[pluginName] = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = Array.prototype.slice.call(arguments, 1);

            if (/^\_/.test(method)) {
                return false;
            } else if ((/^(get)/.test(method))) {
                var api = this.first().data(pluginName);
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, method_arguments);
                }
            } else {
                return this.each(function() {
                    var api = $.data(this, pluginName);
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, method_arguments);
                    }
                });
            }
        } else {
            return this.each(function() {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new Plugin(this, options));
                }
            });
        }
    };
})(jQuery, document, window);
