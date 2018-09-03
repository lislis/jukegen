import { scales,
         chord,
         beatPatterns,
         timecodes,
         octaves,
         notes } from './data';
import { DataArray } from './data-classes';
import { montecarloDist, normalDist } from './dist-helpers';

export function buildBeatPattern(beatPatterns, baseNote) {
  let note = getNotefromCombinedNote(baseNote);
  let bassNote = combineNoteAndOctave(note, 3);
  let beat = beatPatterns.randomProperty();
  return beat.map(x => {
    return [x[0], bassNote];
  });
}

export function combineNoteAndOctave(note, octave) {
  if (note.length == 1) {
    return `${note}${octave}`;
  } else {
    let noteParts = note.split('');
    return `${noteParts[0]}${octave}${noteParts[1]}`;
  }
}

export function pickRandomNote(notes, octaves) {
  let randomOct = octaves.randomElement();
  let randomNote = notes.randomElement();
  let noteWithOctave = combineNoteAndOctave(randomNote, randomOct);
  return noteWithOctave;
}

export function pickRandomScale(scales) {
  let randoScale =  scales.randomPropertyKey();
  console.log(randoScale);
  let scale = scales[randoScale];
  return scale;
}

export function buildRandomScale(scales, notes, octaves) {
  const oct = octaves.randomElement();
  const note = notes.randomElement();
  let scale = pickRandomScale(scales);
  console.log(oct, note);
  return buildGivenScale(oct, note, scale, notes, scales);
}

export function buildGivenScale(oct, note, scale, notes, scales) {
  let index = notes.indexOf(note);
  let seq = new DataArray();
  seq.push(getNotefromCombinedNote(note));
  scale.forEach((v, i) => {
    index = notes.indexOf(seq[seq.length -1]);
    seq.push(notes[index + v]);
  });
  return seq.filter(x => x !== undefined)
    .map(x => combineNoteAndOctave(x, oct));
}

export function getNotefromCombinedNote(note) {
  let noteParts = note.split('');
  if (noteParts.length === 3) {
    return noteParts[0]+noteParts[2];
  } else {
    return noteParts[0];
  }
}

export function buildRandomPattern(scale, intervalMax = 2) {
  let chunkLength = pickChunkSize();
  let p = [];
  p.push(scale[0]);
  [...Array(chunkLength -1).keys()].forEach(x => {
    let prevNote = scale.indexOf(p[p.length -1]);
    let newIndex = findNearbyNotes(intervalMax, scale, prevNote);
    p.push(scale[newIndex]);
  });
  //console.log(p.filter(x => x !== undefined));
  return p.filter(x => x !== undefined);
}

export function findNearbyNotes(maxStepSize, scale, prevNote) {
  let step = pickStepSize(maxStepSize);
  let lastIndex = scale.indexOf(prevNote);
  let newIndex = findNewIndex(lastIndex, step, scale.length);
  return newIndex;
}

export function findNewIndex(lastIndex, step, scaleLength) {
  let newIndex = lastIndex + step;
  if (newIndex > scaleLength) {
    newIndex = newIndex - scaleLength;
  } else if (newIndex < 0) {
    newIndex = - newIndex;
  } else {
    if (montecarloDist() > 0.6) {
      newIndex = lastIndex;
    }
  }
  return newIndex;
}

export function pickStepSize(intervalMax) {
  let prob = Math.ceil(intervalMax * normalDist());
  prob = montecarloDist() > 0.5 ? prob * -1 : prob;
  return prob;
}

export function pickChunkSize() {
  let typicalLength = [4, 16];
  let possible = new DataArray(...Array(typicalLength[1]).keys()).splice(typicalLength[0]);
  return possible.randomElement();
}

export function buildTimeline(length, timecodes) {
  let t = [];
  [...Array(length).keys()].forEach((x) => {
    t.push(timecodes.randomElement());
  });
  return t.sort();
}

export function buildMelodyPattern(scale, intervalMax, amountOfNotes, timecodes) {
  let chunkLength = amountOfNotes;
  let durations = new DataArray('4n', '8n', '16n');
  let timeline = buildTimeline(chunkLength, timecodes);
  let p = [];
  p.push({
    time: timeline[0],
    note: scale.randomElement(),
    duration: durations.randomElement()
  });
  [...Array(chunkLength -1).keys()].forEach(x => {
    let prevIndex = p[p.length -1];
    let newIndex = findNearbyNotes(intervalMax, scale, prevIndex);
    p.push({
      time: timeline[x + 1],
      note: scale[newIndex],
      third: scale[newIndex + 2],
      duration: durations.randomElement()
    });
  });
  return p.filter(x => x.note !== undefined);
}
