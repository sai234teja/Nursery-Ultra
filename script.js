document.addEventListener('DOMContentLoaded', () => {
    // Ultra: Fullscreen Menu Logic
    const openMenuBtn = document.getElementById('openMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const fullscreenMenu = document.getElementById('fullscreenMenu');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (openMenuBtn && fullscreenMenu) {
        openMenuBtn.addEventListener('click', () => {
            fullscreenMenu.classList.add('active');
        });
        
        closeMenuBtn.addEventListener('click', () => {
            fullscreenMenu.classList.remove('active');
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                fullscreenMenu.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active Nav Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.btn)');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => navObserver.observe(section));

    // Booking Modal Logic
    const bookingModal = document.getElementById('bookingModal');
    const bookConsultBtn = document.getElementById('bookConsultBtn');
    const closeBookingModal = document.getElementById('closeBookingModal');

    if (bookConsultBtn && bookingModal && closeBookingModal) {
        bookConsultBtn.addEventListener('click', (e) => {
            e.preventDefault();
            bookingModal.classList.add('active');
        });

        closeBookingModal.addEventListener('click', () => {
            bookingModal.classList.remove('active');
        });

        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) bookingModal.classList.remove('active');
        });
    }

    // Catalog Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const catalogCards = document.querySelectorAll('.catalog-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');

            let visibleIndex = 0;
            catalogCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                if (filterValue === 'all' || (categories && categories.includes(filterValue))) {
                    card.style.display = 'block';
                    // Re-trigger GSAP on filter if necessary, but basic display block is fine for commerce
                    gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, delay: visibleIndex * 0.1 });
                    visibleIndex++;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// ==========================================
// PREMIUM UI ADDITIONS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. Page Load Transition (Primary)
    window.addEventListener('load', () => {
        document.body.classList.remove('page-fade-in');
        
        // GSAP Hero Animations
        if (typeof gsap !== 'undefined') {
            gsap.from('.hero-text-backdrop', { opacity: 0, y: 50, duration: 1, ease: 'power3.out' });
        }
    });

    // 2. Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (window.scrollY / scrollTotal) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });
    }

    // 3. Button Ripple Effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple');
            
            this.appendChild(ripples);
            setTimeout(() => {
                ripples.remove();
            }, 400); // matches CSS animation duration
        });
    });

    // 4. Lightbox Gallery
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryImgs = document.querySelectorAll('.gallery-img');

    if (lightbox && lightboxImg && galleryImgs.length > 0) {
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            setTimeout(() => { lightboxImg.src = ''; }, 300); // clear after fade
        };

        galleryImgs.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                lightbox.setAttribute('aria-hidden', 'false');
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // 6. Number Counters (Stats) - Reliable Vanilla JS
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    if (counters.length > 0) {
        const animateCounters = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        const inc = target / speed;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 20);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        };

        const counterObserver = new IntersectionObserver(animateCounters, {
            threshold: 0.2
        });

        counters.forEach(counter => {
            counter.innerText = '0'; // reset
            counterObserver.observe(counter);
        });
    }
});

    // 7. Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    // 8. Form Submission Polish & EmailJS Integration
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            
            btn.classList.add('sending');
            btn.innerText = 'Sending...';
            
            // EmailJS integration (mock keys)
            if (typeof emailjs !== 'undefined') {
                emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm)
                    .then(() => {
                        btn.classList.remove('sending');
                        btn.innerText = 'Sent Successfully!';
                        contactForm.reset();
                        setTimeout(() => btn.innerText = originalText, 3000);
                    }, (error) => {
                        console.error('EmailJS Error:', error);
                        btn.classList.remove('sending');
                        btn.innerText = 'Error Sending';
                        setTimeout(() => btn.innerText = originalText, 3000);
                    });
            } else {
                setTimeout(() => {
                    btn.classList.remove('sending');
                    btn.innerText = originalText;
                    alert('Message sent (Mock)!');
                    contactForm.reset();
                }, 800);
            }
        });
    }

    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.removeAttribute('onsubmit');
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.classList.add('sending');
            btn.innerText = 'Subscribing...';
            
            setTimeout(() => {
                btn.classList.remove('sending');
                btn.innerText = originalText;
                alert('Subscribed successfully!');
                newsletterForm.reset();
            }, 800);
        });
    }


/* =========================================
   E-COMMERCE & DEMO FLOW STATE
   ========================================= */
let cart = [];
const DELIVERY_FEE = 149;

// DOM Elements
const openCartBtn = document.getElementById('openCartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartPanel = document.getElementById('cartPanel');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartSubtotalValue = document.getElementById('cartSubtotalValue');
const cartBadge = document.getElementById('cartBadge');
const checkoutBtn = document.getElementById('checkoutBtn');

const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutModal = document.getElementById('closeCheckoutModal');
const checkoutSummaryList = document.getElementById('checkoutSummaryList');
const chkSubtotal = document.getElementById('chkSubtotal');
const chkGrandTotal = document.getElementById('chkGrandTotal');

const successModal = document.getElementById('successModal');
const closeSuccessModal = document.getElementById('closeSuccessModal');
const successDoneBtn = document.getElementById('successDoneBtn');

// 1. CART LOGIC
function updateCartUI() {
    let subtotal = 0;
    let totalItems = 0;
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty</div>';
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            totalItems += item.quantity;
            
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                    <div class="cart-item-actions">
                        <div class="qty-control">
                            <button class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }
    
    cartSubtotalValue.textContent = `₹${subtotal.toLocaleString()}`;
    cartBadge.textContent = totalItems;
    
    // Bounce animation for badge
    cartBadge.style.transform = 'scale(1.2)';
    setTimeout(() => cartBadge.style.transform = 'scale(1)', 200);
}

