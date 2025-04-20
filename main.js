/**
 * main.js
 * Contains essential functionality for the website
 */

// Register Service Worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Use relative path for service worker registration
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile menu functionality
  initMobileMenu();

  // Highlight current page in navigation
  highlightCurrentPage();

  // Set current year in footer copyright
  setFooterYear();

  // Initialize animated counters if elements exist
  initAnimatedCounters();

  // Initialize floating particles for hero section
  initFloatingParticles();

  // Initialize tab switcher if tab elements exist
  initTabSwitcher();

  // Initialize accordion FAQ if elements exist
  initAccordionFAQ();

  // Initialize Prophet Guidance section with TypewriterRTL
  initProphetGuidance();

  // Initialize PrayerTimesDisplay if container exists
  const prayerTimesContainer = document.getElementById('prayer-times-container');
  if (prayerTimesContainer) {
    new PrayerTimesDisplay({ container: prayerTimesContainer });
  }

  // Initialize TypewriterRTL elements
  const typewriterElements = document.querySelectorAll('[data-typewriter]');
  typewriterElements.forEach(element => {
    new TypewriterRTL(element);
  });

  // Initialize announcement cards and popup modal
  initAnnouncementCards();

  // Apply cache busting to all assets
  applyCacheBusting(true); // Use timestamp for maximum cache busting

  // Setup cache busting for popup images
  setupCacheBusting();
});

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      const menuIcon = mobileMenuButton.querySelector('svg path');

      if (!isHidden) {
        menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
      } else {
        menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
      }
    });
  }
}

/**
 * Highlight the current page in the navigation
 */
function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath ||
        (currentPath === '/' && href === '/index.html') ||
        (currentPath !== '/' && href !== '/' && currentPath.includes(href))) {
      link.classList.add('text-primary-color', 'font-bold');
    }
  });
}

/**
 * Set the current year in the footer copyright text
 */
function setFooterYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}


/**
 * Animated Counters
 * Creates animated number counters that count up to a target value
 */
function initAnimatedCounters() {
  // Find all elements with data-counter attribute
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;

  counterElements.forEach((element, index) => {
    // Generate ID if needed and extract options
    element.id = element.id || `animated-counter-${index}`;

    const options = {
      element,
      end: parseFloat(element.dataset.counter || '0'),
      duration: parseInt(element.dataset.duration || '2000', 10),
      prefix: element.dataset.prefix || '',
      suffix: element.dataset.suffix || '',
      title: element.dataset.title || '',
      decimals: parseInt(element.dataset.decimals || '0', 10)
    };

    // Create counter and observe
    setupCounter(options);
  });
}

/**
 * Setup counter with elements and observer
 * @param {Object} options - Counter configuration options
 */
function setupCounter(options) {
  const { element, prefix, suffix, title } = options;

  // Create counter elements with template literals
  element.innerHTML = `
    <div class="text-3xl font-bold mb-2 text-center w-full">${prefix}0${suffix}</div>
    ${title ? `<div class="text-sm opacity-80 text-center w-full">${title}</div>` : ''}
  `;

  // Set up intersection observer
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounter(options);
      observer.disconnect();
    }
  }, { threshold: 0.1 });

  observer.observe(element);
}

/**
 * Animate the counter from 0 to the target value
 * @param {Object} options - Counter configuration options
 */
