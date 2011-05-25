var Shaker = new Class({
    Extends: AudioletGroup,
    initialize: function(audiolet) {
        AudioletGroup.prototype.initialize.apply(this, [audiolet, 1, 1]);
        this.modulationMulAdd = new MulAdd(audiolet, 1000, 4000);
        // White noise source
        this.white = new WhiteNoise(audiolet);

        // Gain envelope
        this.gainEnv = new PercussiveEnvelope(audiolet, 1, 0.03, 0.1,
            function() {
                // Remove the group ASAP when env is complete
                this.audiolet.scheduler.addRelative(0,
                                                    this.remove.bind(this));
            }.bind(this)
        );
        this.gain = new Gain(audiolet);

        this.inputs[0].connect(this.modulationMulAdd);

        // Filter
        this.filter = new BandPassFilter(audiolet);
        this.modulationMulAdd.connect(this.filter, 0, 1);

        // Connect the main signal path
        this.white.connect(this.filter);
        this.filter.connect(this.gain);

        // Connect the gain envelope
        this.gainEnv.connect(this.gain);
        this.gain.connect(this.outputs[0]);
    }
});

