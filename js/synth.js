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
let membraneSynth;

let markerBPM;
let markerBPMValue;
let bpm;

let markerFREQ;
let markerFREQValue;
let freq;

let markerVisible = { markerBPM: false, m2: false };

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

      let marker = document.querySelectorAll('a-marker');

      markerMembrane = document.querySelector('#membrane');
      markerMenbraneValue = document.querySelector('#membraneValue');

      markerBPM = document.querySelector('#membraneBPM');
      markerBPMValue = document.querySelector('#membraneBPMValue');
      markerBPMRing = document.querySelector('#membraneBPMRing');

      markerFREQ = document.querySelector('#membraneFREQ');
      markerFREQValue = document.querySelector('#membraneFREQValue');
      markerFREQRing = document.querySelector('#membraneFREQRing');

      membraneSynth = new Tone.MembraneSynth().toMaster();
      loopBeat = new Tone.Loop(song, '4n');
      Tone.Transport.start();

      marker.forEach(m => m.addEventListener('markerFound', function () {
        console.log('FOUND: ' + m.id);
        if (m.id == 'membrane') { loopBeat.start(0);}
      }));

      marker.forEach(m => m.addEventListener('markerLost', function () {
        console.log('LOST: ' + m.id);
        if (m.id == 'membrane') { loopBeat.stop(0);}
      }));
    },
  
    trigger: function () {
      // synth.triggerAttackRelease(this.data.note, this.data.duration)
    },
  
    remove: function () {
      // Do something the component or its entity is detached.
      
    },
  
    tick: function (time, timeDelta) {

      bpm = Math.abs(map(markerBPM.object3D.rotation.y, -1.5, 1.5, 40, 300)); // Map marker Y axis rotation
      freq = Math.abs(map(markerFREQ.object3D.rotation.y, -1.5, 1.5, 0, 1500)); // Map marker Y axis rotation

      Tone.Transport.bpm.value = bpm; // Assign rotation value from marker to Tone BPM

      markerMenbraneValue.setAttribute('value', 'Membrane'); // Assign a-text membrane value
      markerBPMValue.setAttribute('value', 'BPM\n' + Math.round(bpm)); // Assign a-text BPM value
      markerBPMRing.setAttribute('theta-length', map(Math.round(bpm), 40, 300, 0, 360)); // Assign a-ring BPM theta value
      markerFREQValue.setAttribute('value', 'FREQ\n' + Math.round(freq)); // Assign a-text FREQ value
      markerFREQRing.setAttribute('theta-length', map(Math.round(freq), 0, 1500, 0, 360)); // Assign a-ring FREQ theta value
    },
});

function song(time) {
  
  membraneSynth.triggerAttackRelease(freq, '8n', time);
  // plucky.triggerAttack("C4", now);
  // plucky.triggerAttack("C3", now + 1);
  // plucky.triggerAttack("C2", now + 1.5);
  // plucky.triggerAttack("C1", now + 2);
}

function map (number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}