function animateCounter(options) {
  const { element, end, duration, prefix, suffix, decimals } = options;
  const counterElement = element.querySelector('div');
  if (!counterElement) return;

  let startTime = null;

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const currentValue = progress * end;

    counterElement.textContent = `${prefix}${formatNumber(currentValue, decimals)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

/**
 * Format number with commas and decimals
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places to show
 * @returns {string} Formatted number
 */
function formatNumber(num, decimals) {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}



/**
 * FloatingParticles.js
 * Creates animated floating particles with neural network-like connections
 */

/**
 * Initialize floating particles in the hero container
 */
function initFloatingParticles() {
  const container = document.getElementById('hero-container');
  if (!container) return;

  // Optimize for performance by reducing particle count on mobile
  const isMobile = window.innerWidth < 768;

  createNeuralNetwork(container, {
    particleCount: isMobile ? 20 : 40,
    colors: ['#6366f1', '#a5b4fc', '#8b5cf6', '#c4b5fd', '#ffffff'],
    minSize: 2, maxSize: 4,
    speed: 0.7,
    minOpacity: 0.3, maxOpacity: 0.7,
    connectionDistance: isMobile ? 120 : 180,
    connectionOpacity: 0.2,
    connectionWidth: 0.8,
    connectionColor: '#a5b4fc',
    // Throttle rendering for better performance
    renderInterval: isMobile ? 2 : 1 // Only render every X frames
  });
}

/**
 * Create a neural network with particles and connections
 * @param {HTMLElement} container - The container element
 * @param {Object} config - Configuration for particles and connections
 */
function createNeuralNetwork(container, config) {
  // Setup canvas
  const canvas = setupCanvas(container);
  const ctx = canvas.getContext('2d');
  const particles = createParticles(container, canvas, config);

  // Add CSS for particles
  addParticleStyles();

  // For throttling rendering
  let frameCount = 0;

  // Animation loop
  (function animate() {
    frameCount++;

    // Only render every X frames based on renderInterval
    if (frameCount % config.renderInterval === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateParticles(particles, canvas, ctx, config);
    }

    requestAnimationFrame(animate);
  })();
}

/**
 * Setup canvas for drawing connections
 * @param {HTMLElement} container - The container element
 * @returns {HTMLCanvasElement} The canvas element
 */
function setupCanvas(container) {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position: 'absolute', top: '0', left: '0',
    width: '100%', height: '100%', pointerEvents: 'none'
  });
  container.appendChild(canvas);

  // Set canvas size and handle resizing
  const resizeObserver = new ResizeObserver(() => {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  });

  resizeObserver.observe(container);
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;

  return canvas;
}

/**
 * Create particles in the container
 * @param {HTMLElement} container - The container element
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {Object} config - Configuration for particles
 * @returns {Array} Array of particle objects
 */
function createParticles(container, canvas, config) {
  const particles = [];
  const fragment = document.createDocumentFragment(); // Use fragment for better performance

  for (let i = 0; i < config.particleCount; i++) {
    // Random properties
    const size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    const opacity = Math.random() * (config.maxOpacity - config.minOpacity) + config.minOpacity;

    // Create particle element
    const element = document.createElement('div');
    element.className = 'neural-particle';

    // Set styles
    Object.assign(element.style, {
      position: 'absolute',
      width: `${size}px`, height: `${size}px`,
      backgroundColor: color,
      borderRadius: '50%',
      opacity: opacity.toString(),
      boxShadow: `0 0 ${size}px ${color}`,
      zIndex: '2',
      transform: 'translate3d(0,0,0)' // Force GPU acceleration
    });

    fragment.appendChild(element);

    // Store particle data
    particles.push({
      element,
      size,
      color,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speedX: (Math.random() - 0.5) * config.speed,
      speedY: (Math.random() - 0.5) * config.speed,
      opacity
    });
  }

  // Append all particles at once
  container.appendChild(fragment);

  return particles;
}

/**
 * Add CSS styles for particles
 */
function addParticleStyles() {
  if (!document.getElementById('floating-particles-keyframes')) {
    const style = document.createElement('style');
    style.id = 'floating-particles-keyframes';
    style.textContent = '.neural-particle { transition: transform 3s ease-in-out; will-change: transform; }';
    document.head.appendChild(style);
  }
}

/**
 * Update particles and draw connections
 * @param {Array} particles - Array of particle objects
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Object} config - Configuration for particles and connections
 */
function updateParticles(particles, canvas, ctx, config) {
  // Pre-calculate canvas dimensions for better performance
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  particles.forEach((particle, i) => {
    // Update position
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    // Bounce off edges
    if (particle.x < 0 || particle.x > canvasWidth) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > canvasHeight) particle.speedY *= -1;

    // Update element position using transform for better performance
    particle.element.style.transform = `translate3d(${particle.x}px, ${particle.y}px, 0)`;

    // Draw connections
    drawConnections(particle, particles.slice(i + 1), ctx, config);
  });
}

/**
 * Draw connections between particles
 * @param {Object} particle - The source particle
 * @param {Array} otherParticles - Array of other particles to connect to
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Object} config - Configuration for connections
 */
function drawConnections(particle, otherParticles, ctx, config) {
  // Parse color once outside the loop
  let r = 165, g = 180, b = 252;
  if (config.connectionColor.startsWith('#')) {
    const hex = config.connectionColor.substring(1);
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }

  const connectionDistanceSquared = config.connectionDistance * config.connectionDistance;
  const opacity = config.connectionOpacity;

  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  ctx.lineWidth = config.connectionWidth;

  otherParticles.forEach(otherParticle => {
    const dx = particle.x - otherParticle.x;
    const dy = particle.y - otherParticle.y;
    // Use squared distance for performance (avoid square root)
    const distanceSquared = dx * dx + dy * dy;

    if (distanceSquared < connectionDistanceSquared) {
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(otherParticle.x, otherParticle.y);
      ctx.stroke();
    }
  });
}


/**
 * Tab Switcher
 * Creates a tabbed interface that switches between content sections
 */
function initTabSwitcher() {
  // Look for tab groups with role="tablist" or specific tab IDs
  const tabGroups = document.querySelectorAll('[role="tablist"]');
  const specificTabPairs = [
    {
      tabs: ['tab-announcements', 'tab-events'],
      contents: ['content-announcements', 'content-events'],
      activeClass: 'px-8 py-4 border-b-2 border-primary-color text-black font-bold cursor-pointer relative transition-all',
      inactiveClass: 'px-8 py-4 border-b-2 border-transparent text-black font-medium cursor-pointer relative transition-all hover:text-primary-color'
    }
  ];

  // Process specific tab pairs first
  specificTabPairs.forEach(pair => {
    const tabs = pair.tabs.map(id => document.getElementById(id)).filter(Boolean);
    const contents = pair.contents.map(id => document.getElementById(id)).filter(Boolean);

    if (tabs.length > 0 && contents.length > 0) {
      setupTabs(tabs, contents, pair.activeClass, pair.inactiveClass);
    }
  });

  // Process generic tab groups
  tabGroups.forEach(tabGroup => {
    const tabs = Array.from(tabGroup.querySelectorAll('[role="tab"]'));

    if (tabs.length > 0) {
      const contents = tabs.map(tab => {
        const contentId = tab.getAttribute('aria-controls');
        return document.getElementById(contentId);
      }).filter(Boolean);

      const activeClass = 'px-6 py-3 border-b-2 border-primary-color text-primary-color font-bold cursor-pointer';
      const inactiveClass = 'px-6 py-3 border-b-2 border-transparent text-black font-medium cursor-pointer';

      setupTabs(tabs, contents, activeClass, inactiveClass);

      // Activate the tab that has aria-selected="true" or the first tab
      const selectedTabIndex = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
      tabs[selectedTabIndex >= 0 ? selectedTabIndex : 0]?.click();
    }
  });
}

/**
 * Set up tab switching functionality
 * @param {Array} tabs - Array of tab elements
 * @param {Array} contents - Array of content elements
 * @param {string} activeClass - CSS class for active tab
 * @param {string} inactiveClass - CSS class for inactive tab
 */
function setupTabs(tabs, contents, activeClass, inactiveClass) {
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      // Update tab styles and attributes
      tabs.forEach((t, i) => {
        t.className = i === index ? activeClass : inactiveClass;
        t.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });

      // Show/hide content sections
      contents.forEach((content, i) => {
        if (content) {
          if (i === index) {
            content.classList.remove('hidden');
            content.classList.add('block');
          } else {
            content.classList.remove('block');
            content.classList.add('hidden');
          }
        }
      });
    });
  });
}

/**
 * Accordion FAQ
 * Creates an accordion-style FAQ component with expandable/collapsible items
 */
function initAccordionFAQ() {
  // Look for FAQ accordion container
  const container = document.getElementById('faq-accordion');
  if (!container) return;

  // Check if container has data-faqs attribute or existing items
  let faqs = [];
  if (container.hasAttribute('data-faqs')) {
    try {
      faqs = JSON.parse(container.getAttribute('data-faqs'));
      renderAccordion(container, faqs);
    } catch (e) {
      console.error('Error parsing FAQ data:', e);
      return;
    }
  } else {
    // Use existing items if present
    const existingItems = container.querySelectorAll('.faq-item');
    if (existingItems.length > 0) {
      setupAccordionListeners(container);
    }
  }
}

/**
 * Render accordion HTML from FAQ data
 * @param {HTMLElement} container - The accordion container
 * @param {Array} faqs - Array of FAQ objects with question and answer properties
 */
function renderAccordion(container, faqs) {
  // Create accordion HTML with template literals
  const accordionHTML = `
    <div class="faq-accordion">
      ${faqs.map((faq, index) => `
        <div class="faq-item mb-4 rounded-xl overflow-hidden transition-all duration-300 shadow border-transparent"
             data-faq-index="${index}"
             style="transform: scale(1); border-left: 4px solid transparent;
                    transition: transform 0.3s ease, border-left 0.3s ease, box-shadow 0.3s ease;">
          <button class="faq-toggle w-full text-left p-5 font-semibold flex justify-between items-center
                         bg-white hover:bg-gray-50 transition-colors"
                  aria-expanded="false"
                  aria-controls="faq-content-${index}">
            <span class="pr-8">${faq.question}</span>
            <span class="faq-icon flex-shrink-0">
              <svg class="w-6 h-6 transition-transform duration-300 rotate-0"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg"
                   style="transition: transform 0.3s ease;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
          </button>
          <div id="faq-content-${index}"
               class="faq-content overflow-hidden transition-all duration-300 ease-in-out bg-gray-50"
               style="max-height: 0; opacity: 0; transition: max-height 0.3s ease, opacity 0.3s ease;">
            <div class="p-5 border-t border-gray-100">
              <p class="text-gray-700">${faq.answer}</p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Set accordion HTML and initialize listeners
  container.innerHTML = accordionHTML;
  setupAccordionListeners(container);
}

/**
 * Set up event listeners for accordion items
 * @param {HTMLElement} container - The accordion container
 */
function setupAccordionListeners(container) {
  // Get all toggle buttons
  const toggleButtons = container.querySelectorAll('.faq-toggle');
  let activeIndex = -1;

  // Add click event listeners
  toggleButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const isExpanding = activeIndex !== index;
      const newActiveIndex = isExpanding ? index : -1;

      // Update all items (close everything first)
      updateAccordionItems(container, newActiveIndex);

      // Update active index after all items are updated
      activeIndex = newActiveIndex;
    });
  });
}

/**
 * Update all accordion items based on active index
 * @param {HTMLElement} container - The accordion container
 * @param {number} activeIndex - Index of the active item (-1 if none)
 */
function updateAccordionItems(container, activeIndex) {
  const faqItems = container.querySelectorAll('.faq-item');

  faqItems.forEach((item, index) => {
    const isActive = index === activeIndex;
    const button = item.querySelector('.faq-toggle');
    const icon = item.querySelector('.faq-icon svg');
    const content = item.querySelector('.faq-content');

    // Update item state based on whether it's active
    if (isActive) {
      // Expand this item
      item.classList.remove('shadow', 'border-transparent');
      item.classList.add('shadow-lg', 'border-primary-color');
      item.style.transform = 'scale(1.02)';
      item.style.borderLeft = '4px solid var(--primary-color)';
      button.setAttribute('aria-expanded', 'true');
      icon.classList.remove('rotate-0');
      icon.classList.add('rotate-45');
      content.style.maxHeight = '500px';
      content.style.opacity = '1';
    } else {
      // Collapse this item
      item.classList.remove('shadow-lg', 'border-primary-color');
      item.classList.add('shadow', 'border-transparent');
      item.style.transform = 'scale(1)';
      item.style.borderLeft = '4px solid transparent';
      button.setAttribute('aria-expanded', 'false');
      icon.classList.remove('rotate-45');
      icon.classList.add('rotate-0');
      content.style.maxHeight = '0';
      content.style.opacity = '0';
    }
  });
}


// TypewriterRTL function is now replaced by the TypewriterRTL class

// Initialize TypewriterRTL for the moonsighting page
function initProphetGuidance() {
  const hadithElement = document.getElementById('hadith-arabic');
  if (!hadithElement) return;

  // Make sure the element has the right styling
  hadithElement.classList.add('font-arabic');
  hadithElement.style.direction = 'rtl';
  hadithElement.style.textAlign = 'center';
  hadithElement.style.lineHeight = '1.8';
  hadithElement.style.fontSize = '1.9rem';

  // Hadith text
  const hadithText = 'إِذَا رَأَيْتُمُوهُ فَصُومُوا وَإِذَا رَأَيْتُمُوهُ فَأَفْطِرُوا فَإِنْ أُغْمِيَ عَلَيْكُمْ فَعُدُّوا ثَلاَثِينَ';

  // Initialize the TypewriterRTL for Arabic text
  new TypewriterRTL(hadithElement, {
    text: hadithText,
    delay: 100, // Typing speed
    cursor: true,
    cursorChar: '|',
    cursorBlink: true,
    onComplete: fadeInRelatedElements
  });

  // Function to fade in related elements
  function fadeInRelatedElements() {
    const elements = [
      { id: 'hadith-translation', delay: 200 },
      { id: 'hadith-citation', delay: 600 },
      { id: 'hadith-description', delay: 1000 }
    ];

    elements.forEach(({ id, delay }) => {
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.style.opacity = '1';
          element.classList.add('animate-fadeIn');
        }, delay);
      }
    });
  }
}

// Contact form submission
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
  e.preventDefault();

  // Here you would normally send the form data to a server
  // For demonstration purposes, we'll just show an alert
  alert('Thank you for your message! We will get back to you soon.');
  this.reset();
});

/**
 * PrayerTimesDisplay Class
 * Handles the display and updating of prayer times
 */
class PrayerTimesDisplay {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('prayer-times-container');
    this.city = options.city || 'Auckland';
    this.country = options.country || 'New Zealand';
    this.updateInterval = options.updateInterval || 60000; // 1 minute
    this.currentDate = new Date();

    // Prayer times in 24-hour format for easier comparison
    this.prayerTimesData = {
      fajr: { time: '05:30', displayTime: '5:30 AM', hour: 5, minute: 30 },
      dhuhr: { time: '12:30', displayTime: '12:30 PM', hour: 12, minute: 30 },
      asr: { time: '16:45', displayTime: '4:45 PM', hour: 16, minute: 45 },
      maghrib: { time: '19:15', displayTime: '7:15 PM', hour: 19, minute: 15 },
      isha: { time: '20:45', displayTime: '8:45 PM', hour: 20, minute: 45 }
    };

    // Initialize if container exists
    if (this.container) {
      this.init();
    }
  }

  init() {
    this.updateDateDisplay();
    this.displayPrayerTimes();
    this.updateNextPrayerHighlight();

    // Set up automatic updates every minute
    setInterval(() => {
      this.currentDate = new Date();
      this.updateDateDisplay();
      this.updateNextPrayerHighlight();
    }, this.updateInterval);
  }

  updateDateDisplay() {
    const dateElement = document.querySelector('.prayer-date');
    if (dateElement) {
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      dateElement.textContent = `${this.city}, ${this.country} • ${this.currentDate.toLocaleDateString('en-US', options)}`;
    }
  }

  displayPrayerTimes() {
    // Update each prayer time element
    Object.entries(this.prayerTimesData).forEach(([prayer, data]) => {
      const element = document.querySelector(`.prayer-time-${prayer}`);
      if (element) {
        element.textContent = data.displayTime;
      }
    });
  }

  updateNextPrayerHighlight() {
    const prayerContainers = document.querySelectorAll('.prayer-time-container');
    if (!prayerContainers.length) return;

    // Remove existing highlights
    prayerContainers.forEach(container => {
      container.classList.remove('next-prayer');
    });

    // Get current time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Find the next prayer
    let nextPrayer = 'fajr'; // Default to fajr

    // Convert prayers to array for easier sorting
    const prayers = Object.entries(this.prayerTimesData);

    // Find the next prayer time
    for (const [prayer, data] of prayers) {
      if (data.hour > currentHour || (data.hour === currentHour && data.minute > currentMinute)) {
        nextPrayer = prayer;
        break;
      }
    }

    // If all prayers have passed for today, next prayer is fajr tomorrow

    // Add highlight to next prayer
    const nextPrayerElement = document.querySelector(`.prayer-time-${nextPrayer}`);
    if (nextPrayerElement) {
      const container = nextPrayerElement.closest('.prayer-time-container');
      if (container) {
        container.classList.add('next-prayer');
      }
    }
  }
}

/**
 * TypewriterRTL Class
 * Creates a typewriter effect for right-to-left text
 */
class TypewriterRTL {
  constructor(element, options = {}) {
    // Default options
    this.defaults = {
      text: '',
      delay: 100,
      loop: false,
      loopDelay: 2000,
      cursor: true,
      cursorChar: '|',
      cursorBlink: true,
      onComplete: () => {}
    };

    // Merge options with defaults
    this.options = { ...this.defaults, ...options };

    // Set element
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.element) return;

    // Set text
    this.text = this.options.text || this.element.getAttribute('data-typewriter') || '';
    if (!this.text) return;

    // Setup cursor style once for all instances
    this.setupCursorStyle();

    // Ensure the element has RTL direction
    this.element.setAttribute('dir', 'rtl');
    this.element.style.textAlign = 'center';
    this.element.textContent = '';

    // Create cursor element if needed
    if (this.options.cursor) {
      this.createCursor();
    }

    // Set state
    this.isTyping = false;
    this.charIndex = 0;
    this.displayedText = '';

    // Start typing
    this.start();
  }

  /**
   * Set up cursor style once for all instances
   */
  setupCursorStyle() {
    if (this.options.cursor && this.options.cursorBlink && !document.getElementById('typewriter-cursor-style')) {
      const style = document.createElement('style');
      style.id = 'typewriter-cursor-style';
      style.textContent = `
        .typewriter-cursor-blink {
          animation: typewriter-cursor-blink 1s step-end infinite;
        }
        @keyframes typewriter-cursor-blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Create cursor element
   */
  createCursor() {
    this.cursor = document.createElement('span');
    this.cursor.textContent = this.options.cursorChar;
    this.cursor.className = 'typewriter-cursor';
    if (this.options.cursorBlink) {
      this.cursor.classList.add('typewriter-cursor-blink');
    }
    this.element.appendChild(this.cursor);
  }

  /**
   * Start the typing animation
   */
  start() {
    if (this.isTyping) return;
    this.isTyping = true;
    this.charIndex = 0;
    this.displayedText = '';
    this.element.textContent = '';
    if (this.options.cursor) {
      this.element.appendChild(this.cursor);
    }
    this.type();
  }

  /**
   * Type the next character
   */
  type() {
    if (!this.isTyping) return;

    if (this.charIndex < this.text.length) {
      // Add the next character to our displayed text
      this.displayedText += this.text[this.charIndex];

      // Update the element's text content
      this.element.textContent = this.displayedText;

      // Re-append the cursor if needed
      if (this.options.cursor) {
        this.element.appendChild(this.cursor);
      }

      this.charIndex++;
      setTimeout(() => this.type(), this.options.delay);
    } else {
      this.isTyping = false;
      this.options.onComplete();

      if (this.options.loop) {
        setTimeout(() => this.reset(), this.options.loopDelay);
      }
    }
  }

  /**
   * Reset for looping
   */
  reset() {
    this.element.textContent = '';
    if (this.options.cursor) {
      this.element.appendChild(this.cursor);
    }
    this.start();
  }

  /**
   * Stop the typing animation
   */
  stop() {
    this.isTyping = false;
  }
}

/**
 * News Popup Functions
 * Handles the functionality for announcement cards and popup modal
 */

// DOM Elements
let newsPopupModal;
let popupNewsTitle;
let popupNewsMeta;
let popupNewsContent;
let popupNewsImage;
let popupNewsImageContainer;
let closeNewsPopup;
let announcementCards;

// Fullscreen image viewer elements
let fullscreenImageViewer;
let fullscreenImage;
let closeFullscreenViewer;

/**
 * Initialize announcement cards and popup modal
 */
function initAnnouncementCards() {
  // Get DOM elements
  newsPopupModal = document.getElementById('news-popup-modal');
  if (newsPopupModal) {
    popupNewsTitle = document.getElementById('popup-news-title');
    popupNewsMeta = document.getElementById('popup-news-meta');
    popupNewsContent = document.getElementById('popup-news-content');
    popupNewsImage = document.getElementById('popup-news-image');
    popupNewsImageContainer = document.getElementById('popup-news-image-container');
    closeNewsPopup = document.getElementById('close-news-popup');
    announcementCards = document.querySelectorAll('.announcement-card');

    // Get fullscreen image viewer elements
    fullscreenImageViewer = document.getElementById('fullscreen-image-viewer');
    fullscreenImage = document.getElementById('fullscreen-image');
    closeFullscreenViewer = document.getElementById('close-fullscreen-viewer');

    // Set up event listeners for announcement cards
    setupAnnouncementCardListeners();

    // Set up event listeners for modal
    setupModalListeners();

    // Set up fullscreen image viewer
    setupFullscreenImageViewer();
  }
}

/**
 * Set up event listeners for announcement cards
 */
function setupAnnouncementCardListeners() {
  announcementCards.forEach(card => {
    card.addEventListener('click', function() {
      // Get announcement data from data attributes or generate from card content
      const news = getAnnouncementDataFromCard(this);
      openNewsPopup(news);
    });

    // Add accessibility attributes
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'Open announcement details');

    // Add keyboard support
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const news = getAnnouncementDataFromCard(this);
        openNewsPopup(news);
      }
    });
  });
}

