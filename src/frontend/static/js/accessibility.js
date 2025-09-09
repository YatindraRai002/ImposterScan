/**
 * Accessibility Enhancement Module
 * Provides comprehensive accessibility features for the DeepFake Detection System
 */

class AccessibilityManager {
  constructor() {
    this.init();
    this.setupKeyboardNavigation();
    this.setupScreenReader();
    this.setupFocusManagement();
    this.setupReducedMotion();
    this.setupHighContrast();
  }

  /**
   * Initialize accessibility features
   */
  init() {
    this.focusRing = true;
    this.highContrast = false;
    this.reducedMotion = this.prefersReducedMotion();
    this.announcements = [];
    
    // Add accessibility toolbar
    this.createAccessibilityToolbar();
    
    // Set up ARIA live regions
    this.setupLiveRegions();
    
    console.log('Accessibility Manager initialized');
  }

  /**
   * Create accessibility toolbar
   */
  createAccessibilityToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'accessibility-toolbar';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', 'Accessibility Options');
    
    toolbar.innerHTML = `
      <div class="toolbar-content">
        <button class="toolbar-toggle" aria-label="Toggle accessibility toolbar">
          <i class="fas fa-universal-access" aria-hidden="true"></i>
          <span class="sr-only">Accessibility Options</span>
        </button>
        <div class="toolbar-panel" role="menu">
          <div class="toolbar-section">
            <h3>Visual</h3>
            <button class="toolbar-button" id="toggleHighContrast" role="menuitem" aria-pressed="false">
              <i class="fas fa-adjust" aria-hidden="true"></i>
              High Contrast
            </button>
            <button class="toolbar-button" id="increaseFontSize" role="menuitem">
              <i class="fas fa-plus" aria-hidden="true"></i>
              Increase Font Size
            </button>
            <button class="toolbar-button" id="decreaseFontSize" role="menuitem">
              <i class="fas fa-minus" aria-hidden="true"></i>
              Decrease Font Size
            </button>
          </div>
          <div class="toolbar-section">
            <h3>Motion</h3>
            <button class="toolbar-button" id="toggleReducedMotion" role="menuitem" aria-pressed="false">
              <i class="fas fa-pause" aria-hidden="true"></i>
              Reduce Motion
            </button>
          </div>
          <div class="toolbar-section">
            <h3>Navigation</h3>
            <button class="toolbar-button" id="skipToContent" role="menuitem">
              <i class="fas fa-arrow-down" aria-hidden="true"></i>
              Skip to Content
            </button>
            <button class="toolbar-button" id="showHeadings" role="menuitem">
              <i class="fas fa-list" aria-hidden="true"></i>
              Show Headings
            </button>
          </div>
        </div>
      </div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      .accessibility-toolbar {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        font-family: var(--font-family);
      }
      
      .toolbar-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        transition: all 0.3s ease;
        font-size: 1.2rem;
      }
      
      .toolbar-toggle:hover,
      .toolbar-toggle:focus {
        background: var(--primary-dark);
        transform: scale(1.1);
        outline: 3px solid rgba(99, 102, 241, 0.3);
      }
      
      .toolbar-panel {
        position: absolute;
        top: 60px;
        right: 0;
        min-width: 250px;
        background: white;
        border: 1px solid var(--gray-200);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-xl);
        padding: 1rem;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
      }
      
      .toolbar-panel.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      
      .toolbar-section {
        margin-bottom: 1rem;
      }
      
      .toolbar-section:last-child {
        margin-bottom: 0;
      }
      
      .toolbar-section h3 {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--gray-700);
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      .toolbar-button {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        padding: 0.75rem;
        background: none;
        border: none;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-size: 0.875rem;
        color: var(--gray-700);
        transition: all 0.2s ease;
        text-align: left;
      }
      
      .toolbar-button:hover,
      .toolbar-button:focus {
        background: var(--gray-100);
        color: var(--gray-900);
        outline: 2px solid var(--primary-color);
        outline-offset: -2px;
      }
      
      .toolbar-button[aria-pressed="true"] {
        background: var(--primary-color);
        color: white;
      }
      
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      
      /* High contrast mode */
      .high-contrast {
        filter: contrast(2) brightness(1.2);
      }
      
      .high-contrast * {
        text-shadow: none !important;
        box-shadow: none !important;
      }
      
      .high-contrast .btn-primary {
        background: #000000 !important;
        color: #ffffff !important;
        border: 2px solid #ffffff !important;
      }
      
      .high-contrast .btn-outline {
        background: #ffffff !important;
        color: #000000 !important;
        border: 2px solid #000000 !important;
      }
      
      /* Reduced motion */
      .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      
      /* Font size adjustments */
      .font-size-large {
        font-size: 120% !important;
      }
      
      .font-size-larger {
        font-size: 140% !important;
      }
      
      .font-size-largest {
        font-size: 160% !important;
      }
      
      /* Focus indicators */
      .enhanced-focus *:focus {
        outline: 3px solid var(--primary-color) !important;
        outline-offset: 2px !important;
      }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(toolbar);
    
    // Setup toolbar events
    this.setupToolbarEvents();
  }

  /**
   * Setup toolbar event listeners
   */
  setupToolbarEvents() {
    const toggle = document.querySelector('.toolbar-toggle');
    const panel = document.querySelector('.toolbar-panel');
    
    if (toggle && panel) {
      toggle.addEventListener('click', () => {
        const isOpen = panel.classList.contains('show');
        panel.classList.toggle('show');
        toggle.setAttribute('aria-expanded', !isOpen);
      });
    }
    
    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.accessibility-toolbar') && panel) {
        panel.classList.remove('show');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Toolbar button events
    document.getElementById('toggleHighContrast')?.addEventListener('click', () => {
      this.toggleHighContrast();
    });
    
    document.getElementById('increaseFontSize')?.addEventListener('click', () => {
      this.increaseFontSize();
    });
    
    document.getElementById('decreaseFontSize')?.addEventListener('click', () => {
      this.decreaseFontSize();
    });
    
    document.getElementById('toggleReducedMotion')?.addEventListener('click', () => {
      this.toggleReducedMotion();
    });
    
    document.getElementById('skipToContent')?.addEventListener('click', () => {
      this.skipToContent();
    });
    
    document.getElementById('showHeadings')?.addEventListener('click', () => {
      this.showHeadings();
    });
    
    // Setup main application button handlers
    this.setupMainAppButtons();
  }

  /**
   * Setup main application button handlers
   */
  setupMainAppButtons() {
    // Hero buttons
    const startAnalysisBtn = document.getElementById('startAnalysisBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    startAnalysisBtn?.addEventListener('click', () => {
      this.scrollToSection('analysis');
      this.announce('Navigated to analysis section');
    });
    
    learnMoreBtn?.addEventListener('click', () => {
      this.playDemo();
      this.announce('Demo video opened');
    });
    
    signupBtn?.addEventListener('click', () => {
      this.openSignupModal();
      this.announce('Sign up modal opened');
    });
    
    // File upload button
    const fileSelectBtn = document.getElementById('selectFilesBtn');
    if (fileSelectBtn) {
      fileSelectBtn.addEventListener('click', () => {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
          fileInput.click();
        }
        this.announce('File selection dialog opened');
      });
    }
    
    // Queue buttons
    const clearQueueBtn = document.getElementById('clearQueueBtn');
    const startAnalysisQueueBtn = document.getElementById('startAnalysisQueueBtn');
    
    clearQueueBtn?.addEventListener('click', () => {
      this.announce('Analysis queue cleared');
    });
    
    startAnalysisQueueBtn?.addEventListener('click', () => {
      this.announce('Starting batch analysis');
    });
    
    // Export results button
    const exportResultsBtn = document.getElementById('exportResultsBtn');
    exportResultsBtn?.addEventListener('click', () => {
      this.exportResults();
      this.announce('Results export started');
    });
    
    // Contact form submit
    const contactForm = document.getElementById('contactForm');
    contactForm?.addEventListener('submit', (e) => {
      this.announce('Sending contact message');
    });
    
    // Login form submit
    const loginForm = document.getElementById('loginForm');
    loginForm?.addEventListener('submit', (e) => {
      this.announce('Signing in');
    });
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.announce('Modal closed');
      });
    });
    
    // Social media links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = this.getSocialPlatform(link);
        this.announce(`${platform} link would open in new tab`);
        this.showNotification('info', 'Social Link', `${platform} page would open in a new tab.`);
      });
    });
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    // Tab trap for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const modal = document.querySelector('.modal.show');
        if (modal) {
          this.trapFocus(e, modal);
        }
      }
      
      // Escape key handling
      if (e.key === 'Escape') {
        this.handleEscape();
      }
      
      // Arrow key navigation for custom components
      this.handleArrowKeyNavigation(e);
    });
    
    // Skip links
    this.addSkipLinks();
  }

  /**
   * Add skip links for keyboard users
   */
  addSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main" class="skip-link">Skip to main content</a>
      <a href="#nav" class="skip-link">Skip to navigation</a>
      <a href="#analysis" class="skip-link">Skip to analysis section</a>
    `;
    
