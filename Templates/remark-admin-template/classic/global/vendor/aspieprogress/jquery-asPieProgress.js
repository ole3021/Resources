/*! jQuery asPieProgress - v0.3.4 - 2015-06-19
* https://github.com/amazingSurge/jquery-asPieProgress
* Copyright (c) 2015 amazingSurge; Licensed GPL */
(function(factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module depending on jQuery.
        define(['jquery'], factory);
    } else {
        // No AMD. Register plugin with global jQuery object.
        factory(jQuery);
    }
}(function($) {
    "use strict";

    if (!Date.now) {
        Date.now = function() {
            return new Date().getTime();
        };
    }

    function getTime() {
        if (typeof window.performance !== 'undefined' && window.performance.now) {
            return window.performance.now();
        } else {
            return Date.now();
        }
    }

    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS (6|7)/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = getTime();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() {
                    callback(lastTime = nextTime);
                },
                nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
    var SvgElement = function(tag, attrs) {
        var elem = document.createElementNS("http://www.w3.org/2000/svg", tag);

        $.each(attrs, function(name, value) {
            elem.setAttribute(name, value);
        });

        return elem;
    }
    var svgSupported = "createElementNS" in document && new SvgElement("svg", {}).createSVGRect;

    function isPercentage(n) {
        return typeof n === 'string' && n.indexOf('%') != -1;
    }

    var pluginName = 'asPieProgress';

    var Plugin = $[pluginName] = function(element, options) {
        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, Plugin.defaults, options, this.$element.data());
        this.namespace = this.options.namespace;

        this.classes = this.options.classes;
        this.easing = Plugin.easing[this.options.easing] || Plugin.easing.ease;
        this.$element.addClass(this.classes.element);

        this.min = this.$element.attr('aria-valuemin');
        this.max = this.$element.attr('aria-valuemax');
        this.min = this.min ? parseInt(this.min, 10) : this.options.min;
        this.max = this.max ? parseInt(this.max, 10) : this.options.max;
        this.first = this.$element.attr('aria-valuenow');
        this.first = this.first ? parseInt(this.first, 10) : (this.options.first ? this.options.first : this.min);
        this.now = this.first;
        this.goal = this.options.goal;

        this._frameId = null;

        this.initialized = false;

        this._trigger('init');
        this.init();
    };

    Plugin.defaults = {
        namespace: 'asPieProgress',
        classes: {
            svg: 'pie_progress__svg',
            element: 'pie_progress',
            number: 'pie_progress__number',
            content: 'pie_progress__content'
        },
        min: 0,
        max: 100,
        goal: 100,
        size: 160,
        speed: 15, // speed of 1/100
        barcolor: '#ef1e25',
        barsize: '4',
        trackcolor: '#f2f2f2',
        fillcolor: 'none',
        easing: 'ease',
        numberCallback: function(n) {
            var percentage = Math.round(this.getPercentage(n));
            return percentage + '%';
        },
        contentCallback: null
    };

    var easingBezier = function(mX1, mY1, mX2, mY2) {
        function A(aA1, aA2) {
            return 1.0 - 3.0 * aA2 + 3.0 * aA1;
        }

        function B(aA1, aA2) {
            return 3.0 * aA2 - 6.0 * aA1;
        }

        function C(aA1) {
            return 3.0 * aA1;
        }

        // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
        function CalcBezier(aT, aA1, aA2) {
            return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
        }

        // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
        function GetSlope(aT, aA1, aA2) {
            return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
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
                fn: function(aX) {
                    return aX;
                }
            };
        } else {
            return {
                css: 'cubic-bezier(' + mX1 + ',' + mY1 + ',' + mX2 + ',' + mY2 + ')',
                fn: function(aX) {
                    return CalcBezier(GetTForX(aX), mY1, mY2);
                }
            }
        }
    };

    $.extend(Plugin.easing = {}, {
        "ease": easingBezier(0.25, 0.1, 0.25, 1.0),
        "linear": easingBezier(0.00, 0.0, 1.00, 1.0),
        "ease-in": easingBezier(0.42, 0.0, 1.00, 1.0),
        "ease-out": easingBezier(0.00, 0.0, 0.58, 1.0),
        "ease-in-out": easingBezier(0.42, 0.0, 0.58, 1.0)
    });

    Plugin.prototype = {
        constructor: Plugin,
        init: function() {
            this.$number = this.$element.find('.' + this.classes.number);
            this.$content = this.$element.find('.' + this.classes.content);

            this.size = this.options.size;
            this.width = this.size;
            this.height = this.size;

            this.prepare();

            this.initialized = true;
            this._trigger('ready');
        },
        prepare: function() {
            if (!svgSupported) {
                return;
            }

            this.svg = new SvgElement("svg", {
                "version": "1.1",
                "preserveAspectRatio": "xMinYMin meet",
                "viewBox": "0 0 " + this.width + " " + this.height
            });

            this.buildTrack();
            this.buildBar();

            $('<div class="' + this.classes.svg + '"></div>').append(this.svg).appendTo(this.$element);
        },
        buildTrack: function() {
            var width = this.size,
                height = this.size,
                cx = width / 2,
                cy = height / 2;

            var barsize = this.options.barsize;

            var ellipse = new SvgElement("ellipse", {
                rx: cx - barsize / 2,
                ry: cy - barsize / 2,
                cx: cx,
                cy: cy,
                stroke: this.options.trackcolor,
                fill: this.options.fillcolor,
                'stroke-width': barsize
            });

            this.svg.appendChild(ellipse);
        },
        buildBar: function() {
            if (!svgSupported) {
                return;
            }

            var path = new SvgElement("path", {
                fill: 'none',
                'stroke-width': this.options.barsize,
                stroke: this.options.barcolor
            });
            this.bar = path;
            this.svg.appendChild(path);

            this._drawBar(this.first);
            this._updateBar();
        },
        _drawBar: function(n) {
            if (!svgSupported) {
                return;
            }

            this.bar_goal = n;
            var width = this.size,
                height = this.size,
                cx = width / 2,
                cy = height / 2,
                start_angle = 0;

            var barsize = this.options.barsize;

            var r = Math.min(cx, cy) - barsize / 2;
            this.r = r;
            var percentage = this.getPercentage(n);

            if (percentage === 100) {
                percentage -= 0.0001;
            }
            var end_angle = start_angle + percentage * Math.PI * 2 / 100;

            var x1 = cx + r * Math.sin(start_angle),
                y1 = cy - r * Math.cos(start_angle),
                x2 = cx + r * Math.sin(end_angle),
                y2 = cy - r * Math.cos(end_angle);

            // This is a flag for angles larger than than a half circle
            // It is required by the SVG arc drawing component
            var big = 0;
            if (end_angle - start_angle > Math.PI) big = 1;

            // This string holds the path details
            var d = "M" + x1 + "," + y1 + // Start at (x1,y1)
                " A" + r + "," + r + // Draw an arc of radius r
                " 0 " + big + " 1 " + // Arc details...
                x2 + "," + y2;

            this.bar.setAttribute("d", d);
        },
        _updateBar: function() {
            if (!svgSupported) {
                return;
            }
            var percenage = this.getPercentage(this.now);

            var length = this.bar.getTotalLength();
            var offset = length * (1 - percenage / this.getPercentage(this.bar_goal));

            this.bar.style.strokeDasharray = length + " " + length;
            this.bar.style.strokeDashoffset = offset;
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
        // Return the percentage based on the current step
        getPercentage: function(n) {
            return 100 * (n - this.min) / (this.max - this.min);
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

            if (this.bar_goal < goal) {
                this._drawBar(goal);
            }

            var start = self.now;
            var startTime = getTime();
            var endTime = startTime + Math.abs(start - goal) * 100 * self.options.speed / (self.max - self.min);

            var animation = function(time) {
                var next;

                if (time > endTime) {
                    next = goal;
                } else {
                    var distance = (time - startTime) / self.options.speed;
                    next = Math.round(self.easing.fn(distance / 100) * (self.max - self.min));

                    if (goal > start) {
                        next = start + next;
                        if (next > goal) {
                            next = goal;
                        }
                    } else {
                        next = start - next;
                        if (next < goal) {
                            next = goal;
                        }
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
                    self._frameId = window.requestAnimationFrame(animation);
                }
            };

            self._frameId = window.requestAnimationFrame(animation);
        },
        _update: function(n) {
            this.now = n;

            this._updateBar();

            this.$element.attr('aria-valuenow', this.now);
            if (this.$number.length > 0 && typeof this.options.numberCallback === 'function') {
                this.$number.html(this.options.numberCallback.call(this, [this.now]));
            }
            if (this.$content.length > 0 && typeof this.options.contentCallback === 'function') {
                this.$content.html(this.options.contentCallback.call(this, [this.now]));
            }

            this._trigger('update', n);
        },
        _clear: function() {
            if (this._frameId) {
                window.cancelAnimationFrame(this._frameId);
                this._frameId = null;
            }
        },
        get: function() {
            return this.now;
        },
        start: function() {
            this._clear();
            this._trigger('start');
            this.go(this.goal);
        },
        reset: function() {
            this._clear();
            this._drawBar(this.first);
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
}));
