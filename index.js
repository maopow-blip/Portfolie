const picroll = document.querySelector('.picroll');
const images = [...picroll.querySelectorAll('img')];
const count = images.length;
let frontIndex = 0;

function wrappedDistance(index) {
    let d = index - frontIndex;
    if (d > count / 2) {
        d -= count;
    }
    if (d < -count / 2) {
        d += count;
    }
    return d;
}

function arrange() {
    images.forEach((image, index) => {
        const d = wrappedDistance(index);
        const abs = Math.abs(d);

        if (abs === 0) {
            image.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
            image.style.opacity = '1';
            image.style.zIndex = count;
        } else if (abs <= 2) {
            image.style.transform = `translate(${d * 120}px, 0) rotate(${d * 8}deg) scale(${1 - abs * 0.15})`;
            image.style.opacity = String(1 - abs * 0.15);
            image.style.zIndex = count - abs;
        } else {
            image.style.transform = 'translate(0, 0) rotate(0deg) scale(0.6)';
            image.style.opacity = '0';
            image.style.zIndex = count - abs;
        }
    });
}

function step(direction) {
    frontIndex = (frontIndex + direction + count) % count;
    arrange();
}

picroll.addEventListener('wheel', (event) => {
    const delta = event.deltaX !== 0 ? event.deltaX : event.deltaY;
    if (delta === 0) {
        return;
    }
    event.preventDefault();
    step(delta > 0 ? 1 : -1);
}, { passive: false });

let touchStartX = 0;
let touchStartY = 0;

picroll.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}, { passive: true });

picroll.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    if (Math.abs(dx) < 40 && Math.abs(dy) < 40) {
        return;
    }
    if (Math.abs(dy) > Math.abs(dx)) {
        step(dy < 0 ? 1 : -1);
    } else {
        step(dx < 0 ? 1 : -1);
    }
}, { passive: true });

arrange();