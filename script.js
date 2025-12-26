// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // Select the carousel track element
    const track = document.querySelector('.carousel-track');
    // If the track doesn't exist, exit to prevent errors
    if (!track) return;

    // Add event listener for clicks on the carousel track (using Event Delegation)
    track.addEventListener('click', (e) => {
        // Handle Quantity Buttons (+/-)
        if (e.target.closest('.qty-btn')) {
            const btn = e.target.closest('.qty-btn');
            const selector = btn.closest('.quantity-selector');
            const footer = btn.closest('.food-footer');
            const valSpan = selector.querySelector('.qty-val');
            let val = parseInt(valSpan.textContent);

            // Decrease quantity
            if (btn.classList.contains('minus')) {
                if (val > 1) {
                    val--;
                    valSpan.textContent = val;
                } else {
                    // Reset to "Add" button if quantity goes below 1
                    selector.style.display = 'none';
                    const addBtn = footer.querySelector('.add-btn');
                    if (addBtn) addBtn.style.display = 'flex';
                }
            } else if (btn.classList.contains('plus')) {
                // Increase quantity
                val++;
                valSpan.textContent = val;
            }
        }
        
        // Handle "Add" Button click to show quantity selector
        if (e.target.closest('.add-btn')) {
             const btn = e.target.closest('.add-btn');
             const footer = btn.closest('.food-footer');
             const selector = footer.querySelector('.quantity-selector');
             
             // Hide Add button and show Quantity Selector
             btn.style.display = 'none';
             
             if (selector) {
                 selector.style.display = 'flex';
                 const valSpan = selector.querySelector('.qty-val');
                 // Default start value is 1
                 if (valSpan) valSpan.textContent = '1';
             }
        }
    });

    // Select Carousel Navigation Buttons
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    // Function to calculate width of one slide including gap
    const getSlideWidth = () => {
        const firstSlide = track.children[0];
        const computedStyle = window.getComputedStyle(track);
        const gap = parseFloat(computedStyle.gap) || 0;
        return firstSlide.getBoundingClientRect().width + gap;
    };

    let isTransitioning = false; // Flag to prevent rapid clicks

    // Function to update the "active" class on the center slide
    const updateActiveSlide = () => {
        const slides = Array.from(track.children);
        slides.forEach(s => s.classList.remove('current-slide'));
        // The second slide in the list is visually in the center
        if (slides.length >= 2) {
            slides[1].classList.add('current-slide');
        }
    };

    // Function to move Carousel to the Next item
    const moveNext = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        const slideWidth = getSlideWidth();
        
        // Apply transition for smooth sliding
        track.style.transition = 'transform 0.4s ease-in-out';
        track.style.transform = `translateX(-${slideWidth}px)`;

        // Listen for transition end to reset position
        track.addEventListener('transitionend', () => {
            track.style.transition = 'none';
            // Move the first item to the end of the list (Infinite Loop)
            track.appendChild(track.firstElementChild);
            track.style.transform = 'translateX(0)';
            
            updateActiveSlide();

            // Allow next click
            setTimeout(() => {
                isTransitioning = false;
            });
        }, { once: true });
    };

    // Function to move Carousel to the Previous item
    const movePrev = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        const slideWidth = getSlideWidth();

        track.style.transition = 'none';
        // Move the last item to the beginning of the list
        track.insertBefore(track.lastElementChild, track.firstElementChild);
        // Offset by one slide width to keep visual position
        track.style.transform = `translateX(-${slideWidth}px)`;

        // Force browser reflow to apply the transform
        void track.offsetWidth;

        // Slide back to 0
        track.style.transition = 'transform 0.4s ease-in-out';
        track.style.transform = 'translateX(0)';

        track.addEventListener('transitionend', () => {
            updateActiveSlide();
            isTransitioning = false;
        }, { once: true });
    };


    // Bind click events if buttons exist
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', moveNext);
        prevBtn.addEventListener('click', movePrev);
        
        // Initial setup
        updateActiveSlide();
    }

    // Modal Logic for "Request a Dish"
    const modal = document.getElementById('requestModal');
    const openBtn = document.getElementById('requestDishBtn');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const submitBtn = document.querySelector('.submit-btn');

    // Function to open modal
    const openModal = () => {
        modal.style.display = 'flex';
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
    }

    // Function to close modal
    const closeModal = () => {
        modal.style.display = 'none';
        // Re-enable scrolling
        document.body.style.overflow = 'auto';
    }

    // Event Listeners for Modal
    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close modal if clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle form submission (Mock)
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Request Submitted!');
        closeModal();
    });
    

    // Video Player Logic
    const video = document.getElementById('promoVideo');
    const playOverlay = document.getElementById('playOverlay');

    // Toggle Play/Pause on Video or Overlay click
    const togglePlay = () => {
        if (video.paused) {
            video.play();
            playOverlay.classList.add('hidden');
        } else {
            video.pause();
            playOverlay.classList.remove('hidden');
        }
    }

    playOverlay.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);
    
    // Show overlay again when video ends
    video.addEventListener('ended', () => {
        playOverlay.classList.remove('hidden');
    });

    // Mobile Menu Logic
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            // Toggle active class to show/hide menu
            navbar.classList.toggle('active');
            
            // Lock scrolling if menu is open
            if (navbar.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
    }

});
