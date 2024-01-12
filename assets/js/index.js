document.addEventListener('DOMContentLoaded', (event) => {
    var audio = document.getElementById('bg');
    var soundOn = document.getElementById('sound-on');
    var soundToggle = document.getElementById('sound-toggle');

    // Play sound and then navigate for 'sound-on' link
    if (soundOn) {
        soundOn.addEventListener('click', function(e) {
            console.log('playing');
            audio.play();
        });
    }

    // Toggle sound for 'sound-toggle' link without navigating
    if (soundToggle) {
        soundToggle.addEventListener('click', function(e) {
            console.log('click sound button');
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        });
    }
});