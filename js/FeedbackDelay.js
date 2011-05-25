var FeedbackDelay = new Class({
    Extends: AudioletGroup,
    initialize: function(audiolet, feedback, mix) {
        AudioletGroup.prototype.initialize.apply(this, [audiolet, 3, 1]);

        this.feedbackLag = new Lag(audiolet, feedback || 0, 480);
        this.feedback = this.feedbackLag.value;

        this.mixLag = new Lag(audiolet, mix || 0, 480);
        this.mix = this.mixLag.value;

        var delayTime = this.audiolet.scheduler.beatLength;
        delayTime /= this.audiolet.device.sampleRate;

        this.delay = new Delay(this.audiolet, delayTime, delayTime);
        this.gain = new Gain(this.audiolet);
        this.xfade = new CrossFade(this.audiolet);


        this.inputs[0].connect(this.delay);
        this.inputs[0].connect(this.xfade);
        this.inputs[1].connect(this.feedbackLag);
        this.inputs[2].connect(this.mixLag);

        this.feedbackLag.connect(this.gain, 0, 1);
        this.mixLag.connect(this.xfade, 0, 2);

        this.delay.connect(this.gain);
        this.gain.connect(this.delay);
        this.delay.connect(this.xfade, 0, 1);
        this.xfade.connect(this.outputs[0]);
    }
});

