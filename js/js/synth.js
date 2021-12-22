var loopBeat;

// Membrane Synth
const membraneSynth = new Tone.MembraneSynth().toMaster();

var membraneBpm = 0, membraneFreq = 0, membraneDecay = 0, membraneOctaves = 0;

var counter;

AFRAME.registerComponent('membrane', {
  
    init: function () {

      counter = 0;

      var markers = document.querySelectorAll('a-marker');

      // marker membrane
      // marker 
      markerMembrane = document.querySelector('#markerMembrane');
      // marker membrane text
      markerMembraneText = document.querySelector('#markerMembraneText');
      
      // marker membrane function 
      markerMembraneFunction = document.querySelector('#markerMembraneFunction');
      // marker membrane function text
      markerMembraneFunctionText = document.querySelector('#markerMembraneFunctionText');
      
      // marker membrane value 
      markerMembraneValue = document.querySelector('#markerMembraneValue');
      // marker membrane value text
      markerMembraneValueText = document.querySelector('#markerMembraneValueText');
      // marker membrane value ring
      markerMembraneValueRing = document.querySelector('#markerMembraneValueRing');



      // for each marker present in scene add even listener and trace visibility
      // event marker found
      markers.forEach(m => m.addEventListener('markerFound', function () {
        console.log('FOUND: ' + m.id);
        // markerVisible[m.id] = true;
        // if (m.id == 'membrane') {membraneSynth.volume.value = 0;} // start the beat if membrane marker is visible 
      }));
      // event marker lost
      markers.forEach(m => m.addEventListener('markerLost', function () {
        console.log('LOST: ' + m.id);
        // markerVisible[m.id] = false;
        // if (m.id == 'membrane') {membraneSynth.volume.value = -Infinity;} // stop the beat if membrane marker is not visible
      }));

      // initiate loop with a repeat interval of 16n and initiate transport
      loopBeat = new Tone.Loop(song, '16n'); 
      Tone.Transport.start("+1");
      loopBeat.start(1);
    },

    tick: function (time, timeDelta) {

      // Calculations for markers membrane BPM and Frequency
      membraneFunction = Math.abs(map(markerMembraneFunction.object3D.rotation.y, -1.2, 1.2, 0, 100)); // Map marker Y axis rotation to bpm
      
      // marker membrane synth
      // set marker text
      markerMembraneText.setAttribute('value', 'Membrane'); 

      if (membraneFunction<25 && membraneFunction>0) {
        membraneBpm = Math.abs(map(markerMembraneValue.object3D.rotation.y, -1.2, 1.2, 20, 200)); // BPM
        Tone.Transport.bpm.value = membraneBpm;
        markerMembraneValueText.setAttribute('value', Math.round(membraneBpm));
        markerMembraneFunctionText.setAttribute('value', 'BPM'); 
      } else if (membraneFunction<50 && membraneFunction>25) {
        membraneFreq = Math.abs(map(markerMembraneValue.object3D.rotation.y, -1.2, 1.2, 0, 300)); // FREQ
        markerMembraneValueText.setAttribute('value', Math.round(membraneFreq));
        markerMembraneFunctionText.setAttribute('value', 'FREQUENCY'); 
      } else if (membraneFunction<75 && membraneFunction>50) {
        membraneDecay = Math.abs(map(markerMembraneValue.object3D.rotation.y, -1.2, 1.2, 0, 1)); // DECAY
        markerMembraneValueText.setAttribute('value', Math.round(membraneDecay));
        markerMembraneFunctionText.setAttribute('value', 'DECAY'); 
      } else if (membraneFunction<100 && membraneFunction>75) {
        membraneOctaves = Math.abs(map(markerMembraneValue.object3D.rotation.y, -1.2, 1.2, 0.5, 8)); // OCTAVES
        markerMembraneValueText.setAttribute('value', Math.round(membraneOctaves));
        markerMembraneFunctionText.setAttribute('value', 'OCTAVES'); 
      }

    },
});

function song(time) {

  // membraneSynth.envelope.decay = membraneDecay;
  // membraneSynth.octaves = membraneOctaves;
  membraneSynth.triggerAttackRelease(100, '8n', time, 1);

  counter = (counter+1)%16;
}

function map (number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}