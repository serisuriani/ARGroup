let selectedModel = null;
const synth = window.speechSynthesis;

// Function to open camera with different functionalities
function openCamera(mode) {
  alert(`Opening camera for ${mode} image target`);
  // Logic to switch camera mode can be implemented here
}

// Function to rotate the selected model
function rotateModel() {
  if (selectedModel) {
    selectedModel.object3D.rotation.x += Math.PI / 4;
    speak("The object is rotating at the x-axis");
  }
}

// Function to translate the selected model
function translateModel() {
  if (selectedModel) {
    selectedModel.object3D.position.y += 0.5;
    speak("The object is translating at the y-axis");
  }
}

// Function to handle voice narration
function speak(text) {
  const utterThis = new SpeechSynthesisUtterance(text);
  synth.speak(utterThis);
}

// Adding click event listeners to models
document.querySelector("#model1").addEventListener("click", () => {
  selectedModel = document.querySelector("#model1");
  alert("Model 1 selected");
});

document.querySelector("#model2").addEventListener("click", () => {
  selectedModel = document.querySelector("#model2");
  alert("Model 2 selected");
});
