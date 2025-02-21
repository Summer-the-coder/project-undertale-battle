'use strict';

const fight = document.querySelector('.fight');
const act = document.querySelector('.act');
const item = document.querySelector('.item');
const mercy = document.querySelector('.mercy');

const bulletText = document.querySelector('.bullet-text');
const initialText = "* You feel like you're gonna have a good time.";

// TODO: Make the lazy dialogue each time the player cancels selection. 
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

// Display the initial message on the bullet board.
playDialogue(bulletText, initialText, null);

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
/**
 * "Slowly" plays a dialogue, optionally playing a sound each time a character is printed.
 * 
 * @param htmlelement The HTML element that is supposed to be updated.
 * @param string The string that is supposed to replace the previous content.
 * @param sound The sound that is supposed to be played each time a character is printed. Use null to disable.
 * @param delay The delay between each character being printed (in milliseconds).
 */
function playDialogue(htmlelement, string, sound = "songs_and_sfx/just-sans-talking.mp3", delay = 35) {
    let index = 0;
    htmlelement.textContent = '';
    const dialogue = setInterval(function() {
        if (index >= string.length) {
            clearInterval(dialogue);
        } else {
            let char = string[index++];
            htmlelement.textContent += char;
            if (char !== ' ' && sound !== null) {
                const sfx = new Audio(sound); // workaround for a lack of a better way to do this
                sfx.play();
            }
        }
    }, delay);
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