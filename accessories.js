import { loadGLTF, loadTexture } from "./libs/loader.js";
const THREE = window.MINDAR.FACE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    const mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.getElementById('ar-container'),
      canvas: document.getElementById('ar-canvas')
    });

    const { renderer, scene, camera } = mindarThree;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(0, 1, 1);
    const pointLight = new THREE.PointLight(0xffffff, 0.6, 100);
    pointLight.position.set(0, 10, 10);

    scene.add(ambientLight);
    scene.add(directionalLight);
    scene.add(pointLight);

    const faceMesh = mindarThree.addFaceMesh();
    let currentTiara = null;

    // Function to load a tiara based on its name
    const loadTiara = async (tiaraName) => {
      if (currentTiara) {
        scene.remove(currentTiara);
      }
      const texture = await loadTexture(`./img/${tiaraName}.png`);
      faceMesh.material.map = texture;
      faceMesh.material.transparent = true;
      faceMesh.material.needsUpdate = true;
      scene.add(faceMesh);
      currentTiara = faceMesh;
    };

    

    // Add event listeners to buttons
    document.querySelectorAll('.tiara-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const tiara = event.target.dataset.tiara;
        loadTiara(tiara);
      });
    });

    await mindarThree.start();
    faceMesh.position.set(0, 250, 0);
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };

  start();
});
