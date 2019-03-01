
var nightModeSwitcher = document.querySelector('.nightmode-switch-wrapper');
var body = document.getElementById("Body");
var nigtmode = document.querySelector('#night-mode');

var nightMode = () => {
    event.preventDefault();
    event.target.querySelector('.nightmode-switch').classList.toggle('nightmode-switch--down');
    event.target.closest('.nightmode-switch-wrapper').classList.toggle('nightmode-switch-wrapper--active');
    event.target.closest('.nightmode-switch-wrapper').querySelector('.nightmode-switch').classList.toggle('.nightmode-switch--down');
    console.log("movedown")
    document.documentElement.classList.toggle('night-mode');
}


nightModeSwitcher.addEventListener('click', nightMode);
