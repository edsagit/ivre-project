let markerVisible = { m1: false, m2: false };

AFRAME.registerComponent('registermarker', {
    init: function () {
        let marker = this.el;
        this.m1 = document.querySelector("#m1");
        this.m2 = document.querySelector("#m2");
        this.p1 = new THREE.Vector3();
        this.p2 = new THREE.Vector3();

        marker.addEventListener('markerFound', function () {
            markerVisible[marker.id] = true;
            console.log(markerVisible);
        });

        marker.addEventListener('markerLost', function () {
            markerVisible[marker.id] = false;
        });
    },

    tick: function (time, deltaTime) {
        if (markerVisible["m1"]) {
            console.log("hello world");
            console.log(this.m1.object3D.rotation.y);
            // this.m0.object3D.getWorldPosition(this.p0);
            // this.m1.object3D.getWorldPosition(this.p1);
            // this.geometry.vertices[0] = this.p0;
            // this.geometry.vertices[1] = this.p1;
            // this.geometry.verticesNeedUpdate = true;
            // this.line.visible = true;
        }
    },
});