window.updateQty = (id, change) => {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartUI();
        }
    }
};

window.removeFromCart = (id) => {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
};

document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const price = parseInt(btn.getAttribute('data-price'), 10);
        const image = btn.getAttribute('data-image');
        
        const existing = cart.find(i => i.id === id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id, name, price, image, quantity: 1 });
        }
        
        updateCartUI();
        cartOverlay.classList.add('active');
        cartPanel.classList.add('active');
    });
});

// Slide-in Cart Toggles
if (openCartBtn) openCartBtn.addEventListener('click', (e) => { e.preventDefault(); cartOverlay.classList.add('active'); cartPanel.classList.add('active'); });
if (closeCartBtn) closeCartBtn.addEventListener('click', () => { cartOverlay.classList.remove('active'); cartPanel.classList.remove('active'); });
if (cartOverlay) cartOverlay.addEventListener('click', () => { cartOverlay.classList.remove('active'); cartPanel.classList.remove('active'); });

// 2. CHECKOUT LOGIC
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        cartOverlay.classList.remove('active');
        cartPanel.classList.remove('active');
        checkoutModal.classList.add('active');
        
        // Reset to step 1
        document.querySelectorAll('.checkout-step').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.progress-step').forEach(el => el.classList.remove('active'));
        document.getElementById('step1').classList.add('active');
        document.getElementById('pstep1').classList.add('active');
        
        // Populate Summary
        checkoutSummaryList.innerHTML = '';
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            checkoutSummaryList.innerHTML += `<div class="checkout-summary-item"><span>${item.quantity}x ${item.name}</span><span>₹${(item.price * item.quantity).toLocaleString()}</span></div>`;
        });
        chkSubtotal.textContent = `₹${subtotal.toLocaleString()}`;
        chkGrandTotal.textContent = `₹${(subtotal + DELIVERY_FEE).toLocaleString()}`;
    });
}

if (closeCheckoutModal) closeCheckoutModal.addEventListener('click', () => checkoutModal.classList.remove('active'));

document.querySelectorAll('.next-step-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const currentStep = e.target.closest('.checkout-step');
        
        // Strict validation for Step 1
        if (currentStep.id === 'step1') {
            const inputs = currentStep.querySelectorAll('input, textarea');
            let valid = true;
            let errorMessage = '';
            
            for (let input of inputs) {
                input.style.borderColor = ''; // reset
                
                if (!input.value.trim()) {
                    valid = false;
                    input.style.borderColor = 'red';
                    errorMessage = 'Please fill all required fields.';
                    break;
                }
                
                if (input.id === 'chkName' && !/^[A-Za-z\s]{3,50}$/.test(input.value)) {
                    valid = false;
                    input.style.borderColor = 'red';
                    errorMessage = 'Please enter a valid name (letters only, min 3 chars).';
                    break;
                }
                
                if (input.id === 'chkAddress' && input.value.trim().length < 10) {
                    valid = false;
                    input.style.borderColor = 'red';
                    errorMessage = 'Please enter a complete delivery address (min 10 chars).';
                    break;
                }
                
                if (input.type === 'email' && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input.value)) {
                    valid = false;
                    input.style.borderColor = 'red';
                    errorMessage = 'Please enter a valid email address.';
                    break;
                }
                
                if (input.type === 'tel' && !/^\d{10}$/.test(input.value.replace(/[\s\-\+]/g, ''))) {
                    valid = false;
                    input.style.borderColor = 'red';
                    errorMessage = 'Please enter a valid phone number.';
                    break;
                }
            }
            
            if (!valid) {
                alert(errorMessage);
                return; // Stop here, do not go to next step
            }
        }

        const nextId = btn.getAttribute('data-next');
        currentStep.classList.remove('active');
        document.getElementById(nextId).classList.add('active');
        
        document.getElementById('p' + nextId).classList.add('active');
    });
});

document.querySelectorAll('.prev-step-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const currentStep = e.target.closest('.checkout-step');
        const prevId = btn.getAttribute('data-prev');
        currentStep.classList.remove('active');
        document.getElementById(prevId).classList.add('active');
        
        document.getElementById('p' + currentStep.id).classList.remove('active');
    });
});

// Fake Payment Toggle
document.querySelectorAll('input[name="payMethod"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        document.getElementById('fakeCardFields').style.display = e.target.value === 'card' ? 'block' : 'none';
    });
});

