import Tone from 'tone';

export function createBeatPart(beatPattern, synth) {
  let part = new Tone.Part(function(time, note) {
    synth.triggerAttackRelease(note, '4n', time);
  }, beatPattern);
  part.probability = 0.7;
  return part;
}

//export function createHiHat

export function createMelodyPart(melodyPattern, synth) {
  let part  = new Tone.Part(function(time, value){
    synth.triggerAttackRelease(value.note, value.duration, time);
    //otherSynth.triggerAttackRelease(value.third, value.duration, time);
  }, melodyPattern);
  part.probability = 0.8;
  return part;
}
