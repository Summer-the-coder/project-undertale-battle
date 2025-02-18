'use strict';

const fight = document.querySelector('.fight');
const act = document.querySelector('.act');
const item = document.querySelector('.item');
const mercy = document.querySelector('.mercy');

let selected = fight;
const actions = [fight, act, item, mercy];

const selectionSound = new Audio('songs_and_sfx/select-sound.mp3');

// start and loop the boss song
const song = new Audio('songs_and_sfx/mettalocrusher.mp3');
window.addEventListener('click', function playSong() {
    song.play();
    window.removeEventListener('click', playSong);
});
const loop = setInterval(function() {
    if (song.ended) {
        song.play();
    }
}, 1000);

// helper functions
/**
 * @function Creates an instance of an audio file and loops it.
 * 
 * @returns the ID of the created interval.
 */
function loopSong(path) {
    const song = new Audio(path);
    song.play();
    const loop = setInterval(function() {
        if (song.ended) {
            song.play();
        }
    }, 1000);
    return loop;
}

window.addEventListener('keydown', function(event) {
    const pressed = event.key;

    if (['ArrowRight', 'ArrowLeft'].includes(pressed)) {
        // Reset all buttons to their default state
        actions.forEach(button => {
            const buttonName = button.classList.value;
            button.src = `sprites/${buttonName.toUpperCase()}.png`;
        });

        // Update the selected button
        let currIndex = actions.indexOf(selected);
        if (pressed === 'ArrowRight') {
            currIndex = (currIndex + 1) % actions.length;
        } else if (pressed === 'ArrowLeft') {
            currIndex = (currIndex - 1 + actions.length) % actions.length;
        }
        selected = actions[currIndex];

        const buttonName = selected.classList.value;
        selected.src = `sprites/${buttonName.toUpperCase()}_selected.png`;

        selectionSound.currentTime = 0;
        selectionSound.play();
    }
});