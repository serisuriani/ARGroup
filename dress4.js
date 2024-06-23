// Import necessary functions from the library
import { loadAudio, loadGLTF } from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
  const start = async () => {
    try {
      const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: document.body,
        imageTargetSrc: "../../assets/targets/bride/dress44.mind",
      });

      const { renderer, scene, camera } = mindarThree;

      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      const gltf = await loadGLTF("../../assets/models/dress44/scene.gltf");
      gltf.scene.scale.set(0.001, 0.001, 0.001);
      gltf.scene.position.set(0, -0.4, 0);

      let mixer;
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
      } else {
        console.warn("No animations found in the GLTF model.");
      }

      const clock = new THREE.Clock(); // Define the clock variable

      gltf.scene.userData.clickable = true;

      const anchor = mindarThree.addAnchor(0);
      anchor.group.add(gltf.scene);

      const listener = new THREE.AudioListener();
      camera.add(listener);

      const sound = new THREE.Audio(listener);
      const audio = await loadAudio("../../assets/sounds/dress4.mp3");
      sound.setBuffer(audio);

      document.body.addEventListener("click", (e) => {
        const dressX = (e.clientX / window.innerWidth) * 2 - 1;
        const dressY = -(e.clientY / window.innerHeight) * 2 + 1;
        const dress = new THREE.Vector2(dressX, dressY);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(dress, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
          let o = intersects[0].object;
          while (o.parent && !o.userData.clickable) {
            o = o.parent;
          }
          if (o.userData.clickable && o === gltf.scene) {
            sound.play();
          }
        }
      });

      await mindarThree.start();
      renderer.setAnimationLoop(() => {
        const delta = clock.getDelta();
        gltf.scene.rotation.x += delta;
        if (mixer) mixer.update(delta);
        renderer.render(scene, camera);
      });
    } catch (error) {
      console.error("Error during AR setup:", error);
    }
  };

  start();
});
