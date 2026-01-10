let notes = {
    "s": ["C", 261.63],
    "e": ["C#", 277.18],
    "d": ["D", 293.66],
    "r": ["Eb", 311.13],
    "f": ["E", 329.63],
    "g": ["F", 349.23],
    "y": ["F#", 369.99],
    "h": ["G", 392],
    "u": ["Ab", 415.3],
    "j": ["A", 440],
    "i": ["Bb", 466.16],
    "k": ["B", 493.88],
    "l": ["C", 523.25]
};

const ctx = new AudioContext();
let osc = null;

function playNote(frequency) {
    osc = ctx.createOscillator();
    osc.frequency.value = frequency;
    osc.connect(ctx.destination);
    osc.start()
}

const pressedKeys = new Set();

let notes_text = document.getElementById("notes");
let keyPressed = false

document.addEventListener("keydown", (event) => {
    if (notes[event.key] != undefined && !keyPressed) {
        notes_text.innerHTML += notes[event.key][0] + "<br>";
        keyPressed = true;
        playNote(notes[event.key][1])
    }
});

document.addEventListener("keyup", (event) => {
    osc.stop()
    osc = null;
    keyPressed = false;
});