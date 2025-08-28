document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery-container');
    const gallery = document.getElementById('gallery');
    const viewerPane = document.getElementById('viewer-pane');
    const viewerContent = document.getElementById('viewer-content');
    const viewerImage = document.getElementById('viewer-image');
    const sourceName = document.getElementById('sourceName');
    const sourceIcon = document.getElementById('sourceIcon');
    const imageTitle = document.getElementById('image-title');
    const visitLink = document.getElementById('visit-link');
    const closeViewerBtn = document.getElementById('close-viewer');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shareBtn = document.getElementById('share-btn');
    const saveBtn = document.getElementById('save-btn');
    const messageBox = document.getElementById('messageBox');
    
    let currentIndex = 0;
    let images = [];
    let isViewerOpen = false;

    const imageElements = gallery.querySelectorAll('.gallery-img');
    imageElements.forEach((img) => {
        images.push({
            src: img.src,
            title: img.alt,
            permalink: img.dataset.permalink,
            description: img.dataset.description,
            category: img.dataset.category,
            source: img.dataset.source
        });
    });

    window.openModal = function(index) {
        currentIndex = index;
        updateViewerContent();
        
        if (window.innerWidth >= 768) { // Desktop view
            galleryContainer.classList.add('md:w-[calc(100%-450px)]', 'lg:w-[calc(100%-550px)]');
        }
        document.body.classList.add('body-no-scroll');
        viewerPane.classList.remove('hidden');
        isViewerOpen = true;
    }
    
    function updateViewerContent() {
        if (images.length === 0) return;
        const image = images[currentIndex];
        viewerImage.src = image.src;
        viewerImage.alt = image.title;
        sourceName.textContent = image.source;
        sourceIcon.textContent = image.source ? image.source.charAt(0) : 'U';
        imageTitle.textContent = image.title;
        visitLink.href = image.permalink;
    }

    function closeViewer() {
        if (window.innerWidth >= 768) { // Desktop view
            galleryContainer.classList.remove('md:w-[calc(100%-450px)]', 'lg:w-[calc(100%-550px)]');
        }
        viewerPane.classList.add('hidden');
        document.body.classList.remove('body-no-scroll');
        isViewerOpen = false;
    }

    function showNextImage() {
        if (images.length === 0) return;
        currentIndex = (currentIndex + 1) % images.length;
        updateViewerContent();
    }

    function showPrevImage() {
        if (images.length === 0) return;
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateViewerContent();
    }

    closeViewerBtn.addEventListener('click', closeViewer);
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    document.addEventListener('keydown', (e) => {
        if (!isViewerOpen) return;
        if (e.key === 'Escape') closeViewer();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });

    shareBtn.addEventListener('click', () => {
        const imageUrl = new URL(images[currentIndex].src, window.location.href).href;
        if (navigator.share) {
            navigator.share({
                title: images[currentIndex].title,
                text: `Check out this image: ${images[currentIndex].title}`,
                url: imageUrl,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(imageUrl).then(() => {
                showMessage('Image link copied to clipboard!');
            }).catch(err => {
                console.error('Could not copy text: ', err);
                showMessage('Failed to copy link.', true);
            });
        }
    });
    
    function showMessage(message, isError = false) {
        messageBox.textContent = message;
        messageBox.className = `fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md shadow-lg transition-opacity duration-300 ${isError ? 'bg-red-600' : 'bg-gray-800'} text-white`;
        messageBox.classList.remove('opacity-0');
        setTimeout(() => {
            messageBox.classList.add('opacity-0');
        }, 3000);
    }

    saveBtn.addEventListener('click', async () => {
        const image = images[currentIndex];
        try {
            const response = await fetch(image.src);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            const filename = image.title.replace(/\s+/g, '_').toLowerCase() + '.jpg';
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Download failed:', error);
            showMessage('Download failed. Please try again.', true);
        }
    });

    // Swipe functionality for mobile
    let touchstartX = 0;
    let touchendX = 0;

    viewerContent.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewerContent.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchendX < touchstartX - 50) { // Swiped left
            showNextImage();
        }
        if (touchendX > touchstartX + 50) { // Swiped right
            showPrevImage();
        }
    }
}); 