document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    checkoutModal.classList.remove('active');
    
    // Calculate delivery date (today + 3 days)
    const d = new Date();
    d.setDate(d.getDate() + 3);
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
    document.getElementById('successTitle').textContent = 'Order Placed!';
    document.getElementById('successOrderId').textContent = 'LR-' + Math.floor(10000 + Math.random() * 90000);
    document.getElementById('successDetails').innerHTML = `
        <strong>Delivery Estimate:</strong><br>${dateStr}<br><br>
        <strong>Items:</strong> ${cart.reduce((a,b)=>a+b.quantity, 0)}<br>
        <strong>Total Paid:</strong> ${chkGrandTotal.textContent}
    `;

      lastOrderData = {
          orderId: document.getElementById('successOrderId').textContent,
          name: document.getElementById('chkName').value,
          address: document.getElementById('chkAddress').value,
          items: [...cart], // clone cart before it gets cleared
          subtotal: chkSubtotal.textContent,
          total: chkGrandTotal.textContent,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      };
      
      let history = JSON.parse(localStorage.getItem('nurseryOrderHistory') || '[]');
      history.push(lastOrderData);
      localStorage.setItem('nurseryOrderHistory', JSON.stringify(history));

      successModal.classList.add('active');

      // Clear cart
      cart = [];
    updateCartUI();
});

// Success Modal Logic
if (closeSuccessModal) closeSuccessModal.addEventListener('click', () => successModal.classList.remove('active'));
if (successDoneBtn) successDoneBtn.addEventListener('click', () => successModal.classList.remove('active'));


// 3. BOOKING CUSTOM DATE PICKER
const datePickerGrid = document.getElementById('customDatePicker');
const bookDateHidden = document.getElementById('bookDateHidden');

if (datePickerGrid) {
    const today = new Date();
    const todayDateOnly = new Date(today);
    todayDateOnly.setHours(0,0,0,0);
    
    let currentDisplayedMonth = today.getMonth();
    let currentDisplayedYear = today.getFullYear();
    
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const currentMonthYearDisplay = document.getElementById('currentMonthYearDisplay');

    function renderCalendar(month, year) {
        datePickerGrid.innerHTML = '';
        
        // Update display
        const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
        if(currentMonthYearDisplay) currentMonthYearDisplay.textContent = `${monthName} ${year}`;
        
        // Disable prev button if it's the current month/year
        if(prevMonthBtn) {
            if (year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth())) {
                prevMonthBtn.disabled = true;
                prevMonthBtn.style.opacity = '0.3';
                prevMonthBtn.style.cursor = 'not-allowed';
            } else {
                prevMonthBtn.disabled = false;
                prevMonthBtn.style.opacity = '1';
                prevMonthBtn.style.cursor = 'pointer';
            }
        }
        
        // Days headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(d => {
            const header = document.createElement('div');
            header.className = 'date-header';
            header.textContent = d;
            datePickerGrid.appendChild(header);
        });
        
        const firstDay = new Date(year, month, 1);
        let startOffset = firstDay.getDay();
        
        // Fill empty cells
        for(let i=0; i<startOffset; i++) {
            const empty = document.createElement('div');
            datePickerGrid.appendChild(empty);
        }
        
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        for(let i=1; i<=daysInMonth; i++) {
            const current = new Date(year, month, i);
            const cell = document.createElement('div');
            cell.className = 'date-cell';
            cell.textContent = i;
            
            const isPast = current < todayDateOnly;
            const isDisabled = isPast || (!isPast && current.getDate() !== today.getDate() && current.getMonth() === today.getMonth() && Math.random() < 0.2);
            
            if (isDisabled) {
                cell.classList.add('disabled');
                cell.title = isPast ? 'Past Date' : 'Fully Booked';
            } else {
                cell.addEventListener('click', () => {
                    document.querySelectorAll('.date-cell').forEach(c => c.classList.remove('selected'));
                    cell.classList.add('selected');
                    bookDateHidden.value = current.toISOString();
                });
            }
            
            datePickerGrid.appendChild(cell);
        }
    }
    
    if(prevMonthBtn) {
        prevMonthBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(!prevMonthBtn.disabled) {
                currentDisplayedMonth--;
                if(currentDisplayedMonth < 0) {
                    currentDisplayedMonth = 11;
                    currentDisplayedYear--;
                }
                renderCalendar(currentDisplayedMonth, currentDisplayedYear);
            }
        });
    }
    
    if(nextMonthBtn) {
        nextMonthBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentDisplayedMonth++;
            if(currentDisplayedMonth > 11) {
                currentDisplayedMonth = 0;
                currentDisplayedYear++;
            }
            renderCalendar(currentDisplayedMonth, currentDisplayedYear);
        });
    }

    renderCalendar(currentDisplayedMonth, currentDisplayedYear);
}

