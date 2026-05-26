(function () {
    const btn   = document.getElementById('audioBtn');
    const audio = document.getElementById('bgAudio');
    const icon  = document.getElementById('audioIcon');

    const ICON_PLAY  = './img/director/play.svg';
    const ICON_PAUSE = './img/director/pause.svg';

    // ID блока, при прокрутке до которого появляется кнопка
    const TARGET_ID  = 'about'; // ← замени на нужный

    let isPlaying = false;

    // Показываем кнопку когда доскроллили до блока
    const target = document.getElementById(TARGET_ID);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                btn.hidden = false;
            }
        });
    }, { threshold: 0.1 });

    if (target) observer.observe(target);

    // Клик — play/pause
    btn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            icon.src = ICON_PLAY;
            icon.alt = 'Включить звук';
        } else {
            audio.play();
            icon.src = ICON_PAUSE;
            icon.alt = 'Выключить звук';
        }
        isPlaying = !isPlaying;
    });
})();