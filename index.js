const convert_int_to_roman = function(integer, alpha_case) {
    if (isNaN(integer)) {
        return NaN;
    }
    
    const digits = String(+integer).split("");
    const key = [
        "", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
        "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
        "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"
    ];
    let roman = "";

    let i = 3;
    while (i--) {
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    }

    const romanized = Array(+digits.join("") + 1).join("M") + roman;

    if (alpha_case === "lower") {
        return romanized.toLowerCase();
    }
    
    return romanized;
};

const toggle_class = function(el, class_name) {
    if (el.classList.contains(class_name)) {
        el.classList.remove(class_name);
    } else {
        el.classList.add(class_name);
    }
};


const note_names = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B"
];


const el_input_fretboard_inv_x = document.querySelector("[data-input-fretboard-inv-x]");
const el_input_fretboard_inv_y = document.querySelector("[data-input-fretboard-inv-y]");
const el_fretboard = document.querySelector("[data-fretboard]");
const el_fretboard_markers = document.querySelector("[data-fretboard-markers]");

el_input_fretboard_inv_x.addEventListener("change", function() {
    invert_fretboard('x');
});

el_input_fretboard_inv_y.addEventListener("change", function() {
    invert_fretboard('y');
});

const invert_fretboard = function(axis) {
    if (el_fretboard.classList.contains(`invert-${axis}`)) {
        el_fretboard.classList.remove(`invert-${axis}`);
    } else {
        el_fretboard.classList.add(`invert-${axis}`);
    }

    if (axis === "x") {
        if (el_fretboard_markers.classList.contains(`invert-x`)) {
            el_fretboard_markers.classList.remove(`invert-x`);
        } else {
            el_fretboard_markers.classList.add(`invert-x`);
        }
    }
}


const generate_fretboard_string_notes = function(number_of_frets, starting_note) {
    const n = note_names.length;
    let string_notes = [];
    
    for (let z = starting_note; z < number_of_frets + starting_note + 1; z++) {
          res = (note_names[z % n]);
          string_notes.push(res);
    }

    return string_notes;
}

const generate_fretboard_string = function(number_of_frets, starting_note, string_index) {
    let starting_note_index = note_names.indexOf(starting_note);

    let string_notes = generate_fretboard_string_notes(number_of_frets, starting_note_index);

    let fretboard_string_template = `<tr class="string" data-string="${string_index}">${Array(number_of_frets + 1).fill().map((item, i) => `<td class="note ${convert_int_to_roman(i + 1, 'lower')}"><div class="note-label" data-fretboard-note-label="${string_notes[i]}"><span class="note-name">${string_notes[i]}</span></div></td>`).join("")}</tr>`;

    return fretboard_string_template;
}

const generate_fretboard = function(number_of_strings, number_of_frets, tuning) {
    let fretboard = "";

    let fretboard_markers = `<tr class="headers">${Array(number_of_frets).fill().map((item, i) => `<th class="header"><span>${convert_int_to_roman(i + 1)}</span></th>`).join("")}</tr><tr class="headers">${Array(number_of_frets).fill().map((item, i) => `<th class="header"><span>${i}</span></th>`).join("")}</th>`

    for (let i = 0; i < number_of_strings; i++) {
        fretboard += (generate_fretboard_string(number_of_frets, tuning[i], i + 1));
    }

    el_fretboard_markers.innerHTML = fretboard_markers;
    el_fretboard.innerHTML = fretboard;
};

generate_fretboard(6, 24, ["D", "A", "D", "F#", "A", "D"]);


const el_fretboard_note_labels = document.querySelectorAll("[data-fretboard-note-label");
el_fretboard_note_labels.forEach(function(note) {
    note.addEventListener("click", function(event) {
        toggle_class(event.target, "note-label--active")
    });
});


const el_keyboard_container = document.querySelector("[data-keyboard-container]");
const el_keyboard = document.querySelector("[data-keyboard]");
const input_keyboard_octaves = document.querySelector("[data-input-keyboard-octaves]");

input_keyboard_octaves.addEventListener("change", function(event) {
    generate_keyboard(event.target.value);
});

let keyboard_octave_template = `${Array(12).fill().map((item, i) => `<div class="key${[0,2,4,5,7,9,11].includes(i) ? ' bottom' : ' top'} ${convert_int_to_roman(i + 1, 'lower')}" data-key="${note_names[i]}"><div class="note-names"><span class="note-name">${note_names[i]}</span></div></div>`).join('')}`;

const generate_keyboard = function(octaves) {
    el_keyboard.innerHTML = "";
    document.documentElement.style.setProperty("--keyboard-octaves", octaves);

    for (i = 0; i < octaves; i++) {
        el_keyboard.innerHTML += keyboard_octave_template;
    }
}

input_keyboard_octaves.value = 4;
generate_keyboard(input_keyboard_octaves.value);
