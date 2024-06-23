document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".view-ar");

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const arTarget = e.target.getAttribute("data-ar");
      // Logic to open the AR experience
      window.location.href = `${arTarget}.html`; // Assuming each AR experience has its own HTML file
    });
  });
});
