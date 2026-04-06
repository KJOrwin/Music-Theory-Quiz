let notes = {
    "s": ["Cn4", "&#x2193;C", 261.63, "note-c", "c4-natural.png", "white"],
    "e": ["C#4", "C#", 277.18, "note-c#", "c4-sharp.png", "black"],
    "d": ["Dn4", "D", 293.66, "note-d", "d4-natural.png", "white"],
    "r": ["Eb4", "Eb", 311.13, "note-eb", "e4-flat.png", "black"],
    "f": ["En4", "E", 329.63, "note-e", "e4-natural.png", "white"],
    "g": ["Fn4", "F", 349.23, "note-f", "f4-natural.png", "white"],
    "y": ["F#4", "F#", 369.99, "note-f#", "f4-sharp.png", "black"],
    "h": ["Gn4", "G", 392, "note-g", "g4-natural.png", "white"],
    "u": ["Ab4", "Ab", 415.3, "note-ab", "a4-flat.png", "black"],
    "j": ["An4", "A", 440, "note-a", "a4-natural.png", "white"],
    "i": ["Bb4", "Bb", 466.16, "note-bb", "b4-flat.png", "black"],
    "k": ["Bn4", "B", 493.88, "note-b", "b4-natural.png", "white"],
    "l": ["Cn5", "&#x2191;C", 523.25, "note-C", "c5-natural.png", "white"]
};
const NOTE_NAME = 0;
const NOTE_TEXT = 1;
const NOTE_FREQ = 2;
const NOTE_VAR = 3;
const NOTE_FILE = 4;
const NOTE_COLOUR = 5;

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

let current_question = [];
let imported = false;
let question_num = 1;
let question_type = "";
let question_notes = "";

let output = document.getElementById("notes");
let stave = document.getElementById("stave");
let actions = document.getElementById("actions");
let successText = document.getElementById("success");

let selected_key = "";
let keyPressed = "";
let failed = false;

let export_file = ["type,notes,include_accidentals,instant_fail\n"]

let real_import = document.getElementById("real_import");
let import_file = []
const reader = new FileReader();
reader.onload = () => {
    import_file = reader.result.split("\n");
    importFile();
}

let include_accidentals = document.getElementById("include_accidentals");
let instant_fail = document.getElementById("instant_fail");
let expimp_message = document.getElementById("expimp_message");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function staveExercise(type) {
    if (imported == true) {
        if (confirm("Creating a new question will override the questions that you have imported. Are you sure you want to proceed?")) {
            imported = false;
            include_accidentals.disabled = false;
            instant_fail.disabled = false;
        } else {
            return;
        }
    }
    question_type = type;
    currentNote = 0;
    output.innerHTML = ""
    successText.innerHTML = ""
    failed = false;
    for (i = 0; i < 4; i++) {
        randomNote = Object.keys(notes)[Math.floor(Math.random() * Object.keys(notes).length)]
        if (include_accidentals.checked == false) {
            while (notes[randomNote][NOTE_COLOUR] == "black") {
                randomNote = Object.keys(notes)[Math.floor(Math.random() * Object.keys(notes).length)]
            }
        }
        randomNotes[i] = randomNote;
        output.innerHTML += notes[randomNote][NOTE_TEXT]
        if (i != 3) { output.innerHTML += ", " }
    }
    loadStave()
}

function loadStave() {
    while (stave.hasChildNodes()) {
        stave.removeChild(stave.firstChild);
    }
    let img = document.createElement("img");
    img.className = "stave-elements";
    img.src = "assets/images/clef-sig.png";
    stave.append(img.cloneNode(true));
    if (question_type == "audio") {
        changeActions(2, 0, 6, 1, 1, 0, 2);
        if (imported) {
            changeActions(1, 1, 6, 1, 1, 1, 1);
        }
        img.src = "assets/images/blank-black.png";
        for (i = 0; i < 4; i++) {
            img.id = "n" + String(i + 1)
            stave.append(img.cloneNode(true))
        }
        return;
    }
    changeActions(3, 0, 6, 0, 0, 0, 3);
    if (imported) {
        changeActions(2, 1, 6, 0, 0, 1, 2);
    }
    for (i = 0; i < randomNotes.length; i++) {
        img.id = "n" + String(i + 1)
        img.src = getFilePath(notes[randomNotes[i]][NOTE_FILE]);
        stave.append(img.cloneNode(true));
    }
}

