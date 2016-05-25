/*! asRange - v0.2.6 - 2015-12-10
* https://github.com/amazingSurge/jquery-asRange
* Copyright (c) 2015 amazingSurge; Licensed GPL */
(function($) {
    var pluginName = 'asRange',
        defaults = {
            namespace: pluginName,
            skin: null,
            max: 100,
            min: 0,
            value: null,
            step: 10,
            limit: true,
            range: false,
            direction: 'h', // 'v' or 'h'
            keyboard: true,
            replaceFirst: false, // false, 'inherit', {'inherit': 'default'}
            tip: true,
            scale: true,
            format: function(value) {
                return value;
            }
        };

    var getEventObject = function(event) {
        var e = event.originalEvent;
        if (e.touches && e.touches.length && e.touches[0]) {
            e = e.touches[0];
        }

        return e;
    };

    // main constructor
    var Plugin = $[pluginName] = function(element, options) {
        var metas = {};
        this.element = element;
        this.$element = $(element);

        if (this.$element.is('input')) {
            var value = this.$element.val();

            if (typeof value === 'string') {
                metas.value = value.split(',');
            }

            var self = this;
            $.each(['min', 'max', 'step'], function(index, key) {
                var val = parseFloat(self.$element.attr(key));
                if (!isNaN(val)) {
                    metas[key] = val;
                }
            });

            this.$element.css({
                display: 'none'
            });
            this.$wrap = $("<div></div>");
            this.$element.after(this.$wrap);
        } else {
            this.$wrap = this.$element;
        }

        this.options = $.extend({}, defaults, options, this.$element.data(), metas);
        this.namespace = this.options.namespace;
        this.components = $.extend(true, {}, this.components);
        this.pluginName = pluginName;
        if (this.options.range) {
            this.options.replaceFirst = false;
        }

        // public properties
        this.value = this.options.value;
        if (this.value === null) {
            this.value = this.options.min;
        }

        if (!this.options.range) {
            if ($.isArray(this.value)) {
                this.value = this.value[0];
            }
        } else {
            if (!$.isArray(this.value)) {
                this.value = [this.value, this.value];
            } else if (this.value.length === 1) {
                this.value[1] = this.value[0];
            }
        }

        this.min = this.options.min;
        this.max = this.options.max;
        this.step = this.options.step;
        this.interval = this.max - this.min;

        // flag
        this.initialized = false;
        this.updating = false;
        this.disabled = false;

        if (this.options.direction === 'v') {
            this.direction = {
                axis: 'pageY',
                position: 'top'
            };
        } else {
            this.direction = {
                axis: 'pageX',
                position: 'left'
            };
        }

        this.$wrap.addClass(this.namespace);

        if (this.options.skin) {
            this.$wrap.addClass(this.namespace + '_' + this.options.skin);
        }

        if (this.max < this.min || this.step >= this.interval) {
            throw new Error('error options about max min step');
        }

        this.init();
    };

    Plugin.prototype = {
        constructor: Plugin,
        components: {},

        init: function() {
            this.$wrap.append('<div class="' + this.namespace + '-bar" />');

            // build pointers
            this.buildPointers();

            // initial components
            this.components.selected.init(this);

            if (this.options.tip !== false) {
                this.components.tip.init(this);
            }
            if (this.options.scale !== false) {
                this.components.scale.init(this);
            }

            // initial pointer value
            this.set(this.value);

            // Bind events
            this.bindEvents();

            this._trigger('ready');
            this.initialized = true;
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
        buildPointers: function() {
            this.pointer = [];
            var pointer_count = 1;
            if (this.options.range) {
                pointer_count = 2;
            }
            for (var i = 1; i <= pointer_count; i++) {
                var $pointer = $('<div class="' + this.namespace + '-pointer ' + this.namespace + '-pointer-' + i + '"></div>').appendTo(this.$wrap);
                var p = new Pointer($pointer, i, this);
                this.pointer.push(p);
            }

            // alias of pointer
            this.p1 = this.pointer[0];

            if (this.options.range) {
                this.p2 = this.pointer[1];
            }
        },
        bindEvents: function() {
            var self = this;
            this.$wrap.on('touchstart.asRange mousedown.asRange', function(event) {
                if (self.disabled === true) {
                    return;
                }
                event = getEventObject(event);
                var rightclick = (event.which) ? (event.which === 3) : (event.button === 2);
                if (rightclick) {
                    return false;
                }

                var offset = self.$wrap.offset(),
                    start = event[self.direction.axis] - offset[self.direction.position],
                    p = self.getAdjacentPointer.call(self, start);

                p.mousedown.call(p, event);
                return false;
            });

            if (this.$element.is('input')) {
                this.$element.on(pluginName + '::change', function() {
                    var value = self.get();
                    self.$element.val(value);
                });
            }

            $.each(this.pointer, function(i, p) {
                p.$element.on(pluginName + '::move', function() {
                    self.value = self.get();
                    if (!self.initialized || self.updating) {
                        return false;
                    }
                    self._trigger('change', self.value, self.options.name, pluginName, self);
                    return false;
                });
            });
        },
        getValueFromPosition: function(px) {
            if (px > 0) {
                return this.min + (px / this.getLength()) * this.interval;
            } else {
                return 0;
            }
        },
        getAdjacentPointer: function(start) {
            var value = this.getValueFromPosition(start);
            if (this.options.range) {
                var p1 = this.p1.value,
                    p2 = this.p2.value,
                    diff = Math.abs(p1 - p2);
                if (p1 <= p2) {
                    if (value > p1 + diff / 2) {
                        return this.p2;
                    } else {
                        return this.p1;
                    }
                } else {
                    if (value > p2 + diff / 2) {
                        return this.p1;
                    } else {
                        return this.p2;
                    }
                }
            } else {
                return this.p1;
            }
        },
        getLength: function() {
            if (this.options.direction === 'v') {
                return this.$wrap.height();
            } else {
                return this.$wrap.width();
            }
        },
        update: function(options) {
            var self = this;
            this.updating = true;
            $.each(['max', 'min', 'step', 'limit', 'value'], function(key, value) {
                if (options[value]) {
                    self[value] = options[value];
                }
            });
            if (options.max || options.min) {
                this.setInterval(options.min, options.max);
            }

            if (!options.value) {
                this.value = options.min;
            }

            $.each(this.components, function(key, value) {
                if (typeof value.update === "function") {
                    value.update(self);
                }
            });

            this.set(this.value);

            this._trigger('update');

            this.updating = false;
        },
        get: function() {
            var self = this,
                value = [];

            $.each(this.pointer, function(i, p) {
                value[i] = p.get();
            });

            if (self.options.range) {
                return value;
            } else {
                if (value[0] === self.options.min) {
                    if (typeof self.options.replaceFirst === 'string') {
                        value[0] = self.options.replaceFirst;
                    }
                    if (typeof self.options.replaceFirst === 'object') {
                        for (var key in self.options.replaceFirst) {
                            value[0] = key;
                        }
                    }
                }
                return value[0];
            }

        },
        set: function(value) {
            if (this.options.range) {
                if (typeof value === 'number') {
                    value = [value];
                }
                if (!$.isArray(value)) {
                    return;
                }
                $.each(this.pointer, function(i, p) {
                    p.set(value[i]);
                });
            } else {
                this.p1.set(value);
            }

            this.value = value;
        },
        val: function(value) {
            if (value) {
                this.set(value);
                return this;
            } else {
                return this.get();
            }
        },
        setInterval: function(start, end) {
            this.min = start;
            this.max = end;
            this.interval = end - start;
        },
        enable: function() {
            this.disabled = false;
            this.$wrap.removeClass(this.namespace + '_disabled');
            return this;
        },
        disable: function() {
            this.disabled = true;
            this.$wrap.addClass(this.namespace + '_disabled');
            return this;
        },
        destroy: function() {
            $.each(this.pointer, function(i, p) {
                p.destroy();
            });
            this.$wrap.destroy();
        }
    };

    Plugin.defaults = defaults;

    Plugin.registerComponent = function(component, methods) {
        Plugin.prototype.components[component] = methods;
    };

    // Pointer constuctor
    function Pointer($element, id, parent) {
        this.$element = $element;
        this.uid = id;
        this.parent = parent;
        this.options = $.extend(true, {}, this.parent.options);
        this.direction = this.options.direction;
        this.value = null;
        this.classes = {
            active: this.parent.namespace + '-pointer_active'
        };
    }

    Pointer.prototype = {
        constructor: Pointer,
        mousedown: function(event) {
            var axis = this.parent.direction.axis,
                position = this.parent.direction.position,
                offset = this.parent.$wrap.offset();

            this.$element.trigger(pluginName + '::moveStart', this);

            this.data = {};
            this.data.start = event[axis];
            this.data.position = event[axis] - offset[position];

            var value = this.parent.getValueFromPosition(this.data.position);
            this.set(value);

            $.each(this.parent.pointer, function(i, p) {
                p.deactive();
            });

            this.active();

            this.mousemove = function(event) {
                var eventObj = getEventObject(event),
                    value = this.parent.getValueFromPosition(this.data.position + (eventObj[axis] || this.data.start) - this.data.start);
                this.set(value);

                event.preventDefault();
                return false;
            };
            this.mouseup = function() {
                $(document).off('.asRange mousemove.asRange touchend.asRange mouseup.asRange touchcancel.asRange');
                this.$element.trigger(pluginName + '::moveEnd', this);
                return false;
            };

            $(document).on('touchmove.asRange mousemove.asRange', $.proxy(this.mousemove, this))
                .on('touchend.asRange mouseup.asRange', $.proxy(this.mouseup, this));
            return false;
        },
        active: function() {
            this.$element.addClass(this.classes.active);
        },
        deactive: function() {
            this.$element.removeClass(this.classes.active);
        },
        set: function(value) {
            if (this.value === value) {
                return;
            }

            if (this.parent.step) {
                value = this.matchStep(value);
            }
            if (this.options.limit === true) {
                value = this.matchLimit(value);
            } else {
                if (value <= this.parent.min) {
                    value = this.parent.min;
                }
                if (value >= this.parent.max) {
                    value = this.parent.max;
                }
            }
            this.value = value;

            this.updatePosition();
            this.$element.focus();

            this.$element.trigger(pluginName + '::move', this);
        },
        updatePosition: function() {
            var position = {};

            position[this.parent.direction.position] = this.getPercent() + '%';
            this.$element.css(position);
        },
        getPercent: function() {
            return ((this.value - this.parent.min) / this.parent.interval) * 100;
        },
        get: function() {
            return this.value;
        },
        matchStep: function(value) {
            var step = this.parent.step,
                decimal = step.toString().split('.')[1];

            value = Math.round(value / step) * step;

            if (decimal) {
                value = value.toFixed(decimal.length);
            }

            return parseFloat(value);
        },
        matchLimit: function(value) {
            var left, right, pointer = this.parent.pointer;

            if (this.uid === 1) {
                left = this.parent.min;
            } else {
                left = pointer[this.uid - 2].value;
            }

            if (pointer[this.uid] && pointer[this.uid].value !== null) {
                right = pointer[this.uid].value;
            } else {
                right = this.parent.max;
            }

            if (value <= left) {
                value = left;
            }
            if (value >= right) {
                value = right;
            }
            return value;
        },
        destroy: function() {
            this.$element.off('.asRange');
            this.$element.remove();
        }
    };

    $.fn.asRange = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = Array.prototype.slice.call(arguments, 1);

            if (/^\_/.test(method)) {
                return false;
            } else if ((/^(get)$/.test(method)) || (method === 'val' && method_arguments.length === 1)) {
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

}(jQuery));

(function($) {
    $.asRange.registerComponent('scale', {
        defaults: {
            scale: {
                valuesNumber: 3,
                gap: 1,
                grid: 5
            }
        },
        init: function(instance) {
            var opts = $.extend({}, this.defaults, instance.options.scale),
                scale = opts.scale;
            scale.values = [];
            scale.values.push(instance.min);
            var part = (instance.max - instance.min) / (scale.valuesNumber - 1);
            for (var j = 1; j <= (scale.valuesNumber - 2); j++) {
                scale.values.push(part * j);
            }
            scale.values.push(instance.max);
            var classes = {
                scale: instance.namespace + '-scale',
                lines: instance.namespace + '-scale-lines',
                grid: instance.namespace + '-scale-grid',
                inlineGrid: instance.namespace + '-scale-inlineGrid',
                values: instance.namespace + '-scale-values'
            };

            var len = scale.values.length;
            var num = ((scale.grid - 1) * (scale.gap + 1) + scale.gap) * (len - 1) + len;
            var perOfGrid = 100 / (num - 1);
            var perOfValue = 100 / (len - 1);

            this.$scale = $('<div></div>').addClass(classes.scale);
            this.$lines = $('<ul></ul>').addClass(classes.lines);
            this.$values = $('<ul></ul>').addClass(classes.values);

            for (var i = 0; i < num; i++) {
                var $list;
                if (i === 0 || i === num || i % ((num - 1) / (len - 1)) === 0) {
                    $list = $('<li class="' + classes.grid + '"></li>');
                } else if (i % scale.grid === 0) {
                    $list = $('<li class="' + classes.inlineGrid + '"></li>');
                } else {
                    $list = $('<li></li>');
                }

                // position scale 
                $list.css({
                    left: perOfGrid * i + '%'
                }).appendTo(this.$lines);
            }

            for (var v = 0; v < len; v++) {
                // position value
                $('<li><span>' + scale.values[v] + '</span></li>').css({
                    left: perOfValue * v + '%'
                }).appendTo(this.$values);
            }

            this.$lines.add(this.$values).appendTo(this.$scale);
            this.$scale.appendTo(instance.$wrap);
        },
        update: function(instance) {
            this.$scale.remove();
            this.init(instance);
        }
    });
}(jQuery));

(function($) {
    $.asRange.registerComponent('selected', {
        defaults: {},
        init: function(instance) {
            var self = this;

            this.$arrow = $('<span></span>').appendTo(instance.$wrap);
            this.$arrow.addClass(instance.namespace + '-selected');

            if (instance.options.range === false) {
                instance.p1.$element.on(instance.pluginName + '::move', function(e, pointer) {
                    self.$arrow.css({
                        left: 0,
                        width: pointer.getPercent() + '%'
                    });
                });
            }

            if (instance.options.range === true) {
                var onUpdate = function() {
                    var width = instance.p2.getPercent() - instance.p1.getPercent(),
                        left;
                    if (width >= 0) {
                        left = instance.p1.getPercent();
                    } else {
                        width = -width;
                        left = instance.p2.getPercent();
                    }
                    self.$arrow.css({
                        left: left + '%',
                        width: width + '%'
                    });
                };
                instance.p1.$element.on(instance.pluginName + '::move', onUpdate);
                instance.p2.$element.on(instance.pluginName + '::move', onUpdate);
            }
        }
    });
}(jQuery));

(function($) {

    $.asRange.registerComponent('tip', {
        defaults: {
            active: 'always' // 'always' 'onMove'
        },
        init: function(instance) {
            var self = this,
                opts = $.extend({}, this.defaults, instance.options.tip);

            this.opts = opts;
            this.classes = {
                tip: instance.namespace + '-tip',
                show: instance.namespace + '-tip-show'
            };
            $.each(instance.pointer, function(i, p) {
                var $tip = $('<span></span>').appendTo(instance.pointer[i].$element);

                $tip.addClass(self.classes.tip);
                if (self.opts.active === 'onMove') {
                    $tip.css({
                        display: 'none'
                    });
                    p.$element.on(instance.pluginName + '::moveEnd', function() {
                        self.hide($tip);
                        return false;
                    }).on(instance.pluginName + '::moveStart', function() {
                        self.show($tip);
                        return false;
                    });
                }
                p.$element.on(instance.pluginName + '::move', function() {
                    var value;
                    if (instance.options.range) {
                        value = instance.get()[i];
                    } else {
                        value = instance.get();
                    }
                    if (typeof instance.options.format === 'function') {
                        if (instance.options.replaceFirst && typeof value !== 'number') {
                            if (typeof instance.options.replaceFirst === 'string') {
                                value = instance.options.replaceFirst;
                            }
                            if (typeof instance.options.replaceFirst === 'object') {
                                for (var key in instance.options.replaceFirst) {
                                    value = instance.options.replaceFirst[key];
                                }
                            }
                        } else {
                            value = instance.options.format(value);
                        }
                    }
                    $tip.text(value);
                    return false;
                });
            });
        },
        show: function($tip) {
            $tip.addClass(this.classes.show);
            $tip.css({
                display: 'block'
            });
        },
        hide: function($tip) {
            $tip.removeClass(this.classes.show);
            $tip.css({
                display: 'none'
            });
        }
    });
}(jQuery));

// keyboard
(function(window, document, $, undefined) {
    var $doc = $(document);

    $doc.on('asRange::ready', function(event, instance) {
        var step,
            keyboard = {
                keys: {
                    'UP': 38,
                    'DOWN': 40,
                    'LEFT': 37,
                    'RIGHT': 39,
                    'RETURN': 13,
                    'ESCAPE': 27,
                    'BACKSPACE': 8,
                    'SPACE': 32
                },
                map: {},
                bound: false,
                press: function(e) {
                    var key = e.keyCode || e.which;
                    if (key in keyboard.map && typeof keyboard.map[key] === 'function') {
                        keyboard.map[key](e);
                        return false;
                    }
                },
                attach: function(map) {
                    var key, up;
                    for (key in map) {
                        if (map.hasOwnProperty(key)) {
                            up = key.toUpperCase();
                            if (up in keyboard.keys) {
                                keyboard.map[keyboard.keys[up]] = map[key];
                            } else {
                                keyboard.map[up] = map[key];
                            }
                        }
                    }
                    if (!keyboard.bound) {
                        keyboard.bound = true;
                        $doc.bind('keydown', keyboard.press);
                    }
                },
                detach: function() {
                    keyboard.bound = false;
                    keyboard.map = {};
                    $doc.unbind('keydown', keyboard.press);
                }
            };
        if (instance.options.keyboard === true) {
            $.each(instance.pointer, function(i, p) {
                if (instance.options.step) {
                    step = instance.options.step;
                } else {
                    step = 1;
                }
                var left = function() {
                    var value = p.value;
                    p.set(value - step);
                };
                var right = function() {
                    var value = p.value;
                    p.set(value + step);
                };
                p.$element.attr('tabindex', '0').on('focus', function() {
                    keyboard.attach({
                        left: left,
                        right: right
                    });
                    return false;
                }).on('blur', function() {
                    keyboard.detach();
                    return false;
                });
            });
        }
    });
})(window, document, jQuery);
