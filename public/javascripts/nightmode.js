
var nightModeSwitcher = document.querySelector('.nightmode-switch-wrapper');

var nightMode = () => {
    event.target.classList.toggle('.nightmode-switch--down');
    event.target.closest('.nightmode-switch-wrapper').classList.toggle('nightmode-switch-wrapper--active');
    event.target.closest('.nightmode-switch-wrapper').querySelector('.nightmode-switch').classList.toggle('.nightmode-switch--down');
    console.log("movedown")

    // if (event.target.closest('.nightmode-switch-wrapper').classList.toggle('nightmode-switch-wrapper--active'))
    
}


nightModeSwitcher.addEventListener('click', nightMode);
