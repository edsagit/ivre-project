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
    frequency : 200 ,
    envelope : {
      attack : 0.001 ,
      decay : 0.1 ,
      release : 0.01
    },
    harmonicity : 5.1 ,
    modulationIndex : 32 ,
    resonance : 4000 ,
    octaves : 1.5
    }          
).toMaster();

let markerBPM;
let markerBPMValue;
let bpm;

let markerFREQ;
let markerFREQValue;

let count;
let freq;
let freq2;

let markerVisible = { membrane: false, membraneBPM: false, membraneFREQ: false };

let counter;

AFRAME.registerComponent('membrane', {
   // dependencies: ['raycaster'],  // for oculus go laser controls
    schema: {
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
    },
  
    init: function () {

      counter = 0;

      // console.log(this.data.duration);

      let marker = document.querySelectorAll('a-marker');

      markerMembrane = document.querySelector('#membrane');
      markerMenbraneValue = document.querySelector('#membraneValue');

      markerMetal = document.querySelector('#metal');
      markerMetalValue = document.querySelector('#metalValue');
      marker_Metal_Count = document.querySelector('#metalCount');
      marker_Metal_FREQ = document.querySelector('#metalFreq');

      markerBPM = document.querySelector('#membraneBPM');
      markerBPMValue = document.querySelector('#membraneBPMValue');
      markerBPMRing = document.querySelector('#membraneBPMRing');

      markerFREQ = document.querySelector('#membraneFREQ');
      markerFREQValue = document.querySelector('#membraneFREQValue');
      markerFREQRing = document.querySelector('#membraneFREQRing');

      marker.forEach(m => m.addEventListener('markerFound', function () {
        console.log('FOUND: ' + m.id);
        if (m.id == 'membrane') { loopBeat.start(0);}
      }));

      marker.forEach(m => m.addEventListener('markerLost', function () {
        console.log('LOST: ' + m.id);
        if (m.id == 'membrane') { loopBeat.stop(0);}
      }));


      loopBeat = new Tone.Loop(song, '16n');
      Tone.Transport.start();
    },
  
    trigger: function () {
      // synth.triggerAttackRelease(this.data.note, this.data.duration)
    },
  
    remove: function () {
      // Do something the component or its entity is detached.
      
    },
  
    tick: function (time, timeDelta) {

      bpm = Math.abs(map(markerBPM.object3D.rotation.y, -1.5, 1.5, 40, 300)); // Map marker Y axis rotation to bpm
      freq = Math.abs(map(markerFREQ.object3D.rotation.y, -1.5, 1.5, 0, 1500)); // Map marker Y axis rotation to freq
      freq2 = Math.abs(map(marker_Metal_FREQ.object3D.rotation.y, -1.5, 1.5, 50, 5000));// Map marker Y axis rotation to freq
      count = Math.abs(map(marker_Metal_Count.object3D.rotation.y, -1.5, 1.5, 0, 16));
      // console.log(freq2);

      Tone.Transport.bpm.value = bpm; // Assign rotation value from marker to Tone BPM

      markerMenbraneValue.setAttribute('value', 'Membrane'); // Assign a-text membrane value
      markerMetalValue.setAttribute('value', 'Metal'); // Assign a-text metal value

      markerBPMValue.setAttribute('value', 'BPM\n' + Math.round(bpm)); // Assign a-text BPM value
      markerBPMRing.setAttribute('theta-length', map(Math.round(bpm), 40, 300, 0, 360)); // Assign a-ring BPM theta value

      markerFREQValue.setAttribute('value', 'FREQ\n' + Math.round(freq)); // Assign a-text FREQ value
      markerFREQRing.setAttribute('theta-length', map(Math.round(freq), 0, 1500, 0, 360)); // Assign a-ring FREQ theta value
    

    
    },
});

function song(time) {
  
  if (counter%8 === 0) {
    membraneSynth.triggerAttackRelease(freq, '8n', time, 1);
    
  }

  if (counter%Math.round(count) === 0) {
    // console.log("hello world");
    plucky.triggerAttackRelease(freq2, time);
    // metalSynth.triggerAttackRelease('8n', time+0.02, 1);
  }

  // plucky.triggerAttack("C3", now + 1);
  // plucky.triggerAttack("C2", now + 1.5);
  // plucky.triggerAttack("C1", now + 2);
  counter = (counter+1)%16;
  // console.log(counter);
}

function map (number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}