import Tone from 'tone';

export function createBeatPart(beatPattern, output) {
    let vol = new Tone.Volume(0);
    let beatSynth = new Tone.Synth().chain(vol, output);
    beatSynth.probability = 0.7;
    let part = new Tone.Part(function(time, note) {
        beatSynth.triggerAttackRelease(note, '4n', time);
    }, beatPattern);
    part.loop = true;
    return part;
}

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
