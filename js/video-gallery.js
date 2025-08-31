document.addEventListener('DOMContentLoaded', () => {
    const videoGrid = document.getElementById('video-grid');
    if (!videoGrid) return;

    const viewerPane = document.getElementById('video-viewer-pane');
    const viewerContent = document.getElementById('video-viewer-content');
    const closeViewerBtn = document.getElementById('close-video-viewer');
    const prevBtn = document.getElementById('video-prev-btn');
    const nextBtn = document.getElementById('video-next-btn');
    const shareBtn = document.getElementById('video-share-btn');
    const messageBox = document.getElementById('messageBox'); // Assuming this exists from photos gallery

    const videoTitle = document.getElementById('video-title');
    const videoDescription = document.getElementById('video-description');
    const videoSource = document.getElementById('video-source');
    const videoIframeContainer = document.getElementById('video-iframe-container');
    const visitPostLink = document.getElementById('visit-post-link');
    const youtubeLink = document.getElementById('youtube-link');
    const relatedVideosContainer = document.getElementById('related-videos-container');


    let currentIndex = 0;
    let videos = [];
    let isViewerOpen = false;

    const videoElements = videoGrid.querySelectorAll('.video-item');
    videoElements.forEach((vid, index) => {
        videos.push({
            index: index,
            title: vid.dataset.title,
            description: vid.dataset.description,
            permalink: vid.dataset.permalink,
            youtubeId: vid.dataset.youtubeid,
            category: vid.dataset.category,
            source: vid.dataset.source,
        });
    });

    window.openVideoModal = function(index) {
        currentIndex = index;
        updateViewerContent();
        viewerPane.classList.remove('hidden');
        document.body.classList.add('body-no-scroll');
        isViewerOpen = true;
    }

    function updateViewerContent() {
        if (videos.length === 0) return;
        const video = videos[currentIndex];

        videoTitle.textContent = video.title;
        videoDescription.textContent = video.description;
        videoSource.textContent = video.source || 'YouTube';
        videoIframeContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${video.youtubeId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full"></iframe>`;
        visitPostLink.href = video.permalink;
        youtubeLink.href = `https://www.youtube.com/watch?v=${video.youtubeId}`;

        // Update related videos
        relatedVideosContainer.innerHTML = ''; // Clear previous
        const related = videos.filter(v => v.category === video.category && v.index !== video.index).slice(0, 3);

        if (related.length > 0) {
            const heading = document.createElement('h3');
            heading.className = "text-lg font-semibold text-gray-800 mb-2";
            heading.textContent = "Related Videos";
            relatedVideosContainer.appendChild(heading);

            related.forEach(relVid => {
                const link = document.createElement('a');
                link.href = '#';
                link.className = 'flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100';
                link.onclick = (e) => {
                    e.preventDefault();
                    openVideoModal(relVid.index);
                };
                link.innerHTML = `
                    <img src="https://img.youtube.com/vi/${relVid.youtubeId}/mqdefault.jpg" alt="${relVid.title}" class="w-24 h-16 object-cover rounded-md">
                    <div>
                        <p class="text-sm font-semibold text-gray-800 line-clamp-2">${relVid.title}</p>
                        <p class="text-xs text-gray-500">${relVid.category}</p>
                    </div>
                `;
                relatedVideosContainer.appendChild(link);
            });
        }
    }

    function closeVideoModal() {
        videoIframeContainer.innerHTML = ''; // Stop video playback
        viewerPane.classList.add('hidden');
        document.body.classList.remove('body-no-scroll');
        isViewerOpen = false;
    }

    function showNextVideo() {
        if (videos.length === 0) return;
        currentIndex = (currentIndex + 1) % videos.length;
        updateViewerContent();
    }

    function showPrevVideo() {
        if (videos.length === 0) return;
        currentIndex = (currentIndex - 1 + videos.length) % videos.length;
        updateViewerContent();
    }

    closeViewerBtn.addEventListener('click', closeVideoModal);
    nextBtn.addEventListener('click', showNextVideo);
    prevBtn.addEventListener('click', showPrevVideo);

    document.addEventListener('keydown', (e) => {
        if (!isViewerOpen) return;
        if (e.key === 'Escape') closeVideoModal();
        if (e.key === 'ArrowRight') showNextVideo();
        if (e.key === 'ArrowLeft') showPrevVideo();
    });

    shareBtn.addEventListener('click', () => {
        const videoUrl = new URL(videos[currentIndex].permalink, window.location.href).href;
        if (navigator.share) {
            navigator.share({
                title: videos[currentIndex].title,
                text: `Check out this video: ${videos[currentIndex].title}`,
                url: videoUrl,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(videoUrl).then(() => {
                showMessage('Post link copied to clipboard!');
            }).catch(err => {
                console.error('Could not copy text: ', err);
                showMessage('Failed to copy link.', true);
            });
        }
    });

    function showMessage(message, isError = false) {
        if(!messageBox) return;
        messageBox.textContent = message;
        messageBox.className = `fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md shadow-lg transition-opacity duration-300 ${isError ? 'bg-red-600' : 'bg-gray-800'} text-white`;
        messageBox.classList.remove('opacity-0');
        setTimeout(() => {
            messageBox.classList.add('opacity-0');
        }, 3000);
    }


    // Swipe functionality
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
            showNextVideo();
        }
        if (touchendX > touchstartX + 50) { // Swiped right
            showPrevVideo();
        }
    }
});
