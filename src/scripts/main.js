// Colour example
// const notes = score.notes("C4/q, D4/q, E4/q, F4/q");

// // Make ONLY the first note red
// notes[0].setStyle({
//     fillStyle: "red",
//     strokeStyle: "red"
// });

let notes = {
    "s": ["Cn4", "&#x2193;C", 261.63, "note-c"],
    "e": ["C#4", "C#", 277.18, "note-c#"],
    "d": ["Dn4", "D", 293.66, "note-d"],
    "r": ["Eb4", "Eb", 311.13, "note-eb"],
    "f": ["En4", "E", 329.63, "note-e"],
    "g": ["Fn4", "F", 349.23, "note-f"],
    "y": ["F#4", "F#", 369.99, "note-f#"],
    "h": ["Gn4", "G", 392, "note-g"],
    "u": ["Ab4", "Ab", 415.3, "note-ab"],
    "j": ["An4", "A", 440, "note-a"],
    "i": ["Bb4", "Bb", 466.16, "note-bb"],
    "k": ["Bn4", "B", 493.88, "note-b"],
    "l": ["Cn5", "&#x2191;C", 523.25, "note-C"]
};
const NOTE_NAME = 0;
const NOTE_TEXT = 1;
const NOTE_FREQ = 2;
const NOTE_VAR = 3;

const ctx = new AudioContext();
const osc = ctx.createOscillator();
const gain = ctx.createGain()
const fadeTime = 0.05;
osc.type = "triangle";
osc.frequency.value = 261.63;
gain.gain.value = 0;
osc.connect(gain).connect(ctx.destination);
osc.start();

// Vexflow constants
let factory;
let score;
let system;

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
        output.innerHTML += notes[randomNote][NOTE_TEXT]
        if (i != 3) { output.innerHTML += ", " }
    }
    drawStave();
}

function drawStave() {
    document.getElementById("stave").innerHTML = "";

    factory = new VexFlow.Factory({ renderer: { elementId: "stave", width: 500, height: 200 } });
    score = factory.EasyScore();
    system = factory.System({ width: 400 });

    let note_output = "";
    for (i = 0; i < 4; i++) {
        note_output += notes[randomNotes[i]][NOTE_NAME];
        if (i == 0) { note_output += "/q" }
        if (i != 3) { note_output += ", " }
    }
    system.addStave({
        voices: [
            score.voice(score.notes(note_output))
        ],
    }).addClef("treble").addTimeSignature("4/4");

    factory.draw();
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

// Vexflow
window.addEventListener("load", function() {
    VexFlow.loadFonts("Bravura", "Academico").then(() => {
        VexFlow.setFonts("Bravura", "Academico");
    });
});

document.addEventListener("keydown", (event) => {
    if (notes[event.key] != undefined && !keyPressed) {
        selected_key = event.key
        keyPressed = window.getComputedStyle(document.getElementById(notes[event.key][NOTE_VAR])).backgroundColor;
        document.getElementById(notes[event.key][NOTE_VAR]).style.backgroundColor = "#c0c0c0";
        playNote(1, notes[event.key][NOTE_FREQ]);

        if (failed == false && randomNotes[0] && currentNote < 4) {
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
            document.getElementById(notes[event.key][NOTE_VAR]).style.backgroundColor = "#ffffff";
        } else if (keyPressed == "rgb(0, 0, 0)") {
            document.getElementById(notes[event.key][NOTE_VAR]).style.backgroundColor = "#000000";
        }
        
        keyPressed = "";
    }
});