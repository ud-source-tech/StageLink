// Main application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize tooltips
    initTooltips();
    
    // Handle filter buttons
    initFilters();
    
    // Initialize booking functionality
    initBookingSystem();
    
    console.log('StageLink Platform Loaded');
});

function initAnimations() {
    // Add fade-in animation to cards on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
}

function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(el => {
        el.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.position = 'fixed';
            tooltip.style.top = (rect.top - 40) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2) + 'px';
            tooltip.style.transform = 'translateX(-50%)';
        });
        
        el.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // In a real app, this would filter results
            console.log('Filtering by:', this.dataset.filter);
        });
    });
}

function initBookingSystem() {
    const bookBtns = document.querySelectorAll('.book-btn');
    bookBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const creativeId = this.dataset.creativeId;
            const service = this.dataset.service;
            
            // Store booking info for the booking page
            localStorage.setItem('bookingCreativeId', creativeId);
            localStorage.setItem('bookingService', service);
            
            // Redirect to booking page
            window.location.href = 'booking.html';
        });
    });
}

// Theme management
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            const isDark = !document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
}

// Form validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}




// Authentication related functionality
class Auth {
    static async signup(userData) {
        // This would connect to your backend
        console.log('Signing up user:', userData);
        
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    user: {
                        id: Date.now(),
                        ...userData
                    }
                });
            }, 1000);
        });
    }
    
    static async login(email, password) {
        console.log('Logging in:', email);
        
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    user: {
                        id: 1,
                        email: email,
                        role: email.includes('creative') ? 'creative' : 'booker'
                    }
                });
            }, 1000);
        });
    }
    
    static logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    }
    
    static isAuthenticated() {
        return localStorage.getItem('user') !== null;
    }
    
    static getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            
            const result = await Auth.login(email, password);
            
            if (result.success) {
                localStorage.setItem('user', JSON.stringify(result.user));
                // Redirect based on role
                if (result.user.role === 'creative') {
                    window.location.href = 'dashboard-creative.html';
                } else {
                    window.location.href = 'dashboard-booker.html';
                }
            }
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: this.querySelector('input[name="name"]').value,
                email: this.querySelector('input[type="email"]').value,
                password: this.querySelector('input[type="password"]').value,
                role: this.querySelector('select[name="role"]').value
            };
            
            const result = await Auth.signup(formData);
            
            if (result.success) {
                localStorage.setItem('user', JSON.stringify(result.user));
                // Redirect based on role
                if (result.user.role === 'creative') {
                    window.location.href = 'dashboard-creative.html';
                } else {
                    window.location.href = 'dashboard-booker.html';
                }
            }
        });
    }
    
    // Check authentication on dashboard pages
    const dashboardPages = ['dashboard-creative.html', 'dashboard-booker.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (dashboardPages.includes(currentPage) && !Auth.isAuthenticated()) {
        window.location.href = 'login.html';
    }
});

// Booking system functionality
class BookingSystem {
    static creatives = [
        {
            id: 1,
            name: "DJ Nova",
            role: "DJ",
            genres: ["Afro", "EDM", "House"],
            location: "Lagos, Nigeria",
            rating: 4.9,
            reviews: 124,
            services: [
                { name: "Live Performance", price: "$500+", duration: "3 hours" },
                { name: "Virtual DJ Set", price: "$200", duration: "2 hours" }
            ],
            bio: "International DJ with 10+ years experience playing at major festivals worldwide."
        },
        {
            id: 2,
            name: "Alex Beats",
            role: "Producer",
            genres: ["Hip Hop", "R&B", "Pop"],
            location: "Los Angeles, USA",
            rating: 4.8,
            reviews: 89,
            services: [
                { name: "Beat Production", price: "$300/track", duration: "Custom" },
                { name: "Mixing & Mastering", price: "$150/song", duration: "48 hours" }
            ],
            bio: "Grammy-nominated producer with multiple platinum records."
        }
    ];
    
    static getCreativeById(id) {
        return this.creatives.find(c => c.id == id);
    }
    