/**
 * Extract announcement data from a card element
 * @param {HTMLElement} card - The announcement card element
 * @returns {Object} - The announcement data object
 */
function getAnnouncementDataFromCard(card) {
  // Check if card has data attributes
  if (card.dataset.title && card.dataset.content) {
    return {
      title: card.dataset.title,
      author: card.dataset.author || 'Admin',
      timestamp: card.dataset.timestamp || new Date().toISOString(),
      content: card.dataset.content,
      image: card.dataset.image || card.querySelector('img')?.src || ''
    };
  }

  // Otherwise, extract data from card elements
  const title = card.querySelector('h3')?.textContent || 'Announcement';
  const image = card.querySelector('img')?.src || '';
  const category = card.querySelector('.rounded-full')?.textContent.trim() || '';
  const date = card.querySelector('.text-gray-500')?.textContent || '';
  const excerpt = card.querySelector('p')?.textContent || '';

  // For content, we'll use the excerpt as a fallback
  // In a real implementation, you might fetch the full content from a server
  const content = excerpt;

  return {
    title: title,
    author: 'Admin',
    timestamp: date || new Date().toISOString(),
    content: content,
    image: image,
    category: category
  };
}

/**
 * Set up event listeners for the modal
 */
function setupModalListeners() {
  // Close modal when clicking the close button
  if (closeNewsPopup) {
    closeNewsPopup.addEventListener('click', closeNewsPopupModal);
  }

  // Close modal when clicking outside
  newsPopupModal.addEventListener('click', (event) => {
    if (event.target === newsPopupModal) {
      closeNewsPopupModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !newsPopupModal.classList.contains('hidden')) {
      closeNewsPopupModal();
    }
  });

  // Add click event to the popup image to open fullscreen viewer
  if (popupNewsImage) {
    popupNewsImage.addEventListener('click', openFullscreenImageViewer);
  }
}

