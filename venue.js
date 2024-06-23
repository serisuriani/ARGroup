import { loadGLTF } from "./libs/loader.js";
import { CSS3DObject } from "./libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";

const THREE = window.MINDAR.IMAGE.THREE;
let mindarThreeInstance;

const createYoutube = (videoId) => {
  return new Promise((resolve, reject) => {
    if (typeof YT !== 'undefined' && typeof YT.Player === 'function') {
      resolve(new YT.Player('player', {
        videoId: videoId,
        events: {
          onReady: (event) => {
            resolve(event.target);
          }
        }
      }));
    } else {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        const player = new YT.Player('player', {
          videoId: videoId,
          events: {
            onReady: (event) => {
              resolve(event.target);
            }
          }
        });
      };
    }
  });
};

const startYouTubeAR = async (videoId, targetImage) => {
  try {
    const player = await createYoutube(videoId);

    mindarThreeInstance = new window.MINDAR.IMAGE.MindARThree({
      container: document.getElementById('ar-container'),
      imageTargetSrc: targetImage,
    });

    const { renderer, cssRenderer, scene, cssScene, camera } = mindarThreeInstance;

    const obj = new CSS3DObject(document.querySelector("#ar-div"));

    const cssAnchor = mindarThreeInstance.addCSSAnchor(0);
    cssAnchor.group.add(obj);

    cssAnchor.onTargetFound = () => {
      player.playVideo();
      adjustPlayerSize(); // Call function to adjust player size
      
    };
    cssAnchor.onTargetLost = () => {
      player.pauseVideo();
    };

    await mindarThreeInstance.start();

    renderer.setAnimationLoop(() => {
      cssRenderer.render(cssScene, camera);
    });

    function adjustPlayerSize() {
      const arContainer = document.getElementById('ar-container');
      const player = document.getElementById('player');

      const containerWidth = arContainer.clientWidth;
      const containerHeight = arContainer.clientHeight;
      
      // Adjust player size based on container size
      let playerWidth = containerWidth * 0.9; // Adjust size as needed
      let playerHeight = (playerWidth / 16) * 9; // Assuming 16:9 aspect ratio

      // Check if the player height exceeds container height
      if (playerHeight > containerHeight) {
        playerHeight = containerHeight * 0.9; // Adjust to fit within container
        playerWidth = (playerHeight / 9) * 16; // Adjust width based on new height
      }

      // Set player dimensions
      player.style.width = `${playerWidth}px`;
      player.style.height = `${playerHeight}px`;
    }

  } catch (error) {
    console.error('Error starting YouTube AR', error);
  }
};

const youtubeBtns = document.querySelectorAll('.youtube-btn');

// Update with MindAR image target URL
const mindarImageTarget = "./assets/targets/venue.mind";

youtubeBtns.forEach((btn, index) => {
  btn.addEventListener('click', async () => {
    const videoId = btn.getAttribute('data-video-id');
    startYouTubeAR(videoId, mindarImageTarget).then(() => {
      console.log('YouTube AR started with video ID:', videoId);
    }).catch((error) => {
      console.error('Error starting YouTube AR', error);
    });
  });
});
