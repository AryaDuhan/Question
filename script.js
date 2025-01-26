const resultDiv = document.getElementById("result");

const yesButton = document.getElementById("yesBtn");
const noButton = document.getElementById("noBtn");

let yesButtonSize = 1;
let noButtonSize = 1;

document.getElementById("yesBtn").addEventListener("click", function () {
  resultDiv.textContent = "LESGOOO !!!";
  resultDiv.style.color = "#4CAF50";

  yesButton.style.transform = "scale(1)";
  noButton.style.transform = "scale(1)";
  yesButtonSize = 1;
  noButtonSize = 1;
  yesButton.style.flexGrow = "1";
  noButton.style.flexGrow = "1";
});

document.getElementById("noBtn").addEventListener("click", function () {
  resultDiv.textContent = "";

  noButtonSize -= 0.1;
  yesButtonSize += 0.1;

  noButton.style.transform = `scale(${noButtonSize})`;
  yesButton.style.transform = `scale(${yesButtonSize})`;

  noButton.style.flexGrow = `${noButtonSize}`;
  yesButton.style.flexGrow = `${yesButtonSize}`;

  if (noButtonSize < 0.4) {
    noButtonSize = 0.4;
    noButton.style.flexGrow = "0.4";
  }
});

// particle effect
function createParticle() {
  const particle = document.createElement("div");
  particle.classList.add("particle");
  particle.style.left = `${Math.random() * 100}vw`;
  particle.style.top = `${Math.random() * 100}vh`;
  particle.style.animationDuration = `${Math.random() * 10 + 5}s`;

  const sizeClass =
    Math.random() > 0.5 ? "large" : Math.random() > 0.5 ? "medium" : "";
  if (sizeClass) particle.classList.add(sizeClass);

  document.getElementById("particles").appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 15000);
}

setInterval(createParticle, 1000);

document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("touchmove", handleTouchMove);

function handleMouseMove(event) {
  const { clientX, clientY } = event;
  updateBackgroundPosition(clientX, clientY);
}

function handleTouchMove(event) {
  const { clientX, clientY } = event.touches[0];
  updateBackgroundPosition(clientX, clientY);
}

function updateBackgroundPosition(x, y) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const xPercent = (x / windowWidth) * 100;
  const yPercent = (y / windowHeight) * 100;

  document.body.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
}
