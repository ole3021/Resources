/*! jQuery asScroll - v0.1.1 - 2015-05-11
* https://github.com/amazingSurge/jquery-asScroll
* Copyright (c) 2015 amazingSurge; Licensed GPL */
(function(window, document, $, undefined) {
    'use strict';
    // Constructor
    //
    var instanceId = 0;
    var getTime = function() {
        if (typeof window.performance !== 'undefined' && window.performance.now) {
            return window.performance.now();
        } else {
            return Date.now();
        }
    };

    var isPercentage = function(n) {
        return typeof n === 'string' && n.indexOf('%') !== -1;
    };

    var convertPercentageToFloat = function(n) {
        return parseFloat(n.slice(0, -1) / 100, 10);
    };

    var requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var cancelAnimationFrame = (function() {
        return window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            function(id) {
                window.clearTimeout(id);
            };
    })();


    var easingBezier = function(mX1, mY1, mX2, mY2) {
        function a(aA1, aA2) {
            return 1.0 - 3.0 * aA2 + 3.0 * aA1;
        }

        function b(aA1, aA2) {
            return 3.0 * aA2 - 6.0 * aA1;
        }

        function c(aA1) {
            return 3.0 * aA1;
        }

        // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
        function calcBezier(aT, aA1, aA2) {
            return ((a(aA1, aA2) * aT + b(aA1, aA2)) * aT + c(aA1)) * aT;
        }

        // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
        function getSlope(aT, aA1, aA2) {
            return 3.0 * a(aA1, aA2) * aT * aT + 2.0 * b(aA1, aA2) * aT + c(aA1);
        }

        function getTForX(aX) {
            // Newton raphson iteration
            var aGuessT = aX;
            for (var i = 0; i < 4; ++i) {
                var currentSlope = getSlope(aGuessT, mX1, mX2);
                if (currentSlope === 0.0) {
                    return aGuessT;
                }
                var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
                aGuessT -= currentX / currentSlope;
            }
            return aGuessT;
        }

        if (mX1 === mY1 && mX2 === mY2) {
            return {
                css: 'linear',
                fn: function(aX) {
                    return aX;
                }
            };
        } else {
            return {
                css: 'cubic-bezier(' + mX1 + ',' + mY1 + ',' + mX2 + ',' + mY2 + ')',
                fn: function(aX) {
                    return calcBezier(getTForX(aX), mY1, mY2);
                }
            };
        }
    };

    var AsScroll = function(element, options) {

        this.element = element;
        this.$element = $(element);
        this.options = $.extend(true, {}, AsScroll.defaults, options);


        if (this.options.containerSelector) {
            this.$container = $(this.options.containerSelector);
        } else {
            this.$container = this.$element.is(document.body) ? $(window) : this.$element.parent();
        }
        if (this.$container.length !== 1) {
            return;
        }

        this.namespace = this.options.namespace;
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
                offsetLength: 'offsetHeight',
                offset: 'top',

                crossOffset: 'left',
                crossLength: 'width',
                crossClientLength: 'clientWidth',
                crossOffsetLength: 'offsetWidth'
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
                offsetLength: 'offsetWidth',
                offset: 'left',

                crossOffset: 'top',
                crossLength: 'height',
                crossClientLength: 'clientHeight',
                crossOffsetLength: 'offsetHeight'
            }
        };


        this.classes = {};
        this.easing = AsScroll.easing[this.options.easing] || AsScroll.easing.ease;
        this.duration = this.options.duration;

        this._frameId = null;
        this._states = {};
        this.instanceId = (++instanceId);

        this.vertical = false;
        this.horizontal = false;


        this.init();
    };

    $.extend(AsScroll.easing = {}, {
        'ease': easingBezier(0.25, 0.1, 0.25, 1.0),
        'linear': easingBezier(0.00, 0.0, 1.00, 1.0),
        'ease-in': easingBezier(0.42, 0.0, 1.00, 1.0),
        'ease-out': easingBezier(0.00, 0.0, 0.58, 1.0),
        'ease-in-out': easingBezier(0.42, 0.0, 0.58, 1.0)
    });

    AsScroll.prototype = {
        constructor: AsScroll,

        getActiveTarget: function(direction) {
            if (!this[direction]) {
                return;
            }

            var offset = this.getOffset(direction),
                attributes = this.attributes[direction],
                activeTarget = null,
                containerLength = this.getContainerLength(direction);

            $.each(this.lists, function(target, obj) {
                var targetOffset = obj.offset[attributes.offset],
                    length = obj.$el[attributes.length]();

                if (targetOffset === offset) {
                    activeTarget = target;
                    return false;
                } else if (targetOffset > offset && targetOffset < offset + containerLength) {
                    activeTarget = target;
                    return false;
                } else if (targetOffset < offset && targetOffset + length > offset) {
                    activeTarget = target;
                    return true;
                } else if (targetOffset > offset + containerLength) {
                    return false;
                }
            });

            return activeTarget;
        },

        init: function() {
            var self = this;

            this.$targets = this.$element.find('[data-scroll-target]');
            this.lists = {};

            if (this.getScrollLength('vertical') > 0) {
                this.vertical = true;
            }

            if (this.getScrollLength('horizontal') > 0) {
                this.horizontal = true;
            }

            this.$targets.each(function() {
                var $target = $(this);

                self.lists[$target.data('scrollTarget')] = {
                    $el: $target,
                    offset: $target.offset()
                };
            });

            this.bindEvents();
        },

        bindEvents: function() {
            var self = this;

            $(window).on(this.eventNameWithId('resize'), function() {
                if ($(window).width() < self.options.mobile.width) {
                    self.duration = self.options.duration;
                    self.easing = AsScroll.easing[self.options.easing] || AsScroll.easing.ease;
                }
            });

            $(window).on(this.eventNameWithId('orientationchange'), function() {
                if ($(window).width() < self.options.mobile.width) {
                    self.duration = self.options.duration;
                    self.easing = AsScroll.easing[self.options.easing] || AsScroll.easing.ease;
                }
            });

            if (!this.horizontal && !this.vertical) {
                return;
            }

            this.$container.on(this.eventName('scroll'), function() {
                if (self.vertical) {
                    self.trigger(self.eventName('active'), ['vertical', self.getActiveTarget('vertical')]);
                }
                if (self.horizontal) {
                    self.trigger(self.eventName('active'), ['horizontal', self.getActiveTarget('horizontal')]);
                }
            });
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
        trigger: function(eventType) {
            var method_arguments = Array.prototype.slice.call(arguments, 1),
                data = [this].concat(method_arguments);

            // event
            this.$element.trigger('AsScroll::' + eventType, data);

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

            this._states[state]++;
        },

        /**
         * Leaves a state.
         */
        leave: function(state) {
            this._states[state]--;
        },


        getOffset: function(direction) {
            var attributes = this.attributes[direction],
                element = this.$element[0];

            return (element[attributes.pageOffset] || element[attributes.scroll]);
        },

        getPercentOffset: function(direction) {
            return this.getOffset(direction) / this.getScrollLength(direction);
        },

        getContainerLength: function(direction) {
            return this.$container[0] === window ? this.$container[this.attributes[direction].length]() : this.$container[0][this.attributes[direction].clientLength];
        },

        getScrollLength: function(direction) {
            var scrollLength = this.$element[0][this.attributes[direction].scrollLength];
            return scrollLength - this.getContainerLength(direction);
        },

        scrollToTarget: function(direction, target, trigger, sync) {
            if (typeof this.lists[target] === 'undefined') {
                return;
            }
            target = this.lists[target];

            var attributes = this.attributes[direction],
                offset = target.offset[attributes.offset];

            this.scrollTo(direction, offset, trigger, sync);
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
            if (!this[direction] || typeof value !== "number") {
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
            };

            if (sync) {

                this.$element[0][attributes.scroll] = value;

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
                    var percent = (time - startTime) / self.duration;


                    if (percent > 1) {
                        percent = 1;
                    }

                    percent = self.easing.fn(percent);

                    var current = parseFloat(start + percent * (end - start), 10);

                    self.$element[0][attributes.scroll] = current;

                    if (trigger !== false) {
                        self.trigger('change', value / self.getScrollLength(direction));
                    }

                    if (percent === 1) {
                        cancelAnimationFrame(self._frameId);
                        self._frameId = null;

                        self.leave('animating');
                        callback();
                    } else {
                        self._frameId = requestAnimFrame(run);
                    }
                };

                self._frameId = requestAnimFrame(run);
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

        scrollXToTarget: function(target, trigger, sync) {
            return this.scrollToTarget('horizontal', target, trigger, sync);
        },

        scrollYToTarget: function(target, trigger, sync) {
            return this.scrollToTarget('vertical', target, trigger, sync);
        }
    };

    AsScroll.defaults = {
        duration: 800,
        easing: 'ease',
        namespace: 'asScroll',
        offsetTop: 50,
        mobile: {
            width: 768,
            duration: 500,
            easing: 'ease',
        }
    };


    $.fn.asScroll = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = Array.prototype.slice.call(arguments, 1);

            return this.each(function() {
                var api = $.data(this, 'asScroll');

                if (api && typeof api[method] === 'function') {
                    api[method].apply(api, method_arguments);
                }
            });
        } else {
            return this.each(function() {
                var api = $.data(this, 'asScroll');
                if (!api) {
                    api = new AsScroll(this, options);
                    $.data(this, 'asScroll', api);
                }
            });
        }
    };
}(window, document, jQuery));
