/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// console.log("Hello, world!");

AFRAME.registerComponent('markerhandler', {
    init: function () {
      this.el.sceneEl.addEventListener('markerFound', () => {
        // redirect to custom URL e.g. google.com
        console.log("Marker found");
      })
    }
  });
