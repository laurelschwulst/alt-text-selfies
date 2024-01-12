document.addEventListener('DOMContentLoaded', (event) => {
    var audio = document.getElementById('bg');
    var soundOn = document.getElementById('sound-on');
    var soundToggle = document.getElementById('sound-toggle');

    // Play sound and then navigate for 'sound-on' link
    if (soundOn) {
        soundOn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the immediate default navigation
            audio.play(); // Play the audio
            
            // Note to Taichi: the below doesn't seem to work?
            // setTimeout(function() {
            //     window.location.href = soundOn.href;
            // }, 500);
        });
    }

    // Toggle sound for 'sound-toggle' link without navigating
    if (soundToggle) {
        soundToggle.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent navigation
            if (audio.paused) {
                audio.play(); // Play the audio if it's paused
            } else {
                audio.pause(); // Pause the audio if it's playing
            }
        });
    }
});