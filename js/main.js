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

//pass in some initial values for the filter and filter envelope
const synth = new Tone.PolySynth(Tone.Synth).toDestination();
const now = Tone.now()



window.addEventListener('load', () => {
    const camera = document.querySelector('[camera]');
    const marker = document.querySelector('a-marker');
    let check;

    marker.addEventListener('markerFound', () => {

        synth.triggerAttack("D4", now);
        synth.triggerAttack("F4", now + 0.5);
        synth.triggerAttack("A4", now + 1);
        synth.triggerAttack("C4", now + 1.5);
        synth.triggerAttack("E4", now + 2);

        console.log("Marker found!");

        let cameraPosition = camera.object3D.position;
        let markerPosition = marker.object3D.position;
        let distance = cameraPosition.distanceTo(markerPosition)

        check = setInterval(() => {
            cameraPosition = camera.object3D.position;
            markerPosition = marker.object3D.position;
            markerRotation = marker.object3D.rotation;
            // distance = cameraPosition.distanceTo(markerPosition)

            // do what you want with the distance:
            console.log(markerRotation.y);
        }, 1000);
    });

    marker.addEventListener('markerLost', () => {
        console.log("Marker lost...");
        clearInterval(1000);
        synth.triggerRelease(["D4", "F4", "A4", "C4", "E4"], now);
    });
})