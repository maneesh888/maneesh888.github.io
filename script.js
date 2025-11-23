// ===================================
// Theme Toggle (Light/Dark Mode)
// ===================================
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Get saved theme from localStorage or use system preference
function getSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return prefersDarkScheme.matches ? 'dark' : 'light';
}

// Set theme
function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Initialize theme on page load
setTheme(getSavedTheme());

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Listen for system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// ===================================
// Mobile Navigation Toggle
// ===================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger icon
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');

        // Reset hamburger icon
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ===================================
// Smooth Scrolling with Active Link Highlighting
// ===================================
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ===================================
// Navbar Background on Scroll
// ===================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// ===================================
// Intersection Observer for Fade-in Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and timeline items
const animatedElements = document.querySelectorAll(
    '.project-card, .timeline-item, .skill-category, .contact-card, .about-text'
);

animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(element);
});

// ===================================
// Typing Effect for Hero Title (Optional Enhancement)
// ===================================
function createTypingEffect() {
    const gradientText = document.querySelector('.gradient-text');
    if (!gradientText) return;

    const text = gradientText.textContent;
    gradientText.textContent = '';
    gradientText.style.borderRight = '2px solid var(--primary-color)';

    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            gradientText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            gradientText.style.borderRight = 'none';
        }
    };

    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
}

// Uncomment the line below to enable typing effect
// createTypingEffect();

// ===================================
// Stats Counter Animation
// ===================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const text = statNumber.textContent;

            if (text === '10+') {
                statNumber.textContent = '0+';
                animateCounter(statNumber, 10);
            } else if (text === '5') {
                statNumber.textContent = '0';
                const timer = setInterval(() => {
                    const current = parseInt(statNumber.textContent);
                    if (current >= 5) {
                        clearInterval(timer);
                    } else {
                        statNumber.textContent = current + 1;
                    }
                }, 300);
            }

            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// ===================================
// Copy Email to Clipboard
// ===================================
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

emailLinks.forEach(link => {
    // Add click handler to copy email
    link.addEventListener('click', (e) => {
        const email = link.href.replace('mailto:', '');

        // Try to copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(email).then(() => {
                // Show temporary tooltip
                showTooltip(link, 'Email copied!');
            }).catch(() => {
                // Fallback: just open email client
            });
        }
    });
});

function showTooltip(element, message) {
    const tooltip = document.createElement('div');
    tooltip.textContent = message;
    tooltip.style.cssText = `
        position: fixed;
        background: var(--success-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 600;
        z-index: 10000;
        pointer-events: none;
        animation: fadeInOut 2s ease-in-out;
    `;

    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.top = `${rect.top - 50}px`;
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;

    setTimeout(() => {
        tooltip.remove();
    }, 2000);
}

// Add fadeInOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(10px); }
        10% { opacity: 1; transform: translateY(0); }
        90% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);

