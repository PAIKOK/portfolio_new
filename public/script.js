/*==================== MENU SHOW & HIDDEN ====================*/
document.addEventListener('DOMContentLoaded', function () {
    const navMenu = document.getElementById('nav-menu'),
        navToggle = document.getElementById('nav-toggle'),
        navLinks = document.querySelectorAll('.nav__link'),
        scrollTop = document.getElementById('scroll-top'),
        contactForm = document.getElementById('contact-form');

    /*===== MENU SHOW =====*/
    /* Validate if constant exists */
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
        });
    }

    /*===== MENU HIDDEN =====*/
    /* Validate if constant exists */
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show-menu');
            });
        });
    }

    /*===== ACTIVE LINKS ON SCROLL =====*/
    window.addEventListener('scroll', scrollActive);

    function scrollActive() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 50;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav__link[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.nav__link[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    }

    /*===== CHANGE HEADER BACKGROUND =====*/
    window.addEventListener('scroll', function () {
        const header = document.querySelector('.l-header');
        // When the scroll is greater than 100 viewport height, add the scroll-header class
        if (this.scrollY >= 100) {
            header.classList.add('scroll-header');
        } else {
            header.classList.remove('scroll-header');
        }
    });

    /*===== SHOW SCROLL TOP =====*/
    window.addEventListener('scroll', function () {
        // When the scroll is higher than 560 viewport height, add the show-scroll class
        if (this.scrollY >= 560) {
            scrollTop.classList.add('show-scroll');
        } else {
            scrollTop.classList.remove('show-scroll');
        }
    });

    /*===== SCROLL TO TOP =====*/
    if (scrollTop) {
        scrollTop.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /*===== SMOOTH SCROLL FOR NAVIGATION =====*/
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50,
                    behavior: 'smooth'
                });
            }
        });
    });


    /*===== FORM SUBMISSION =====*/
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());

            // Change submit button text and disable it
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Config options - update these based on your environment
            // Line ~105 in your script.js:
            const API_URL = "https://portfolio-new-z8hs.onrender.com/api/contact";
            const FALLBACK_MODE = false; // Set to true to test without backend during development

            // Fallback mode for development without backend
            if (FALLBACK_MODE) {
                setTimeout(() => {
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.classList.add('form__success-message');
                    successMessage.innerHTML = `
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Message sent successfully! (Development mode)</p>
                    `;

                    // Insert success message after form
                    this.insertAdjacentElement('afterend', successMessage);

                    // Reset the form
                    this.reset();

                    // Remove success message after 5 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);

                    // Reset submit button
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }, 1000);
                return;
            }

            // Connection check before attempting to send data
            const checkConnection = () => {
                return new Promise((resolve, reject) => {
                    const testRequest = new XMLHttpRequest();
                    testRequest.timeout = 5000; // 5 seconds timeout
                    testRequest.onreadystatechange = function () {
                        if (this.readyState === 4) {
                            resolve(true);
                        }
                    };
                    testRequest.ontimeout = function () {
                        reject(new Error('Connection timeout. Server might be down.'));
                    };
                    testRequest.onerror = function () {
                        reject(new Error('Cannot connect to server. Please check your network.'));
                    };

                    // Make a HEAD request to test connectivity
                    testRequest.open('HEAD', API_URL.split('/api/')[0], true);
                    testRequest.send();
                });
            };
            document.addEventListener('DOMContentLoaded', function () {
                console.log("DOM loaded");

                const contactForm = document.getElementById('contact-form');
                console.log("Contact form element:", contactForm);  // This should show the form

                if (contactForm) {
                    contactForm.addEventListener('submit', function (e) {
                        console.log("Form submitted!");
                        e.preventDefault();
                        console.log("Default prevented");

                        // Rest of your form handling code...
                    });
                }
            });
            // Send data to backend with improved error handling
            checkConnection()
                .then(() => {
                    return fetch(API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formValues)
                    });
                })
                .then(response => {
                    // Check if response is ok before parsing JSON
                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status} ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        // Show success message
                        const successMessage = document.createElement('div');
                        successMessage.classList.add('form__success-message');
                        successMessage.innerHTML = `
                            <ion-icon name="checkmark-circle-outline"></ion-icon>
                            <p>${data.message}</p>
                        `;

                        // Insert success message after form
                        this.insertAdjacentElement('afterend', successMessage);

                        // Reset the form
                        this.reset();

                        // Remove success message after 5 seconds
                        setTimeout(() => {
                            successMessage.remove();
                        }, 5000);
                    } else {
                        throw new Error(data.message || 'Something went wrong');
                    }
                })
                .catch(error => {
                    // Show error message
                    const errorMessage = document.createElement('div');
                    errorMessage.classList.add('form__error-message');

                    // Provide more specific error messages
                    let errorText = error.message;
                    if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
                        errorText = 'Cannot connect to server. Please check if the server is running.';
                    } else if (error.message.includes('timeout')) {
                        errorText = 'Server took too long to respond. Please try again later.';
                    }

                    errorMessage.innerHTML = `
                        <ion-icon name="alert-circle-outline"></ion-icon>
                        <p>${errorText}</p>
                    `;

                    // Insert error message after form
                    this.insertAdjacentElement('afterend', errorMessage);

                    // Remove error message after 5 seconds
                    setTimeout(() => {
                        errorMessage.remove();
                    }, 5000);

                    // Log the full error for debugging
                    console.error('Contact form submission error:', error);
                })
                .finally(() => {
                    // Reset submit button
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }


    /*===== ANIMATION ON SCROLL =====*/
    // Optional: Add an intersection observer to apply animations when elements come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all section titles, project cards, and skill boxes
    document.querySelectorAll('.section-title, .project__card, .skills__box, .experience__item').forEach(el => {
        observer.observe(el);
    });

    /*===== TYPEWRITER EFFECT (OPTIONAL) =====*/
    // Add a typewriter effect to the home skill text
    const skillText = document.querySelector('.home__skill');
    if (skillText) {
        const text = skillText.textContent;
        skillText.textContent = '';

        let charIndex = 0;
        const typeWriter = () => {
            if (charIndex < text.length) {
                skillText.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50);
            }
        };

        // Start the effect after a delay
        setTimeout(typeWriter, 2000);
    }
});
// Get all project images
const projectImages = document.querySelectorAll('.project__img');
const aboutImage = document.querySelector('.about__img img');