/**
 * Open the news popup with the provided data
 * @param {Object} news - The news data object
 */
function openNewsPopup(news) {
  // Populate the popup with news data
  popupNewsTitle.textContent = news.title;

  // Format the timestamp for display
  let displayTimestamp = news.timestamp;
  if (news.timestamp && news.timestamp.includes('T')) {
    try {
      const date = new Date(news.timestamp);
      // Format: "April 9, 2025 at 2:30 PM"
      displayTimestamp = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) + ' at ' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error('Error formatting date:', e);
    }
  }

  popupNewsMeta.textContent = `Posted by ${news.author || 'Admin'} • ${displayTimestamp}`;

  // Format the content with proper paragraphs
  const formattedContent = news.content
    .split('\n')
    .filter(para => para.trim() !== '')
    .map(para => `<p class="mb-4">${para}</p>`)
    .join('');

  popupNewsContent.innerHTML = formattedContent;

  // Handle image if present
  if (news.image) {
    // Reset any previous image styles
    popupNewsImage.style.width = '';
    popupNewsImage.style.height = '';
    popupNewsImage.className = 'w-auto h-auto max-w-full max-h-[70vh] object-contain';

    // Set the source
    popupNewsImage.src = news.image;
    popupNewsImage.alt = news.title;

    // Show the container
    popupNewsImageContainer.classList.remove('hidden');

    // Ensure image loads with proper aspect ratio
    popupNewsImage.onload = function() {
      // Add a small animation when the image loads
      this.classList.add('animate-fadeIn');

      // Log image dimensions for debugging
      console.log(`Image loaded: ${this.naturalWidth}x${this.naturalHeight}, aspect ratio: ${this.naturalWidth/this.naturalHeight}`);
    };
  } else {
    popupNewsImageContainer.classList.add('hidden');
  }

  // Show the popup with animation
  newsPopupModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal

  // Add animation class
  setTimeout(() => {
    newsPopupModal.querySelector('div').classList.add('animate-popup-in');
  }, 10);
}

