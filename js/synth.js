// const synth = new Tone.Synth({
//     volume: -15, // -15dB
//     oscillator: {
//       type: 'triangle' // triangle wave 
//     },
//     envelope: {
//       attack: 0.03, // 30ms attack
//       release: 1 // 1s release
//     }
// }).toMaster();

const now = Tone.now();
const plucky = new Tone.PluckSynth().toDestination();

let loopBeat;

const membraneSynth = new Tone.MembraneSynth().toMaster();
const metalSynth = new Tone.MetalSynth(
  {
    frequency : 250 ,
    envelope : {
      attack : 0.001 ,
      decay : 0.1 ,
      release : 0.01
    },
    harmonicity : 4.1 ,
    modulationIndex : 16 ,
    resonance : 8000 ,
    octaves : 0.5
    }          
).toMaster();

const autoFilter = new Tone.AutoFilter("4n").toMaster();
const toneOscillator = new Tone.Oscillator(400, "sine").connect(autoFilter).toMaster();

// let markerMembrane_position;

// Membrane Synth
// Membrane Synth BPM marker
// let markerMembraneBpm, markerMembraneBpmValue, bpm;

// Membrane Synth Frequency marker
// let markerMembraneFreq, markerMembraneFreqValue, freq;

// Metal Synth
// Metal Synth Count marker
let count;
// Metal Synth Frequency marker
let metalFreq;

let oscillatorCount;
// oscillator frequency
let oscillatorFrequency;

let markerVisible = { 
   markerMembrane: false,
   markerMembraneBpm: false,
   markerMembraneFreq: false,
   markerMetal: false,
   markerMetalCount: false,
   markerMetalFreq: false
  };

let counter;