    static async createBooking(bookingData) {
        console.log('Creating booking:', bookingData);
        
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    bookingId: 'BK' + Date.now(),
                    message: 'Booking request sent successfully!'
                });
            }, 1500);
        });
    }
    
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Initialize booking page
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const creativeId = localStorage.getItem('bookingCreativeId');
    
    if (bookingForm && creativeId) {
        const creative = BookingSystem.getCreativeById(creativeId);
        
        if (creative) {
            // Pre-fill creative info
            const creativeInfo = document.querySelector('.creative-info');
            if (creativeInfo) {
                creativeInfo.innerHTML = `
                    <h3>Booking ${creative.name}</h3>
                    <p>${creative.role} • ${creative.location}</p>
                `;
            }
            
            // Populate service options
            const serviceSelect = bookingForm.querySelector('select[name="service"]');
            if (serviceSelect && creative.services) {
                serviceSelect.innerHTML = creative.services.map(service => 
                    `<option value="${service.name}">${service.name} - ${service.price}</option>`
                ).join('');
            }
        }
        
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                creativeId: creativeId,
                service: this.querySelector('select[name="service"]').value,
                date: this.querySelector('input[name="date"]').value,
                budget: this.querySelector('input[name="budget"]').value,
                message: this.querySelector('textarea[name="message"]').value,
                location: this.querySelector('input[name="location"]').value
            };
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            const result = await BookingSystem.createBooking(formData);
            
            if (result.success) {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <h3>Booking Request Sent!</h3>
                    <p>${creative.name} will respond within 48 hours.</p>
                    <p>Booking ID: ${result.bookingId}</p>
                `;
                
                bookingForm.replaceWith(successMsg);
                
                // Store booking in local storage
                const userBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
                userBookings.push({
                    id: result.bookingId,
                    creative: creative.name,
                    service: formData.service,
                    date: formData.date,
                    status: 'pending'
                });
                localStorage.setItem('bookings', JSON.stringify(userBookings));
            } else {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                alert('Failed to create booking. Please try again.');
            }
        });
    }
    
    // Initialize date picker
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
});

// Theme Management System
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.init();
    }
    
    init() {
        // Check for saved theme preference or prefer-color-scheme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
            this.enableLightTheme();
        } else {
            this.enableDarkTheme();
        }
        
        // Add event listener to toggle button
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                e.matches ? this.enableDarkTheme() : this.enableLightTheme();
            }
        });
    }
    
    enableLightTheme() {
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
        this.updateMetaThemeColor('#ffffff');
    }
    
    enableDarkTheme() {
        document.body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
        this.updateMetaThemeColor('#121212');
    }
    
    toggleTheme() {
        if (document.body.classList.contains('light-theme')) {
            this.enableDarkTheme();
        } else {
            this.enableLightTheme();
        }
        
        // Add animation effect
        this.themeToggle.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.themeToggle.style.transform = '';
        }, 300);
    }
    
    updateMetaThemeColor(color) {
        // Update meta theme-color for mobile browsers
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = color;
    }
    
    getCurrentTheme() {
        return document.body.classList.contains('light-theme') ? 'light' : 'dark';
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    
    // Add theme transition to body
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Apply transition to all elements
    const style = document.createElement('style');
    style.textContent = `
        * {
            transition: background-color 0.3s ease, 
                       color 0.3s ease, 
                       border-color 0.3s ease,
                       box-shadow 0.3s ease !important;
        }
        .logo, .btn, .btn-outline {
            transition: all 0.3s ease !important;
        }
    `;
    document.head.appendChild(style);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}

// Theme initialization (if not using separate theme.js)
function initTheme() {
    // If theme.js is not loaded, add basic theme toggle
    if (!document.getElementById('themeToggle')) return;
    
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        document.body.classList.add('light-theme');
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        const isDark = !document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Add rotation effect
        this.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
    });
}

// Call initTheme in your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    initTheme();
    // ... existing code ...
});
// ===========================================
// THEME TOGGLE FUNCTIONALITY
// ===========================================
function initThemeToggle() {
    console.log("Initializing theme toggle...");
    
    // Create theme toggle button if it doesn't exist
    if (!document.getElementById('themeToggle')) {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.id = 'themeToggle';
        themeToggle.title = 'Toggle Dark/Light Mode';
        themeToggle.innerHTML = `
            <i class="fas fa-moon"></i>
            <i class="fas fa-sun"></i>
        `;
        
        // Add to navigation
        const nav = document.querySelector('.nav-links');
        if (nav) {
            nav.appendChild(themeToggle);
        }
    }
    
    // Get the toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) {
        console.error("Theme toggle button not found!");
        return;
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('stageLinkTheme');
    console.log("Saved theme:", savedTheme);
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log("System prefers dark:", prefersDark);
    
    // Set initial theme
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        console.log("Applied light theme from localStorage");
    } else if (savedTheme === 'dark') {
        document.body.classList.remove('light-theme');
        console.log("Applied dark theme from localStorage");
    } else if (!savedTheme && !prefersDark) {
        // No saved preference and system prefers light
        document.body.classList.add('light-theme');
        localStorage.setItem('stageLinkTheme', 'light');
        console.log("Applied light theme from system preference");
    } else {
        // Default to dark
        document.body.classList.remove('light-theme');
        localStorage.setItem('stageLinkTheme', 'dark');
        console.log("Applied dark theme as default");
    }
    
    // Add click event to toggle button
    themeToggle.addEventListener('click', function() {
        console.log("Theme toggle clicked!");
        
        // Toggle the class
        document.body.classList.toggle('light-theme');
        
        // Check current state
        const isLightTheme = document.body.classList.contains('light-theme');
        console.log("Is light theme now?", isLightTheme);
        
        // Save to localStorage
        localStorage.setItem('stageLinkTheme', isLightTheme ? 'light' : 'dark');
        
        // Add animation effect
        this.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
        
        // Force a redraw (sometimes needed for Safari)
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
    });
    
    console.log("Theme toggle initialized successfully");
}

// ===========================================
// ENHANCED TEST FUNCTION TO DEBUG THEME
// ===========================================
function testTheme() {
    console.log("=== THEME DEBUG INFO ===");
    console.log("Body classes:", document.body.className);
    console.log("Has light-theme class?", document.body.classList.contains('light-theme'));
    console.log("LocalStorage theme:", localStorage.getItem('stageLinkTheme'));
    console.log("System prefers dark:", window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Check if CSS is loaded
    const styles = document.styleSheets;
    console.log("Loaded stylesheets:", styles.length);
    
    // Try to force toggle for testing
    document.body.classList.toggle('light-theme');
    console.log("Toggled theme. Now has light-theme?", document.body.classList.contains('light-theme'));
    
    // Toggle back
    setTimeout(() => {
        document.body.classList.toggle('light-theme');
        console.log("Toggled back. Now has light-theme?", document.body.classList.contains('light-theme'));
    }, 1000);
}

// ===========================================
// UPDATE MAIN DOMCONTENTLOADED FUNCTION
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("StageLink Platform Loaded");
    
    // Initialize theme toggle FIRST
    initThemeToggle();
    
    // Then initialize other functions
    initAnimations();
    initTooltips();
    initFilters();
    initBookingSystem();
    
    // Optional: Add test button for debugging (remove in production)
    // Uncomment next line if you want a debug button
    // addDebugButton();
});

// ===========================================
// DEBUG FUNCTION (Optional - remove in production)
// ===========================================
function addDebugButton() {
    const debugBtn = document.createElement('button');
    debugBtn.textContent = 'Debug Theme';
    debugBtn.style.position = 'fixed';
    debugBtn.style.bottom = '20px';
    debugBtn.style.right = '20px';
    debugBtn.style.zIndex = '9999';
    debugBtn.style.padding = '10px';
    debugBtn.style.background = 'red';
    debugBtn.style.color = 'white';
    debugBtn.style.border = 'none';
    debugBtn.style.borderRadius = '5px';
    debugBtn.style.cursor = 'pointer';
    
    debugBtn.addEventListener('click', testTheme);
    document.body.appendChild(debugBtn);
}
// ===========================================
// MOBILE NAVIGATION FUNCTIONALITY
// ===========================================
function initMobileNavigation() {
    console.log("Initializing mobile navigation...");
    
    // Create mobile menu toggle button
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.id = 'mobileMenuToggle';
    menuToggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    // Create overlay for mobile menu
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    menuOverlay.id = 'mobileMenuOverlay';
    
    // Add elements to header
    const header = document.querySelector('.header');
    if (header) {
        // Insert menu toggle before nav links
        const nav = header.querySelector('.nav-links');
        if (nav) {
            header.insertBefore(menuToggle, nav);
            document.body.appendChild(menuOverlay);
        }
    }
    
    // Create sidebar toggle for dashboard pages
    if (document.querySelector('.sidebar')) {
        const sidebarToggle = document.createElement('button');
        sidebarToggle.className = 'sidebar-toggle';
        sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
        sidebarToggle.id = 'sidebarToggle';
        document.body.appendChild(sidebarToggle);
        
        sidebarToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close sidebar when clicking overlay
        menuOverlay.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }
    
    // Toggle mobile menu
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        document.querySelector('.nav-links').classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking overlay
    menuOverlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        document.querySelector('.nav-links').classList.remove('active');
        this.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
    
    // Close menu when clicking a link (for single page apps)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1024) {
                menuToggle.classList.remove('active');
                document.querySelector('.nav-links').classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            menuToggle.classList.remove('active');
            document.querySelector('.nav-links').classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Also close sidebar if open
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) sidebar.classList.remove('active');
        }
    });
    
    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 1024) {
            // Close mobile menu on desktop
            menuToggle.classList.remove('active');
            document.querySelector('.nav-links').classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Close sidebar on desktop
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) sidebar.classList.remove('active');
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    console.log("Mobile navigation initialized");
}

// ===========================================
// UPDATE MAIN INITIALIZATION
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("StageLink Platform Loaded");
    
    // Initialize theme toggle FIRST
    initThemeToggle();
    
    // Initialize mobile navigation SECOND
    initMobileNavigation();
    
    // Then initialize other functions
    initAnimations();
    initTooltips();
    initFilters();
    initBookingSystem();
});
// ===========================================
// MOBILE THEME TOGGLE FUNCTIONALITY
// ===========================================
function initMobileThemeToggle() {
    console.log("Initializing mobile theme toggle...");
    
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 1024;
    
    if (isMobile) {
        // Create floating theme toggle for mobile
        createFloatingThemeToggle();
        
        // Add theme indicator to mobile menu
        addThemeIndicatorToMenu();
        
        // Add theme toggle to mobile menu header
        addThemeToggleToMenuHeader();
    }
    
    // Update menu toggle with theme indicator
    updateMenuToggleWithTheme();
    
    // Listen for theme changes
    document.addEventListener('themeChanged', function(e) {
        updateThemeIndicators(e.detail.theme);
    });
}

function createFloatingThemeToggle() {
    // Check if floating toggle already exists
    if (document.getElementById('floatingThemeToggle')) return;
    
    const floatingToggle = document.createElement('button');
    floatingToggle.className = 'floating-theme-toggle';
    floatingToggle.id = 'floatingThemeToggle';
    floatingToggle.title = 'Toggle Dark/Light Mode';
    floatingToggle.innerHTML = '<i class="fas fa-palette"></i>';
    
    // Add to body
    document.body.appendChild(floatingToggle);
    
    // Add click event
    floatingToggle.addEventListener('click', function() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.click();
            
            // Add animation
            this.style.transform = 'rotate(180deg) scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
            
            // Update icon based on theme
            setTimeout(() => {
                const isLight = document.body.classList.contains('light-theme');
                this.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            }, 300);
        }
    });
    
    // Update initial icon
    const isLight = document.body.classList.contains('light-theme');
    floatingToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function addThemeIndicatorToMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    
    // Check if indicator already exists
    if (document.querySelector('.theme-indicator')) return;
    
    const themeIndicator = document.createElement('div');
    themeIndicator.className = 'theme-indicator';
    
    const isLight = document.body.classList.contains('light-theme');
    themeIndicator.innerHTML = `
        <i class="fas fa-${isLight ? 'sun' : 'moon'}"></i>
        <span>${isLight ? 'Light' : 'Dark'} Mode</span>
        <span style="margin-left: auto; font-size: 0.8rem;">Tap icon to toggle</span>
    `;
    
    // Insert before theme toggle in nav
    const themeToggle = navLinks.querySelector('.theme-toggle');
    if (themeToggle) {
        navLinks.insertBefore(themeIndicator, themeToggle);
    } else {
        navLinks.appendChild(themeIndicator);
    }
}

function addThemeToggleToMenuHeader() {
    // Add theme toggle to menu header (optional)
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.classList.add('with-theme');
    }
}

function updateMenuToggleWithTheme() {
    const menuToggle = document.querySelector('.menu-toggle');
    if (!menuToggle) return;
    
    // Update menu toggle indicator color based on theme
    const updateIndicator = () => {
        const isLight = document.body.classList.contains('light-theme');
        menuToggle.style.setProperty('--indicator-color', isLight ? 'var(--secondary)' : 'var(--primary)');
    };
    
    // Initial update
    updateIndicator();
    
    // Update when theme changes
    document.addEventListener('themeChanged', updateIndicator);
}

function updateThemeIndicators(theme) {
    const isLight = theme === 'light';
    
    // Update floating toggle icon
    const floatingToggle = document.getElementById('floatingThemeToggle');
    if (floatingToggle) {
        floatingToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    
    // Update menu indicator text
    const themeIndicator = document.querySelector('.theme-indicator');
    if (themeIndicator) {
        const icon = themeIndicator.querySelector('i');
        const text = themeIndicator.querySelector('span');
        
        if (icon) icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
        if (text) text.textContent = isLight ? 'Light Mode' : 'Dark Mode';
    }
    
    // Update menu toggle indicator
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle && menuToggle.classList.contains('with-theme')) {
        // Indicator color is handled by CSS, but we can add a class
        menuToggle.classList.toggle('light-theme-active', isLight);
    }
}

// ===========================================
// UPDATE EXISTING THEME TOGGLE FUNCTION
// ===========================================
function initThemeToggle() {
    console.log("Initializing theme toggle...");
    
    // Create theme toggle button if it doesn't exist
    if (!document.getElementById('themeToggle')) {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.id = 'themeToggle';
        themeToggle.title = 'Toggle Dark/Light Mode';
        themeToggle.innerHTML = `
            <i class="fas fa-moon"></i>
            <i class="fas fa-sun"></i>
        `;
        
        // Add to navigation
        const nav = document.querySelector('.nav-links');
        if (nav) {
            nav.appendChild(themeToggle);
        }
    }
    
    // Get the toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) {
        console.error("Theme toggle button not found!");
        return;
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('stageLinkTheme');
    console.log("Saved theme:", savedTheme);
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    } else if (savedTheme === 'dark') {
        document.body.classList.remove('light-theme');
    } else if (!savedTheme && !prefersDark) {
        document.body.classList.add('light-theme');
        localStorage.setItem('stageLinkTheme', 'light');
    } else {
        document.body.classList.remove('light-theme');
        localStorage.setItem('stageLinkTheme', 'dark');
    }
    
    // Dispatch initial theme event
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: currentTheme } }));
    
    // Add click event to toggle button
    themeToggle.addEventListener('click', function() {
        // Toggle the class
        document.body.classList.toggle('light-theme');
        
        // Check current state
        const isLightTheme = document.body.classList.contains('light-theme');
        
        // Save to localStorage
        localStorage.setItem('stageLinkTheme', isLightTheme ? 'light' : 'dark');
        
        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: isLightTheme ? 'light' : 'dark' } 
        }));
        
        // Add animation effect
        this.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
        
        // Force a redraw
        document.body.style.display = 'none';
        document.body.offsetHeight;
        document.body.style.display = '';
    });
    
    console.log("Theme toggle initialized successfully");
}

// ===========================================
// UPDATE MAIN INITIALIZATION
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("StageLink Platform Loaded");
    
    // Initialize theme toggle FIRST
    initThemeToggle();
    
    // Initialize mobile theme toggle SECOND
    initMobileThemeToggle();
    
    // Initialize mobile navigation THIRD
    initMobileNavigation();
    
    // Then initialize other functions
    initAnimations();
    initTooltips();
    initFilters();
    initBookingSystem();
});