/**
 * Close the news popup modal with animation
 */
function closeNewsPopupModal() {
  // Add animation class for closing
  const modalContent = newsPopupModal.querySelector('div');
  modalContent.classList.remove('animate-popup-in');
  modalContent.classList.add('animate-popup-out');

  // Hide after animation completes
  setTimeout(() => {
    newsPopupModal.classList.add('hidden');
    document.body.style.overflow = ''; // Re-enable scrolling
    modalContent.classList.remove('animate-popup-out');
  }, 300);
}

/**
 * Set up the fullscreen image viewer
 */
function setupFullscreenImageViewer() {
  if (!fullscreenImageViewer) return;

  // Close viewer when clicking the close button
  if (closeFullscreenViewer) {
    closeFullscreenViewer.addEventListener('click', closeFullscreenImageViewer);
  }

  // Close viewer when clicking on the image or background
  fullscreenImageViewer.addEventListener('click', (event) => {
    if (event.target === fullscreenImageViewer || event.target === fullscreenImage) {
      closeFullscreenImageViewer();
    }
  });

  // Close viewer with Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !fullscreenImageViewer.classList.contains('hidden')) {
      closeFullscreenImageViewer();
    }
  });
}

/**
 * Open the fullscreen image viewer
 */
function openFullscreenImageViewer() {
  if (!fullscreenImageViewer || !fullscreenImage || !popupNewsImage) return;

  // Set the image source from the popup image
  fullscreenImage.src = popupNewsImage.src;
  fullscreenImage.alt = popupNewsImage.alt;

  // Show the fullscreen viewer
  fullscreenImageViewer.classList.remove('hidden');
  fullscreenImageViewer.classList.add('flex');
  fullscreenImage.classList.add('animate-zoom-in');

  // Prevent scrolling behind the viewer
  document.body.style.overflow = 'hidden';
}

