let character = document.querySelector('.character');
let moveBy = 50;

window.addEventListener('load', () => {
    character.style.position = 'absolute';
    character.style.left = 0;
    character.style.top = 0;
});

/*
window.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        character.style.top = parseInt(character.style.top) - moveBy + 'px';
    }
    else if (e.keyCode == '40') {
        character.style.top = parseInt(character.style.top) + moveBy + 'px';
    }
    else if (e.keyCode == '37') {
        haracter.style.left = parseInt(character.style.left) - moveBy + 'px';
    }
    else if (e.keyCode == '39') {
        character.style.left = parseInt(character.style.left) + moveBy + 'px';
    }

}
*/

window.addEventListener('onkeypress', function(e){
    switch (e.keyCode) {
        case 37:
            character.style.left = parseInt(character.style.left) - moveBy + 'px';
            break
        case 39:
            character.style.left = parseInt(character.style.left) + moveBy + 'px';
            break
        case 38:
            character.style.top = parseInt(character.style.top) - moveBy + 'px';
            break
        case 40:
            character.style.top = parseInt(character.style.top) + moveBy + 'px';
            break
        default:
            break
    }
});
