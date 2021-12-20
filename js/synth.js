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

// const now = Tone.now();
// const plucky = new Tone.PluckSynth().toDestination();

var loopBeat;

const autoFilter = new Tone.AutoFilter("4n").toDestination();
const toneOscillator = new Tone.Oscillator(400, "sine").connect(autoFilter).toDestination();

// Membrane Synth

const membraneSynth = new Tone.MembraneSynth().toMaster();
// Membrane Synth BPM marker
// let markerMembraneBpm, markerMembraneBpmValue, bpm;

// Membrane Synth Frequency marker
// let markerMembraneFreq, markerMembraneFreqValue, freq;

// Metal Synth
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
).toDestination();

// Metal Synth Count and Metal Synth Frequency markers
var metalCount, metalDecay;

// Oscillator Count and Frequency markers
var oscillatorCount, oscillatorFrequency;

var markerVisible = { 
   markerMembrane: false,
   markerMembraneBpm: false,
   markerMembraneFreq: false,
   markerMetal: false,
   markerMetalCount: false,
   markerMetalFreq: false
  };

var counter;

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

      membraneSynth.volume.value = -Infinity;
      metalSynth.volume.value = -Infinity;
      toneOscillator.volume.value = -Infinity;

      counter = 0;

      // console.log(this.data.duration);

      var markers = document.querySelectorAll('a-marker');

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
      markers.forEach(m => m.addEventListener('markerFound', function () {
        console.log('FOUND: ' + m.id);
        markerVisible[m.id] = true;
        if (m.id == 'membrane') {membraneSynth.volume.value = 0;} // start the beat if membrane marker is visible 
        if (m.id == 'metal') {metalSynth.volume.value = 0;} // start the beat if membrane marker is visible 
        if (m.id == 'oscillator') {toneOscillator.volume.value = 0;} // start the beat if membrane marker is visible 
      }));
      // event marker lost
      markers.forEach(m => m.addEventListener('markerLost', function () {
        console.log('LOST: ' + m.id);
        markerVisible[m.id] = false;
        if (m.id == 'membrane') {membraneSynth.volume.value = -Infinity;} // stop the beat if membrane marker is not visible
        if (m.id == 'metal') {metalSynth.volume.value = -Infinity;} // stop the beat if membrane marker is not visible
        if (m.id == 'oscillator') {toneOscillator.volume.value = -Infinity;} // stop the beat if membrane marker is not visible
      }));

      // initiate loop with a repeat interval of 16n and initiate transport
      loopBeat = new Tone.Loop(song, '16n'); 
      Tone.Transport.start();
      toneOscillator.start();
      loopBeat.start(0);
    },

    tick: function (time, timeDelta) {

      // Calculations for markers membrane BPM and Frequency
      bpm = Math.abs(map(markerMembraneBpm.object3D.rotation.y, -1.2, 1.2, 40, 300)); // Map marker Y axis rotation to bpm
      membraneFreq = Math.abs(map(markerMembraneFreq.object3D.rotation.y, -1.2, 1.2, 20, 200)); // Map marker Y axis rotation to freq
      
      // Calculations for markers metal Count and Frequency
      metalCount = Math.abs(map(markerMetalCount.object3D.rotation.y, -1.2, 1.2, 0, 16)); // Map marker Y axis rotation to count
      metalDecay = Math.abs(map(markerMetalDecay.object3D.rotation.y, -1.2, 1.2, 0, 3)); // Map marker Y axis rotation to freq

      // Calculations for markers oscillator frequency and
      oscillatorFrequency = Math.abs(map(markerOscillatorFreq.object3D.rotation.y, -1.2, 1.2, 0, 1000)); // Map marker Y axis rotation to freq
      oscillatorCount = Math.abs(map(markerOscillatorCount.object3D.rotation.y, -1.2, 1.2, 0, 16)); // Map marker Y axis rotation to freq
      
      // console.log(metalFreq);

      Tone.Transport.bpm.value = bpm; // Assign rotation value from marker to Tone BPM
      
      // marker membrane synth
      // set marker text
      markerMembraneValue.setAttribute('value', 'Membrane'); 

      // marker bpm
      // set marker text
      markerMembraneBpmValue.setAttribute('value', 'BPM: ' + Math.round(bpm)); 
      // set a-ring bpm theta value
      markerMembraneBpmRing.setAttribute('theta-length', map(Math.round(bpm), 40, 300, 0, 360)); 

      // marker frequency
      // set marker text
      markerMembraneFreqValue.setAttribute('value', 'FREQ\n' + Math.round(membraneFreq)); 
      // set a-ring freq theta value
      markerMembraneFreqRing.setAttribute('theta-length', map(Math.round(membraneFreq), 20, 200, 0, 360)); 


      // marker metal synth
      // set marker text
      markerMetalValue.setAttribute('value', 'Metal'); // Assign a-text metal value

      // marker count
      // set marker text
      markerMetalCountValue.setAttribute('value', 'COUNT\n' + Math.round(metalCount));
      // set marker ring
      markerMetalCountRing.setAttribute('theta-length', map(Math.round(metalCount), 0, 16, 0, 360)); 

      // marker decay
      // set marker text
      markerMetalDecayValue.setAttribute('value', 'DECAY\n' + Math.round(metalDecay));
      // set marker ring
      markerMetalDecayRing.setAttribute('theta-length', map(metalDecay, 0, 3, 0, 360)); 


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

  toneOscillator.type = "sine2";
  toneOscillator.frequency.value = oscillatorFrequency;
  // toneOscillator.frequency.rampTo = (oscillatorFrequency+ 200, 10);

  membraneSynth.triggerAttackRelease(membraneFreq, '8n', time, 1);

  if (counter%16 != 2) {
    
  }

  if (counter%Math.round(metalCount) === 0) {
    metalSynth.envelope.decay = metalDecay;
    metalSynth.triggerAttack('32n', time, 1);
  }

  if (counter%Math.round(oscillatorCount) === 0) {
    // toneOscillator.type = "sine2";
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