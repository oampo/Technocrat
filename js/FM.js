var FM = new Class({
    Extends: AudioletGroup,
    initialize: function(audiolet, frequency) {
        AudioletGroup.prototype.initialize.apply(this, [audiolet, 1, 1]);
        this.modulator = new Sine(this.audiolet, frequency * 4);
        this.modulatorMulAdd = new MulAdd(this.audiolet, 0,
                                          frequency);

        this.depthMultiplierA = new Multiply(this.audiolet, frequency);
        this.depthMultiplierB = new Multiply(this.audiolet, 0.99);

        this.carrier = new Sine(this.audiolet, frequency);

//        this.envelope = new PercussiveEnvelope(this.audiolet, 1, 0.1, 0.5,
        this.envelope = new ADSREnvelope(this.audiolet, 1, 0.1, 0.1, 1, 0.4,
            function() {
                this.audiolet.scheduler.addRelative(0,
                                                    this.remove.bind(this));
            }.bind(this)
        );
        this.gain = new Gain(this.audiolet);

        this.inputs[0].connect(this.depthMultiplierA);
        this.depthMultiplierA.connect(this.depthMultiplierB);
        this.depthMultiplierB.connect(this.modulatorMulAdd, 0, 1);

        this.modulator.connect(this.modulatorMulAdd);
        this.modulatorMulAdd.connect(this.carrier);
        this.carrier.connect(this.gain);
        this.envelope.connect(this.gain, 0, 1);
        this.gain.connect(this.outputs[0]);
    }
});

