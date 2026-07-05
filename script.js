document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('bg-video');
    const music = document.getElementById('bg-music');

    const restartMedia = (media) => {
        if (!media || typeof media.duration !== 'number' || !Number.isFinite(media.duration)) return;
        if (media.duration - media.currentTime < 5) {
            media.currentTime = 0;
            media.play().catch(() => {});
        }
    };

    if (video) {
        video.addEventListener('timeupdate', () => restartMedia(video));
    }

    if (music) {
        music.addEventListener('timeupdate', () => restartMedia(music));
    }

    document.body.addEventListener('click', () => {
        if (music) {
            music.play().catch(() => {});
        }
    }, { once: true });
});