AFRAME.registerComponent('membrane', {
   // dependencies: ['raycaster'],  // for oculus go laser controls
/*     schema: {
        // Describe the property of the component.
        note: {
            // NOTE: type: 'string' is referring to our Aframe component's property type, not a synth preset
            type: 'string', 
            default: 'C4' // C4 default note
          },
        duration: {
            type: 'string',
            default: '4n' // quarter note default time
          }
    }, */
  
    init: function () {

      counter = 0;

      // console.log(this.data.duration);

      let marker = document.querySelectorAll('a-marker');

      // marker membrane
      // marker 
      markerMembrane = document.querySelector('#membrane');
      // marker membrane text
      markerMembraneValue = document.querySelector('#membraneValue');
      
      // marker Bpm 
      markerMembraneBpm = document.querySelector('#membraneBPM');
      // marker Bpm text
      markerMembraneBpmValue = document.querySelector('#membraneBPMValue');
      // marker Bpm ring
      markerMembraneBpmRing = document.querySelector('#membraneBPMRing');
      
      // marker Freq
      markerMembraneFreq = document.querySelector('#membraneFREQ');
      // marker Freq text
      markerMembraneFreqValue = document.querySelector('#membraneFREQValue');
      // marker Freq ring
      markerMembraneFreqRing = document.querySelector('#membraneFREQRing');
      
      // marker metal synth
      // marker
      markerMetal = document.querySelector('#metal');
      // marker metal text
      markerMetalValue = document.querySelector('#metalValue');
      // marker Count
      markerMetalCount = document.querySelector('#metalCount');
      // marker Count text 
      markerMetalCountValue = document.querySelector('#metalCountValue');
      // marker Count ring
      markerMetalCountRing = document.querySelector('#metalCountRing');
      // marker Freq
      markerMetalDecay = document.querySelector('#metalDecay');
      // marker Freq text
      markerMetalDecayValue = document.querySelector('#metalDecayValue');
      // marker Freq ring
      markerMetalDecayRing = document.querySelector('#metalDecayRing');

      // marker oscillator
      // marker 
      markerOscillator = document.querySelector('#oscillator');
      // marker oscillator text
      markerOscillatorValue = document.querySelector('#oscillatorValue');

      // marker freq
      markerOscillatorFreq = document.querySelector('#oscillatorFreq');
      // marker freq text
      markerOscillatorFreqValue = document.querySelector('#oscillatorFreqValue');
      // marker freq ring
      markerOscillatorFreqRing = document.querySelector('#oscillatorFreqRing');

      // marker count
      markerOscillatorCount = document.querySelector('#oscillatorCount');
      // marker count text
      markerOscillatorCountValue = document.querySelector('#oscillatorCountValue');
      // marker count ring
      markerOscillatorCountRing = document.querySelector('#oscillatorCountRing');


      // for each marker present in scene add even listener and trace visibility
      // event marker found
      marker.forEach(m => m.addEventListener('markerFound', function () {
        console.log('FOUND: ' + m.id);
        markerVisible[m.id] = true;
        if (m.id == 'membrane') { loopBeat.start(0);} // start the beat if membrane marker is visible 
      }));
      // event marker lost
      marker.forEach(m => m.addEventListener('markerLost', function () {
        console.log('LOST: ' + m.id);
        markerVisible[m.id] = false;
        if (m.id == 'membrane') { loopBeat.stop(0);} // stop the beat if membrane marker is not visible
      }));

      // initiate loop with a repeat interval of 16n and initiate transport
      loopBeat = new Tone.Loop(song, '16n'); 
      Tone.Transport.start();
      // toneOscillator.start();

    },

    tick: function (time, timeDelta) {
      
      // Calculations for markers membrane BPM and Frequency
      bpm = Math.abs(map(markerMembraneBpm.object3D.rotation.y, -1.5, 1.5, 40, 300)); // Map marker Y axis rotation to bpm
      membraneFreq = Math.abs(map(markerMembraneFreq.object3D.rotation.y, -1.5, 1.5, 0, 1500)); // Map marker Y axis rotation to freq
      
      // Calculations for markers metal Count and Frequency
      count = Math.abs(map(markerMetalCount.object3D.rotation.y, -1.5, 1.5, 0, 16)); // Map marker Y axis rotation to count
      metalFreq = Math.abs(map(markerMetalDecay.object3D.rotation.y, -1.5, 1.5, 0, 3)); // Map marker Y axis rotation to freq

      // Calculations for markers oscillator frequency and
      // count = Math.abs(map(markerMetalCount.object3D.rotation.y, -1.5, 1.5, 0, 16)); // Map marker Y axis rotation to count
      oscillatorFrequency = Math.abs(map(markerOscillatorFreq.object3D.rotation.y, -1.5, 1.5, 0, 1000)); // Map marker Y axis rotation to freq
      oscillatorCount = Math.abs(map(markerOscillatorCount.object3D.rotation.y, -1.5, 1.5, 0, 16)); // Map marker Y axis rotation to freq
      
      // console.log(metalFreq);

      Tone.Transport.bpm.value = bpm; // Assign rotation value from marker to Tone BPM
      
      // marker membrane synth
      // set marker text
      markerMembraneValue.setAttribute('value', 'Membrane'); 

      // marker bpm
      // set marker text
      markerMembraneBpmValue.setAttribute('value', 'BPM\n' + Math.round(bpm)); 
      // set a-ring bpm theta value
      markerMembraneBpmRing.setAttribute('theta-length', map(Math.round(bpm), 40, 300, 0, 360)); 

      // marker frequency
      // set marker text
      markerMembraneFreqValue.setAttribute('value', 'FREQ\n' + Math.round(membraneFreq)); 
      // set a-ring freq theta value
      markerMembraneFreqRing.setAttribute('theta-length', map(Math.round(membraneFreq), 0, 1500, 0, 360)); 


      // marker metal synth
      // set marker text
      markerMetalValue.setAttribute('value', 'Metal'); // Assign a-text metal value

      // marker count
      // set marker text
      markerMetalCountValue.setAttribute('value', 'COUNT\n' + Math.round(count));
      // set marker ring
      markerMetalCountRing.setAttribute('theta-length', map(Math.round(count), 0, 16, 0, 360)); 

      // marker decay
      // set marker text
      markerMetalDecayValue.setAttribute('value', 'DECAY\n' + Math.round(metalFreq));
      // set marker ring
      markerMetalDecayRing.setAttribute('theta-length', map(metalFreq, 0, 3, 0, 360)); 


      // marker oscillator
      // set marker text
      markerOscillatorValue.setAttribute('value', 'Oscillator');
      
      // set marker frequency
      markerOscillatorFreqValue.setAttribute('value', 'FREQ\n' + Math.round(oscillatorFrequency));
      markerOscillatorFreqRing.setAttribute('theta-length', map(Math.round(oscillatorFrequency), 0, 1000, 0, 360)); 

      markerOscillatorCountValue.setAttribute('value', 'COUNT\n' + Math.round(oscillatorCount));
      markerOscillatorCountRing.setAttribute('theta-length', map(Math.round(oscillatorCount), 0, 16, 0, 360)); 

    },
});

function song(time) {
  toneOscillator.start();
  toneOscillator.type = "sine";
  toneOscillator.frequency.value = oscillatorFrequency;
  // toneOscillator.frequency.rampTo = (oscillatorFrequency+ 200, 10);

  if (counter%16 != 1) {
    membraneSynth.triggerAttackRelease(membraneFreq, '8n', time, 1);
  }

  if (counter%Math.round(count) === 0) {
    metalSynth.envelope.decay = metalFreq;
    metalSynth.triggerAttack('32n', time, 1);
  }

  if (counter%Math.round(oscillatorCount) === 0) {
    toneOscillator.type = "sine2";
    // plucky.triggerAttack(300, time + 0.25);
    // plucky.triggerAttack(250, time + 0.50);
    // plucky.triggerAttack(200, time + 0.75);
    // plucky.triggerAttack(150, time + 1);
    // plucky.triggerAttack(100, time + 1.25);
    // plucky.triggerAttack(50, time + 1.50);
    // plucky.release(time + 5);
    // console.log("asd");
  }
      


  counter = (counter+1)%16;
}

function map (number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}