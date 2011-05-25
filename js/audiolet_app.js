window.addEvent("domready", function() {
    window.Colors = {
        white: '#EEEEEC',
        black: '#2E3436',
        red: '#CC0000',
        orange: '#F57900'
    };

    function construct(constructor, args) {
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;
        return new F();
    }

    var AudioletApp = new Class({
        initialize: function() {
            this.audiolet = new Audiolet();

            this.width = 500;
            this.height = 450;
            this.canvasWidth = this.width;
            this.canvasHeight = this.height;
            this.canvasCenterX = this.canvasWidth / 2;
            this.canvasCenterY = this.canvasHeight / 2;
            this.itemWidth = 100;
            this.itemHeight = 30;
            this.notepad = $('notepad');

            this.paper = Raphael("notepad", this.width, this.height);
            this.addArc();

            this.numberOfChannels = 6;
            this.channelIndex = 0;

            this.scale = new MajorScale();
            this.baseFrequency = 16.352;
            

            this.addPatterns();

            this.addChannels();

            this.addSynths();
            this.addKnobs();
            this.addChannelUI();

            $('about-link').addEvents({
                'mouseover': function(event) {
                    $('about').setStyle('display', 'inline');
                },
                'mouseout': function(event) {
                    $('about').setStyle('display', 'none');
                }
            });

            $('tips-link').addEvents({
                'mouseover': function(event) {
                    $('tips').setStyle('display', 'inline');
                },
                'mouseout': function(event) {
                    $('tips').setStyle('display', 'none');
                }
            });

            document.addEvent("mousemove", this.mouseMoved.bind(this));
        },

        addPatterns: function() {
            this.frequencyPatterns = {
                'one': {
                    class: PSequence,
                    args: [[0], Infinity]
                },
                'two': {
                    class: PSequence,
                    args: [[0, 1], Infinity]
                },
                'three': {
                    class: PSequence,
                    args: [[0, 1, 2], Infinity]
                },
                'four': {
                    class: PSequence,
                    args: [[0, 1, 2, 3], Infinity]
                },
                'six': {
                    class: PSequence,
                    args: [[0, 1, 2, 3, 4, 5], Infinity]
                },
                'eight': {
                     class: PSequence,
                     args: [[0, 1, 2, 3, 4, 5, 6, 7], Infinity]
                },
                'twelve': {
                    class: PSequence,
                    args: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], Infinity]
                },
                'sixteen': {
                     class: PSequence,
                     args: [[0, 1, 2, 3, 4, 5, 6, 7,
                             8, 9, 10, 11, 12, 13, 14, 15], Infinity]
                },
                '3 up 3': {
                     class: PSequence,
                     args: [[0, 1, 2, 1, 2, 3, 2, 3, 4], Infinity]
                }, 
                '3 up 4': {
                     class: PSequence,
                     args: [[0, 1, 2, 1, 2, 3, 2, 3, 4, 3, 4, 5], Infinity]
                },
                '4 up 3': {
                     class: PSequence,
                     args: [[0, 1, 2, 3, 1, 2, 3, 4, 2, 3, 4, 5], Infinity]
                },
                '4 up 4': {
                     class: PSequence,
                     args: [[0, 1, 2, 3, 1, 2, 3, 4, 2, 3, 4, 5, 3, 4, 5, 6],
                            Infinity]
                }
            };

            this.durationPatterns = {
                'four': {
                    class: PSequence,
                    args: [[16], Infinity]
                },
                'two': {
                    class: PSequence,
                    args: [[8], Infinity]
                },
                'whole': {
                    class: PSequence,
                    args: [[4], Infinity]
                },
                'half': {
                    class: PSequence, 
                    args: [[2], Infinity]
                },
                'quarter': {
                    class: PSequence, 
                    args: [[1], Infinity]
                },
                'triplet': {
                    class: PSequence, 
                    args: [[1/1.5], Infinity]
                },
                'eighth': {
                    class: PSequence, 
                    args: [[1/2], Infinity]
                },
                'sextuplet': {
                    class: PSequence, 
                    args: [[1/3], Infinity]
                },
                'sixteenth': {
                    class: PSequence, 
                    args: [[1/4], Infinity]
                }
            };

            this.sustainPatterns = {
                'four': {
                    class: PSequence,
                    args: [[16], Infinity]
                },
                'two': {
                    class: PSequence,
                    args: [[8], Infinity]
                },
                'whole': {
                    class: PSequence,
                    args: [[4], Infinity]
                },
                'half': {
                    class: PSequence,
                    args: [[2], Infinity]
                },
                'quarter': {
                    class: PSequence,
                    args: [[1], Infinity]
                },
                'triplet': {
                    class: PSequence,
                    args: [[1/1.5], Infinity]
                },
                'eighth': {
                    class: PSequence,
                    args: [[1/2], Infinity]
                },
                'sextuplet': {
                    class: PSequence,
                    args: [[1/3], Infinity]
                },
                'sixteenth': {
                    class: PSequence,
                    args: [[1/4], Infinity]
                }
            };
        },

        addChannels: function() {
            this.channels = [
                {
                    'synth': Kick,
                    'frequencyPattern': 'one',
                    'durationPattern': 'quarter',
                    'octave': 1
                },
                {
                    'synth': Shaker,
                    'frequencyPattern': 'one',
                    'durationPattern': 'quarter',
                    'octave': 1
                },
                
                {
                    'synth': FM,
                    'frequencyPattern': '4 up 4',
                    'durationPattern': 'four',
                    'octave': 2
                },
                {
                    'synth': FM,
                    'frequencyPattern': 'three',
                    'durationPattern': 'eighth',
                    'octave': 4
                },
                {
                    'synth': FM,
                    'frequencyPattern': '3 up 4',
                    'durationPattern': 'sixteenth',
                    'octave': 5
                },
                {
                    'synth': FM,
                    'frequencyPattern': '3 up 3',
                    'durationPattern': 'sextuplet',
                    'octave': 6
                }
            ];
            for (var i=0; i<this.channels.length; i++) {
                this.channels[i].knobValues = {};
            }
        },

        addSynths: function() {
            this.limiter = new Limiter(this.audiolet);
            this.reverb = new LaggedReverb(this.audiolet, 0.1);
            for (var i=0; i<this.channels.length; i++) {
                var channel = this.channels[i];

                channel.frequencyProxy = new PProxy();
                var pattern = this.frequencyPatterns[channel.frequencyPattern];
                var frequencyPattern = construct(pattern.class,
                                                 pattern.args);
                channel.frequencyProxy.pattern = frequencyPattern;

                channel.durationProxy = new PProxy();
                var pattern = this.durationPatterns[channel.durationPattern];
                var durationPattern = construct(pattern.class,
                                                pattern.args);
                channel.durationProxy.pattern = durationPattern;

                channel.sustainProxy = new PProxy();
                var pattern = this.sustainPatterns[channel.durationPattern];
                var sustainPattern = construct(pattern.class,
                                               pattern.args);
                channel.sustainProxy.pattern = sustainPattern;

                this.audiolet.scheduler.play([channel.frequencyProxy,
                                              channel.sustainProxy],
                                              channel.durationProxy,
                                              this.playNote.bind(this,
                                                                 channel));

                channel.mod = new Lag(this.audiolet, 0, 480);
                channel.silence = new Silence(this.audiolet);
                channel.filter = new OneKnobFilter(this.audiolet);
                channel.delay = new FeedbackDelay(this.audiolet);
                channel.distortion = new Distortion(this.audiolet);
                channel.amp = new Amp(this.audiolet);

                channel.mod.connect(channel.silence);
                channel.silence.connect(this.audiolet.output);
                channel.filter.connect(channel.delay);
                channel.delay.connect(channel.distortion);
                channel.distortion.connect(channel.amp);
                channel.amp.connect(this.reverb);
            }
            this.reverb.connect(this.limiter);
            this.limiter.connect(this.audiolet.output);
        },

        addKnobs: function() {
            this.knobs = {};
            this.knobs.modulation = new Knob(this, 90 + 0 * 80, 50);
            this.knobs.filter = new Knob(this, 90 + 1 * 80, 50, 20, 0.5, true); 
            this.knobs.delay = new Knob(this, 90 + 2 * 80, 50);
            this.knobs.distortion = new Knob(this, 90 + 3 * 80, 50);
            this.knobs.reverb = new Knob(this, 90 + 4 * 80, 50);

            for (var knob in this.knobs) {
                this.knobs[knob].callback = this.knobCallback.bind(this, knob);
                for (var i=0; i<this.channels.length; i++) {
                    this.channels[i].knobValues[knob] = this.knobs[knob].value;
                }
            }

        },

        addChannelUI: function() {
            var frequencyOptions = [];
            for (var pattern in this.frequencyPatterns) {
                frequencyOptions.push(pattern);
            }

            var durationOptions = [];
            for (var pattern in this.durationPatterns) {
                durationOptions.push(pattern);
            }

            this.buttons = [];
            this.sliders = [];
            this.frequencySpinBoxes = [];
            this.durationSpinBoxes = [];
            for (var i=0; i<this.numberOfChannels; i++) {
                // Buttons
                var button = new Button(this, 50 + i * 80, 110, 40, 20);
                button.callback = this.buttonCallback.bind(this, i);
                this.buttons.push(button);

                // Sliders
                var slider = new Slider(this, 50 + i * 80, 230, 40, 180);
                slider.callback = this.sliderCallback.bind(this, i);
                this.sliders.push(slider);

                // Frequency SpinBoxes
                if (i >= 2) {
                    var frequencySpinBox = new SpinBox(this, 50 + i * 80, 360, 70,
                                                       20, frequencyOptions);
                    frequencySpinBox.setValue(this.channels[i].frequencyPattern);
                    frequencySpinBox.callback = this.frequencySpinBoxCallback.bind(this, i);
                    this.frequencySpinBoxes.push(frequencySpinBox);
                }

                // Duration Spinboxes
                var durationSpinBox = new SpinBox(this, 50 + i * 80, 410, 70,
                                                  20, durationOptions);
                durationSpinBox.setValue(this.channels[i].durationPattern);
                durationSpinBox.callback = this.durationSpinBoxCallback.bind(this, i);
                this.durationSpinBoxes.push(durationSpinBox);

            }

            this.buttons[this.channelIndex].setValue(true);
        },

        addArc: function() {
            this.paper.customAttributes.arc = function(centerX, centerY,
                                                       radius,
                                                       startAngle, endAngle) {
                var startX = centerX - radius * Math.sin(startAngle);
                var startY = centerY + radius * Math.cos(startAngle);
                var endX = centerX - radius * Math.sin(endAngle);
                var endY = centerY + radius * Math.cos(endAngle);
                var path = ['M', startX, startY, 'A', radius, radius, 0,
                            +(endAngle - startAngle > Math.PI), 1,
                            endX, endY].join(' ');
                return {path: path};
            }
        },

        buttonCallback: function(index) {
            this.channelIndex = index;
            for (var i=0; i<6; i++) {
                if (i != index) {
                    this.buttons[i].setValue(false);
                }
            }

            for (var knob in this.knobs) {
                var activeChannel = this.channels[this.channelIndex];
                if (knob != 'reverb') {
                    var knobValues = activeChannel.knobValues;
                    this.knobs[knob].setValue(knobValues[knob]);
                }
            }
        },

        sliderCallback: function(index, value) {
            this.buttons[index].setValue(true);
            this.buttonCallback(index);
            this.channels[index].amp.gain.setValue(value);
        },

        knobCallback: function(knob, value) {
            var activeChannel = this.channels[this.channelIndex];
            activeChannel.knobValues[knob] =  value;
            
            if (knob == 'modulation') {
                activeChannel.mod.value.setValue(value);
            }
            else if (knob == 'filter') {
                activeChannel.filter.position.setValue(value);
            }
            else if (knob == 'delay') {
                activeChannel.delay.feedback.setValue(value);
                activeChannel.delay.mix.setValue(value);
            }
            else if (knob == 'distortion') {
                activeChannel.distortion.distortion.setValue(value + 1);
            }
            else if (knob == 'reverb') {
                this.reverb.mix.setValue(0.1 + value * 0.9);
            }
        },  

        frequencySpinBoxCallback: function(index, value) {
            this.buttons[index].setValue(true);
            this.buttonCallback(index);
            // TODO: This code should be in scheduler already
            var beat = this.audiolet.scheduler.beat;
            var beatPosition = beat % 4;
            var nextBar = beat + (4 - beatPosition);
            this.audiolet.scheduler.addAbsolute(nextBar - 0.1,
                this.setFrequencyPattern.bind(this, index));
        },

        setFrequencyPattern: function(index) {
            var spinBox = this.frequencySpinBoxes[index - 2];
            var patternName = spinBox.options[spinBox.index];
            var pattern = this.frequencyPatterns[patternName];
            var frequencyPattern = construct(pattern.class, pattern.args);
            this.channels[index].frequencyProxy.pattern = frequencyPattern;
        },

        durationSpinBoxCallback: function(index, value) {
            this.buttons[index].setValue(true);
            this.buttonCallback(index);
            var beat = this.audiolet.scheduler.beat;
            var beatPosition = beat % 4;
            var nextBar = beat + (4 - beatPosition);
            // Schedule slightly before the beat the change is done before the
            // beat starts
            this.audiolet.scheduler.addAbsolute(nextBar - 0.1,
                this.setDurationPattern.bind(this, index)); 
        },

        setDurationPattern: function(index) {
            var spinBox = this.durationSpinBoxes[index];
            var patternName = spinBox.options[spinBox.index];
            var pattern = this.durationPatterns[patternName];
            var durationPattern = construct(pattern.class, pattern.args);
            this.channels[index].durationProxy.pattern = durationPattern;

            var pattern = this.sustainPatterns[patternName];
            var sustainPattern = construct(pattern.class, pattern.args);
            this.channels[index].sustainProxy.pattern = sustainPattern;
        },

        playNote: function(channel, degree, sustain) {
            var frequency = this.scale.getFrequency(degree, this.baseFrequency,
                                                    channel.octave);
            var synth = construct(channel.synth, [this.audiolet,
                                                  frequency]);
            channel.mod.connect(synth);
            synth.connect(channel.filter);
            if (channel.synth == FM) {
                this.audiolet.scheduler.addRelative(sustain, function() {
                    this.envelope.gate.setValue(0);
                }.bind(synth));
            }
        },

        mouseMoved: function(event) {
            this.mouseX = event.page.x;
            this.mouseY = event.page.y;
        }
    });

    this.audioletApp = new AudioletApp();
});