// Override existing booking form submit
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    // Remove the inline onsubmit attribute if it exists
    bookingForm.removeAttribute('onsubmit');
    
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!bookDateHidden.value) {
            alert('Please select a preferred date from the calendar.');
            return;
        }
        
        document.getElementById('bookingModal').classList.remove('active');
        
        const d = new Date(bookDateHidden.value);
        const dateStr = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        const timeSlot = document.getElementById('bookTimeSlot').value;
        const service = document.getElementById('bookService').value;
        
        document.getElementById('successTitle').textContent = 'Consultation Booked!';
        document.getElementById('successOrderId').textContent = 'BK-' + Math.floor(1000 + Math.random() * 9000);
        document.getElementById('successDetails').innerHTML = `
            <strong>Date:</strong> ${dateStr}<br>
            <strong>Time:</strong> ${timeSlot}<br>
            <strong>Service:</strong> ${service}<br><br>
            <em>Our experts will call you shortly to confirm the details.</em>
        `;
        
        // Optional: Also send via EmailJS for booking
        if (typeof emailjs !== 'undefined') {
            emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_BOOKING_TEMPLATE_ID', bookingForm)
                .catch(err => console.error("EmailJS Booking Error:", err));
        }

        successModal.classList.add('active');
        bookingForm.reset();
        document.querySelectorAll('.date-cell').forEach(c => c.classList.remove('selected'));
        bookDateHidden.value = '';
    });
}

/* =========================================
   PHASE 2: INVOICE & TRACKING LOGIC
   ========================================= */

let lastOrderData = null;

// Handle "Buy Now"
document.querySelectorAll('.buy-now-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const price = parseInt(btn.getAttribute('data-price'), 10);
        const image = btn.getAttribute('data-image');
        
        // Clear cart and add this item
        cart = [{ id, name, price, image, quantity: 1 }];
        updateCartUI();
        
        // Open checkout directly
        checkoutModal.classList.add('active');
        document.querySelectorAll('.checkout-step').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.progress-step').forEach(el => el.classList.remove('active'));
        document.getElementById('step1').classList.add('active');
        document.getElementById('pstep1').classList.add('active');
        
        checkoutSummaryList.innerHTML = `<div class="checkout-summary-item"><span>1x ${name}</span><span>₹${price.toLocaleString()}</span></div>`;
        chkSubtotal.textContent = `₹${price.toLocaleString()}`;
        chkGrandTotal.textContent = `₹${(price + DELIVERY_FEE).toLocaleString()}`;
    });
});



// Invoice Logic
const invoiceModal = document.getElementById('invoiceModal');
const closeInvoiceModal = document.getElementById('closeInvoiceModal');
const downloadInvoiceBtn = document.getElementById('downloadInvoiceBtn');

