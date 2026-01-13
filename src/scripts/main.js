let notes = {
    "s": ["&#x2193;C", 261.63, "note-c"],
    "e": ["C#", 277.18, "note-c#"],
    "d": ["D", 293.66, "note-d"],
    "r": ["Eb", 311.13, "note-eb"],
    "f": ["E", 329.63, "note-e"],
    "g": ["F", 349.23, "note-f"],
    "y": ["F#", 369.99, "note-f#"],
    "h": ["G", 392, "note-g"],
    "u": ["Ab", 415.3, "note-ab"],
    "j": ["A", 440, "note-a"],
    "i": ["Bb", 466.16, "note-bb"],
    "k": ["B", 493.88, "note-b"],
    "l": ["&#x2191;C", 523.25, "note-C"]
};

const ctx = new AudioContext();
const osc = ctx.createOscillator();
const gain = ctx.createGain()
const fadeTime = 0.05;
osc.type = "triangle";
osc.frequency.value = 261.63;
gain.gain.value = 0;
osc.connect(gain).connect(ctx.destination);
osc.start();

let randomNote = ""
let randomNotes = [];
let currentNote = 0;

let output = document.getElementById("notes");
let successText = document.getElementById("success");

let selected_key = "";
let keyPressed = "";
let failed = false;

function startExercise() {
    currentNote = 0;
    output.innerHTML = ""
    successText.innerHTML = ""
    failed = false;
    for (i = 0; i < 4; i++) {
        randomNote = Object.keys(notes)[Math.floor(Math.random() * Object.keys(notes).length)]
        randomNotes[i] = randomNote;
        output.innerHTML += notes[randomNote][0] + ", ";
    }
}

function playNote(gainValue, frequencyValue = -1) {
    if (frequencyValue != -1) {
        osc.frequency.value = frequencyValue;
    }
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(gainValue, ctx.currentTime + fadeTime);
}

document.addEventListener("keydown", () => ctx.resume(), { once: true });

document.addEventListener("keydown", (event) => {
    if (notes[event.key] != undefined && !keyPressed) {
        selected_key = event.key
        keyPressed = window.getComputedStyle(document.getElementById(notes[event.key][2])).backgroundColor;
        document.getElementById(notes[event.key][2]).style.backgroundColor = "#c0c0c0";
        playNote(1, notes[event.key][1]);

        if (failed == false && randomNotes[0]) {
            if (event.key == randomNotes[currentNote]) {
                successText.innerHTML += "Success <br/>";
            } else {
                successText.innerHTML += "Fail <br/>";
                successText.innerHTML += "<br/>You Lose!<br/>";
                failed = true;
            }

            if (currentNote == 3 && failed == false) {
                successText.innerHTML += "<br/>You Win!<br/>";
            }
            currentNote++;
        }
        
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key == selected_key) {
        playNote(0);
        if (keyPressed == "rgb(255, 255, 255)") {
            document.getElementById(notes[event.key][2]).style.backgroundColor = "#ffffff";
        } else if (keyPressed == "rgb(0, 0, 0)") {
            document.getElementById(notes[event.key][2]).style.backgroundColor = "#000000";
        }
        
        keyPressed = "";
    }
});