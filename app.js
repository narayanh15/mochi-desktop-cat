const stage = document.querySelector("#stage");
const cat = document.querySelector("#cat");
const petZone = document.querySelector("#pet-zone");
const speech = document.querySelector("#speech");
const particles = document.querySelector("#particles");

const messages = [
  "Meow.",
  "Keep going.",
  "Water check.",
  "Tiny break?",
  "I'm here.",
];

let muted = false;
let strokes = 0;
let lastStroke = 0;
let speechTimer;
let happyTimer;
let audioContext;

function showSpeech(text, duration = 1900) {
  clearTimeout(speechTimer);
  speech.textContent = text;
  speech.classList.add("show");
  speechTimer = setTimeout(() => speech.classList.remove("show"), duration);
}

function addSpark() {
  const spark = document.createElement("span");
  spark.className = "spark";
  spark.textContent = Math.random() > .35 ? "✦" : "+";
  spark.style.setProperty("--drift", `${Math.round(Math.random() * 28 - 14)}px`);
  particles.appendChild(spark);
  spark.addEventListener("animationend", () => spark.remove());
}

function playMeow() {
  if (muted) return;
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return;
  audioContext ||= new Audio();
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(620, now);
  oscillator.frequency.exponentialRampToValueAtTime(850, now + .1);
  oscillator.frequency.exponentialRampToValueAtTime(440, now + .38);
  gain.gain.setValueAtTime(.0001, now);
  gain.gain.exponentialRampToValueAtTime(.1, now + .025);
  gain.gain.exponentialRampToValueAtTime(.0001, now + .4);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + .42);
}

function becomeHappy(text = "Prrrrr.") {
  clearTimeout(happyTimer);
  stage.classList.add("happy");
  showSpeech(text);
  addSpark();
  happyTimer = setTimeout(() => stage.classList.remove("happy"), 1700);
}

function reactToClick(event) {
  if (event.detail > 1) return;
  playMeow();
  becomeHappy(messages[Math.floor(Math.random() * messages.length)]);
}

petZone.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "mouse" || event.buttons !== 0) return;
  const now = performance.now();
  if (now - lastStroke < 55) return;
  lastStroke = now;
  strokes += 1;
  stage.classList.add("petted");
  setTimeout(() => stage.classList.remove("petted"), 100);
  if (strokes >= 7) {
    strokes = 0;
    becomeHappy();
  }
});

petZone.addEventListener("pointerleave", () => { strokes = 0; });
petZone.addEventListener("click", reactToClick);
petZone.addEventListener("dblclick", () => {
  addSpark();
  setTimeout(addSpark, 110);
  showSpeech("Oh. Hi.");
});

cat.addEventListener("click", reactToClick);

window.mochi?.onCornerChange((corner) => {
  stage.dataset.corner = corner;
});

window.mochi?.onMuteChange((value) => {
  muted = value;
  showSpeech(muted ? "Quiet mode." : "Sound on.");
});

setTimeout(() => showSpeech("Meow.", 1800), 450);

setInterval(() => {
  if (!speech.classList.contains("show") && document.visibilityState === "visible") {
    showSpeech(messages[Math.floor(Math.random() * messages.length)]);
  }
}, 30000);
