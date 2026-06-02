
const audio = document.getElementById('bgAudio');
const icon = document.getElementById('audioIcon');

icon.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        icon.src = './img/director/pause.svg';
    } else {
        audio.pause();
        icon.src = './img/director/play.svg';
    }
});