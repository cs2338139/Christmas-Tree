{
  let _renderer, _scene, _camera, controls;
  var _geometry = new Array();
  var mesh = new Array();
  let light, starMesh;

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

    // const pointLight = new THREE.PointLight(0xff0000, 10);
    // pointLight.position.set(0, 11.5, 0);
    // _scene.add(pointLight);

    // const sphereSize = 10;
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    // _scene.add(pointLightHelper);

    controls = new THREE.OrbitControls(_camera, _renderer.domElement);
    controls.enabled = true;
    controls.minDistance = 0;
    controls.maxDistance = 1000;
    controls.enablePan = true;

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
    CreateStar();
    requestAnimationFrame(loop);
  }

  function initGeometry(i) {
    const points = createSpiral(i);
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(points.length * 3 * 2), 3)
    );
    geometry.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(points.length * 2 * 2), 2)
    );
    geometry.setIndex(
      new THREE.BufferAttribute(new Uint16Array(points.length * 6), 1)
    );

    points.forEach((b, i) => {
      let o = 0.15;

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
    let r = 0.2;
    let a = 0;
    let h = 10;
    let w = 215,
      w1 = 100;

    for (let i = 0; i < w; i++) {
      let p = 1 - i / w;

      if (i <= 50) {
        h -= (1 / w) * 15;
      } else if (i > 50 && i <= w1) {
        h -= (1 / w) * 5;
        r += p * 0.2;
      } else if (i > w1) {
        h -= (1 / w) * 15;
        r -= p * 0.2;
      }
      // r -= Math.pow(p, 2) * 0.187;
      a += 0.3 - (r / 6) * 0.2;
      console.log(i + "  " + h);
      switch (n) {
        case 0:
          points.push(
            new THREE.Vector3(
              (r * Math.sin(a)) / -1.5,
              h,
              (r * Math.cos(a)) / -1.5
            )
          );
          break;
        case 1:
          points.push(
            new THREE.Vector3(
              (r * Math.sin(a)) / 1.5,
              h,
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
          // transparent: true,
          side: THREE.DoubleSide,
          // wireframe:true
        });

        break;
      case 1:
        shader = new THREE.MeshBasicMaterial({
          color: "rgb(255,0,0)",
          // transparent: true,
          side: THREE.DoubleSide,
          // wireframe:true
        });
        break;

      default:
        break;
    }
    mesh[x] = new THREE.Mesh(_geometry[x], shader);
    mesh[x].rotation.y = 180;
    mesh[x].scale.setScalar(0.5 + Math.random());

    let rand = Math.random();
    mesh[x].scale.x = 2;
    mesh[x].scale.y = -1.5;
    mesh[x].scale.z = 2;
    mesh[x].position.y = 8;
    // mesh[x].position.x = 10*x;

    _scene.add(mesh[x]);
  }

  function CreateStar() {
    let starGeometry = new THREE.IcosahedronGeometry(0.6);
    let starMaterial = new THREE.MeshBasicMaterial({
      color: "rgb(255,255,0)",
    });
    starMesh = new THREE.Mesh(starGeometry, starMaterial);
    starMesh.position.y = 11.5;
    _scene.add(starMesh);
  }

  function loop() {
    requestAnimationFrame(loop);
    // _scene.rotation.y += 0.04;
    for (let i = 0; i < mesh.length; i++) {
      mesh[i].rotation.y += 0.04;
    }
    starMesh.rotation.y += 0.04;
  }
}