if (downloadInvoiceBtn) {
    downloadInvoiceBtn.addEventListener('click', () => {
        if (!lastOrderData) return;
        
        // Populate Invoice
        document.getElementById('invOrderId').textContent = lastOrderData.orderId;
        document.getElementById('invDate').textContent = lastOrderData.date;
        document.getElementById('invName').textContent = lastOrderData.name;
        document.getElementById('invAddress').textContent = lastOrderData.address;
        
        const invItems = document.getElementById('invItems');
        invItems.innerHTML = '';
        lastOrderData.items.forEach(item => {
            invItems.innerHTML += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px 0;">${item.name}</td>
                    <td style="padding: 10px 0; text-align: center;">${item.quantity}</td>
                    <td style="padding: 10px 0; text-align: right;">₹${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
            `;
        });
        
        document.getElementById('invSubtotal').textContent = lastOrderData.subtotal;
        document.getElementById('invTotal').textContent = lastOrderData.total;
        
        // Show Invoice
        successModal.classList.remove('active');
        invoiceModal.classList.add('active');
    });
}

if (closeInvoiceModal) closeInvoiceModal.addEventListener('click', () => invoiceModal.classList.remove('active'));

// Tracking Logic
const trackingModal = document.getElementById('trackingModal');
const closeTrackingModal = document.getElementById('closeTrackingModal');
const trackDeliveryBtn = document.getElementById('trackDeliveryBtn');


let currentTrackStep = 1;

if (trackDeliveryBtn) {
    trackDeliveryBtn.addEventListener('click', () => {
        if (lastOrderData) {
            document.getElementById('trackOrderId').textContent = lastOrderData.orderId;
            document.getElementById('trackDeliveryDate').textContent = "Arriving " + lastOrderData.date;
        }
        
        // Reset state
        currentTrackStep = 1;
        document.getElementById('liveVehicle').className = 'live-marker pos-1';
        
        // Reset UI steps
        for(let i=1; i<=4; i++) {
            const step = document.getElementById('trackStep' + i);
            if(step) {
                if(i === 1) {
                    step.classList.add('active');
                    step.querySelector('.step-icon').textContent = '✓';
                } else {
                    step.classList.remove('active');
                    step.querySelector('.step-icon').textContent = '';
                }
            }
            const line = document.getElementById('trackLine' + i);
            if(line) line.classList.remove('active');
        }
        
        document.getElementById('simProgressBtn').disabled = false;
        
        successModal.classList.remove('active');
        trackingModal.classList.add('active');
    });
}

const simProgressBtn = document.getElementById('simProgressBtn');
if (simProgressBtn) {
    simProgressBtn.addEventListener('click', () => {
        if(currentTrackStep < 4) {
            // Activate the line bridging to next step
            document.getElementById('trackLine' + currentTrackStep).classList.add('active');
            
            currentTrackStep++;
            
            // Move truck
            document.getElementById('liveVehicle').className = 'live-marker pos-' + currentTrackStep;
            
            // Activate the new step
            const step = document.getElementById('trackStep' + currentTrackStep);
            step.classList.add('active');
            step.querySelector('.step-icon').textContent = '✓';
            
            if(currentTrackStep === 4) {
                simProgressBtn.disabled = true;
                simProgressBtn.textContent = "Delivered!";
            }
        }
    });
}

if (closeTrackingModal)
 closeTrackingModal.addEventListener('click', () => trackingModal.classList.remove('active'));

/* =========================================
   PHASE 3: ORDER HISTORY (LOCAL STORAGE)
   ========================================= */
const historyModal = document.getElementById('historyModal');
const closeHistoryModal = document.getElementById('closeHistoryModal');
const openHistoryBtn = document.getElementById('openHistoryBtn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

function renderHistory() {
    let history = JSON.parse(localStorage.getItem('nurseryOrderHistory') || '[]');
    historyList.innerHTML = '';
    
    if(history.length === 0) {
        historyList.innerHTML = '<p style="text-align:center; color: var(--clr-text-light); padding: 2rem;">No past orders found.</p>';
        return;
    }
    
    // Render newest first
    [...history].reverse().forEach((order, index) => {
        const itemNames = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
        // The index in the reversed array vs original array
        const origIndex = history.length - 1 - index;
        
        historyList.innerHTML += `
            <div class="history-card">
                <div class="history-header">
                    <strong>${order.orderId}</strong>
                    <span>${order.date}</span>
                </div>
                <div class="history-items">
                    ${itemNames} <br>
                    <strong style="color: var(--clr-text); margin-top:0.5rem; display:block;">Total: ${order.total}</strong>
                </div>
                <div class="history-actions">
                    <button class="btn btn-secondary w-100 history-inv-btn" data-index="${origIndex}" style="padding: 0.5rem;">Invoice</button>
                    <button class="btn btn-primary w-100 history-trk-btn" data-index="${origIndex}" style="padding: 0.5rem;">Track</button>
                </div>
            </div>
        `;
    });
    
    // Attach events dynamically
    document.querySelectorAll('.history-inv-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-index');
            let h = JSON.parse(localStorage.getItem('nurseryOrderHistory') || '[]');
            lastOrderData = h[idx]; // Set global so existing logic works
            historyModal.classList.remove('active');
            document.getElementById('downloadInvoiceBtn').click(); // trigger existing invoice logic
        });
    });
    
    document.querySelectorAll('.history-trk-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-index');
            let h = JSON.parse(localStorage.getItem('nurseryOrderHistory') || '[]');
            lastOrderData = h[idx];
            historyModal.classList.remove('active');
            document.getElementById('trackDeliveryBtn').click(); // trigger existing tracking logic
        });
    });
}

if(openHistoryBtn) {
    openHistoryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        renderHistory();
        historyModal.classList.add('active');
    });
}

if(closeHistoryModal) {
    closeHistoryModal.addEventListener('click', () => historyModal.classList.remove('active'));
}

if(clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
        if(confirm("Are you sure you want to clear your demo order history?")) {
            localStorage.removeItem('nurseryOrderHistory');
            renderHistory();
        }
    });
}

// ==========================================
// ULTRA UPGRADE: CURSOR, MAGNETIC & GSAP
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Only apply if on a device that supports hover
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        
        // 1. Custom Cursor
        const cursor = document.getElementById('custom-cursor');
        if (cursor) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });

            // Add hover effect for links and specific interactive elements
            const hoverElements = document.querySelectorAll('a, button, .catalog-card, .menu-link, input, select, textarea');
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
            });
            
            // Guardrail: Remove cursor hover effect on very precise elements if needed
            const preciseElements = document.querySelectorAll('.qty-btn');
            preciseElements.forEach(el => {
                el.addEventListener('mouseenter', (e) => { e.stopPropagation(); cursor.classList.remove('hovered'); });
            });
        }

        // 2. Magnetic Buttons (Only applied to elements with data-magnetic to avoid commerce conflict)
        const magneticElements = document.querySelectorAll('[data-magnetic]');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(el, {
                    x: x * 0.4,
                    y: y * 0.4,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            el.addEventListener('mouseleave', () => {
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }

    // 3. GSAP ScrollTrigger Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Replace old .staggered-reveal logic safely
        const catalogGrids = document.querySelectorAll('.catalog-grid');
        catalogGrids.forEach(grid => {
            const cards = grid.querySelectorAll('.catalog-card');
            if (cards.length > 0) {
                gsap.fromTo(cards, 
                    { opacity: 0, y: 50 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.6, 
                        stagger: 0.1, 
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: grid,
                            start: "top 80%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            }
        });
        
        // General fade-in elements
        const fadeElements = document.querySelectorAll('.fade-in, .section-header');
        fadeElements.forEach(el => {
            gsap.fromTo(el, 
                { opacity: 0, y: 30 },
                {
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%"
                    }
                }
            );
        });

        // Blur & Color Reveal Effect for Gallery Images
        const galleryItems = document.querySelectorAll('.ag-item img');
        galleryItems.forEach(img => {
            gsap.fromTo(img, 
                { 
                    filter: "grayscale(100%) blur(8px)",
                    scale: 1.15
                },
                {
                    filter: "grayscale(0%) blur(0px)",
                    scale: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: img.parentElement,
                        start: "top 90%",
                        end: "top 40%",
                        scrub: true
                    }
                }
            );
        });
         // Clip-path reveal for About section image/box
        const missionBox = document.querySelector('.mission-box');
        if (missionBox) {
            gsap.fromTo(missionBox, 
                { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" },
                {
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                    duration: 1.2,
                    ease: "power3.inOut",
                    scrollTrigger: {
                        trigger: missionBox,
                        start: "top 75%"
                    }
                }
            );
        }
    }

    // 4. UI Automations (Phase 4)
    // Auto-playing Gallery Accordion
    const galleryItems = document.querySelectorAll('.ag-item');
    if (galleryItems.length > 0) {
        let currentGalleryIndex = 0;
        let galleryInterval;

        const cycleGallery = () => {
            galleryItems.forEach(item => item.classList.remove('active'));
            galleryItems[currentGalleryIndex].classList.add('active');
            currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
        };

        const startGalleryAutoPlay = () => {
            clearInterval(galleryInterval);
            galleryInterval = setInterval(cycleGallery, 3000);
        };

        // Initialize auto-play
        startGalleryAutoPlay();

        // Pause on hover
        const galleryContainer = document.querySelector('.accordion-gallery');
        if (galleryContainer) {
            galleryContainer.addEventListener('mouseenter', () => clearInterval(galleryInterval));
            galleryContainer.addEventListener('mouseleave', startGalleryAutoPlay);
        }
    }

    // Auto-scroll Testimonials
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    if (testimonialsGrid) {
        const testimonials = testimonialsGrid.querySelectorAll('.testimonial-card');
        if (testimonials.length > 1) {
            // Very simple auto-fade loop for testimonials
            let tIndex = 0;
            const cycleTestimonials = () => {
                testimonials.forEach(t => {
                    t.style.opacity = '0.5';
                    t.style.transform = 'scale(0.95)';
                    t.style.transition = 'all 1s ease';
                });
                testimonials[tIndex].style.opacity = '1';
                testimonials[tIndex].style.transform = 'scale(1)';
                
                tIndex = (tIndex + 1) % testimonials.length;
            };
            
            // Initial setup
            cycleTestimonials();
            let tInterval = setInterval(cycleTestimonials, 4000);

            testimonialsGrid.addEventListener('mouseenter', () => {
                clearInterval(tInterval);
                testimonials.forEach(t => {
                    t.style.opacity = '1';
                    t.style.transform = 'scale(1)';
                });
            });
            testimonialsGrid.addEventListener('mouseleave', () => {
                tInterval = setInterval(cycleTestimonials, 4000);
            });
        }
    }
});

/* ==========================================
   PHASE 5: WISHLIST LOGIC
   ========================================== */

let wishlist = JSON.parse(localStorage.getItem('nurseryWishlist') || '[]');

function saveWishlist() {
    localStorage.setItem('nurseryWishlist', JSON.stringify(wishlist));
}

function updateWishlistUI() {
    const countEl = document.getElementById('wishlistCount');
    if(countEl) countEl.textContent = wishlist.length;
    
    // Update all heart buttons across the page
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (wishlist.some(item => item.id === id)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function toggleWishlist(e, id) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Find the plant details from the catalog card or quickview
    let name = "Unknown Plant";
    let price = 0;
    let image = "";
    
    // Try to find the button that was clicked to extract details from its siblings
    const btn = document.querySelector(`.wishlist-btn[data-id="${id}"]`);
    if(btn) {
        const cardFront = btn.closest('.flip-card-front');
        if(cardFront) {
            const imgEl = cardFront.querySelector('img');
            const nameEl = cardFront.querySelector('h3');
            const priceEl = cardFront.querySelector('.plant-price');
            
            if(imgEl) image = imgEl.src;
            if(nameEl) name = nameEl.textContent;
            if(priceEl) price = parseInt(priceEl.textContent.replace('₹', ''));
        }
    }

    const index = wishlist.findIndex(item => item.id === id);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push({ id, name, price, image });
    }
    
    saveWishlist();
    updateWishlistUI();
    renderWishlistModal();
}

const wishlistModal = document.getElementById('wishlistModal');
const openWishlistBtn = document.getElementById('openWishlistBtn');
const closeWishlistModal = document.getElementById('closeWishlistModal');
const wishlistItemsContainer = document.getElementById('wishlistItemsContainer');

function renderWishlistModal() {
    if(!wishlistItemsContainer) return;
    
    wishlistItemsContainer.innerHTML = '';
    
    if(wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = '<p style="text-align:center; color:var(--clr-text-light);">Your wishlist is empty.</p>';
        return;
    }
    
    wishlist.forEach(item => {
        const div = document.createElement('div');
        div.className = 'wishlist-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="wishlist-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
            </div>
            <div class="wishlist-item-actions">
                <button class="btn btn-secondary" onclick="addToCartFromWishlist('${item.id}')" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">Cart</button>
                <button class="btn" onclick="toggleWishlist(null, '${item.id}')" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; background:#f5f5f5; color:var(--clr-text);">Remove</button>
            </div>
        `;
        wishlistItemsContainer.appendChild(div);
    });
}

function addToCartFromWishlist(id) {
    const item = wishlist.find(i => i.id === id);
    if(item) {
        const existingItem = cart.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 });
        }
        updateCartUI();
        const cartModalEl = document.getElementById('cartModal');
        if(cartModalEl) cartModalEl.classList.add('active');
        if(wishlistModal) wishlistModal.classList.remove('active');
    }
}

