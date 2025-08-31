document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery-container');
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
    const thumbnailContainer = document.getElementById('thumbnail-container');
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const fitToRatioBtn = document.getElementById('fit-to-ratio-btn');

    let currentIndex = 0;
    let images = [];
    let isViewerOpen = false;

    // Zoom variables
    let currentScale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX, startY;
    
    // Prioritize the global `allPhotos` array if it exists
    if (window.allPhotos && window.allPhotos.length > 0) {
        images = window.allPhotos;
    } else {
        // Fallback to scraping from DOM if the global array isn't present
        const gallery = document.getElementById('gallery');
        if(gallery) {
            const imageElements = gallery.querySelectorAll('.gallery-img');
            imageElements.forEach((img) => {
                images.push({
                    image: img.src, // Use 'image' property to be consistent
                    title: img.alt,
                    permalink: img.dataset.permalink,
                    description: img.dataset.description,
                    category: img.dataset.category,
                    source: img.dataset.source
                });
            });
        }
    }

    window.openModal = function(index) {
        currentIndex = index;
        updateViewerContent();
        createThumbnails();
        resetZoom();

        if (window.innerWidth >= 768) {
            if(galleryContainer) {
                galleryContainer.classList.add('md:w-[calc(100%-450px)]', 'lg:w-[calc(100%-550px)]');
                const galleryGrid = document.getElementById('gallery');
                if(galleryGrid) galleryGrid.classList.remove('lg:grid-cols-5', 'xl:grid-cols-6');
            }
        }
        document.body.classList.add('body-no-scroll');
        viewerPane.classList.remove('hidden');
        isViewerOpen = true;
    }

    function createThumbnails() {
        thumbnailContainer.innerHTML = '';
        images.forEach((image, index) => {
            const thumb = document.createElement('img');
            thumb.src = image.image; // Use 'image' property
            thumb.classList.add('thumbnail-img');
            if (index === currentIndex) {
                thumb.classList.add('active');
            }
            thumb.addEventListener('click', () => {
                currentIndex = index;
                updateViewerContent();
                updateActiveThumbnail();
                resetZoom();
            });
            thumbnailContainer.appendChild(thumb);
        });
    }

    function updateActiveThumbnail() {
        const thumbnails = thumbnailContainer.querySelectorAll('.thumbnail-img');
        thumbnails.forEach((thumb, index) => {
            if (index === currentIndex) {
                thumb.classList.add('active');
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    function updateViewerContent() {
        if (images.length === 0 || !images[currentIndex]) return;
        const image = images[currentIndex];
        viewerImage.src = image.image; // Use 'image' property
        viewerImage.alt = image.title;
        sourceName.textContent = image.source;
        sourceIcon.textContent = image.source ? image.source.charAt(0) : 'U';
        imageTitle.textContent = image.title;
        visitLink.href = image.permalink;
        resetZoom();
    }

    function closeViewer() {
        if (window.innerWidth >= 768) {
            if(galleryContainer) {
                galleryContainer.classList.remove('md:w-[calc(100%-450px)]', 'lg:w-[calc(100%-550px)]');
                const galleryGrid = document.getElementById('gallery');
                if(galleryGrid) galleryGrid.classList.add('lg:grid-cols-5', 'xl:grid-cols-6');
            }
        }
        viewerPane.classList.add('hidden');
        document.body.classList.remove('body-no-scroll');
        isViewerOpen = false;
        resetZoom();
    }

    function showNextImage() {
        if (images.length === 0) return;
        currentIndex = (currentIndex + 1) % images.length;
        updateViewerContent();
        updateActiveThumbnail();
        resetZoom();
    }

    function showPrevImage() {
        if (images.length === 0) return;
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateViewerContent();
        updateActiveThumbnail();
        resetZoom();
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
        const imageUrl = new URL(images[currentIndex].image, window.location.href).href;
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
            const response = await fetch(image.image);
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
        if (currentScale > 1) return;
        touchstartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewerContent.addEventListener('touchend', e => {
        if (currentScale > 1) return;
        touchendX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchendX < touchstartX - 50) {
            showNextImage();
        }
        if (touchendX > touchstartX + 50) {
            showPrevImage();
        }
    }

    // Zoom functionality
    function applyZoom() {
        viewerImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
        viewerImage.dataset.scale = currentScale;

        if (currentScale > 1) {
            viewerImage.classList.add('zoomable');
            viewerContent.style.overflow = 'auto';
        } else {
            viewerImage.classList.remove('zoomable');
            viewerContent.scrollTo(0, 0);
            viewerContent.style.overflow = 'hidden';
            translateX = 0;
            translateY = 0;
            viewerImage.style.transform = `translate(0px, 0px) scale(1)`;
        }
    }

    function resetZoom() {
        currentScale = 1;
        translateX = 0;
        translateY = 0;
        applyZoom();
    }

    function zoomIn() {
        currentScale = Math.min(currentScale + 0.2, 4);
        applyZoom();
    }

    function zoomOut() {
        currentScale = Math.max(currentScale - 0.2, 1);
        if (currentScale === 1) {
            resetZoom();
        } else {
            applyZoom();
        }
    }

    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);
    fitToRatioBtn.addEventListener('click', resetZoom);

    viewerImage.addEventListener('wheel', (e) => {
        if (!isViewerOpen) return;
        e.preventDefault();
        const scaleAmount = 0.1;
        const rect = viewerImage.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newScale = e.deltaY < 0 ? Math.min(currentScale + scaleAmount, 4) : Math.max(currentScale - scaleAmount, 1);

        if (newScale !== currentScale) {
            const scaleRatio = newScale / currentScale;
            translateX = mouseX - (mouseX - translateX) * scaleRatio;
            translateY = mouseY - (mouseY - translateY) * scaleRatio;
            currentScale = newScale;
            applyZoom();
        }

        if (currentScale === 1) {
            resetZoom();
        }
    });

    viewerImage.addEventListener('mousedown', (e) => {
        if (currentScale > 1) {
            isDragging = true;
            viewerImage.classList.add('dragging');
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
        }
    });

    viewerImage.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        applyZoom();
    });

    viewerImage.addEventListener('mouseup', () => {
        isDragging = false;
        viewerImage.classList.remove('dragging');
    });

    viewerImage.addEventListener('mouseleave', () => {
        isDragging = false;
        viewerImage.classList.remove('dragging');
    });
});