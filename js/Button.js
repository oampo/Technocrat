var Button = new Class({
    initialize: function(app, x, y, width, height) {
        this.app = app;
        this.paper = this.app.paper;

        this.x = x - width / 2;
        this.y = y - height / 2;

        this.width = width;
        this.height = height;

        this.value = false;

        this.rect = this.paper.rect(this.x, this.y,
                                    this.width, this.height, 10);
        this.rect.attr({'fill': Colors.black,
                        'stroke': Colors.white,
                        'stroke-width': 2});

        this.rect.click(this.click.bind(this));
    },

    setValue: function(value) {
        if (value) {
            this.rect.attr({'fill': Colors.red});
        }
        else {
            this.rect.attr({'fill': Colors.black});
        }
        this.value = value;
    },

    click: function() {
        if (!this.value) {
            this.setValue(true);
            this.callback();
        }
    },

    callback: function() {
    }
});

