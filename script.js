'use strict';

const fight = document.querySelector('.fight');
const act = document.querySelector('.act');
const item = document.querySelector('.item');
const mercy = document.querySelector('.mercy');

const soul = document.querySelector('.soul');
const bulletBoard = document.querySelector('.bullet-board');
const bulletText = document.querySelector('.bullet-text');
const initialText = "* You feel like you're gonna have a good time.";

let flavorText = '';

let selected = fight;
const actions = [fight, act, item, mercy];

let playerTurn = false;

// TODO: Add multiline support.
const menus = [
    '* Sans',
    '* Sans',
    '* L.Hero',
    '* Sans',
]

const selectionSound = new Audio('songs_and_sfx/select-sound.mp3');

// start and loop the boss song
const bossMusic = new Audio('songs_and_sfx/mettalocrusher.mp3');
window.addEventListener('click', function playSong() {
    bossMusic.play();
    window.removeEventListener('click', playSong);
});
const loop = setInterval(function() {
    if (bossMusic.ended) {
        bossMusic.play();
    }
}, 1000);

// Display the initial message on the bullet board.
playDialogue(bulletText, initialText, null);

// helper functions
/**
 * Gets the value of the specified CSS property of an element.
 */
function getCSSPropertyValue(element, value) {
    const elementStyles = window.getComputedStyle(element);
    return elementStyles.getPropertyValue(value);
}
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
 * @param htmlElement The HTML element that is supposed to be updated.
 * @param string The string that is supposed to replace the previous content.
 * @param sound The sound that is supposed to be played each time a character is printed. Use null to disable.
 * @param delay The delay between each character being printed (in milliseconds).
 */
function playDialogue(htmlElement, string, sound = "songs_and_sfx/just-sans-talking.mp3", delay = 30) {
    let index = 0;
    htmlElement.textContent = '';
    const dialogue = setInterval(function() {
        if (index >= string.length) {
            clearInterval(dialogue);
        } else {
            let char = string[index++];
            htmlElement.textContent += char;
            if (char !== ' ' && sound !== null) {
                const sfx = new Audio(sound); // workaround for a lack of a better way to do this
                sfx.play();
            }
        }
    }, delay);
}
/**
 * Moves the soul across the bullet board.
 */
function moveSoul(direction) {
    function getNum(variable) {
        return +variable.match(/\d+/g)[0];
    }
    function handleMovement(property, step) {
        return getNum(property) + step + 'px';
    }
    const step = 5;
    const [width, height] = [getNum(getCSSPropertyValue(bulletBoard, 'width')) - 65, getNum(getCSSPropertyValue(bulletBoard, 'height')) - 50];
    const [x, y] = [getNum(soul.style.left), getNum(soul.style.top)];

    if (direction === 'ArrowRight' && x < width) {
        soul.style.left = handleMovement(soul.style.left, step);
    } else if (direction === 'ArrowLeft' && x > 0) {
        soul.style.left = handleMovement(soul.style.left, -step);
    } else if (direction === 'ArrowDown' && y < height) {
        soul.style.top = handleMovement(soul.style.top, step);
    } else if (direction === 'ArrowUp' && y > 0) {
        soul.style.top = handleMovement(soul.style.top, -step);
    }
}

window.addEventListener('keydown', function(event) {
    const pressed = event.key;

    if (playerTurn) {
        soul.style.display = 'none';
        bulletText.style.display = 'block';
        
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
                flavorText = bulletText.textContent;
                bulletText.innerHTML = menus[actions.indexOf(selected)];
            }

            // play the 'select' sound for both of these cases
            selectionSound.currentTime = 0;
            selectionSound.play();
        } else if (pressed === 'Shift') {
            playDialogue(bulletText, flavorText);
        }
    } else {
        soul.style.display = 'block';
        bulletText.style.display = 'none';

        if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(pressed)) {
            moveSoul(pressed);
        }
    }
});