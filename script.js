// Your script here.
// Base utterance object
const msg = new SpeechSynthesisUtterance();
msg.text = document.querySelector('[name="text"]').value;

let voices = [];

// Select elements
const voicesDropdown = document.querySelector('[name="voice"]');
const options = document.querySelectorAll('[type="range"], [name="text"]');
const speakButton = document.querySelector('#speak');
const stopButton = document.querySelector('#stop');

/* -------------------------
   LOAD AND POPULATE VOICES
--------------------------*/
function populateVoices() {
  voices = speechSynthesis.getVoices();

  // If no voices available (browser issue)
  if (!voices.length) {
    voicesDropdown.innerHTML = `<option value="">No voices available</option>`;
    return;
  }

  voicesDropdown.innerHTML = voices
    .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
    .join('');
}

// Browser loads voices asynchronously
speechSynthesis.addEventListener('voiceschanged', populateVoices);

/* -------------------------
   SET SELECTED VOICE
--------------------------*/
function setVoice() {
  msg.voice = voices.find(voice => voice.name === this.value);
  toggleSpeech(); // restart speech if user changes voice while speaking
}

/* -------------------------
   APPLY RATE / PITCH / TEXT CHANGES
--------------------------*/
function setOption() {
  msg[this.name] = this.value;
  toggleSpeech(); // live update while speaking
}

/* -------------------------
   SPEAK & STOP FUNCTIONS
--------------------------*/
function speak() {
  msg.text = document.querySelector('[name="text"]').value.trim();

  if (!msg.text) return alert("Please enter some text!");

  speechSynthesis.cancel();   // stop any previous speech
  speechSynthesis.speak(msg); // speak new input
}

function stop() {
  speechSynthesis.cancel();
}

/* -------------------------
   RESTART SPEECH ON SETTINGS CHANGE
--------------------------*/
function toggleSpeech() {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
  }
}

/* -------------------------
   EVENT LISTENERS
--------------------------*/
voicesDropdown.addEventListener('change', setVoice);
options.forEach(opt => opt.addEventListener('change', setOption));
speakButton.addEventListener('click', speak);
stopButton.addEventListener('click', stop);

// Initial voice load
populateVoices();