// ===================================
// Add "Back to Top" Button
// ===================================
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '↑';
backToTopButton.setAttribute('aria-label', 'Back to top');
backToTopButton.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
`;

document.body.appendChild(backToTopButton);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.visibility = 'visible';
    } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.visibility = 'hidden';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

backToTopButton.addEventListener('mouseenter', () => {
    backToTopButton.style.transform = 'translateY(-5px)';
    backToTopButton.style.boxShadow = '0 6px 16px rgba(0, 122, 255, 0.4)';
});

backToTopButton.addEventListener('mouseleave', () => {
    backToTopButton.style.transform = 'translateY(0)';
    backToTopButton.style.boxShadow = '0 4px 12px rgba(0, 122, 255, 0.3)';
});

// ===================================
// Keyboard Navigation Enhancement
// ===================================
document.addEventListener('keydown', (e) => {
    // Press 'Escape' to close mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');

        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// ===================================
// Lazy Loading for Better Performance
// ===================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===================================
// Console Message (Easter Egg)
// ===================================
console.log('%c👋 Hello there!', 'font-size: 24px; font-weight: bold; color: #007AFF;');
console.log('%cInterested in the code? Check out the repository!', 'font-size: 14px; color: #666;');
console.log('%c🚀 Built with vanilla HTML, CSS, and JavaScript', 'font-size: 12px; color: #999;');

// ===================================
// Page Load Performance
// ===================================
window.addEventListener('load', () => {
    // Remove any loading classes or spinners
    document.body.classList.add('loaded');

    // Log performance metrics (for development)
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    }
});

// ===================================
// Swipe Demo - Expense Tracker
// ===================================

// Category icons mapping
const categoryIcons = {
    'Food': '🍔',
    'Transport': '🚗',
    'Shopping': '🛒',
    'Entertainment': '🎬',
    'Bills': '📄',
    'Health': '🏥',
    'Travel': '✈️',
    'Other': '📦'
};

// Sample expense data
let expenses = [
    { id: 1, description: 'Coffee & Breakfast', amount: 12.50, currency: 'USD', category: 'Food' },
    { id: 2, description: 'Uber to Office', amount: 25.00, currency: 'AED', category: 'Transport' },
    { id: 3, description: 'Netflix Subscription', amount: 15.99, currency: 'USD', category: 'Entertainment' },
    { id: 4, description: 'Grocery Shopping', amount: 85.75, currency: 'EUR', category: 'Shopping' }
];

let nextId = 5;
let editingExpenseId = null;
let deletingExpenseId = null;

// DOM Elements
const expenseList = document.getElementById('expenseList');
const editModalOverlay = document.getElementById('editModalOverlay');
const deleteModalOverlay = document.getElementById('deleteModalOverlay');
const modalTitle = document.getElementById('modalTitle');
const expenseDescription = document.getElementById('expenseDescription');
const expenseAmount = document.getElementById('expenseAmount');
const addExpenseBtn = document.getElementById('addExpenseBtn');

// Initialize the demo
function initSwipeDemo() {
    if (!expenseList) return;

    renderExpenses();
    setupModalEvents();
    setupDropdowns();
}

// Render all expenses
function renderExpenses() {
    expenseList.innerHTML = '';
    expenses.forEach((expense, index) => {
        const wrapper = createExpenseElement(expense, index === 0);
        expenseList.appendChild(wrapper);
    });
}

// Create expense element with swipe functionality
function createExpenseElement(expense, isFirst = false) {
    const wrapper = document.createElement('div');
    wrapper.className = 'expense-item-wrapper';
    wrapper.dataset.id = expense.id;

    wrapper.innerHTML = `
        <div class="expense-item-actions edit-action">✏️ Edit</div>
        <div class="expense-item-actions delete-action">🗑️ Delete</div>
        <div class="expense-item ${isFirst ? 'swipe-hint' : ''}" data-id="${expense.id}">
            <div class="expense-info">
                <div class="expense-category-icon">${categoryIcons[expense.category] || '📦'}</div>
                <div class="expense-details">
                    <span class="expense-description">${expense.description}</span>
                    <span class="expense-category">${expense.category}</span>
                </div>
            </div>
            <div class="expense-amount-wrapper">
                <span class="expense-amount">${formatAmount(expense.amount)}</span>
                <span class="expense-currency">${expense.currency}</span>
            </div>
        </div>
    `;

    const item = wrapper.querySelector('.expense-item');
    setupSwipeGesture(item, wrapper);

    // Remove hint animation after first interaction
    if (isFirst) {
        item.addEventListener('mousedown', () => item.classList.remove('swipe-hint'), { once: true });
        item.addEventListener('touchstart', () => item.classList.remove('swipe-hint'), { once: true });
    }

    return wrapper;
}

// Format amount with commas
function formatAmount(amount) {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Setup swipe gesture for an item
function setupSwipeGesture(item, wrapper) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    const threshold = 80;
    const maxSwipe = 100;

    // Touch events
    item.addEventListener('touchstart', handleStart, { passive: true });
    item.addEventListener('touchmove', handleMove, { passive: false });
    item.addEventListener('touchend', handleEnd);

    // Mouse events
    item.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseEnd);

    function handleStart(e) {
        if (e.type === 'mousedown' && e.button !== 0) return;

        isDragging = true;
        startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        item.classList.add('swiping');
        item.classList.remove('swiped-left', 'swiped-right');
    }

    function handleMove(e) {
        if (!isDragging) return;

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        currentX = clientX - startX;

        // Limit swipe distance
        currentX = Math.max(-maxSwipe, Math.min(maxSwipe, currentX));

        item.style.transform = `translateX(${currentX}px)`;

        // Prevent scrolling while swiping horizontally
        if (Math.abs(currentX) > 10) {
            e.preventDefault();
        }
    }

    function handleMouseMove(e) {
        if (!isDragging || !item.classList.contains('swiping')) return;
        handleMove(e);
    }

    function handleEnd() {
        if (!isDragging) return;

        isDragging = false;
        item.classList.remove('swiping');
        item.style.transform = '';

        const expenseId = parseInt(wrapper.dataset.id);

        if (currentX > threshold) {
            // Swipe right - Edit
            item.classList.add('swiped-right');
            setTimeout(() => {
                item.classList.remove('swiped-right');
                openEditModal(expenseId);
            }, 200);
        } else if (currentX < -threshold) {
            // Swipe left - Delete
            item.classList.add('swiped-left');
            setTimeout(() => {
                item.classList.remove('swiped-left');
                openDeleteModal(expenseId);
            }, 200);
        }

        currentX = 0;
    }

    function handleMouseEnd() {
        if (isDragging && item.classList.contains('swiping')) {
            handleEnd();
        }
    }
}

// Setup modal events
function setupModalEvents() {
    // Edit modal
    document.getElementById('modalCloseBtn')?.addEventListener('click', closeEditModal);
    document.getElementById('modalCancelBtn')?.addEventListener('click', closeEditModal);
    document.getElementById('modalSaveBtn')?.addEventListener('click', saveExpense);
    editModalOverlay?.addEventListener('click', (e) => {
        if (e.target === editModalOverlay) closeEditModal();
    });

    // Delete modal
    document.getElementById('deleteCancelBtn')?.addEventListener('click', closeDeleteModal);
    document.getElementById('deleteConfirmBtn')?.addEventListener('click', confirmDelete);
    deleteModalOverlay?.addEventListener('click', (e) => {
        if (e.target === deleteModalOverlay) closeDeleteModal();
    });

    // Add expense button
    addExpenseBtn?.addEventListener('click', () => {
        editingExpenseId = null;
        modalTitle.textContent = 'Add New Expense';
        expenseDescription.value = '';
        expenseAmount.value = '';
        setDropdownValue('currencyDropdown', 'USD');
        setDropdownValue('categoryDropdown', 'Food');
        openEditModal();
    });

    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeEditModal();
            closeDeleteModal();
        }
    });
}

// Setup custom dropdowns
function setupDropdowns() {
    const dropdowns = document.querySelectorAll('.custom-dropdown');

    dropdowns.forEach(dropdown => {
        const selected = dropdown.querySelector('.dropdown-selected');
        const options = dropdown.querySelectorAll('.dropdown-option');

        // Toggle dropdown on click
        selected?.addEventListener('click', (e) => {
            e.stopPropagation();

            // Close other dropdowns
            dropdowns.forEach(d => {
                if (d !== dropdown) d.classList.remove('open');
            });

            dropdown.classList.toggle('open');
        });

        // Select option
        options.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                const valueDisplay = dropdown.querySelector('.dropdown-value');

                // Update selected value
                valueDisplay.textContent = value;

                // Update selected state
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                // Close dropdown
                dropdown.classList.remove('open');
            });
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        dropdowns.forEach(d => d.classList.remove('open'));
    });
}

// Set dropdown value
function setDropdownValue(dropdownId, value) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;

    const valueDisplay = dropdown.querySelector('.dropdown-value');
    const options = dropdown.querySelectorAll('.dropdown-option');

    valueDisplay.textContent = value;

    options.forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.value === value);
    });
}

// Get dropdown value
function getDropdownValue(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return '';

    return dropdown.querySelector('.dropdown-value').textContent;
}

// Open edit modal
function openEditModal(expenseId = null) {
    if (expenseId) {
        editingExpenseId = expenseId;
        const expense = expenses.find(e => e.id === expenseId);

        if (expense) {
            modalTitle.textContent = 'Edit Expense';
            expenseDescription.value = expense.description;
            expenseAmount.value = expense.amount;
            setDropdownValue('currencyDropdown', expense.currency);
            setDropdownValue('categoryDropdown', expense.category);
        }
    }

    editModalOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus on description input
    setTimeout(() => expenseDescription?.focus(), 300);
}

// Close edit modal
function closeEditModal() {
    editModalOverlay?.classList.remove('active');
    document.body.style.overflow = '';
    editingExpenseId = null;

    // Close any open dropdowns
    document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));
}

// Save expense
function saveExpense() {
    const description = expenseDescription.value.trim();
    const amount = parseFloat(expenseAmount.value);
    const currency = getDropdownValue('currencyDropdown');
    const category = getDropdownValue('categoryDropdown');

    if (!description) {
        expenseDescription.focus();
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        expenseAmount.focus();
        return;
    }

    if (editingExpenseId) {
        // Update existing expense
        const expense = expenses.find(e => e.id === editingExpenseId);
        if (expense) {
            expense.description = description;
            expense.amount = amount;
            expense.currency = currency;
            expense.category = category;
        }
    } else {
        // Add new expense
        expenses.unshift({
            id: nextId++,
            description,
            amount,
            currency,
            category
        });
    }

    renderExpenses();
    closeEditModal();

    // Show success toast
    showToast(editingExpenseId ? 'Expense updated!' : 'Expense added!');
}

// Open delete modal
function openDeleteModal(expenseId) {
    deletingExpenseId = expenseId;
    deleteModalOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close delete modal
function closeDeleteModal() {
    deleteModalOverlay?.classList.remove('active');
    document.body.style.overflow = '';
    deletingExpenseId = null;
}

// Confirm delete
function confirmDelete() {
    if (deletingExpenseId) {
        expenses = expenses.filter(e => e.id !== deletingExpenseId);
        renderExpenses();
        showToast('Expense deleted!');
    }
    closeDeleteModal();
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: var(--success-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10001;
        animation: fadeInOut 2s ease-in-out;
        box-shadow: 0 4px 20px rgba(52, 199, 89, 0.3);
    `;

    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2000);
}

// Initialize swipe demo when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwipeDemo);
} else {
    initSwipeDemo();
}
