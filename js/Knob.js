var Knob = new Class({
    initialize: function(app, x, y, radius, initialValue, isMiddle,
                         callback) {
        this.app = app;
        this.paper = this.app.paper;

        this.x = x;
        this.y = y;

        this.radius = radius || 20;
        this.range = 3 * Math.PI / 2;

        if (typeof initialValue != 'undefined') {
            this.value = initialValue;
        }
        else {
            this.value = 0;
        }

        if (typeof isMiddle != 'undefined') {
            this.isMiddle = isMiddle;
        }
        else {
            this.isMiddle = false;
        }

        if (callback) {
            this.callback = callback;
        }

        var lowAngle = Math.PI / 4;
        var highAngle = lowAngle + this.range;

        this.circle = this.paper.circle(this.x, this.y, this.radius);
        this.circle.attr({'fill': Colors.black,
                          'stroke': null});

        this.circle.drag(this.move.bind(this),
                         this.startDrag.bind(this),
                         this.endDrag.bind(this));

        this.background = this.paper.path();
        this.background.attr({'arc' : [this.x, this.y, this.radius,
                                       lowAngle, highAngle],
                              'stroke' : Colors.white,
                              'stroke-width' : 10});

        this.background.drag(this.move.bind(this),
                             this.startDrag.bind(this),
                             this.endDrag.bind(this));

        this.foreground = this.paper.path();
        this.foreground.attr({'arc': [this.x, this.y, this.radius,
                                       lowAngle, lowAngle],
                              'stroke': Colors.red,
                              'stroke-width': 11});

        this.pointer = this.paper.path();
        this.pointer.attr({'stroke': Colors.red,
                           'stroke-width': 3});

        this.setValue(this.value);


        this.foreground.drag(this.move.bind(this),
                             this.startDrag.bind(this),
                             this.endDrag.bind(this));

    },

    setValue: function(value) {
        this.value = value;
        if (this.value < 0) {
            this.value = 0;
        }

        if (this.value > 1) {
            this.value = 1;
        }

        var angle1, angle2;
        if (!this.isMiddle) {
            angle1 = Math.PI / 4;
            angle2 = angle1 + this.value * this.range;
        }
        else {
            angle1 = Math.PI;
            angle2 = angle1 + (this.value - 0.5) * this.range;
        }
        var lowAngle = Math.min(angle1, angle2);
        var highAngle = Math.max(angle1, angle2);
        this.foreground.attr({'arc': [this.x, this.y, this.radius,
                                      lowAngle, highAngle]});

        var path = ['M',
                    this.x - Math.sin(angle2) * (this.radius - 5),
                    this.y + Math.cos(angle2) * (this.radius - 5),
                    'L',
                    this.x - Math.sin(angle2) * (this.radius + 5),
                    this.y + Math.cos(angle2) * (this.radius + 5)].join(' ');
        this.pointer.attr({'path': path});
    },

    move: function() {
        var x = this.app.mouseX;
        var y = this.app.mouseY;
        var dx = this.lastX - x;
        var dy = this.lastY - y;
        this.setValue(this.value + dy * 0.01);
        this.lastX = x;
        this.lastY = y;
    },

    startDrag: function() {
        this.lastX = this.app.mouseX;
        this.lastY = this.app.mouseY;
    },

    endDrag: function() {
        this.callback(this.value);
    },

    callback: function() {
    }
});
