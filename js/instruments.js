
var markerVisible  = {};

var note = {value: 36, state: false};

var current;
var samples;

var nameText = 'piano';
var instrumentName;

AFRAME.registerComponent('membrane', {

    init: function () {

      markerInstrument = document.querySelector("#instrument");
      instrumentName = document.querySelector("#instrumentName");

      samples = SampleLibrary.load({
        instruments: ['piano', 'bass-electric', 'bassoon', 'cello', 'clarinet', 'contrabass', 'flute', 'french-horn', 'guitar-acoustic', 'guitar-electric','guitar-nylon', 'harmonium', 'harp', 'organ', 'saxophone', 'trombone', 'trumpet', 'tuba', 'violin', 'xylophone'],
        baseUrl: "./samples/"
    });

    // show keyboard on load //

        // loop through instruments and set release, connect to master output
        for (var property in samples) {
            if (samples.hasOwnProperty(property)) {
                console.log(samples[property]);
                samples[property].release = 0.5;
                samples[property].toMaster();
            }
        }

        // current = samples[chooseFour[0]];

        // select a specific sample
        current = samples[nameText];






      var markers = document.querySelectorAll('a-marker');


      // for each marker present in scene add even listener and trace visibility
      // event marker found
      markers.forEach(m => m.addEventListener('markerFound', function () {
        // console.log('FOUND: ' + m.id);
        markerVisible[m.id] = true;
        note.state = false;

        switch (m.id) {

          case 'key0':
            note.value = 36;
            break;
          case 'key1':
            note.value = 37; 
            break;
          case 'key2':
            note.value = 38; 
            break;
          case 'key3':
            note.value = 39; 
            break;
          case 'key4':
            note.value = 40; 
            break;
          case 'key5':
            note.value = 41; 
            break;
          case 'key6':
            note.value = 42; 
            break;
          case 'key7':
            note.value = 43; 
            break;
          case 'key8':
            note.value = 44; 
            break;
          case 'key9':
            note.value = 45; 
            break;
        }

        if (note.state === false) {
          current.triggerRelease(Tone.Frequency(note.value, "midi").toNote());
        }

      }));
      // event marker lost
      markers.forEach(m => m.addEventListener('markerLost', function () {
        // console.log('LOST: ' + m.id);
        markerVisible[m.id] = false;
        
        switch (m.id) {

          case 'key0':
            note.value = 36; 
            break;
          case 'key1':
            note.value = 37; 
            break;
          case 'key2':
            note.value = 38; 
            break;
          case 'key3':
            note.value = 39; 
            break;
          case 'key4':
            note.value = 40; 
            break;
          case 'key5':
            note.value = 41; 
            break;
          case 'key6':
            note.value = 42; 
            break;
          case 'key7':
            note.value = 43; 
            break;
          case 'key8':
            note.value = 44; 
            break;
          case 'key9':
            note.value = 45; 
            break;

        }

        // if (note.state === true) {
        //   // console.log(Tone.Frequency(note.value, "midi").toNote());
        //   current.triggerAttack(Tone.Frequency(note.value, "midi").toNote());
        // } 
        note.state = true;

      }));

    },

    tick: function (time, timeDelta) {
    


     instrument = Math.abs(map(markerInstrument.object3D.rotation.y, -1.2, 1.2, 0, 200));

     if (instrument>0 && instrument<10) {nameText = 'piano';}
     if (instrument>10 && instrument<20) {nameText = 'bass-electric';} 
     if (instrument>20 && instrument<30) {nameText = 'bassoon';} 
     if (instrument>30 && instrument<40) {nameText = 'cello';} 
     if (instrument>40 && instrument<50) {nameText = 'clarinet';}
     if (instrument>50 && instrument<60) {nameText = 'contrabass';}
     if (instrument>60 && instrument<70) {nameText = 'flute';}
     if (instrument>70 && instrument<80) {nameText = 'french-horn';}
     if (instrument>80 && instrument<90) {nameText = 'guitar-acoustic';}
     if (instrument>90 && instrument<100) {nameText = 'guitar-electric';}
     if (instrument>100 && instrument<110) {nameText = 'guitar-nylon';}
     if (instrument>110 && instrument<120) {nameText = 'harmonium';}
     if (instrument>120 && instrument<130) {nameText = 'harp';}
     if (instrument>130 && instrument<140) {nameText = 'organ';}
     if (instrument>140 && instrument<150) {nameText = 'saxophone';}
     if (instrument>150 && instrument<160) {nameText = 'trombone';}
     if (instrument>160 && instrument<170) {nameText = 'trumpet';}
     if (instrument>170 && instrument<180) {nameText = 'tuba';}
     if (instrument>180 && instrument<190) {nameText = 'violin';}
     if (instrument>190 && instrument<200) {nameText = 'xylophone';}

     current = samples[nameText];

     if (note.state === true) {
      // console.log(Tone.Frequency(note.value, "midi").toNote());
      current.triggerAttack(Tone.Frequency(note.value, "midi").toNote());
    } else if (note.state === false) {
        current.triggerRelease(Tone.Frequency(note.value, "midi").toNote());
     }
    //  console.log(nameText);
     instrumentName.setAttribute('value', nameText); 

    }
});

function map (number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}