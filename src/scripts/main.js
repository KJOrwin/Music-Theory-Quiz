let notes = {
    "s": ["C", 261.63, "note-c"],
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
    "l": ["C", 523.25, "note-C"]
};

const ctx = new AudioContext();
let osc = null;

function playNote(frequency) {
    osc = ctx.createOscillator();
    osc.frequency.value = frequency;
    osc.connect(ctx.destination);
    osc.start()
}

//let notes_text = document.getElementById("notes");
let selected_key = "";
let keyPressed = "";

document.addEventListener("keydown", (event) => {
    if (notes[event.key] != undefined && !keyPressed) {
        //notes_text.innerHTML += notes[event.key][0] + "<br>";
        selected_key = event.key
        keyPressed = window.getComputedStyle(document.getElementById(notes[event.key][2])).backgroundColor;
        document.getElementById(notes[event.key][2]).style.backgroundColor = "#ffaaaa";
        playNote(notes[event.key][1]);
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key == selected_key) {
        osc.stop();
        if (keyPressed == "rgb(255, 255, 255)") {
            document.getElementById(notes[event.key][2]).style.backgroundColor = "#ffffff";
        } else if (keyPressed == "rgb(0, 0, 0)") {
            document.getElementById(notes[event.key][2]).style.backgroundColor = "#000000";
        }
        
        osc = null;
        keyPressed = "";
    }
});