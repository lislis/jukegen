# JukeGen

> procedually generated jukebox


## Install

`$ npm install jukegen`

or

`$ yarn add jukegen`

## Use


```js

import JukeGen from 'jukegen';

let jg = new JukeGen();

jg.start();

```

JukeGen will do all setup on init. Start with `.start()`, stop with `.stop()`.

Once JukeGen is playing it will regenerate a new piece of melody every 8 seconds (or two meassures) matching the base note and scale it picked during init.


## API

A JukeGen object exposes some getters:

`.getTime` to get the current seconds of playing. This resets after 8 seconds but you can count up yourself.

`.getFft` Fourier Transform information of what's playing, can be used to visualise.

`.getBpm` gets beats per minute, default is 120.

`.getTension` tension defines the maximum step (in semitones) two notes can be apart when a new piece of melody is generated. Default is 4.

`.getVolume` gets the volume.

`.getDistortion` JukeGen comes with a distortion node plugged in but it's default value is set to 0 (no distortion).

and some setters:

`.setBpm(int)` set the beats per minute.

`.setTension(int` tension defines the maximum step (in semitones) two notes can be apart when a new piece of melody is generated. Should be a natural number.

`.setVolume(int)` sets the volume.

`.setDistortion(int)` sets the value of the distortion node, should be a number.


## No tests?

No, mostly because I gave up on configuring webpack and mocha after two hours. But it is somewhere on my todo list.
