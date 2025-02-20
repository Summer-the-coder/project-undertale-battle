'use strict';

const fight = document.querySelector('.fight');
const act = document.querySelector('.act');
const item = document.querySelector('.item');
const mercy = document.querySelector('.mercy');

const bulletText = document.querySelector('.bullet-text');
let flavorText = bulletText.textContent;

let selected = fight;
const actions = [fight, act, item, mercy];

let playerTurn = true;

// TODO: Add multiline support.
const menus = [
    '* Sans',
    '* Sans',
    '* L.Hero',
    '* Sans',
]

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
 * Creates an instance of an audio file and loops it.
 * 
 * @param path The file path of the song, relative to the folder where the current script is located.
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

    if (playerTurn) {
        if (['ArrowRight', 'ArrowLeft', 'Enter'].includes(pressed)) {
            if (['ArrowRight', 'ArrowLeft'].includes(pressed)) {
                // reset all buttons to their default state
                actions.forEach(button => {
                    const buttonName = button.classList.value;
                    button.src = `sprites/${buttonName.toUpperCase()}.png`;
                });

                // update the selected button
                let currIndex = actions.indexOf(selected);
                if (pressed === 'ArrowRight') {
                    currIndex = (currIndex + 1) % actions.length;
                } else if (pressed === 'ArrowLeft') {
                    currIndex = (currIndex - 1 + actions.length) % actions.length;
                }
                selected = actions[currIndex];

                const buttonName = selected.classList.value;
                selected.src = `sprites/${buttonName.toUpperCase()}_selected.png`;
            } else if (pressed === 'Enter') {
                bulletText.innerHTML = menus[actions.indexOf(selected)];
            }

            // play the 'select' sound for both of these cases
            selectionSound.currentTime = 0;
            selectionSound.play();
        } else if (pressed === 'Shift') {
            bulletText.innerHTML = flavorText;
        }
    } else {
        // TODO: add support for the enemy's turn.
    }
});