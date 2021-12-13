{
  let _renderer, _scene, _camera, _controls;
  let _geometry;

  window.onload = init;

  function init() {
    initWorld();
    initScene();
  }

  //=====// World //========================================//

  function initWorld() {
    _renderer = new THREE.WebGLRenderer();
    _renderer.setPixelRatio(2);
    _renderer.setSize(window.innerWidth, window.innerHeight);
    _renderer.setClearColor(0x2e2f27);
    document.body.appendChild(_renderer.domElement);

    _scene = new THREE.Scene();

    _camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    _camera.position.set(0, 4, 30);
    _camera.target = new THREE.Vector3(0, 0, 0);

    // _controls = new THREE.OrbitControls(_camera, document.body);
    // _controls.target = _camera.target;
    // _controls.enableDamping = true;
    // _controls.dampingFactor = 0.1;
    // _controls.rotateSpeed = 0.1;

    window.addEventListener("resize", resize, false);
    resize();
    requestAnimationFrame(render);
  }

  function resize() {
    _renderer.setSize(window.innerWidth, window.innerHeight);
    _camera.aspect = window.innerWidth / window.innerHeight;
    _camera.updateProjectionMatrix();
  }

  function render() {
    requestAnimationFrame(render);
    // if (_controls) _controls.update();
    _renderer.render(_scene, _camera);
  }

  //=====// Scene //========================================//

  function initScene() {
    initGeometry();
    for (let i = 0; i < 1; i++) initMesh();
    requestAnimationFrame(loop);
  }

  function createSpiral() {
    let points = [];
    let r = 8;
    let a = 0;
    for (let i = 0; i < 120; i++) {
      let p = 1 - i / 120;
      //   r -= Math.pow(p, 2) * 0.187;
      r -= p * 0.125;
      a += 0.3 - (r / 6) * 0.2;
      console.log(a);

      points.push(new THREE.Vector3(r * Math.sin(a)/1.5, p * 3.5, r * Math.cos(a)/1.5));
    }
    return points;
  }

  function initGeometry() {
    const points = createSpiral();

    // Create the flat geometry
    const geometry = new THREE.BufferGeometry();

    // create two times as many vertices as points, as we're going to push them in opposing directions to create a ribbon
    geometry.addAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(points.length * 3 * 2), 3)
    );
    geometry.addAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(points.length * 2 * 2), 2)
    );
    geometry.setIndex(
      new THREE.BufferAttribute(new Uint16Array(points.length * 6), 1)
    );

    points.forEach((b, i) => {
      let o = 0.1;

      geometry.attributes.position.setXYZ(i * 2 + 0, b.x, b.y + o, b.z);
      geometry.attributes.position.setXYZ(i * 2 + 1, b.x, b.y - o, b.z);

      geometry.attributes.uv.setXY(i * 2 + 0, i / (points.length - 1), 0);
      geometry.attributes.uv.setXY(i * 2 + 1, i / (points.length - 1), 1);

      if (i < points.length - 1) {
        geometry.index.setX(i * 6 + 0, i * 2);
        geometry.index.setX(i * 6 + 1, i * 2 + 1);
        geometry.index.setX(i * 6 + 2, i * 2 + 2);

        geometry.index.setX(i * 6 + 0 + 3, i * 2 + 1);
        geometry.index.setX(i * 6 + 1 + 3, i * 2 + 3);
        geometry.index.setX(i * 6 + 2 + 3, i * 2 + 2);
      }
    });

    _geometry = geometry;
  }

  var t = 1;
  function initMesh() {
    let shader = new THREE.MeshBasicMaterial({
      color: "rgb(255,255,0)",
      transparent: true,
      side: THREE.DoubleSide,
    //   wireframe: true,
    });

    let mesh = new THREE.Mesh(_geometry, shader);
    mesh.rotation.y = t * 200;
    mesh.scale.setScalar(0.5 + Math.random());

    let rand = Math.random();
    // console.log(rand);
    mesh.scale.x = 2;
    mesh.scale.y = -3;
    mesh.scale.z = 2;
    mesh.position.y = 10;

    _scene.add(mesh);
    t++;
  }

  function loop() {
    requestAnimationFrame(loop);
    _scene.rotation.y += 0.02;
  }
}
