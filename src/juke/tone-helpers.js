import Tone from 'tone';

export function createBeatPart(beatPattern, output) {
  let vol = new Tone.Volume(3).connect(output);

  let beatSynth = new Tone.Synth({
    "pitchDecay" : 0.01,
    "octaves" : 6,
    "oscillator" : {
      "type" : "square4"
    }
  }).connect(vol);

  //let beatSynth = new Tone.Synth().toMaster();
  beatSynth.probability = 0.7;
  let part = new Tone.Part(function(time, note) {
    beatSynth.triggerAttackRelease(note, '4n', time);
  }, beatPattern);
  //part.loop = true;
  return part;
}

//export function createHiHat

export function createMelodyPart(melodyPattern, output) {
  let synth = new Tone.Synth().connect(output);
  let otherSynth = new Tone.Synth().connect(output);
  let part  = new Tone.Part(function(time, value){
    synth.triggerAttackRelease(value.note, value.duration, time);
    otherSynth.triggerAttackRelease(value.third, value.duration, time);
  }, melodyPattern);
  part.probability = 0.8;
  return part;
}
