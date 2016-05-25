/*! jQuery asScrollable - v0.3.1 - 2015-06-15
* https://github.com/amazingSurge/jquery-asScrollable
* Copyright (c) 2015 amazingSurge; Licensed GPL */
(function(window, document, $, Scrollbar, undefined) {
    "use strict";

    var pluginName = 'asScrollable';
    var instanceId = 0;

    /**
     * Helper functions
     **/
    function getTime() {
        if (typeof window.performance !== 'undefined' && window.performance.now) {
            return window.performance.now();
        } else {
            return Date.now();
        }
    }

    function isPercentage(n) {
        return typeof n === 'string' && n.indexOf('%') != -1;
    }

    function conventToPercentage(n) {
        if (n < 0) {
            n = 0;
        } else if (n > 1) {
            n = 1;
        }
        return parseFloat(n).toFixed(4) * 100 + '%';
    }

    function convertPercentageToFloat(n) {
        return parseFloat(n.slice(0, -1) / 100, 10);
    }

    var isFFLionScrollbar = (function() {
        var isOSXFF, ua, version;
        ua = window.navigator.userAgent;
        isOSXFF = /(?=.+Mac OS X)(?=.+Firefox)/.test(ua);
        if (!isOSXFF) {
            return false;
        }
        version = /Firefox\/\d{2}\./.exec(ua);
        if (version) {
            version = version[0].replace(/\D+/g, '');
        }
        return isOSXFF && +version > 23;
    })();

    var Plugin = $[pluginName] = function(options, element) {
        this.$element = $(element);
        options = this.options = $.extend({}, Plugin.defaults, options || {}, this.$element.data('options') || {});

        this.classes = {
            wrap: options.namespace,
            content: options.namespace + '-content',
            container: options.namespace + '-container',
            bar: options.namespace + '-bar',
            barHide: options.namespace + '-bar-hide',
            skin: options.skin
        };

        this.attributes = {
            vertical: {
                axis: 'Y',
                overflow: 'overflow-y',

                scroll: 'scrollTop',
                scrollLength: 'scrollHeight',
                pageOffset: 'pageYOffset',

                ffPadding: 'padding-right',

                length: 'height',
                clientLength: 'clientHeight',
                offset: 'offsetHeight',

                crossLength: 'width',
                crossClientLength: 'clientWidth',
                crossOffset: 'offsetWidth'
            },
            horizontal: {
                axis: 'X',
                overflow: 'overflow-x',

                scroll: 'scrollLeft',
                scrollLength: 'scrollWidth',
                pageOffset: 'pageXOffset',

                ffPadding: 'padding-bottom',

                length: 'width',
                clientLength: 'clientWidth',
                offset: 'offsetWidth',

                crossLength: 'height',
                crossClientLength: 'clientHeight',
                crossOffset: 'offsetHeight'
            }
        };

        // Current state information.
        this._states = {};

        // Supported direction
        this.horizontal = null;
        this.vertical = null;

        this.$bar = null;

        // Current timeout
        this._frameId = null;
        this._timeoutId = null;

        this.instanceId = (++instanceId);

        this.easing = Scrollbar.easing[this.options.easing] || Scrollbar.easing.ease;

        var position = this.$element.css('position');
        if (this.options.containerSelector) {
            this.$container = this.$element.find(this.options.containerSelector);
            this.$wrap = this.$element;

            if (position == 'static') {
                this.$wrap.css('position', 'relative');
            }
        } else {
            this.$container = this.$element.wrap('<div>');
            this.$wrap = this.$container.parent();
            this.$wrap.height(this.$element.height());

            if (position !== 'static') {
                this.$wrap.css('position', position);
            } else {
                this.$wrap.css('position', 'relative');
            }
        }

        if (this.options.contentSelector) {
            this.$content = this.$container.find(this.options.contentSelector);
        } else {
            this.$content = this.$container.wrap('<div>');
            this.$container = this.$content.parent();
        }

        this.init();
    };

    Plugin.defaults = {
        namespace: pluginName,

        skin: null,

        contentSelector: null,
        containerSelector: null,

        enabledClass: 'is-enabled',
        disabledClass: 'is-disabled',

        draggingClass: 'is-dragging',
        hoveringClass: 'is-hovering',
        scrollingClass: 'is-scrolling',

        direction: 'vertical', // vertical, horizontal, both, auto

        showOnHover: true,
        showOnBarHover: false,

        duration: 500,
        easing: 'ease-in', // linear, ease, ease-in, ease-out, ease-in-out

        responsive: true,
        throttle: 20,

        scrollbar: {}
    };

    Plugin.prototype = {
        constructor: Plugin,

        init: function() {
            switch (this.options.direction) {
                case 'vertical':
                    this.vertical = true;
                    break;
                case 'horizontal':
                    this.horizontal = true;
                    break;
                case 'both':
                    this.horizontal = true;
                    this.vertical = true;
                    break;
                case 'auto':
                    var overflowX = this.$element.css('overflow-x'),
                        overflowY = this.$element.css('overflow-y');

                    if (overflowX === 'scroll' || overflowX === 'auto') {
                        this.horizontal = true;
                    }
                    if (overflowY === 'scroll' || overflowY === 'auto') {
                        this.vertical = true;
                    }
                    break;
            }

            if (!this.vertical && !this.horizontal) {
                return;
            }

            this.$wrap.addClass(this.classes.wrap);
            this.$container.addClass(this.classes.container);
            this.$content.addClass(this.classes.content);

            if (this.options.skin) {
                this.$wrap.addClass(this.classes.skin);
            }

            this.$wrap.addClass(this.options.enabledClass);

            if (this.vertical) {
                this.$wrap.addClass(this.classes.wrap + '-vertical');
                this.initLayout('vertical');
                this.createBar('vertical');
            }

            if (this.horizontal) {
                this.$wrap.addClass(this.classes.wrap + '-horizontal');
                this.initLayout('horizontal');
                this.createBar('horizontal');
            }

            this.bindEvents();
        },

        bindEvents: function() {
            var self = this;
            var options = this.options;

            if (options.responsive) {
                $(window).on(this.eventNameWithId('orientationchange'), function() {
                    self.update.call(self);
                });
                $(window).on(this.eventNameWithId('resize'), this.throttle(function() {
                    self.update.call(self);
                }, options.throttle));
            }

            if (!this.horizontal && !this.vertical) {
                return;
            }

            this.$wrap.on(this.eventName('mouseenter'), function() {
                self.$wrap.addClass(self.options.hoveringClass);
                self.enter('hovering');
                self.trigger('hover');
            });

            this.$wrap.on(this.eventName('mouseleave'), function() {
                self.$wrap.removeClass(self.options.hoveringClass);

                if (!self.is('hovering')) {
                    return;
                }
                self.leave('hovering');
                self.trigger('hovered');
            });

            if (options.showOnHover) {
                if (options.showOnBarHover) {
                    this.$bar.on('asScrollbar::hover', function() {
                        self.showBar(this.direction);
                    }).on('asScrollbar::hovered', function() {
                        self.hideBar(this.direction);
                    });
                } else {
                    this.$element.on(pluginName + '::hover', $.proxy(this.showBar, this));
                    this.$element.on(pluginName + '::hovered', $.proxy(this.hideBar, this));
                }
            }

            this.$container.on(this.eventName('scroll'), function() {
                if (self.horizontal) {
                    var oldLeft = self.offsetLeft;
                    self.offsetLeft = self.getOffset('horizontal');

                    if (oldLeft !== self.offsetLeft) {
                        self.trigger('scroll', self.getPercentOffset('horizontal'), 'horizontal');

                        if (self.offsetLeft === 0) {
                            self.trigger('scrolltop', 'horizontal');
                        }
                        if (self.offsetLeft === self.getScrollLength('horizontal')) {
                            self.trigger('scrollend', 'horizontal');
                        }
                    }
                }

                if (self.vertical) {
                    var oldTop = self.offsetTop;

                    self.offsetTop = self.getOffset('vertical');

                    if (oldTop !== self.offsetTop) {
                        self.trigger('scroll', self.getPercentOffset('vertical'), 'vertical');

                        if (self.offsetTop === 0) {
                            self.trigger('scrolltop', 'vertical');
                        }
                        if (self.offsetTop === self.getScrollLength('vertical')) {
                            self.trigger('scrollend', 'vertical');
                        }
                    }
                }
            });

            this.$element.on(pluginName + '::scroll', function(e, api, value, direction) {
                if (!self.is('scrolling')) {
                    self.enter('scrolling');
                    self.$wrap.addClass(self.options.scrollingClass);
                }
                var bar = api.getBarApi(direction);

                bar.moveTo(conventToPercentage(value), false, true);

                clearTimeout(self._timeoutId);
                self._timeoutId = setTimeout(function() {
                    self.$wrap.removeClass(self.options.scrollingClass);
                    self.leave('scrolling');
                }, 200);
            });

            this.$bar.on('asScrollbar::change', function(e, api, value) {
                self.scrollTo(this.direction, conventToPercentage(value), false, true);
            });

            this.$bar.on('asScrollbar::drag', function() {
                self.$wrap.addClass(self.options.draggingClass);
            }).on('asScrollbar::dragged', function() {
                self.$wrap.removeClass(self.options.draggingClass);
            });
        },

        unbindEvents: function() {
            this.$wrap.off(this.eventName());
            this.$element.off(pluginName + '::scroll').off(pluginName + '::hover').off(pluginName + '::hovered');
            this.$container.off(this.eventName());
            $(window).off(this.eventNameWithId());
        },

        initLayout: function(direction) {
            if (direction === 'vertical') {
                this.$container.css('height', this.$wrap.height());
            }
            var attributes = this.attributes[direction],
                container = this.$container[0];

            // this.$container.css(attributes.overflow, 'scroll');

            var scrollbarWidth = this.getBrowserScrollbarWidth(direction),
                parentLength = container.parentNode[attributes.crossClientLength];

            this.$content.css(attributes.crossLength, parentLength + 'px');
            this.$container.css(attributes.crossLength, scrollbarWidth + parentLength + 'px');

            if (scrollbarWidth === 0 && isFFLionScrollbar) {
                this.$container.css(attributes.ffPadding, 16);
            }
        },

        createBar: function(direction) {
            var options = $.extend(this.options.scrollbar, {
                namespace: this.classes.bar,
                direction: direction,
                useCssTransitions: false,
                keyboard: false
                    //mousewheel: false
            });
            var $bar = $('<div>');
            $bar.asScrollbar(options);

            if (this.options.showOnHover) {
                $bar.addClass(this.classes.barHide);
            }

            $bar.appendTo(this.$wrap);

            this['$' + direction] = $bar;

            if (this.$bar === null) {
                this.$bar = $bar;
            } else {
                this.$bar = this.$bar.add($bar);
            }

            this.updateBarHandle(direction);
        },

        trigger: function(eventType) {
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

        /**
         * Checks whether the carousel is in a specific state or not.
         */
        is: function(state) {
            return this._states[state] && this._states[state] > 0;
        },

        /**
         * Enters a state.
         */
        enter: function(state) {
            if (this._states[state] === undefined) {
                this._states[state] = 0;
            }

            this._states[state] ++;
        },

        /**
         * Leaves a state.
         */
        leave: function(state) {
            this._states[state] --;
        },

        eventName: function(events) {
            if (typeof events !== 'string' || events === '') {
                return '.' + this.options.namespace;
            }

            events = events.split(' ');
            var length = events.length;
            for (var i = 0; i < length; i++) {
                events[i] = events[i] + '.' + this.options.namespace;
            }
            return events.join(' ');
        },

        eventNameWithId: function(events) {
            if (typeof events !== 'string' || events === '') {
                return this.options.namespace + '-' + this.instanceId;
            }

            events = events.split(' ');
            var length = events.length;
            for (var i = 0; i < length; i++) {
                events[i] = events[i] + '.' + this.options.namespace + '-' + this.instanceId;
            }
            return events.join(' ');
        },

        /**
         * _throttle
         * @description Borrowed from Underscore.js
         */
        throttle: function(func, wait) {
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

        getBrowserScrollbarWidth: function(direction) {
            var attributes = this.attributes[direction],
                outer, outerStyle;
            if (attributes.scrollbarWidth) {
                return attributes.scrollbarWidth;
            }
            outer = document.createElement('div');
            outerStyle = outer.style;
            outerStyle.position = 'absolute';
            outerStyle.width = '100px';
            outerStyle.height = '100px';
            outerStyle.overflow = 'scroll';
            outerStyle.top = '-9999px';
            document.body.appendChild(outer);
            attributes.scrollbarWidth = outer[attributes.offset] - outer[attributes.clientLength];
            document.body.removeChild(outer);
            return attributes.scrollbarWidth;
        },

        getOffset: function(direction) {
            var attributes = this.attributes[direction],
                container = this.$container[0];

            return (container[attributes.pageOffset] || container[attributes.scroll]);
        },

        getPercentOffset: function(direction) {
            return this.getOffset(direction) / this.getScrollLength(direction);
        },

        getContainerLength: function(direction) {
            return this.$container[0][this.attributes[direction].clientLength];
        },

        getScrollLength: function(direction) {
            var scrollLength = this.$content[0][this.attributes[direction].scrollLength];
            return scrollLength - this.getContainerLength(direction);
        },

        scrollTo: function(direction, value, trigger, sync) {
            var type = typeof value;

            if (type === "string") {
                if (isPercentage(value)) {
                    value = convertPercentageToFloat(value) * this.getScrollLength(direction);
                }

                value = parseFloat(value);
                type = "number";
            }

            if (type !== "number") {
                return;
            }

            this.move(direction, value, trigger, sync);
        },

        scrollBy: function(direction, value, trigger, sync) {
            var type = typeof value;

            if (type === "string") {
                if (isPercentage(value)) {
                    value = convertPercentageToFloat(value) * this.getScrollLength(direction);
                }

                value = parseFloat(value);
                type = "number";
            }

            if (type !== "number") {
                return;
            }

            this.move(direction, this.getOffset(direction) + value, trigger, sync);
        },

        move: function(direction, value, trigger, sync) {
            if (this[direction] !== true || typeof value !== "number") {
                return;
            }
            var self = this;

            this.enter('moving');

            if (value < 0) {
                value = 0;
            } else if (value > this.getScrollLength(direction)) {
                value = this.getScrollLength(direction);
            }

            var attributes = this.attributes[direction];

            var callback = function() {
                self.leave('moving');
            }

            if (sync) {
                this.$container[0][attributes.scroll] = value;

                if (trigger !== false) {
                    this.trigger('change', value / this.getScrollLength(direction));
                }
                callback();
            } else {
                self.enter('animating');
                var startTime = getTime();
                var start = self.getOffset(direction);
                var end = value;

                var run = function(time) {
                    var percent = (time - startTime) / self.options.duration;

                    if (percent > 1) {
                        percent = 1;
                    }

                    percent = self.easing.fn(percent);

                    var current = parseFloat(start + percent * (end - start), 10);
                    self.$container[0][attributes.scroll] = current;

                    if (trigger !== false) {
                        self.trigger('change', value / self.getScrollLength(direction));
                    }

                    if (percent === 1) {
                        window.cancelAnimationFrame(self._frameId);
                        self._frameId = null;

                        self.leave('animating');
                        callback();
                    } else {
                        self._frameId = window.requestAnimationFrame(run);
                    }
                };

                self._frameId = window.requestAnimationFrame(run);
            }
        },

        scrollXto: function(value, trigger, sync) {
            return this.scrollTo('horizontal', value, trigger, sync);
        },

        scrollYto: function(value, trigger, sync) {
            return this.scrollTo('vertical', value, trigger, sync);
        },

        scrollXby: function(value, trigger, sync) {
            return this.scrollBy('horizontal', value, trigger, sync);
        },

        scrollYby: function(value, trigger, sync) {
            return this.scrollBy('vertical', value, trigger, sync);
        },

        getBar: function(direction) {
            if (direction && this['$' + direction]) {
                return this['$' + direction];
            } else {
                return this.$bar;
            }
        },

        getBarApi: function(direction) {
            return this.getBar(direction).data('asScrollbar');
        },

        getBarX: function() {
            return this.getBar('horizontal');
        },

        getBarY: function() {
            return this.getBar('vertical');
        },

        showBar: function(direction) {
            this.getBar(direction).removeClass(this.classes.barHide);
        },

        hideBar: function(direction) {
            this.getBar(direction).addClass(this.classes.barHide);
        },

        updateBarHandle: function(direction) {
            var api = this.getBarApi(direction);

            var scrollLength = this.getScrollLength(direction),
                containerLength = this.getContainerLength(direction);

            if (scrollLength > 0) {
                if (api.is('disabled')) {
                    api.enable();
                }
                api.setHandleLength(api.getBarLength() * containerLength / (scrollLength + containerLength), true);
            } else {
                api.disable();
            }
        },

        disable: function() {
            if (!this.is('disabled')) {
                this.enter('disabled');
                this.$wrap.addClass(this.options.disabledClass).removeClass(this.options.enabledClass);

                this.unbindEvents();
                this.unStyle();
            }
        },

        enable: function() {
            if (this.is('disabled')) {
                this.leave('disabled');
                this.$wrap.addClass(this.options.enabledClass).removeClass(this.options.disabledClass);

                this.bindEvents();
                this.update();
            }
        },

        update: function() {
            if (this.is('disabled')) {
                return;
            }
            if (this.vertical) {
                this.initLayout('vertical');
                this.updateBarHandle('vertical');
            }
            if (this.horizontal) {
                this.initLayout('horizontal');
                this.updateBarHandle('horizontal');
            }
        },
        unStyle: function() {
            if (this.horizontal) {
                this.$container.css({
                    'height': '',
                    'padding-bottom': ''
                });
                this.$content.css({
                    'height': ''
                });
            }
            if (this.vertical) {
                this.$container.css({
                    'width': '',
                    'height': '',
                    'padding-right': ''
                });
                this.$content.css({
                    'width': ''
                });
            }
            if (!this.options.containerSelector) {
                this.$wrap.css({
                    'height': ''
                });
            }
        },

        destory: function() {
            this.$wrap.removeClass(this.classes.wrap + '-vertical')
                .removeClass(this.classes.wrap + '-horizontal')
                .removeClass(this.classes.wrap)
                .removeClass(this.options.enabledClass)
                .removeClass(this.classes.disabledClass);
            this.unStyle();

            if (this.$bar) {
                this.$bar.remove();
            }

            this.unbindEvents();


            if (this.options.containerSelector) {
                this.$container.removeClass(this.classes.container);
            } else {
                this.$container.unwrap();
            }
            if (!this.options.contentSelector) {
                this.$content.unwrap();
            }
            this.$content.removeClass(this.classes.content);
            this.$element.data(pluginName, null);
        }
    }

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
                if (!$(this).data(pluginName)) {
                    $(this).data(pluginName, new Plugin(options, this));
                } else {
                    $(this).data(pluginName).update();
                }
            });
        }
        return this;
    };

})(window, document, jQuery, (function($) {
    "use strict"
    if ($.asScrollbar === undefined) {
        // console.info('lost dependency lib of $.asScrollbar , please load it first !');
        return false;
    } else {
        return $.asScrollbar;
    }
}(jQuery)));