    const styles = document.createElement('style');
    styles.textContent = `
      .skip-links {
        position: absolute;
        top: -100px;
        left: 0;
        z-index: 10001;
      }
      
      .skip-link {
        position: absolute;
        top: -100px;
        left: 0;
        background: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        text-decoration: none;
        border-radius: 0 0 var(--border-radius) 0;
        font-weight: 600;
        transition: top 0.3s ease;
      }
      
      .skip-link:focus {
        top: 0;
      }
    `;
    
    document.head.appendChild(styles);
    document.body.insertBefore(skipLinks, document.body.firstChild);
  }

  /**
   * Trap focus within a container (for modals)
   */
  trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  /**
   * Handle escape key
   */
  handleEscape() {
    // Close accessibility toolbar
    const panel = document.querySelector('.toolbar-panel');
    if (panel && panel.classList.contains('show')) {
      panel.classList.remove('show');
      return;
    }
    
    // Close modals
    const modal = document.querySelector('.modal.show');
    if (modal && window.app) {
      window.app.closeModal(modal);
    }
  }

  /**
   * Handle arrow key navigation
   */
  handleArrowKeyNavigation(e) {
    // Custom components that need arrow key navigation
    const activeElement = document.activeElement;
    
    // Navigation menu
    if (activeElement.classList.contains('nav-link')) {
      const navLinks = Array.from(document.querySelectorAll('.nav-link'));
      const currentIndex = navLinks.indexOf(activeElement);
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % navLinks.length;
        navLinks[nextIndex].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex === 0 ? navLinks.length - 1 : currentIndex - 1;
        navLinks[prevIndex].focus();
      }
    }
  }

  /**
   * Setup screen reader support
   */
  setupScreenReader() {
    // Add proper ARIA labels and descriptions
    this.enhanceARIA();
    
    // Setup live regions for dynamic content
    this.setupLiveRegions();
    
    // Add landmark roles
    this.addLandmarkRoles();
  }

  /**
   * Enhance ARIA attributes
   */
  enhanceARIA() {
    // Add aria-label to buttons without text
    const iconButtons = document.querySelectorAll('button:not([aria-label]) i.fas');
    iconButtons.forEach(icon => {
      const button = icon.closest('button');
      if (button && !button.textContent.trim()) {
        const iconClass = Array.from(icon.classList).find(cls => cls.startsWith('fa-'));
        if (iconClass) {
          const label = this.getAriaLabelFromIcon(iconClass);
          button.setAttribute('aria-label', label);
        }
      }
    });
    
    // Add aria-describedby for form fields with help text
    const formFields = document.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
      const helpText = field.nextElementSibling;
      if (helpText && helpText.classList.contains('help-text')) {
        const helpId = `help-${this.generateId()}`;
        helpText.id = helpId;
        field.setAttribute('aria-describedby', helpId);
      }
    });
    
    // Enhance progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
      bar.setAttribute('role', 'progressbar');
      bar.setAttribute('aria-valuemin', '0');
      bar.setAttribute('aria-valuemax', '100');
    });
  }

  /**
   * Setup live regions for announcements
   */
  setupLiveRegions() {
    // Create polite live region
    const politeRegion = document.createElement('div');
    politeRegion.id = 'polite-announcements';
    politeRegion.setAttribute('aria-live', 'polite');
    politeRegion.setAttribute('aria-atomic', 'true');
    politeRegion.className = 'sr-only';
    document.body.appendChild(politeRegion);
    
    // Create assertive live region
    const assertiveRegion = document.createElement('div');
    assertiveRegion.id = 'assertive-announcements';
    assertiveRegion.setAttribute('aria-live', 'assertive');
    assertiveRegion.setAttribute('aria-atomic', 'true');
    assertiveRegion.className = 'sr-only';
    document.body.appendChild(assertiveRegion);
  }

  /**
   * Add landmark roles
   */
  addLandmarkRoles() {
    // Main content
    const main = document.querySelector('main') || document.querySelector('#main');
    if (main) {
      main.setAttribute('role', 'main');
    }
    
    // Navigation
    const nav = document.querySelector('nav');
    if (nav) {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Main navigation');
    }
    
    // Form sections
    const forms = document.querySelectorAll('form');
    forms.forEach((form, index) => {
      if (!form.getAttribute('aria-label')) {
        form.setAttribute('aria-label', `Form ${index + 1}`);
      }
    });
  }

  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Enhance focus visibility
    document.body.classList.add('enhanced-focus');
    
    // Skip to content functionality
    const skipLinks = document.querySelectorAll('.skip-link');
    skipLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
    
    // Manage focus for dynamic content
    this.setupDynamicFocus();
  }

  /**
   * Setup dynamic focus management
   */
  setupDynamicFocus() {
    // Focus management for file upload results
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Focus on new results
              if (node.classList?.contains('result-card')) {
                this.announce(`Analysis result added for ${node.querySelector('.result-file-name')?.textContent}`);
              }
              
              // Focus on new notifications
              if (node.classList?.contains('notification')) {
                const title = node.querySelector('.notification-title')?.textContent;
                const message = node.querySelector('.notification-message')?.textContent;
                this.announce(`${title}: ${message}`, 'assertive');
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Setup reduced motion preferences
   */
  setupReducedMotion() {
    if (this.prefersReducedMotion()) {
      document.body.classList.add('reduced-motion');
    }
  }

  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Setup high contrast mode
   */
  setupHighContrast() {
    // Detect if user has high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.toggleHighContrast();
    }
  }

  /**
   * Toggle high contrast mode
   */
  toggleHighContrast() {
    this.highContrast = !this.highContrast;
    document.body.classList.toggle('high-contrast', this.highContrast);
    
    const button = document.getElementById('toggleHighContrast');
    if (button) {
      button.setAttribute('aria-pressed', this.highContrast.toString());
    }
    
    this.announce(`High contrast mode ${this.highContrast ? 'enabled' : 'disabled'}`);
  }

  /**
   * Increase font size
   */
  increaseFontSize() {
    const currentSize = document.body.style.fontSize || '100%';
    const currentValue = parseInt(currentSize) || 100;
    
    if (currentValue < 160) {
      const newSize = Math.min(currentValue + 20, 160);
      document.body.style.fontSize = `${newSize}%`;
      this.announce(`Font size increased to ${newSize}%`);
    } else {
      this.announce('Maximum font size reached');
    }
  }

  /**
   * Decrease font size
   */
  decreaseFontSize() {
    const currentSize = document.body.style.fontSize || '100%';
    const currentValue = parseInt(currentSize) || 100;
    
    if (currentValue > 80) {
      const newSize = Math.max(currentValue - 20, 80);
      document.body.style.fontSize = `${newSize}%`;
      this.announce(`Font size decreased to ${newSize}%`);
    } else {
      this.announce('Minimum font size reached');
    }
  }

  /**
   * Toggle reduced motion
   */
  toggleReducedMotion() {
    this.reducedMotion = !this.reducedMotion;
    document.body.classList.toggle('reduced-motion', this.reducedMotion);
    
    const button = document.getElementById('toggleReducedMotion');
    if (button) {
      button.setAttribute('aria-pressed', this.reducedMotion.toString());
    }
    
    this.announce(`Reduced motion ${this.reducedMotion ? 'enabled' : 'disabled'}`);
  }

  /**
   * Skip to main content
   */
  skipToContent() {
    const main = document.querySelector('main') || document.querySelector('#main') || document.querySelector('#analysis');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
      this.announce('Skipped to main content');
    }
  }

  /**
   * Show headings outline
   */
  showHeadings() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const outline = Array.from(headings).map((heading, index) => {
      return `${index + 1}. ${heading.tagName}: ${heading.textContent}`;
    }).join(', ');
    
    this.announce(`Page headings: ${outline}`);
  }

  /**
   * Announce message to screen readers
   */
  announce(message, priority = 'polite') {
    const regionId = priority === 'assertive' ? 'assertive-announcements' : 'polite-announcements';
    const region = document.getElementById(regionId);
    
    if (region) {
      region.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        region.textContent = '';
      }, 1000);
    }
  }

  /**
   * Get ARIA label from icon class
   */
  getAriaLabelFromIcon(iconClass) {
    const iconLabels = {
      'fa-upload': 'Upload file',
      'fa-download': 'Download',
      'fa-share': 'Share',
      'fa-times': 'Close',
      'fa-plus': 'Add',
      'fa-minus': 'Remove',
      'fa-play': 'Play',
      'fa-pause': 'Pause',
      'fa-stop': 'Stop',
      'fa-search': 'Search',
      'fa-filter': 'Filter',
      'fa-sort': 'Sort',
      'fa-edit': 'Edit',
      'fa-delete': 'Delete',
      'fa-save': 'Save',
      'fa-print': 'Print',
      'fa-email': 'Email',
      'fa-phone': 'Phone',
      'fa-home': 'Home',
      'fa-user': 'User',
      'fa-settings': 'Settings',
      'fa-help': 'Help',
      'fa-info': 'Information'
    };
    
    return iconLabels[iconClass] || 'Button';
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Scroll to section helper
   */
  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      section.focus();
    }
  }

  /**
   * Play demo functionality
   */
  playDemo() {
    this.showNotification('info', 'Demo Video', 'Demo video would play here. This is a placeholder in the demo version.');
  }

  /**
   * Open signup modal
   */
  openSignupModal() {
    // Create signup modal if it doesn't exist
    let signupModal = document.getElementById('signupModal');
    if (!signupModal) {
      this.createSignupModal();
      signupModal = document.getElementById('signupModal');
    }
    
    if (signupModal) {
      signupModal.classList.add('show');
      document.body.style.overflow = 'hidden';
      
      // Focus on first input
      const firstInput = signupModal.querySelector('input');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  }

  /**
   * Create signup modal
   */
  createSignupModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'signupModal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Sign Up</h3>
          <button class="modal-close" onclick="accessibilityManager.closeSignupModal()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form id="signupForm" class="form">
            <div class="form-group">
              <label for="signupName" class="form-label">Full Name</label>
              <input type="text" id="signupName" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="signupEmail" class="form-label">Email</label>
              <input type="email" id="signupEmail" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="signupPassword" class="form-label">Password</label>
              <input type="password" id="signupPassword" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="signupConfirmPassword" class="form-label">Confirm Password</label>
              <input type="password" id="signupConfirmPassword" class="form-input" required>
            </div>
            <div class="form-actions">
              <label class="checkbox">
                <input type="checkbox" id="agreeTerms" required>
                <span class="checkmark"></span>
                I agree to the Terms of Service
              </label>
            </div>
            <button type="submit" class="btn btn-primary btn-full">
              <i class="fas fa-user-plus"></i>
              Create Account
            </button>
          </form>
          <div class="form-footer">
            <p>Already have an account? <a href="#" class="link" onclick="accessibilityManager.switchToLogin()">Sign in</a></p>
          </div>
        </div>
      </div>
      <div class="modal-backdrop" onclick="accessibilityManager.closeSignupModal()"></div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup form submission
    const form = modal.querySelector('#signupForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSignup(e);
      });
    }
  }

  /**
   * Handle signup form submission
   */
  async handleSignup(e) {
    const formData = new FormData(e.target);
    const password = formData.get('signupPassword');
    const confirmPassword = formData.get('signupConfirmPassword');
    
    if (password !== confirmPassword) {
      this.showNotification('error', 'Password Mismatch', 'Passwords do not match. Please try again.');
      return;
    }
    
    try {
      // Simulate signup process
      this.showNotification('info', 'Creating Account', 'Processing your registration...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.closeSignupModal();
      this.showNotification('success', 'Account Created', 'Welcome! Your account has been created successfully.');
      
    } catch (error) {
      this.showNotification('error', 'Signup Failed', 'Unable to create account. Please try again.');
    }
  }

  /**
   * Close signup modal
   */
  closeSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  /**
   * Switch to login modal from signup
   */
  switchToLogin() {
    this.closeSignupModal();
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
      loginModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Export results functionality
   */
  exportResults() {
    // Create mock CSV data
    const csvData = this.generateExportData();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `deepfake_analysis_results_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    this.showNotification('success', 'Export Complete', 'Analysis results have been downloaded as CSV file.');
  }

  /**
   * Generate export data as CSV
   */
  generateExportData() {
    const headers = ['Filename', 'File Type', 'Prediction', 'Confidence', 'Facial Inconsistencies', 'Temporal Artifacts', 'Compression Anomalies', 'Processing Time', 'Timestamp'];
    
    // Get results from the app if available, or create sample data
    let results = [];
    if (window.app && window.app.analysisResults && window.app.analysisResults.length > 0) {
      results = window.app.analysisResults;
    } else {
      // Sample data for demo
      results = [
        {
          fileName: 'sample_image.jpg',
          fileType: 'image',
          result: {
            prediction: 'authentic',
            confidence: 0.943,
            evidence: {
              facial_inconsistencies: 0.12,
              temporal_artifacts: 0.08,
              compression_anomalies: 0.15
            },
            processing_time: 2.34
          },
          timestamp: new Date().toISOString()
        }
      ];
    }
    
    let csv = headers.join(',') + '\n';
    
    results.forEach(result => {
      const row = [
        `"${result.fileName}"`,
        result.fileType,
        result.result.prediction,
        (result.result.confidence * 100).toFixed(1) + '%',
        (result.result.evidence.facial_inconsistencies * 100).toFixed(1) + '%',
        (result.result.evidence.temporal_artifacts * 100).toFixed(1) + '%',
        (result.result.evidence.compression_anomalies * 100).toFixed(1) + '%',
        result.result.processing_time.toFixed(2) + 's',
        result.timestamp
      ];
      csv += row.join(',') + '\n';
    });
    
    return csv;
  }

  /**
   * Get social media platform name from link
   */
  getSocialPlatform(link) {
    const iconClass = link.querySelector('i').className;
    if (iconClass.includes('github')) return 'GitHub';
    if (iconClass.includes('twitter')) return 'Twitter';
    if (iconClass.includes('linkedin')) return 'LinkedIn';
    if (iconClass.includes('discord')) return 'Discord';
    return 'Social Media';
  }

  /**
   * Show notification helper (uses app notification system if available)
   */
  showNotification(type, title, message) {
    if (window.app && typeof window.app.showNotification === 'function') {
      window.app.showNotification(type, title, message);
    } else {
      // Fallback to console log
      console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
      // Create simple notification if app system not available
      this.createSimpleNotification(type, title, message);
    }
  }

  /**
   * Create simple notification fallback
   */
  createSimpleNotification(type, title, message) {
    const notification = document.createElement('div');
    notification.className = `simple-notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      z-index: 10000;
      max-width: 300px;
      animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 0.5rem;">${title}</div>
      <div style="font-size: 0.875rem; color: #666;">${message}</div>
      <button onclick="this.parentElement.remove()" style="position: absolute; top: 8px; right: 8px; background: none; border: none; font-size: 1.2rem; cursor: pointer;">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }
}

// Initialize accessibility manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.accessibilityManager = new AccessibilityManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityManager;
}