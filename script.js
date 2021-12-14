{
  let _renderer, _scene, _camera, _controls;
  let _geometry = new Array();

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

  function initScene() {
    for (let i = 0; i < 2; i++) {
      initGeometry(i);
      initMesh(i);
    }
    requestAnimationFrame(loop);
  }

  function initGeometry(i) {
    const points = createSpiral(i);
    const geometry = new THREE.BufferGeometry();

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

    _geometry[i] = geometry;
  }

  function createSpiral(n) {
    let points = [];
    let r = 8;
    let a = 0;
    for (let i = 0; i < 120; i++) {
      let p = 1 - i / 120;
      //   r -= Math.pow(p, 2) * 0.187;
      r -= p * 0.128;
      a += 0.3 - (r / 6) * 0.2;
      // console.log(a);

      switch (n) {
        case 0:
          points.push(
            new THREE.Vector3(
              (r * Math.sin(a)) / -1.5,
              p * 3.5,
              (r * Math.cos(a)) / -1.5
            )
          );
          break;
        case 1:
          points.push(
            new THREE.Vector3(
              (r * Math.sin(a)) / 1.5,
              p * 3.5,
              (r * Math.cos(a)) / 1.5
            )
          );
          break;

        default:
          break;
      }
    }
    return points;
  }

  function initMesh(x) {
    let shader;
    switch (x) {
      case 0:
        shader = new THREE.MeshBasicMaterial({
          color: "rgb(15,89,21)",
          transparent: true,
          side: THREE.DoubleSide,
          // wireframe:true
        });

        console.log(x);
        break;
      case 1:
        shader = new THREE.MeshBasicMaterial({
          color: "rgb(255,0,0)",
          transparent: true,
          side: THREE.DoubleSide,
          // wireframe:true
        });

        console.log(x);
        break;

      default:
        break;
    }
    let mesh = new Array();
    mesh[x] = new THREE.Mesh(_geometry[x], shader);
    mesh[x].rotation.y = 180;
    mesh[x].scale.setScalar(0.5 + Math.random());

    let rand = Math.random();
    mesh[x].scale.x = 2;
    mesh[x].scale.y = -3;
    mesh[x].scale.z = 2;
    mesh[x].position.y = 10;
    // mesh[x].position.x = 10*x;

    _scene.add(mesh[x]);
  }

  function loop() {
    requestAnimationFrame(loop);
    _scene.rotation.y += 0.04;
  }
}
