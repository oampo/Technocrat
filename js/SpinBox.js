var SpinBox = new Class({
    initialize: function(app, x, y, width, height, options) {
        this.app = app;
        this.paper = this.app.paper;

        this.x = x - width / 2;
        this.y = y - height / 2;

        this.width = width;
        this.height = height;

        this.options = options;
        this.index = 0;

        this.rect = this.paper.rect(this.x, this.y,
                                    this.width, this.height);
        this.rect.attr({'stroke': Colors.white,
                        'stroke-width': 2});

        this.upButton = this.paper.rect(this.x + this.width -
                                        this.height / 2,
                                        this.y, this.height / 2,
                                        this.height / 2);
        this.upButton.attr({'fill': Colors.black,
                            'stroke': Colors.white,
                            'stroke-width': 2});
        this.upButton.mouseover(this.mouseOver);
        this.upButton.mouseout(this.mouseOut);
        this.upButton.click(this.up.bind(this));

        this.downButton = this.paper.rect(this.x + this.width -
                                          this.height / 2,
                                          this.y + this.height / 2,
                                          this.height / 2,
                                          this.height / 2);
        this.downButton.attr({'fill': Colors.black,
                              'stroke': Colors.white,
                              'stroke-width': 2});
        this.downButton.mouseover(this.mouseOver);
        this.downButton.mouseout(this.mouseOut);
        this.downButton.click(this.down.bind(this));

        this.text = this.paper.text(this.x + this.width / 2,
                                    this.y + this.height / 2,
                                    this.options[this.index]);
        this.text.attr({'stroke': Colors.white});
    },

    setValue: function(value) {
        this.index = this.options.indexOf(value);
        if (this.index != -1) {
            this.text.attr({'text': this.options[this.index]});
        }
    },

    up: function(event) {
        if (this.index < this.options.length - 1) {
            this.index += 1;
            this.text.attr({'text': this.options[this.index]});
            this.callback(this.options[this.index]);
        }
    },

    down: function(event) {
        if (this.index > 0) {
            this.index -= 1;
            this.text.attr({'text': this.options[this.index]});
            this.callback(this.options[this.index]);
        }
    },

    mouseOver: function(event) {
        this.attr({'fill': Colors.red});
    },

    mouseOut: function(event) {
        this.attr({'fill': Colors.black});
    },

    callback: function(value) {
    }
});

