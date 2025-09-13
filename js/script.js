// Add this function to your existing script.js
function setupKnowledgePanel() {
    const faqContainer = document.getElementById('faq-container');
    // Fetch FAQ data from Hugo's params
    const faqs = {{ site.Params.knowledge_panel.people_also_ask | default "[]" | jsonify }};

    if (faqContainer && faqs.length > 0) {
        faqs.forEach(faq => {
            const faqItem = document.createElement('div');
            faqItem.className = 'border-b border-gray-200 last:border-b-0 py-3';
            faqItem.innerHTML = `
                <button class="w-full flex justify-between items-center text-left text-gray-800 focus:outline-none">
                    <span class="text-sm">${faq.question}</span>
                    <svg class="w-5 h-5 transition-transform transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div class="mt-2 text-sm text-gray-600 max-h-0 overflow-hidden transition-all duration-300">
                    ${faq.answer}
                </div>
            `;
            faqContainer.appendChild(faqItem);
        });

        faqContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const answer = button.nextElementSibling;
            const arrow = button.querySelector('svg');

            const isOpening = answer.classList.contains('max-h-0');

            // Close all others
            faqContainer.querySelectorAll('.border-b').forEach(item => {
                const otherAnswer = item.querySelector('div');
                otherAnswer.classList.add('max-h-0');
                otherAnswer.classList.remove('max-h-40');
                item.querySelector('svg').classList.remove('rotate-180');
            });
            
            // Toggle the clicked one
            if (isOpening) {
                answer.classList.remove('max-h-0');
                answer.classList.add('max-h-40'); // Or a suitable max height
                arrow.classList.add('rotate-180');
            }
        });
    }

//     // --- Mobile Image Swipe and Dots ---
//     const gallery = document.getElementById('image-gallery');
//     const dotsContainer = document.getElementById('dots-container');
    
//     if (gallery && dotsContainer && window.innerWidth < 768) {
//         const images = Array.from(gallery.children).filter(child => child.tagName !== 'TEMPLATE');
//         let activeIndex = 0;

//         // Create dots
//         images.forEach((_, i) => {
//             const dot = document.createElement('button');
//             dot.classList.add('w-2', 'h-2', 'rounded-full', 'transition-colors');
//             dot.classList.add(i === 0 ? 'bg-white' : 'bg-gray-400');
//             dotsContainer.appendChild(dot);
//         });
//         const dots = dotsContainer.children;

//         const updateDots = () => {
//             const scrollAmount = gallery.scrollLeft;
//             const imageWidth = images[0].clientWidth;
//             const margin = 8; // approx margin-left
//             const newIndex = Math.round(scrollAmount / (imageWidth + margin));

//             if (newIndex !== activeIndex && dots[activeIndex] && dots[newIndex]) {
//                 dots[activeIndex].classList.remove('bg-white');
//                 dots[activeIndex].classList.add('bg-gray-400');
//                 dots[newIndex].classList.add('bg-white');
//                 dots[newIndex].classList.remove('bg-gray-400');
//                 activeIndex = newIndex;
//             }
//         };

//         gallery.addEventListener('scroll', updateDots, { passive: true });
//     }
// }

// // Add the call to the new function inside DOMContentLoaded
// document.addEventListener('DOMContentLoaded', () => {
//     // ... (your existing code like setupViewerModal)
//     setupKnowledgePanel();
// });



// swiper initialization for mobile image slider
 document.addEventListener('DOMContentLoaded', () => {
        if (window.innerWidth < 768) {
          const mobileImageSlider = document.querySelector('#mobile-image-slider');
          
          if (mobileImageSlider) {
            const swiper = new Swiper(mobileImageSlider, {
              slidesPerView: 1,
              spaceBetween: 10,
              // The pagination object has been removed from here
            });
          }
        }
      });

      
      

