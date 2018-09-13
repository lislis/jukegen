import Tone from 'tone';
import { pickRandomNote,
         buildBeatPattern,
         buildGivenScale,
         buildRandomScale,
         pickRandomScale,
         buildRandomPattern,
         buildMelodyPattern} from './lib/generator';
import { createBeatPart,
         createMelodyPart } from './lib/tone-helpers';
import { scales, notes, octaves, beatPatterns, timecodes } from './lib/data';
import { DataArray } from './lib/data-classes';

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
    this.volume = new Tone.Volume();
    this.distortion = new Tone.Distortion(0.4);
    this.distortion.wet.value = 0;
    this.chorus = new Tone.Chorus(4, 2.5, 0.5);
    this.chorus.wet.value = 0;
    this.phaser = new Tone.Phaser({
      "frequency" : 15,
      "octaves" : 5,
      "baseFrequency" : 1000
    });
    this.phaser.wet.value = 0;

    this.volume.toMaster();
    this.distortion.connect(this.chorus);
    this.chorus.connect(this.phaser);
    this.phaser.connect(this.analyser);
    this.analyser.connect(this.volume);

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

  get getTime() {
    return Tone.Transport.position;
  }

  get getFft() {
    if (this.analyser.getValue()[0] !== -Infinity) {
      return this.analyser.getValue();
    } else {
      return false;
    }
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
    return this.volume.volume.value;
  }

  get getDistortion() {
    return this.distortion.wet.value;
  }

  get getPhaser() {
    return this.phaser.wet.value;
  }

  get getChorus() {
    return this.chorus.wet.value;
  }

  //get getHihat() {
  //  return true;
  //}

  //setHihat(int) {
    //this.set('hihat', int)
  //  return int;
  //}

  setVolume(int) {
    if (int >= -20 && int <= 20) {
      this.volume.volume.value = int;
    }
    return this.volume.volume.value;
  }

  setTension(int) {
    if (int > 1 && int < 10) {
      this.tenstion = int;
    }
    return this.tension;
  }

  setDistortion(int) {
    if (int >= 0 && int <= 1) {
      this.distortion.wet.value = int;
    }
    return this.distortion.wet.value;
  }

  setPhaser(int) {
    if (int >= 0 && int <= 1) {
      this.phaser.wet.value = int;
    }
    return this.phaser.wet.value;
  }

  setChorus(int) {
    if (int >= 0 && int <= 1) {
      this.chorus.wet.value = int;
    }
    return this.chorus.wet.value;
  }

  setBpm(int) {
    if (int >= 80 && int <= 200) {
      Tone.Transport.bpm.value = int;
    }
    return Tone.Transport.bpm.value;
  }
}
