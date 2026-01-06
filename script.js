// Main application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log("StageLink Platform Loaded");
    
    // Initialize theme system FIRST
    initThemeSystem();
    
    // Initialize mobile navigation SECOND
    initMobileNavigation();
    
    // Initialize mobile theme toggle THIRD
    if (window.innerWidth <= 1024) {
        initMobileThemeToggle();
    }
    
    // Initialize other functions
    initAnimations();
    initTooltips();
    initFilters();
    initBookingSystem();
    
    // Initialize auth forms if they exist
    initAuthForms();
    
    // Initialize booking page if it exists
    initBookingPage();
});

// ===========================================
// THEME SYSTEM
// ===========================================
function initThemeSystem() {
    console.log("Initializing theme system...");
    
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
    
    // Add click event to toggle button
    themeToggle.addEventListener('click', function() {
        // Toggle the class
        document.body.classList.toggle('light-theme');
        
        // Check current state
        const isLightTheme = document.body.classList.contains('light-theme');
        
        // Save to localStorage
        localStorage.setItem('stageLinkTheme', isLightTheme ? 'light' : 'dark');
        
        // Add animation effect
        this.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
    });
    
    console.log("Theme system initialized successfully");
}

// ===========================================
// MOBILE NAVIGATION
// ===========================================
function initMobileNavigation() {
    console.log("Initializing mobile navigation...");
    
    // Check if we're on mobile
    if (window.innerWidth > 1024) return;
    
    // Check if menu toggle already exists
    if (document.getElementById('mobileMenuToggle')) return;
    
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
        const nav = header.querySelector('.nav-links');
        if (nav) {
            header.insertBefore(menuToggle, nav);
            document.body.appendChild(menuOverlay);
        }
    }
    
    // Create sidebar toggle for dashboard pages
    if (document.querySelector('.sidebar') && !document.getElementById('sidebarToggle')) {
        const sidebarToggle = document.createElement('button');
        sidebarToggle.className = 'sidebar-toggle';
        sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
        sidebarToggle.id = 'sidebarToggle';
        document.body.appendChild(sidebarToggle);
        
        sidebarToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Toggle mobile menu
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        const nav = document.querySelector('.nav-links');
        if (nav) nav.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking overlay
    menuOverlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        const nav = document.querySelector('.nav-links');
        if (nav) nav.classList.remove('active');
        this.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1024) {
                menuToggle.classList.remove('active');
                const nav = document.querySelector('.nav-links');
                if (nav) nav.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            menuToggle.classList.remove('active');
            const nav = document.querySelector('.nav-links');
            if (nav) nav.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) sidebar.classList.remove('active');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            // Close mobile menu on desktop
            menuToggle.classList.remove('active');
            const nav = document.querySelector('.nav-links');
            if (nav) nav.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) sidebar.classList.remove('active');
        }
    });
    
    console.log("Mobile navigation initialized");
}

// ===========================================
// MOBILE THEME TOGGLE
// ===========================================
function initMobileThemeToggle() {
    console.log("Initializing mobile theme toggle...");
    
    // Create floating theme toggle for mobile
    if (!document.getElementById('floatingThemeToggle')) {
        const floatingToggle = document.createElement('button');
        floatingToggle.className = 'floating-theme-toggle';
        floatingToggle.id = 'floatingThemeToggle';
        floatingToggle.title = 'Toggle Dark/Light Mode';
        
        // Set initial icon
        const isLight = document.body.classList.contains('light-theme');
        floatingToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
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
                    
                    // Update icon
                    const isLightNow = document.body.classList.contains('light-theme');
                    this.innerHTML = isLightNow ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
                }, 300);
            }
        });
    }
    
    console.log("Mobile theme toggle initialized");
}

// ===========================================
// ANIMATIONS
// ===========================================
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

// ===========================================
// TOOLTIPS
// ===========================================
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

// ===========================================
// FILTERS
// ===========================================
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            console.log('Filtering by:', this.dataset.filter);
        });
    });
}

// ===========================================
// BOOKING SYSTEM
// ===========================================
function initBookingSystem() {
    const bookBtns = document.querySelectorAll('.book-btn');
    bookBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const creativeId = this.dataset.creativeId;
            const service = this.dataset.service;
            
            localStorage.setItem('bookingCreativeId', creativeId);
            localStorage.setItem('bookingService', service);
            
            window.location.href = 'booking.html';
        });
    });
}

// ===========================================
// AUTHENTICATION
// ===========================================
class Auth {
    static async signup(userData) {
        console.log('Signing up user:', userData);
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

function initAuthForms() {
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
}

// ===========================================
// BOOKING PAGE
// ===========================================
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
}

function initBookingPage() {
    const bookingForm = document.getElementById('bookingForm');
    const creativeId = localStorage.getItem('bookingCreativeId');
    
    if (bookingForm && creativeId) {
        const creative = BookingSystem.getCreativeById(creativeId);
        
        if (creative) {
            const creativeInfo = document.querySelector('.creative-info');
            if (creativeInfo) {
                creativeInfo.innerHTML = `
                    <h3>Booking ${creative.name}</h3>
                    <p>${creative.role} • ${creative.location}</p>
                `;
            }
            
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
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            const result = await BookingSystem.createBooking(formData);
            
            if (result.success) {
                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <h3>Booking Request Sent!</h3>
                    <p>${creative.name} will respond within 48 hours.</p>
                    <p>Booking ID: ${result.bookingId}</p>
                `;
                
                bookingForm.replaceWith(successMsg);
                
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
}

// ===========================================
// FORM VALIDATION
// ===========================================
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