// Create modal elements
const modal = document.createElement('div');
modal.className = 'image-modal';
const modalImg = document.createElement('img');
modal.appendChild(modalImg);

// Close button
const closeBtn = document.createElement('span');
closeBtn.className = 'close-modal';
closeBtn.innerHTML = '&times;';
closeBtn.setAttribute('aria-label', 'Close image');
modal.appendChild(closeBtn);

// Add modal to body
document.body.appendChild(modal);

// Function to open modal
function openModal(src) {
    // Add loading state
    modal.classList.add('loading');
    modal.style.display = 'flex';

    // Track image loading
    modalImg.onload = function () {
        modal.classList.remove('loading');
    };

    modalImg.src = src;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open

    // Accessibility
    modalImg.setAttribute('aria-expanded', 'true');

    // Handle loading errors
    modalImg.onerror = function () {
        modal.classList.remove('loading');
        modalImg.src = ''; // Clear the source
        modalImg.alt = 'Image failed to load';

        // Display error message
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'Image failed to load';
        errorMsg.style.color = 'white';
        errorMsg.style.textAlign = 'center';
        modal.appendChild(errorMsg);

        // Remove error message when modal closes
        const removeError = function () {
            if (modal.contains(errorMsg)) {
                modal.removeChild(errorMsg);
            }
            closeBtn.removeEventListener('click', removeError);
        };

        closeBtn.addEventListener('click', removeError);
    };
}

// Function to close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling

    // Accessibility
    modalImg.setAttribute('aria-expanded', 'false');
}

// Add click events to project images
projectImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.setAttribute('aria-label', 'Click to enlarge image');
    img.addEventListener('click', () => {
        openModal(img.src);
    });

    // Add keyboard accessibility
    img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(img.src);
        }
    });

    // Make images focusable for keyboard navigation
    img.setAttribute('tabindex', '0');
});

// Add click event to about image
if (aboutImage) {
    aboutImage.style.cursor = 'pointer';
    aboutImage.setAttribute('aria-label', 'Click to enlarge profile image');
    aboutImage.addEventListener('click', () => {
        openModal(aboutImage.src);
    });

    // Add keyboard accessibility
    aboutImage.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(aboutImage.src);
        }
    });

    // Make image focusable for keyboard navigation
    aboutImage.setAttribute('tabindex', '0');
}

// Close modal when clicking the close button or outside the image
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
    }
});

// Handle touch events for mobile devices
let touchStartX, touchStartY;

modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

modal.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;

    // Calculate swipe distance
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // If the swipe is significant enough (40px), close the modal
    if (Math.abs(diffX) > 40 || Math.abs(diffY) > 40) {
        closeModal();
    }
});

// Prevent scrolling on touch devices when modal is open
modal.addEventListener('touchmove', (e) => {
    if (modal.style.display === 'flex') {
        e.preventDefault();
    }
}, { passive: false });

// Add indicator text for all images
const addImageIndicator = () => {
    const allImages = [...projectImages];
    if (aboutImage) allImages.push(aboutImage);

    allImages.forEach(img => {
        // Only add indicator if not already added
        if (!img.parentNode.querySelector('.image-click-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'image-click-indicator';
            indicator.textContent = '';

            // For project images
            if (img.classList.contains('project__img')) {
                img.parentNode.style.position = 'relative';
                img.parentNode.appendChild(indicator);
            }
            // For about image
            else if (img.parentNode.classList.contains('about__img')) {
                img.parentNode.style.position = 'relative';
                img.parentNode.appendChild(indicator);
            }
        }
    });
};

// Call once on page load
addImageIndicator();

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
    // If modal is open, adjust image size
    if (modal.style.display === 'flex') {
        modalImg.style.maxHeight = window.innerHeight * 0.9 + 'px';
        modalImg.style.maxWidth = window.innerWidth * 0.9 + 'px';
    }
});

// Add css for click indicator
const style = document.createElement('style');
style.textContent = `
  .image-click-indicator {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .project__card:hover .image-click-indicator,
  .about__img:hover .image-click-indicator {
    opacity: 1;
  }
  
  @media (hover: none) {
    .image-click-indicator {
      opacity: 0.8;
      font-size: 10px;
      padding: 3px 6px;
    }
  }
`;
document.head.appendChild(style);