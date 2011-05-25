var Slider = new Class({
    initialize: function(app, x, y, width, height, initialValue, isMiddle,
                         callback) {
        this.app = app;
        this.paper = this.app.paper;

        this.x = x - width / 2;
        this.y = y - height / 2;

        this.width = width;
        this.height = height;

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

        this.background = this.paper.rect(this.x - 1, this.y - 1,
                                          this.width + 2, this.height + 2,
                                          10);
        this.background.attr({'fill': Colors.black,
                              'stroke' : Colors.white,
                              'stroke-width' : 2});

        this.background.drag(this.move.bind(this),
                             this.startDrag.bind(this),
                             this.endDrag.bind(this));

        this.foreground = this.paper.rect(this.x, this.height,
                                          this.width, 0, 10);
        this.foreground.attr({'fill': Colors.red,
                              'stroke': null});

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

        if (!this.isMiddle) {
            var foregroundHeight = this.value * this.height;
            this.foreground.attr({'y': this.y + this.height -
                                        foregroundHeight,
                                  'height': foregroundHeight});
        }
        else {
        }
    },

    move: function() {
        var y = this.app.mouseY - this.app.notepad.offsetTop;
        this.setValue((this.height - (y - this.y))/this.height);
    },

    startDrag: function() {
        var y = this.app.mouseY - this.app.notepad.offsetTop;
        this.setValue((this.height - (y - this.y))/this.height);
        this.callback(this.value);
    },

    endDrag: function() {
        this.callback(this.value);
    },

    callback: function() {
    }
});
