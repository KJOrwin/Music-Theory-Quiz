let notes = {
    "s": ["Cn4", "&#x2193;C", 261.63, "note-c", "c4-natural.png"],
    "e": ["C#4", "C#", 277.18, "note-c#", "c4-sharp.png"],
    "d": ["Dn4", "D", 293.66, "note-d", "d4-natural.png"],
    "r": ["Eb4", "Eb", 311.13, "note-eb", "e4-flat.png"],
    "f": ["En4", "E", 329.63, "note-e", "e4-natural.png"],
    "g": ["Fn4", "F", 349.23, "note-f", "f4-natural.png"],
    "y": ["F#4", "F#", 369.99, "note-f#", "f4-sharp.png"],
    "h": ["Gn4", "G", 392, "note-g", "g4-natural.png"],
    "u": ["Ab4", "Ab", 415.3, "note-ab", "a4-flat.png"],
    "j": ["An4", "A", 440, "note-a", "a4-natural.png"],
    "i": ["Bb4", "Bb", 466.16, "note-bb", "b4-flat.png"],
    "k": ["Bn4", "B", 493.88, "note-b", "b4-natural.png"],
    "l": ["Cn5", "&#x2191;C", 523.25, "note-C", "c5-natural.png"]
};
const NOTE_NAME = 0;
const NOTE_TEXT = 1;
const NOTE_FREQ = 2;
const NOTE_VAR = 3;
const NOTE_FILE = 4;

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
let stave = document.getElementById("stave");
let actions = document.getElementById("actions");
let successText = document.getElementById("success");

let selected_key = "";
let keyPressed = "";
let failed = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function staveExercise(blank) {
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
    loadStave(blank)
}

function loadStave(blank) {
    while (stave.hasChildNodes()) {
        stave.removeChild(stave.firstChild);
    }
    let img = document.createElement("img");
    img.className = "stave-elements";
    img.src = "assets/images/clef-sig.png";
    stave.append(img.cloneNode(true));
    if (blank) {
        actions.children[0].className = "col-sm-2"
        actions.children[2].style.display = "block"
        actions.children[3].style.display = "block"
        actions.children[4].className = "col-sm-2"
        img.src = "assets/images/blank-black.png";
        for (i = 0; i < 4; i++) {
            img.id = "n" + String(i + 1)
            stave.append(img.cloneNode(true))
        }
        return;
    }
    actions.children[0].className = "col-sm-3"
    actions.children[2].style.display = "none"
    actions.children[3].style.display = "none"
    actions.children[4].className = "col-sm-3"
    for (i = 0; i < randomNotes.length; i++) {
        img.id = "n" + String(i + 1)
        img.src = "assets/images/" + notes[randomNotes[i]][NOTE_FILE];
        stave.append(img.cloneNode(true));
    }
}

function audioExercise() {

}

async function playAudio() {
    for (let i = 0; i < randomNotes.length; i++) {
        console.log(notes[randomNotes[i]][NOTE_FREQ])
        playNote(1, notes[randomNotes[i]][NOTE_FREQ])
        await sleep(500);
        playNote(0)
        await sleep(500);
    }
}

function hint() {
    let note = document.getElementById("n" + String(currentNote + 1));    
    successText.innerHTML += "Hint <br/>";
    note.src = "assets/images/" + notes[randomNotes[currentNote]][NOTE_FILE];
    stave.children[currentNote + 1].style.backgroundColor = "#ffeecc";
    currentNote++;
}

function pressKey(key) {
    let note = document.getElementById("n" + String(currentNote + 1));
    if (notes[key] != undefined && !keyPressed) {
        selected_key = key
        keyPressed = window.getComputedStyle(document.getElementById(notes[key][NOTE_VAR])).backgroundColor;
        document.getElementById(notes[key][NOTE_VAR]).style.backgroundColor = "#c0c0c0";
        playNote(1, notes[key][NOTE_FREQ]);
        if (failed == false && randomNotes[0] && currentNote < 4) {
            if (key == randomNotes[currentNote]) {
                successText.innerHTML += "Success <br/>";
                note.src = "assets/images/" + notes[randomNotes[currentNote]][NOTE_FILE];
                stave.children[currentNote + 1].style.backgroundColor = "#ddffdd";
            } else {
                successText.innerHTML += "Fail <br/>";
                note.src = "assets/images/" + notes[randomNotes[currentNote]][NOTE_FILE];
                stave.children[currentNote + 1].style.backgroundColor = "#ffdddd";
                successText.innerHTML += "<br/>You Lose!<br/>";
                failed = true;
            }

            if (currentNote == 3 && failed == false) {
                successText.innerHTML += "<br/>You Win!<br/>";
            }
            currentNote++;
        }
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

document.addEventListener("keydown", (event) => pressKey(event.key));

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