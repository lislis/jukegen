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
    this.notesPerSequence = 12;
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
    this.beatPart = createBeatPart(this.beatPart, this.volume);

    this.melodies = [];
    this.genNextMelodySequence(4);
    this.melodyPart = this.melodies.map((x, i) => {
      return createMelodyPart(x);
    });

    this.transport = Tone.Transport;
    console.log(this.baseNote, this.beat, this.scale);
  }

  start() {
    this.beatPart.start(0);
    this.melodyPart.forEach((x, i) => {
      x.start(`${2 * i}m`);
    });

    this.transport.loop = true;
    this.transport.loopEnd = '5m';

    this.externalLoop();

    this.transport.start('+0.1');
  }

  stop() {
    this.transport.stop();
  }

  genNextMelodySequence(int) {
    return [...Array(int).keys()].map(x => {
      return this.melodies.push(buildMelodyPattern(this.scale,
                                                    this.tension,
                                                    this.notesPerSequence,
                                                    timecodes));
    });
  }

  externalLoop() {
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
    return this.transport.position;
  }

  get getFft() {
    return this.fft;
  }

  get getBpm() {
    return this.transport.bpm.value;
  }

  get getTension() {
    return this.tension;
  }

  get getVolume() {
    return this.volume.value;
  }

  get getDistortion() {
    return this.distortion.value;
  }

  get getHihat() {
    return true;
  }

  setHihat(int) {
    //this.set('hihat', int)
    return int;
  }

  setVolume(int) {
    this.volume.value = int;
    return this.volume.value;
  }

  setTension(int) {
    this.tenstion = int;
    return this.tension;
  }

  setDistortion(int) {
    this.distortion.value = int;
    return this.distortion;
  }

  setBpm(int) {
    this.transport.bpm.value = int;
    return this.transport.bpm.value;
  }
}

let jg = new JukeGen();
jg.start();

window.jg = jg;
