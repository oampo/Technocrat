var Amp = new Class({
    Extends: AudioletGroup,
    initialize: function(audiolet) {
        AudioletGroup.prototype.initialize.apply(this, [audiolet, 1, 1]);
        this.lag = new Lag(audiolet, 0, 960);
        this.gain = this.lag.value;
        this.gainNode = new Gain(audiolet);
        this.inputs[0].connect(this.gainNode);
        this.lag.connect(this.gainNode, 0, 1);
        this.gainNode.connect(this.outputs[0]);
    }
});
