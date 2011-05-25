var Distortion = new Class({
    Extends: AudioletGroup,
    initialize: function(audiolet, distortion) {
        AudioletGroup.prototype.initialize.apply(this, [audiolet, 2, 1]);
        // Distortion level between 1 and 2
        this.lag = new Lag(audiolet, distortion || 1, 480);
        this.distortion = this.lag.value;

        this.preMultiplier = new Multiply(audiolet, 0.5);
        this.preGain = new MulAdd(audiolet);

        this.softClip = new SoftClip(this.audiolet);
        this.postMultiplier = new Multiply(audiolet, 2);


        this.inputs[0].connect(this.preMultiplier);
        this.inputs[1].connect(this.lag);


        this.preMultiplier.connect(this.preGain);
        this.lag.connect(this.preGain, 0, 1);

        this.preGain.connect(this.softClip);
        this.softClip.connect(this.postMultiplier);
        this.postMultiplier.connect(this.outputs[0]);
    }
});

