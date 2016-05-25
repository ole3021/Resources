/*! jQuery asProgress - v0.1.1 - 2014-12-09
* https://github.com/amazingSurge/jquery-asProgress
* Copyright (c) 2014 amazingSurge; Licensed GPL */
(function($, document, window, undefined) {
    "use strict";

    if (!Date.now){
        Date.now = function() { return new Date().getTime(); };
    }

    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                   || window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS (6|7)/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() {
                    callback(lastTime = nextTime);
                },
                nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }

    function isPercentage(n) {
        return typeof n === 'string' && n.indexOf('%') != -1;
    }

    function getTime(){
        if (typeof window.performance !== 'undefined' && window.performance.now) {
            return window.performance.now();
        } else {
            return Date.now();
        }
    }

    var pluginName = 'asProgress';

    var Plugin = $[pluginName] = function(element, options) {
        this.element = element;
        this.$element = $(element);


        this.options = $.extend({}, Plugin.defaults, options, this.$element.data());

        if(this.options.bootstrap){
            this.namespace = 'progress';

            this.$target = this.$element.find('.progress-bar');

            this.classes = {
                label: this.namespace + '-label',
                bar: this.namespace + '-bar'
            };
        } else {
            this.namespace = this.options.namespace;

            this.classes = {
                label: this.namespace + '__label',
                bar: this.namespace + '__bar'
            };

            this.$target = this.$element;

            this.$element.addClass(this.namespace);
        }

        this.easing = Plugin.easing[this.options.easing] || Plugin.easing["ease"];
        
        this.min = this.$target.attr('aria-valuemin');
        this.max = this.$target.attr('aria-valuemax');
        this.min = this.min? parseInt(this.min, 10): this.options.min;
        this.max = this.max? parseInt(this.max, 10): this.options.max;
        this.first = this.$target.attr('aria-valuenow');
        this.first = this.first? parseInt(this.first, 10): this.min;

        this.now = this.first;
        this.goal = this.options.goal;
        this._frameId = null;

        this.initialized = false;
        this._trigger('init');
        this.init();
    };

    Plugin.defaults = {
        namespace: 'asProgress',
        bootstrap: false,
        min: 0,
        max: 100,
        goal: 100,
        speed: 20, // speed of 1/100
        easing: 'ease',
        labelCallback: function(n) {
            var percentage = this.getPercentage(n);
            return percentage + '%';
        }
    };

    var easingBezier = function (mX1, mY1, mX2, mY2) {    
        function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
        function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
        function C(aA1)      { return 3.0 * aA1; }
       
        // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
        function CalcBezier(aT, aA1, aA2) {
          return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
        }
       
        // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
        function GetSlope(aT, aA1, aA2) {
          return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
        }
       
        function GetTForX(aX) {
          // Newton raphson iteration
          var aGuessT = aX;
          for (var i = 0; i < 4; ++i) {
            var currentSlope = GetSlope(aGuessT, mX1, mX2);
            if (currentSlope === 0.0) return aGuessT;
            var currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
            aGuessT -= currentX / currentSlope;
          }
          return aGuessT;
        }

        if (mX1 === mY1 && mX2 === mY2) {
            return {
                css: 'linear',
                fn: function(aX){
                    return aX;
                }
            };
        } else {
            return {
                css: 'cubic-bezier('+mX1+','+mY1+','+mX2+','+mY2+')',
                fn: function (aX) {
                    return CalcBezier(GetTForX(aX), mY1, mY2);
                }
            }
        }
    };

    $.extend(Plugin.easing = {}, {
        "ease":        easingBezier(0.25, 0.1, 0.25, 1.0), 
        "linear":      easingBezier(0.00, 0.0, 1.00, 1.0),
        "ease-in":     easingBezier(0.42, 0.0, 1.00, 1.0),
        "ease-out":    easingBezier(0.00, 0.0, 0.58, 1.0),
        "ease-in-out": easingBezier(0.42, 0.0, 0.58, 1.0)
    });

    Plugin.prototype = {
        constructor: Plugin,
        init: function() {
            this.$bar = this.$element.find('.' + this.classes.bar);
            this.$label = this.$element.find('.' + this.classes.label);

            this.reset();
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
        getPercentage: function(n) {
            return Math.round(100 * (n - this.min) / (this.max - this.min));
        },
        go: function(goal) {
            var self = this;
            this._clear();

            if (isPercentage(goal)) {
                goal = parseInt(goal.replace('%', ''), 10);
                goal = Math.round(this.min + (goal / 100) * (this.max - this.min));
            }
            if (typeof goal === 'undefined') {
                goal = this.goal;
            }

            if (goal > this.max) {
                goal = this.max;
            } else if (goal < this.min) {
                goal = this.min;
            }

            var start = self.now;
            var startTime = getTime();
            var animation = function(time){
                var distance = (time - startTime)/self.options.speed;
                var next = Math.round(self.easing.fn(distance/100) * (self.max - self.min));

                if(goal > start){
                    next = start + next;
                    if(next > goal){
                        next = goal;
                    }
                } else{
                    next = start - next;
                    if(next < goal){
                        next = goal;
                    }
                }

                self._update(next);
                if (next === goal) {
                    window.cancelAnimationFrame(self._frameId);
                    self._frameId = null;

                    if (self.now === self.goal) {
                        self._trigger('finish');
                    }
                } else {
                    self._frameId =  window.requestAnimationFrame(animation);
                }
            };

            self._frameId =  window.requestAnimationFrame(animation);
        },
        _update: function(n) {
            this.now = n;

            var percenage = this.getPercentage(this.now);
            this.$bar.css('width', percenage + '%');
            this.$target.attr('aria-valuenow', this.now);
            if (this.$label.length > 0 && typeof this.options.labelCallback === 'function') {
                this.$label.html(this.options.labelCallback.call(this, [this.now]));
            }

            this._trigger('update', n);
        },
        get: function() {
            return this.now;
        },
        start: function() {
            this._clear();
            this._trigger('start');
            this.go(this.goal);
        },
        _clear: function() {
            if (this._frameId) {
                window.cancelAnimationFrame(this._frameId);
                this._frameId = null;
            }
        },
        reset: function() {
            this._clear();
            this._update(this.first);
            this._trigger('reset');
        },
        stop: function() {
            this._clear();
            this._trigger('stop');
        },
        finish: function() {
            this._clear();
            this._update(this.goal);
            this._trigger('finish');
        },
        destory: function() {
            this.$element.data(pluginName, null);
            this._trigger('destory');
        }
    };

    $.fn[pluginName] = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = Array.prototype.slice.call(arguments, 1);

            if (/^\_/.test(method)) {
                return false;
            } else if ((/^(get)$/.test(method))) {
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