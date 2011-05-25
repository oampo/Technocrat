var LaggedReverb = new Class({
    Extends: AudioletGroup,
    initialize: function(audiolet, mix) {
        AudioletGroup.prototype.initialize.apply(this, [audiolet, 2, 1]);
        this.mixLag = new Lag(audiolet, mix || 0.1, 480);
        this.mix = this.mixLag.value;

        this.reverb = new Reverb(audiolet, 0.1, 0.05, 0.1);

        this.inputs[0].connect(this.reverb);
        this.inputs[1].connect(this.mixLag);

        this.mixLag.connect(this.reverb, 0, 1);

        this.reverb.connect(this.outputs[0]);
    }
});

