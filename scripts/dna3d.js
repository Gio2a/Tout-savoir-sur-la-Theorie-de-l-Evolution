import * as THREE from "three";

(function () {
  "use strict";

  const canvas = document.getElementById("dna-canvas");

  if (!canvas) {
    return;
  }

  const stage = canvas.closest(".dna-stage") || canvas.parentElement || canvas;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0, 22);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const dna = new THREE.Group();
  scene.add(dna);

  const turns = 3.2;
  const segments = 240;
  const radius = 2.4;
  const helixHeight = 14;
  const tubeRadius = 0.18;

  function strandPoint(t, offset) {
    const angle = t * turns * Math.PI * 2 + offset;
    const y = -helixHeight / 2 + t * helixHeight;

    return new THREE.Vector3(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    );
  }

  function buildStrand(offset, color, sheenColor) {
    const points = [];

    for (let i = 0; i <= segments; i++) {
      points.push(strandPoint(i / segments, offset));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 320, tubeRadius, 18, false);
    const material = new THREE.MeshPhysicalMaterial({
      color: color,
      roughness: 0.32,
      metalness: 0.28,
      clearcoat: 0.6,
      clearcoatRoughness: 0.18,
      sheen: 1,
      sheenColor: sheenColor,
      sheenRoughness: 0.6
    });

    return new THREE.Mesh(geometry, material);
  }

  const strandA = buildStrand(0, 0x6cb6d8, 0xa6dceb);
  const strandB = buildStrand(Math.PI, 0xc89cd6, 0xe2c4e8);

  dna.add(strandA);
  dna.add(strandB);

  const rungCount = 32;
  const rungBaseGeometry = new THREE.CylinderGeometry(0.085, 0.085, 1, 14);
  const sphereGeometry = new THREE.SphereGeometry(0.24, 24, 18);

  const sphereMaterialA = new THREE.MeshPhysicalMaterial({
    color: 0xa6dcec,
    roughness: 0.28,
    metalness: 0.42,
    clearcoat: 0.7,
    emissive: 0x0a2438,
    emissiveIntensity: 0.45
  });

  const sphereMaterialB = new THREE.MeshPhysicalMaterial({
    color: 0xe2c5e8,
    roughness: 0.28,
    metalness: 0.42,
    clearcoat: 0.7,
    emissive: 0x2a1138,
    emissiveIntensity: 0.45
  });

  const baseAtMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd4ad65,
    roughness: 0.55,
    metalness: 0.18
  });

  const baseGcMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x9bc8a3,
    roughness: 0.55,
    metalness: 0.18
  });

  const yAxis = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i < rungCount; i++) {
    const t = (i + 0.5) / rungCount;
    const pointA = strandPoint(t, 0);
    const pointB = strandPoint(t, Math.PI);

    const direction = new THREE.Vector3().subVectors(pointB, pointA);
    const length = direction.length();
    const mid = new THREE.Vector3().addVectors(pointA, pointB).multiplyScalar(0.5);

    const isAT = i % 2 === 0;
    const baseMaterial = isAT ? baseAtMaterial : baseGcMaterial;

    const rung = new THREE.Mesh(rungBaseGeometry, baseMaterial);
    rung.position.copy(mid);
    rung.scale.set(1, length, 1);

    const normalizedDir = direction.clone().normalize();
    rung.quaternion.setFromUnitVectors(yAxis, normalizedDir);
    dna.add(rung);

    const sphereA = new THREE.Mesh(sphereGeometry, sphereMaterialA);
    sphereA.position.copy(pointA);
    dna.add(sphereA);

    const sphereB = new THREE.Mesh(sphereGeometry, sphereMaterialB);
    sphereB.position.copy(pointB);
    dna.add(sphereB);
  }

  const ambient = new THREE.AmbientLight(0x4a5a70, 0.7);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(6, 9, 10);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0x5aa0ff, 1.2, 38);
  fillLight.position.set(-9, -4, 7);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xff8fcb, 0.8, 28);
  rimLight.position.set(0, 12, -8);
  scene.add(rimLight);

  const groundLight = new THREE.HemisphereLight(0x88aacc, 0x1a1f2a, 0.45);
  scene.add(groundLight);

  function resize() {
    const rect = stage.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }

  resize();

  if ("ResizeObserver" in window) {
    new ResizeObserver(resize).observe(stage);
  } else {
    window.addEventListener("resize", resize);
  }

  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

  stage.addEventListener("pointermove", function (event) {
    const rect = stage.getBoundingClientRect();
    pointer.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  stage.addEventListener("pointerleave", function () {
    pointer.targetX = 0;
    pointer.targetY = 0;
  });

  const clock = new THREE.Clock();

  function animate() {
    const elapsed = clock.getElapsedTime();

    pointer.x += (pointer.targetX - pointer.x) * 0.045;
    pointer.y += (pointer.targetY - pointer.y) * 0.045;

    dna.rotation.y += 0.0042;
    dna.rotation.x = -0.05 + pointer.y * 0.28;
    dna.rotation.z = pointer.x * 0.12;
    dna.position.y = Math.sin(elapsed * 0.55) * 0.18;

    rimLight.position.x = Math.cos(elapsed * 0.35) * 6;
    rimLight.position.z = Math.sin(elapsed * 0.35) * 6 - 4;

    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  }

  window.requestAnimationFrame(animate);
})();
