AFRAME.registerComponent('run', {
    init: function () {

        // MEMBRANE
        markerMembranePosition = new THREE.Vector3();
        markerMembraneOctavesPosition = new THREE.Vector3();
        markerMembraneFreqPosition = new THREE.Vector3();

        // line bpm geometry
        this.lineOctavesGeometry = new THREE.Geometry();
        this.lineOctavesGeometry.vertices.push(new THREE.Vector3(-1, -1, -1));
        this.lineOctavesGeometry.vertices.push(new THREE.Vector3(1, 1, 1));

        // line freq geometry
        this.lineFrequencyGeometry = new THREE.Geometry();
        this.lineFrequencyGeometry.vertices.push(new THREE.Vector3(-1, -1, -1));
        this.lineFrequencyGeometry.vertices.push(new THREE.Vector3(1, 1, 1));

        // METAL
        markerMetalPosition = new THREE.Vector3();
        markerMetalCountPosition = new THREE.Vector3();
        markerMetalDecayPosition = new THREE.Vector3();

        // line count geometry
        this.lineCountGeometry = new THREE.Geometry();
        this.lineCountGeometry.vertices.push(new THREE.Vector3(-1, -1, -1));
        this.lineCountGeometry.vertices.push(new THREE.Vector3(1, 1, 1));

        // line decay geometry
        this.lineDecayGeometry = new THREE.Geometry();
        this.lineDecayGeometry.vertices.push(new THREE.Vector3(-1, -1, -1));
        this.lineDecayGeometry.vertices.push(new THREE.Vector3(1, 1, 1));

        // line (dashed) material
        this.material = new THREE.LineDashedMaterial({ color: "white", dashSize: 0.3, gapSize: 0.2 });

        // assign lines
        this.lineOctaves = new THREE.Line(this.lineOctavesGeometry, this.material);
        this.lineFreq = new THREE.Line(this.lineFrequencyGeometry, this.material);
        this.lineCount = new THREE.Line(this.lineCountGeometry, this.material);
        this.lineDecay = new THREE.Line(this.lineDecayGeometry, this.material);

        // compute lines for bpm line to show dashed material
        // this.lineOctaves.computeLineDistances();

        // instantiate scene 
        let scene = document.querySelector('a-scene').object3D;

        // add previously created lines to the scene
        scene.add(this.lineOctaves);
        scene.add(this.lineFreq);
        scene.add(this.lineCount);
        scene.add(this.lineDecay);
    },

    tick: function (time, deltaTime) {
        // get points positions
        markerMembrane.object3D.getWorldPosition(markerMembranePosition);
        markerMembraneOctaves.object3D.getWorldPosition(markerMembraneOctavesPosition);
        markerMembraneFreq.object3D.getWorldPosition(markerMembraneFreqPosition);
        markerMetal.object3D.getWorldPosition(markerMetalPosition);
        markerMetalCount.object3D.getWorldPosition(markerMetalCountPosition);
        markerMetalDecay.object3D.getWorldPosition(markerMetalDecayPosition);

        // line from membrane to bpm
        this.lineOctavesGeometry.vertices[0] = markerMembranePosition;
        this.lineOctavesGeometry.vertices[1] = markerMembraneOctavesPosition;

        // line from membrane to freq
        this.lineFrequencyGeometry.vertices[0] = markerMembranePosition;
        this.lineFrequencyGeometry.vertices[1] = markerMembraneFreqPosition;

        // line from metal to count
        this.lineCountGeometry.vertices[0] = markerMetalPosition;
        this.lineCountGeometry.vertices[1] = markerMetalCountPosition;

        // line from metal to decay
        this.lineDecayGeometry.vertices[0] = markerMetalPosition;
        this.lineDecayGeometry.vertices[1] = markerMetalDecayPosition;

        // update vertices
        this.lineOctavesGeometry.verticesNeedUpdate = true;
        this.lineFrequencyGeometry.verticesNeedUpdate = true;
        this.lineCountGeometry.verticesNeedUpdate = true;
        this.lineDecayGeometry.verticesNeedUpdate = true;

        // check if markers are visible in order to only draw the lines when their visibility is true
        // line membrane bpm visibility
        if (markerVisible["membrane"] && markerVisible["membraneOctaves"]) {
            this.lineOctaves.visible = true;
            // console.log(this.p0.distanceTo(this.p1));    // PRINT LINE DISTANCE between vector this.p0 and this.p1
        } else { this.lineOctaves.visible = false; }
        // line membrane freq visibility
        if (markerVisible["membrane"] && markerVisible["membraneFREQ"]) {
            this.lineFreq.visible = true;
            // console.log(this.p0.distanceTo(this.p2));    // PRINT LINE DISTANCE between vector this.p0 and this.p2
        } else { this.lineFreq.visible = false; }
        // line metal count visibility
        if (markerVisible["metal"] && markerVisible["metalCount"]) {
            this.lineCount.visible = true;
            // console.log(this.p0.distanceTo(this.p2));    // PRINT LINE DISTANCE between vector this.p0 and this.p2
        } else { this.lineCount.visible = false; }
        // line metal decay visibility
        if (markerVisible["metal"] && markerVisible["metalDecay"]) {
            this.lineDecay.visible = true;
            // console.log(this.p0.distanceTo(this.p2));    // PRINT LINE DISTANCE between vector this.p0 and this.p2
        } else { this.lineDecay.visible = false; }
    }
});