if(openWishlistBtn && wishlistModal) {
    openWishlistBtn.addEventListener('click', () => {
        renderWishlistModal();
        wishlistModal.classList.add('active');
    });
}

if(closeWishlistModal && wishlistModal) {
    closeWishlistModal.addEventListener('click', () => {
        wishlistModal.classList.remove('active');
    });
}

// Initial UI sync
document.addEventListener('DOMContentLoaded', () => {
    updateWishlistUI();
});

/* ==========================================
   PHASE 2: QUICK VIEW MODAL LOGIC
   ========================================== */

const quickViewModal = document.getElementById('quickViewModal');
const closeQuickView = document.getElementById('closeQuickView');

// Populate and open Quick View
window.openQuickView = function(plantId) {
    if(!quickViewModal) return;
    
    // Find the plant card
    const card = document.querySelector(`.wishlist-btn[data-id="${plantId}"]`)?.closest('.catalog-card');
    if(!card) return;
    
    // Extract data
    const imgSrc = card.querySelector('.flip-card-front img').src;
    const name = card.querySelector('.flip-card-front h3').textContent;
    const price = card.querySelector('.flip-card-front .plant-price').textContent;
    const specsHtml = card.querySelector('.plant-details').innerHTML;
    
    // Populate modal
    document.getElementById('qvImage').src = imgSrc;
    document.getElementById('qvName').textContent = name;
    document.getElementById('qvPrice').textContent = price;
    document.getElementById('qvSpecs').innerHTML = specsHtml;
    
    const qvWishlistBtn = document.getElementById('qvWishlistBtn');
    qvWishlistBtn.setAttribute('data-id', plantId);
    if(wishlist.some(item => item.id === plantId)) {
        qvWishlistBtn.classList.add('active');
    } else {
        qvWishlistBtn.classList.remove('active');
    }
    
    const addToCartBtn = document.getElementById('qvAddToCartBtn');
    const priceNum = parseInt(price.replace('₹', ''));
    
    // We bind a new function to onClick
    addToCartBtn.onclick = function() {
        const existingItem = cart.find(i => i.id === plantId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: plantId, name: name, price: priceNum, image: imgSrc, quantity: 1 });
        }
        updateCartUI();
        const cartModalEl = document.getElementById('cartModal');
        if(cartModalEl) cartModalEl.classList.add('active');
        quickViewModal.classList.remove('active');
    };
    
    // Animate open
    quickViewModal.classList.add('active');
    
    if(typeof gsap !== 'undefined') {
        gsap.fromTo(quickViewModal.querySelector('.modal-content'), 
            { scale: 0.8, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
        );
    }
};

