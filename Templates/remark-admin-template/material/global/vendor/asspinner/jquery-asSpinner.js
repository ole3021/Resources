/*! jquery asSpinner - v0.2.0 - 2014-09-06
* https://github.com/amazingSurge/jquery-asSpinner
* Copyright (c) 2014 amazingSurge; Licensed GPL */
(function($) {
    "use strict";

    var AsSpinner = $.asSpinner = function(element, options) {
        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, AsSpinner.defaults, options, this.$element.data());
        this.namespace = this.options.namespace;

        if (this.options.rule) {
            var self = this;
            var array = ['min', 'max', 'step', 'precision'];
            $.each(array, function(key, value) {
                self[value] = AsSpinner.rules[self.options.rule][value];
            });
        } else {
            this.min = this.options.min;
            this.max = this.options.max;
            this.step = this.options.step;
            this.precision = this.options.precision;
        }

        this.disabled = this.options.disabled;
        if (this.$element.prop('disabled')) {
            this.disabled = true;
        }

        this.value = this.options.parse(this.$element.val());

        this.mousewheel = this.options.mousewheel;
        if (this.mousewheel && !$.event.special.mousewheel) {
            this.mousewheel = false;
        }

        this.eventBinded = false;
        this.spinTimeout = null;
        this.isFocused = false;

        this.classes = {
            disabled: this.namespace + '_disabled',
            skin: this.namespace + '_' + this.options.skin,
            focus: this.namespace + '_focus',

            control: this.namespace + '-control',
            down: this.namespace + '-down',
            up: this.namespace + '-up',
            wrap: this.namespace
        };

        this._trigger('init');
        this.init();
    };
    AsSpinner.prototype = {
        constructor: AsSpinner,
        init: function() {
            this.$control = $('<div class="' + this.namespace + '-control"><span class="' + this.classes.up + '"></span><span class="' + this.classes.down + '"></span></div>');
            this.$wrap = this.$element.wrap('<div tabindex="0" class="' + this.classes.wrap + '"></div>').parent();
            this.$down = this.$control.find('.' + this.classes.down);
            this.$up = this.$control.find('.' + this.classes.up);

            if (this.options.skin) {
                this.$wrap.addClass(this.classes.skin);
            }

            this.$control.appendTo(this.$wrap);

            if (this.disabled === false) {
                // attach event
                this.bindEvent();
            } else {
                this.disable();
            }

            // inital
            this._trigger('ready');
        },
        _trigger: function(eventType) {
            var method_arguments = Array.prototype.slice.call(arguments, 1),
                data = [this].concat(method_arguments.concat);

            // event
            this.$element.trigger('asSpinner::' + eventType, data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;
            if (typeof this.options[onFunction] === 'function') {
                this.options[onFunction].apply(this, method_arguments);
            }
        },
        // 500ms to detect if it is a click event
        // 60ms interval execute if it if long pressdown
        spin: function(fn, timeout) {
            var self = this;
            var spinFn = function(timeout) {
                clearTimeout(self.spinTimeout);
                self.spinTimeout = setTimeout(function() {
                    fn.call(self);
                    spinFn(60);
                }, timeout);
            };
            spinFn(timeout || 500);
        },
        bindEvent: function() {
            var self = this;
            this.eventBinded = true;

            this.$wrap.on('focus.asSpinner', function() {
                self.$wrap.addClass(self.classes.focus);
            }).on('blur.asSpinner', function() {
                if (!self.isFocused) {
                    self.$wrap.removeClass(self.classes.focus);
                }
            });

            this.$down.on('mousedown.asSpinner', function() {
                $(document).one('mouseup.asSpinner', function() {
                    clearTimeout(self.spinTimeout);
                });
                self.spin(self.spinDown);
            }).on('mouseup.asSpinner', function() {
                clearTimeout(self.spinTimeout);
                $(document).off('mouseup.asSpinner');
            }).on('click.asSpinner', function() {
                self.spinDown.call(self);

            });

            this.$up.on('mousedown.asSpinner', function() {
                $(document).one('mouseup.asSpinner', function() {
                    clearTimeout(self.spinTimeout);
                });
                self.spin(self.spinUp);
            }).on('mouseup.asSpinner', function() {
                clearTimeout(self.spinTimeout);
                $(document).off('mouseup.asSpinner');
            }).on('click.asSpinner', function() {
                self.spinUp.call(self);
            });

            this.$element.on('focus.asSpinner', function() {
                self.isFocused = true;
                self.$wrap.addClass(self.classes.focus);

                // keyboard support
                $(this).on('keydown.asSpinner', function(e) {
                    var key = e.keyCode || e.which;
                    if (key === 38) {
                        self.applyValue();
                        self.spinUp();
                        return false;
                    }
                    if (key === 40) {
                        self.applyValue();
                        self.spinDown();
                        return false;
                    }
                    if (key <= 57 && key >= 48) {
                        setTimeout(function() {
                            //self.set(parseFloat(it.value));
                        }, 0);
                    }
                });

                // mousewheel support
                if (self.mousewheel === true) {
                    $(this).mousewheel(function(event, delta) {
                        if (delta > 0) {
                            self.spinUp();
                        } else {
                            self.spinDown();
                        }
                        return false;
                    });
                }
            }).on('blur.asSpinner', function() {
                self.isFocused = false;
                self.$wrap.removeClass(self.classes.focus);
                $(this).off('keydown.asSpinner');
                if (self.mousewheel === true) {
                    $(this).unmousewheel();
                }
                self.applyValue();
            });
        },
        unbindEvent: function() {
            this.eventBinded = false;
            this.$element.off('.asSpinner');
            this.$down.off('.asSpinner');
            this.$up.off('.asSpinner');
            this.$wrap.off('.asSpinner');
        },
        isNumber: function(value) {
            // get rid of NaN
            if (typeof value === 'number' && $.isNumeric(value)) {
                return true;
            } else {
                return false;
            }
        },
        isOutOfBounds: function(value) {
            if (value < this.min) {
                return -1;
            }
            if (value > this.max) {
                return 1;
            }
            return 0;
        },
        applyValue: function() {
            if (this.options.format(this.value) !== this.$element.val()) {
                this.set(this.options.parse(this.$element.val()));
            }
        },
        _set: function(value) {
            if (isNaN(value)) {
                value = this.min;
            }
            var valid = this.isOutOfBounds(value);
            if (valid !== 0) {
                if (this.options.looping === true) {
                    value = (valid === 1) ? this.min : this.max;
                } else {
                    value = (valid === -1) ? this.min : this.max;
                }
            }
            this.value = value = Number(value).toFixed(this.precision);

            this.$element.val(this.options.format(this.value));
        },
        set: function(value) {
            this._set(value);

            this._trigger('change', this.value, this.options.name, 'asSpinner');
        },
        get: function() {
            return this.value;
        },
        /* Public methods */
        update: function(obj) {
            var self = this;
            ['min', 'max', 'precision', 'step'].map(function(value) {
                if (obj[value]) {
                    self[value] = obj[value];
                }
            });
            if (obj.value) {
                this.set(obj.value);
            }
            return this;
        },
        val: function(value) {
            if (value) {
                this.set(this.options.parse(value));
            } else {
                return this.get();
            }
        },
        spinDown: function() {
            if (!$.isNumeric(this.value)) {
                this.value = 0;
            }
            this.value = parseFloat(this.value) - parseFloat(this.step);
            this.set(this.value);

            return this;
        },
        spinUp: function() {
            if (!$.isNumeric(this.value)) {
                this.value = 0;
            }
            this.value = parseFloat(this.value) + parseFloat(this.step);
            this.set(this.value);

            return this;
        },
        enable: function() {
            this.disabled = false;
            this.$wrap.removeClass(this.classes.disabled);
            this.$element.prop('disabled', false);

            if (this.eventBinded === false) {
                this.bindEvent();
            }

            return this;
        },
        disable: function() {
            this.disabled = true;
            this.$element.prop('disabled', true);

            this.$wrap.addClass(this.classes.disabled);
            this.unbindEvent();

            return this;
        },
        destroy: function() {
            this.unbindEvent();
            this.$control.remove();
            this.$element.unwrap();

            return this;
        }
    };
    AsSpinner.rules = {
        defaults: {
            min: null,
            max: null,
            step: 1,
            precision: 0
        },
        currency: {
            min: 0.00,
            max: 99999,
            step: 0.01,
            precision: 2
        },
        quantity: {
            min: 1,
            max: 999,
            step: 1,
            precision: 0
        },
        percent: {
            min: 1,
            max: 100,
            step: 1,
            precision: 0
        },
        month: {
            min: 1,
            max: 12,
            step: 1,
            precision: 0
        },
        day: {
            min: 1,
            max: 31,
            step: 1,
            precision: 0
        },
        hour: {
            min: 0,
            max: 23,
            step: 1,
            precision: 0
        },
        minute: {
            min: 1,
            max: 59,
            step: 1,
            precision: 0
        },
        second: {
            min: 1,
            max: 59,
            step: 1,
            precision: 0
        }
    };
    AsSpinner.defaults = {
        namespace: 'asSpinner',
        skin: null,

        disabled: false,
        min: -10,
        max: 10,
        step: 1,
        name: null,
        precision: 0,
        rule: null, //string, shortcut define max min step precision 

        looping: true, // if cycling the value when it is outofbound
        mousewheel: false, // support mouse wheel

        format: function(value) { // function, define custom format
            return value;
        },
        parse: function(value) { // function, parse custom format value
            return parseFloat(value);
        }
    };

    $.fn.asSpinner = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = Array.prototype.slice.call(arguments, 1);

            if (/^\_/.test(method)) {
                return false;
            } else if ((/^(get)$/.test(method)) || (method === 'val' && method_arguments.length === 0)) {
                var api = this.first().data('asSpinner');
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, method_arguments);
                }
            } else {
                return this.each(function() {
                    var api = $.data(this, 'asSpinner');
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, method_arguments);
                    }
                });
            }
        } else {
            return this.each(function() {
                if (!$.data(this, 'asSpinner')) {
                    $.data(this, 'asSpinner', new AsSpinner(this, options));
                }
            });
        }
    };
}(window.jQuery));
