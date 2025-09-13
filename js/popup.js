document.addEventListener('DOMContentLoaded', () => {
    const popupOverlay = document.getElementById('popup-overlay');
    const popupModal = document.getElementById('popup-modal');
    const acceptButton = document.getElementById('accept-button');
    const denyButton = document.getElementById('deny-button');
    const textContent = document.getElementById('popup-text-content');
    const scrollDownButton = document.getElementById('scroll-down-button');
    const termsCheckbox = document.getElementById('terms-checkbox');

    const isFirstVisit = localStorage.getItem('visited') === null;

    if (isFirstVisit) {
        popupOverlay.classList.remove('hidden');
        popupModal.classList.remove('hidden');
        updateScrollButtonVisibility();
    }

    function closePopup() {
        popupOverlay.classList.add('hidden');
        popupModal.classList.add('hidden');
        localStorage.setItem('visited', 'true');
    }

    function updateScrollButtonVisibility() {
        if (textContent.scrollHeight > textContent.clientHeight) {
            scrollDownButton.classList.remove('hidden');
        } else {
            scrollDownButton.classList.add('hidden');
        }
    }

    function handleScroll() {
        if (textContent.scrollTop + textContent.clientHeight >= textContent.scrollHeight) {
            scrollDownButton.classList.add('hidden');
        } else {
            scrollDownButton.classList.remove('hidden');
        }
    }

    acceptButton.addEventListener('click', closePopup);
    denyButton.addEventListener('click', closePopup);

    scrollDownButton.addEventListener('click', () => {
        textContent.scrollBy({ top: 100, behavior: 'smooth' });
    });

    textContent.addEventListener('scroll', handleScroll);

    termsCheckbox.addEventListener('change', () => {
        if (termsCheckbox.checked) {
            acceptButton.disabled = false;
        } else {
            acceptButton.disabled = true;
        }
    });
});