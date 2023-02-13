let character = document.querySelector('.character');
let moveBy = 50;

window.addEventListener('load', () => {
    character.style.position = 'absolute';
    character.style.left = 0;
    character.style.top = 0;
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            character.style.left = parseInt(character.style.left) - moveBy + 'px';
            break
        case 'ArrowRight':
            character.style.left = parseInt(character.style.left) + moveBy + 'px';
            break
        case 'ArrowUp':
            character.style.top = parseInt(character.style.top) - moveBy + 'px';
            break
        case 'ArrowDown':
            character.style.top = parseInt(character.style.top) + moveBy + 'px';
            break
    }
});