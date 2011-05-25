var Silence = new Class({
    Extends: AudioletNode,
    initialize: function(audiolet) {
        AudioletNode.prototype.initialize.apply(this, [audiolet, 1, 1]);
    },

    generate: function(inputBuffers, outputBuffers) {
        outputBuffers[0].isEmpty = true;
    }
});

