var Kick = new Class({
    Extends: AudioletGroup,
    initialize: function(audiolet) {
        AudioletGroup.prototype.initialize.apply(this, [audiolet, 1, 1]);
        this.modulatorMulAdd = new MulAdd(audiolet, 80, 80);
        // Main sine oscillator
        this.sine = new Sine(audiolet);

        // Pitch Envelope
        this.pitchEnv = new PercussiveEnvelope(audiolet, 1, 0.001, 0.3);
        this.pitchEnvMulAdd = new MulAdd(audiolet, 0, 1);

        // Gain Envelope
        this.gainEnv = new PercussiveEnvelope(audiolet, 1, 0.001, 0.3,
            function() {
                // Remove the group ASAP when env is complete
                this.audiolet.scheduler.addRelative(0,
                                                    this.remove.bind(this));
            }.bind(this)
        );
        this.gain = new Gain(audiolet);

        this.inputs[0].connect(this.modulatorMulAdd);
        this.modulatorMulAdd.connect(this.pitchEnvMulAdd, 0, 1);

        // Connect oscillator
        this.sine.connect(this.gain);

        // Connect pitch envelope
        this.pitchEnv.connect(this.pitchEnvMulAdd);
        this.pitchEnvMulAdd.connect(this.sine);

        // Connect gain envelope
        this.gainEnv.connect(this.gain, 0, 1);
        this.gain.connect(this.outputs[0]);
    }
});

