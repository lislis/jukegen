import { DataArray, DataObject } from './data-classes';

/*
 * scales and chords taken from http://www.procjam.com/tutorials/en/music/
 */

// musical scales in semitone intervals:
export let scales = new DataObject();
scales.chromatic = [1,1,1,1,1,1,1,1,1,1,1]; // (random, atonal: all twelve notes)
scales.major = [2,2,1,2,2,2,1]; // (classic, happy)
scales.harmonicMinor = [2,1,2,2,1,3,1]; // (haunting, creepy)
scales.minorPentatonic = [3,2,2,3,2]; // (blues, rock)
scales.naturalMinor = [2,1,2,2,1,2,2]; // (scary, epic)
scales.melodicMinorUp = [2,1,2,2,2,2,1]; // (wistful, mysterious)
scales.melodicMinorDown = [2,2,1,2,2,1,2];  // (sombre, soulful)
scales.dorian = [2,1,2,2,2,1,2]; // (cool, jazzy)
scales.mixolydian = [2,2,1,2,2,1,2]; // (progressive, complex)
scales.ahavaRaba = [1,3,1,2,1,2,2]; // (exotic, unfamiliar)
scales.majorPentatonic = [2,2,3,2,3]; // (country, gleeful)
scales.diatonic = [2,2,2,2,2,2]; // (bizarre, symmetrical)

// chord voicings in semitone distance from root note
export let chord = new DataObject();
chord.major = [0,4,7];
chord.minor = [0,3,7];
chord.relMinor1stInv = [0,4,9];
chord.subdominant2ndInv = [0,5,9];
chord.major7th = [0,4,7,11];
chord.minor7th = [0,3,7,10];
chord.major9th = [0,4,7,14];
chord.minor9th = [0,3,7,13];
chord.major6th = [0,4,9];
chord.minor6th = [0,3,8];
chord.major7th9th = [0,4,7,11,14];
chord.minor7th9th = [0,3,7,10,13];
chord.major7th11th = [0,4,7,11,18];
chord.minor7th11th = [0,3,7,10,17];

export let beatPatterns = new DataObject();
beatPatterns.one = [[0]];
beatPatterns.three = [[0],['0:2']];
beatPatterns.andThree = [[0], ['0:1:2'], ['0:2']];
beatPatterns.threeAnd = [[0], ['0:2'], ['0:2:2']];

export let timecodes = new DataArray('0', '0:0:1', '0:0:2', '0:0:3',
                              '0:1', '0:1:1', '0:1:2', '0:1:3',
                              '0:2', '0:2:1', '0:2:2', '0:2:3',
                              '0:3', '0:3:1', '0:3:2', '0:3:3');
export let octaves = new DataArray(3, 4, 5);
export let notes = new DataArray('C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B');
