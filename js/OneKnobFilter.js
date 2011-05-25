/**
 * @depends ../core/AudioletGroup.js
 */

var OneKnobFilter = new Class({
    Extends: AudioletGroup,

    initialize: function(audiolet, position) {
        AudioletGroup.prototype.initialize.apply(this, [audiolet, 2, 1]);

        // Parameters
        this.lpf = new LowPassFilter(audiolet);
        this.hpf = new HighPassFilter(audiolet);

        this.crossFade = new CrossFade(audiolet);

        this.lag = new Lag(audiolet, position || 0.5, 480);
        this.position = this.lag.value;

        this.positionTranslator = new KnobPositionTranslator(audiolet);

        this.inputs[0].connect(this.lpf);
        this.inputs[0].connect(this.hpf);
        this.inputs[1].connect(this.lag);

        this.lag.connect(this.positionTranslator);

        this.positionTranslator.connect(this.crossFade, 0, 2);
        this.positionTranslator.connect(this.lpf, 1, 1);
        this.positionTranslator.connect(this.hpf, 2, 1);

        this.lpf.connect(this.crossFade);
        this.hpf.connect(this.crossFade, 0, 1);

        this.crossFade.connect(this.outputs[0]);
    },

    toString: function() {
        return 'One Knob Filter';
    }
});

var KnobPositionTranslator = new Class({
    Extends: AudioletNode,
    initialize: function(audiolet, position) {
        AudioletNode.prototype.initialize.apply(this, [audiolet, 1, 3]);
        this.position = new AudioletParameter(this, 0, position || 0.5);

        this.minLPFreq = 50;
        this.maxLPFreq = 20000;

        this.minHPFreq = 50;
        this.maxHPFreq = 20000;

        this.logMinLPFreq = Math.log(this.minLPFreq);
        this.logMaxLPFreq = Math.log(this.maxLPFreq);
        this.logLPFreqRange = this.logMaxLPFreq - this.logMinLPFreq;

        this.logMinHPFreq = Math.log(this.minHPFreq);
        this.logMaxHPFreq = Math.log(this.maxHPFreq);
        this.logHPFreqRange = this.logMaxHPFreq - this.logMinHPFreq;

    },

    generate: function(inputBuffers, outputBuffers) {
        var crossFadeBuffer = outputBuffers[0];
        var crossFadeChannel = crossFadeBuffer.getChannelData(0);
        var lpfBuffer = outputBuffers[1];
        var lpfChannel = lpfBuffer.getChannelData(0);
        var hpfBuffer = outputBuffers[2];
        var hpfChannel = hpfBuffer.getChannelData(0);

        // Local processing variables
        var positionParameter = this.position;
        var position, positionChannel;
        if (positionParameter.isStatic()) {
            position = positionParameter.getValue();
        }
        else {
            positionChannel = positionParameter.getChannel();
        }

        var logMinLPFreq = this.logMinLPFreq;
        var logLPFreqRange = this.logLPFreqRange;
        var maxLPFreq = this.maxLPFreq;

        var logMinHPFreq = this.logMinHPFreq;
        var logHPFreqRange = this.logHPFreqRange;
        var minHPFreq = this.minHPFreq;

        var bufferLength = crossFadeBuffer.length;
        for (var i = 0; i < bufferLength; i++) {
            if (positionChannel) {
                position = positionChannel[i];
            }

            if (position < 0.5) {
                var scaledPosition = position * 2;
                lpfChannel[i] = Math.exp(logMinLPFreq +
                                         scaledPosition * logLPFreqRange);
                hpfChannel[i] = minHPFreq;
                crossFadeChannel[i] = 0;

            }
            else {
                var scaledPosition = (position - 0.5) * 2;
                hpfChannel[i] = Math.exp(logMinHPFreq +
                                         scaledPosition * logHPFreqRange);
                lpfChannel[i] = maxLPFreq;
                crossFadeChannel[i] = 1;
            }
        }
    },

    toString: function() {
        return ('Knob Position Translator');
    }
});