// This varaible is only used for error checking in the next function
let totalColsActions = 0;

function changeActions(...colWidth) {
    /*
        --- actions.children ---
        0: left padding
        1: question number (only used when a set of questions has been imported)
        2: stave
        3: audio button (only used for audio)
        4: hint button (only used for audio)
        5: next button (only used when a set of questions has been imported)
        6: right padding
    */
    // Debug Error Checking
    totalColsActions = 0;
    for (i = 0; i < colWidth.length; i++) {
        totalColsActions += colWidth[i];
    }
    if (totalColsActions != 12 || colWidth.length != 7) {
        console.error("Action bar setup incorrectly");
    }

    // Adjust the column widths and display styling for the action bar
    for (i = 0; i < actions.children.length; i++) {
        actions.children[i].className = "col-sm-" + colWidth[i];
        if (colWidth[i] == "0") {
            actions.children[i].style.display = "none";
        } else {
            actions.children[i].style.display = "block";
        }
    }
}

function getFilePath(file_name) {
    if (include_accidentals.checked) {
        return "assets/images/" + file_name;
    } else {
        return "assets/images/" + file_name.slice(0, 2) + ".png";
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
    note.src = getFilePath(notes[randomNotes[currentNote]][NOTE_FILE]);
    stave.children[currentNote + 1].style.backgroundColor = "#ffeecc";
    currentNote++;
}

function pressKey(key) {
    let note = document.getElementById("n" + String(currentNote + 1));
    if (notes[key] != undefined && !keyPressed) {
        selected_key = key;
        keyPressed = window.getComputedStyle(document.getElementById(notes[key][NOTE_VAR])).backgroundColor;
        document.getElementById(notes[key][NOTE_VAR]).style.backgroundColor = "#c0c0c0";
        playNote(1, notes[key][NOTE_FREQ]);
        if (failed == false && randomNotes[0] && currentNote < 4) {
            if (key == randomNotes[currentNote]) {
                successText.innerHTML += "Success <br/>";
                note.src = getFilePath(notes[randomNotes[currentNote]][NOTE_FILE]);
                stave.children[currentNote + 1].style.backgroundColor = "#ddffdd";
            } else {
                successText.innerHTML += "Fail <br/>";
                note.src = getFilePath(notes[randomNotes[currentNote]][NOTE_FILE]);
                stave.children[currentNote + 1].style.backgroundColor = "#ffdddd";
                successText.innerHTML += "<br/>You Lose!<br/>";
                if (instant_fail.checked == true) {
                    failed = true;
                }
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

function appendQuestion(type) {
    if (type != "") {
        export_file.push(`${type},/,${include_accidentals.checked},${instant_fail.checked}\n`);
        expimp_message.innerHTML = `Successfully appended ${type} question to file.`
    } else {
        question_notes = ""
        for (i = 0; i < randomNotes.length; i++) {
            question_notes += `${randomNotes[i]}/`;
        }
        question_notes = question_notes.slice(0, -1);
        export_file.push(`${question_type},${question_notes},${include_accidentals.checked},${instant_fail.checked}\n`);
        expimp_message.innerHTML = `Successfully appended question to file.`
    }
}

function exportFile() {
    let blob = new Blob(export_file, { type: "text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "questions.txt";
    link.click();
}

function importFile() {
    imported = true;
    current_question = import_file[question_num].split(",")
    question_type = current_question[0];
    randomNotes = current_question[1].split("/");
    include_accidentals.checked = JSON.parse(current_question[2]);
    instant_fail.checked = JSON.parse(current_question[3]);
    include_accidentals.disabled = true;
    instant_fail.disabled = true;
    loadStave();
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

real_import.addEventListener("click", () => {
    real_import.value = "";
})

real_import.addEventListener("change", () => {
    reader.readAsText(real_import.files[0]);
});

include_accidentals.addEventListener("change", () => {
    if (include_accidentals.checked) {
        include_accidentals.title = "Questions will include sharps and flats"
    } else {
        include_accidentals.title = "Questions will not include sharps and flats"
    }
});

instant_fail.addEventListener("change", () => {
    if (instant_fail.checked) {
        instant_fail.title = "Question will end when you make a mistake"
    } else {
        instant_fail.title = "Question will continue when you make a mistake"
    }
})