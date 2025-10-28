window.onload = function() {
    const video = document.getElementById('bg-video');
    const music = document.getElementById('bg-music');

    // Loop video, skipping last 5 seconds
    video.addEventListener('timeupdate', function() {
        if (video.duration - video.currentTime < 5) {
            video.currentTime = 0;
            video.play();
        }
    });

    // Loop music, skipping last 5 seconds
    music.addEventListener('timeupdate', function() {
        if (music.duration - music.currentTime < 5) {
            music.currentTime = 0;
            music.play();
        }
    });

    // Ensure music plays (autoplay policy)
    document.body.addEventListener('click', function() {
        music.play();
    });
};