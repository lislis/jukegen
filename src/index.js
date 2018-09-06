import Tone from 'tone';
import { pickRandomNote,
         buildBeatPattern,
         buildGivenScale,
         buildRandomScale,
         pickRandomScale,
         buildRandomPattern,
         buildMelodyPattern} from './juke/generator';
import { createBeatPart,
         createMelodyPart } from './juke/tone-helpers';
import { scales, notes, octaves, beatPatterns, timecodes } from './juke/data';
import { DataArray } from './juke/data-classes';

export default class JukeGen {
  constructor() {
    this.baseNote = pickRandomNote(notes, octaves);
    this.tension = 4;
    this.notesPerSequence = 8;
    this.scale = buildGivenScale(octaves.randomElement(),
                                 this.baseNote,
                                 pickRandomScale(scales),
                                 notes, scales);

    this.analyser = new Tone.Analyser('fft', 512);
    this.fft = [];
    this.volume = new Tone.Volume(0);
    this.distortion = new Tone.Distortion(0);

    this.distortion.connect(this.analyser);
    this.analyser.connect(this.volume);
    this.volume.toMaster();

    this.beat = buildBeatPattern(beatPatterns, this.baseNote);
    this.beatSynth = new Tone.Synth({
      "pitchDecay" : 0.01,
      "octaves" : 6,
      "oscillator" : {
        "type" : "square4"
      }
    }).connect(this.distortion);
    this.beatPart = createBeatPart(this.beat, this.beatSynth);

    this.melodies = [];
    this.melodySynth = new Tone.Synth().connect(this.distortion);

    this.loopCount = 4;

    console.log(this.baseNote, this.beat, this.scale);
  }

  start() {
    new Tone.Loop((time) => {
      Tone.Transport.clear();

      this.beatPart.start(0);
      this.beatPart.loop = true;
      this.beatPart.loopEnd = '1m';

      this.melodies = [];
      this.genNextMelodySequence(4);
      this.melodies.forEach((x, i) => {
        createMelodyPart(x, this.melodySynth).start(`${i}m`);;
      });
      console.log(this.melodies);

    }, `${this.loopCount}m`).start(0);

    Tone.Transport.loop = this.loopCount;
    Tone.Transport.loopEnd = `${this.loopCount }m`;

    this.controlLoop();
    Tone.Transport.start('+0.1');
  }

  stop() {
    Tone.Transport.stop();
  }

  genNextMelodySequence(int) {
    return [...Array(int).keys()].map(x => {
      return this.melodies.push(buildMelodyPattern(this.scale,
                                                    this.tension,
                                                    this.notesPerSequence,
                                                    timecodes));
    });
  }

  controlLoop() {
    let self = this;
    new Tone.Loop(function(time) {
      Tone.Draw.schedule(function(time) {
        if (self.analyser.getValue()[0] !== -Infinity) {
          self.fft = self.analyser.getValue();
        }
      }, time);
    }, "0:0:1").start(0);
  }

  get getTime() {
    return Tone.Transport.position;
  }

  get getFft() {
    return this.fft;
  }

  get getBpm() {
    return Tone.Transport.bpm.value;
  }

  get getElements() {
    return true;
  }

  get getTension() {
    return this.tension;
  }

  get getVolume() {
    return this.volume.volume;
  }

  get getDistortion() {
    return this.distortion.distortion;
  }

  get getHihat() {
    return true;
  }

  setHihat(int) {
    //this.set('hihat', int)
    return int;
  }

  setVolume(int) {
    this.volume.volume = int;
    return this.volume.volume;
  }

  setTension(int) {
    this.tenstion = int;
    return this.tension;
  }

  setDistortion(int) {
    this.distortion.distortion = int;
    return this.distortion.distortion;
  }

  setBpm(int) {
    Tone.Transport.bpm.value = int;
    return Tone.Transport.bpm.value;
  }
}

let jg = new JukeGen();
jg.start();

window.jg = jg;
window.tt = Tone.Transport;