if(closeQuickView && quickViewModal) {
    closeQuickView.addEventListener('click', () => {
        if(typeof gsap !== 'undefined') {
            gsap.to(quickViewModal.querySelector('.modal-content'), {
                scale: 0.8, opacity: 0, duration: 0.3, 
                onComplete: () => {
                    quickViewModal.classList.remove('active');
                    // Reset transform for next open
                    gsap.set(quickViewModal.querySelector('.modal-content'), {clearProps: "all"});
                }
            });
        } else {
            quickViewModal.classList.remove('active');
        }
    });
}

/* ==========================================
   PHASE 4: QUIZ LOGIC
   ========================================== */

const startQuizBtn = document.getElementById('startQuizBtn');
const quizModal = document.getElementById('quizModal');
const closeQuizModal = document.getElementById('closeQuizModal');
const quizOpts = document.querySelectorAll('.quiz-opt');
const quizShowResultBtn = document.getElementById('quizShowResultBtn');

let quizAnswers = {
    step1: '',
    step2: '',
    step3: ''
};

let currentQuizStep = 1;

if(startQuizBtn && quizModal) {
    startQuizBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Reset quiz
        currentQuizStep = 1;
        for(let i=1; i<=4; i++) {
            const step = document.getElementById('quizStep' + (i===4 ? 'Result' : i));
            if(step) {
                if(i===1) {
                    step.style.left = '0';
                    step.style.opacity = '1';
                } else {
                    step.style.left = '100%';
                    step.style.opacity = '0';
                }
            }
        }
        quizModal.classList.add('active');
        
        if(typeof gsap !== 'undefined') {
            gsap.fromTo(quizModal.querySelector('.modal-content'), 
                { scale: 0.8, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
            );
        }
    });
}

if(closeQuizModal && quizModal) {
    closeQuizModal.addEventListener('click', () => {
        if(typeof gsap !== 'undefined') {
            gsap.to(quizModal.querySelector('.modal-content'), {
                scale: 0.8, opacity: 0, duration: 0.3, 
                onComplete: () => {
                    quizModal.classList.remove('active');
                    gsap.set(quizModal.querySelector('.modal-content'), {clearProps: "all"});
                }
            });
        } else {
            quizModal.classList.remove('active');
        }
    });
}

