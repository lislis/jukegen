import Tone from 'tone';
import { pickRandomNote,
         buildBeatPattern,
         buildGivenScale,
         buildRandomScale,
         pickRandomScale,
         buildRandomPattern,
         buildMelodySegments} from './juke/generator';
import { scales, notes, octaves, beatPatterns, timecodes } from './juke/data';
import { DataArray } from './juke/data-classes';

class JukeTron {

  constructor() {
    this.shuffle();
  }

  get beatPart() {
    let vol = new Tone.Volume(-5);
    let beatSynth = new Tone.Synth().chain(vol, Tone.Master);
    beatSynth.probability = 0.7;
    let part = new Tone.Part(function(time, note) {
      beatSynth.triggerAttackRelease(note, '4n', time);
    }, this.beat);
    part.loop = true;
    return part;
  }

  get pattern() {
    let synth = new Tone.Synth().toMaster();
    let pattern = new Tone.Pattern(function(time, note){
      synth.triggerAttackRelease(note, new DataArray('2n', '4n').randomElement());
    }, this.part, "randomOnce");
    pattern.probability = 0.2;
    return pattern;
  }

  melody(segment) {
    let synth = new Tone.Synth().connect(this.melodyAnalyser);
    let otherSynth = new Tone.Synth().connect(this.melodyAnalyser);
    let another = new Tone.Synth().connect(this.melodyAnalyser);
    let part  = new Tone.Part(function(time, value){
      synth.triggerAttackRelease(value.note, value.duration, time);
      otherSynth.triggerAttackRelease(value.third, value.duration, time);
    }, segment);
    part.probability = 0.8;
    return part;
  }

  play() {
    this.beatPart.start(0);
    this.pattern.start(0);

    this.melodyParts.forEach((x, i) => {
      this.melody(x).start(`${2 * i}m`);
    });

    Tone.Transport.loop = true;
    Tone.Transport.loopEnd = '5m';

    var loop = new Tone.Loop(function(time){
      Tone.Draw.schedule(function(){
        console.log(Tone.Transport.position, Tone.Transport.seconds);
      }, time) //use AudioContext time of the event
    }, "1m").start(0);
  }

  shuffle() {
    Tone.Transport.clear();
    this.baseNote = pickRandomNote(notes, octaves);
    console.log(this.baseNote);
    this.intervalMax = 4;
    this.beat = buildBeatPattern(beatPatterns, this.baseNote);
    this.scale = buildGivenScale(octaves.randomElement(),
                                 this.baseNote,
                                 pickRandomScale(scales),
                                 notes, scales);
    this.part = buildRandomPattern(this.scale, this.intervalMax);
    this.melodyParts = [...Array(4).keys()].map(x => {
      return buildMelodySegments(this.scale, this.intervalMax, timecodes);
    });
    this.melodyAnalyser = new Tone.Analyser('fft', 128);
    this.melodyAnalyser.toMaster();
    console.log(this.melodyParts);
  }
}

let juke = new JukeTron();
juke.play();
//Tone.Transport.start(0);

function update() {
  juke.melodyAnalyser.getValue()[0] !== -Infinity ? console.log(juke.melodyAnalyser.getValue()) : null;
  requestAnimationFrame(update)
}


//update();
