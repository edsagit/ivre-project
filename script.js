/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

console.log("Hello, world!");

window.addEventListener('load', () => {
    const camera = document.querySelector('[camera]');
    const marker = document.querySelector('a-marker');
   
    camera.addEventListener('camera-error', () => {
        console.log("Error acessing or loading the camera.");
    })
    
    marker.addEventListener('markerFound', () => {
        console.log("Marker found!")
    });

    marker.addEventListener('markerLost', () => {
      clearInterval(check);
    });
})


//AFRAME.registerComponent('markerhandler', {
//    init: function () {
//      this.el.sceneEl.addEventListener('markerFound', () => {
//        // redirect to custom URL e.g. google.com
//        console.log("Marker found");
//      })
//    }
//  });