quizOpts.forEach(btn => {
    btn.addEventListener('click', function() {
        const step = parseInt(this.getAttribute('data-step'));
        const val = this.getAttribute('data-val');
        
        quizAnswers['step' + step] = val;
        
        // Transition to next step
        const currentStepEl = document.getElementById('quizStep' + step);
        const nextStepEl = document.getElementById(step === 3 ? 'quizResult' : 'quizStep' + (step + 1));
        
        if(currentStepEl && nextStepEl) {
            currentStepEl.style.left = '-100%';
            currentStepEl.style.opacity = '0';
            
            nextStepEl.style.left = '0';
            nextStepEl.style.opacity = '1';
        }
    });
});

if(quizShowResultBtn) {
    quizShowResultBtn.addEventListener('click', () => {
        quizModal.classList.remove('active');
        // Simple logic to pick a plant ID based on answers
        // Default to Snake Plant (plant-0) as it's low light, beginner friendly.
        // If they want pet safe, maybe we suggest a different one if we had it, but we'll use plant-0 or plant-1
        let matchedPlantId = 'plant-0'; // Snake Plant
        
        if(quizAnswers.step2 === 'yes') {
            // Pet safe
            matchedPlantId = 'plant-3'; // Calathea (usually pet safe)
        } else if (quizAnswers.step1 === 'high') {
            matchedPlantId = 'plant-1'; // Aloe Vera
        } else if (quizAnswers.step3 === 'expert') {
            matchedPlantId = 'plant-4'; // Fiddle Leaf
        }
        
        // Wait for modal close animation to finish then open quick view
        setTimeout(() => {
            if(typeof window.openQuickView === 'function') {
                window.openQuickView(matchedPlantId);
            }
        }, 300);
    });
}

/* ==========================================
   PHASE 5: SUBSCRIPTION LOGIC
   ========================================== */

const subAddBtns = document.querySelectorAll('.sub-add-btn');

subAddBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');
        const price = parseInt(this.getAttribute('data-price'));
        
        const existingItem = cart.find(i => i.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1, isRecurring: true });
        }
        updateCartUI();
        const cartModalEl = document.getElementById('cartModal');
        if(cartModalEl) cartModalEl.classList.add('active');
    });
});

// We need to override the existing updateCartUI function to handle isRecurring
const originalUpdateCartUI = window.updateCartUI;
window.updateCartUI = function() {
    // Call the original to update totals and counts
    if (typeof originalUpdateCartUI === 'function') {
        originalUpdateCartUI();
    }
    
    // Now let's re-render the cart items to include the recurring badge
    const cartItemsContainer = document.getElementById('cartItems');
    if(!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; padding:2rem; color:var(--clr-text-light);">Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.gap = '1rem';
        div.style.marginBottom = '1rem';
        div.style.paddingBottom = '1rem';
        div.style.borderBottom = '1px solid var(--clr-border)';
        
        const imgSrc = item.image || 'assets/hero_nursery.png';
        const recurringBadge = item.isRecurring ? '<span style="font-size:0.7rem; background:var(--clr-primary); color:white; padding:2px 6px; border-radius:10px; margin-left:10px;">Recurring Monthly</span>' : '';
        
        div.innerHTML = `
            <img src="${imgSrc}" alt="${item.name}" style="width:60px; height:60px; object-fit:cover; border-radius:var(--radius-sm); background:#f5f5f5;">
            <div style="flex:1;">
                <h4 style="margin:0; font-size:1rem;">${item.name} ${recurringBadge}</h4>
                <p style="margin:0; color:var(--clr-primary); font-weight:bold;">₹${item.price}</p>
                <div style="display:flex; align-items:center; gap:10px; margin-top:5px;">
                    <button onclick="updateQuantity('${item.id}', -1)" style="border:1px solid var(--clr-border); background:white; cursor:pointer; width:24px; height:24px; border-radius:4px;">-</button>
                    <span style="font-size:0.9rem;">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)" style="border:1px solid var(--clr-border); background:white; cursor:pointer; width:24px; height:24px; border-radius:4px;">+</button>
                </div>
            </div>
            <button onclick="removeFromCart('${item.id}')" style="background:none; border:none; color:#e91e63; cursor:pointer; font-size:1.2rem;">&times;</button>
        `;
        cartItemsContainer.appendChild(div);
    });
    
    // Update invoice items in checkout if it exists
    const invoiceItems = document.getElementById('invoiceItems');
    if(invoiceItems) {
        invoiceItems.innerHTML = '';
        cart.forEach(item => {
            const recurringText = item.isRecurring ? ' (Monthly)' : '';
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.marginBottom = '0.5rem';
            div.innerHTML = `
                <span>${item.name}${recurringText} x${item.quantity}</span>
                <strong>₹${item.price * item.quantity}</strong>
            `;
            invoiceItems.appendChild(div);
        });
    }
};

// Re-run updateCartUI to apply new render logic if cart has items
updateCartUI();