/**
 * Close the fullscreen image viewer
 */
function closeFullscreenImageViewer() {
  if (!fullscreenImageViewer) return;

  // Hide the fullscreen viewer with a fade-out effect
  fullscreenImage.classList.remove('animate-zoom-in');

  // Add a small delay before hiding to allow for animation
  setTimeout(() => {
    fullscreenImageViewer.classList.add('hidden');
    fullscreenImageViewer.classList.remove('flex');
    // Don't re-enable scrolling if the news popup is still open
    if (newsPopupModal.classList.contains('hidden')) {
      document.body.style.overflow = '';
    }
  }, 200);
}

/**
 * Cache Busting Utility
 * Ensures the latest versions of assets are loaded
 */

/**
 * Adds a cache busting parameter to a URL
 * @param {string} url - The URL to add the cache busting parameter to
 * @param {string|number} [version] - Optional specific version to use (defaults to timestamp)
 * @returns {string} - URL with cache busting parameter
 */
function addCacheBuster(url, version) {
  if (!url || url.includes('?v=') || url.includes('&v=')) return url;

  const cacheBuster = version || new Date().getTime();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${cacheBuster}`;
}

/**
 * Updates all script, link, and image tags with cache busting parameters
 * @param {boolean} [useTimestamp=false] - Whether to use timestamp (true) or incremental version (false)
 */
function applyCacheBusting(useTimestamp = false) {
  const selectors = [
    { elements: document.querySelectorAll('script[src]'), attr: 'src' },
    { elements: document.querySelectorAll('link[rel="stylesheet"]'), attr: 'href' },
    { elements: document.querySelectorAll('img[src]'), attr: 'src' }
  ];

  let versionCounter = 1;

  selectors.forEach(({ elements, attr }) => {
    elements.forEach(element => {
      const value = element.getAttribute(attr);
      if (value) {
        const version = useTimestamp ? new Date().getTime() : versionCounter++;
        element.setAttribute(attr, addCacheBuster(value, version));
      }
    });
  });

  // Set up cache busting for dynamically loaded content
  setupDynamicCacheBusting();
}

/**
 * Set up cache busting for dynamically loaded content
 */
function setupDynamicCacheBusting() {
  // Apply cache busting to images loaded in the popup
  if (typeof openNewsPopup === 'function') {
    const originalOpenNewsPopup = openNewsPopup;
    openNewsPopup = function(news) {
      if (news.image) {
        news.image = addCacheBuster(news.image);
      }
      originalOpenNewsPopup(news);
    };
  }
}
