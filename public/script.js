// =======================
// 🌙 THEME TOGGLE
// =======================
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const icon = themeToggle.querySelector('i');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateIcon(theme);
    }

    function updateIcon(theme) {
        if (theme === 'dark') {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
});

// =======================
// 🧭 SMOOTH SCROLL
// =======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =======================
// ✨ SCROLL ANIMATIONS
// =======================
const sections = document.querySelectorAll('section');
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// =======================
// 📧 CONTACT FORM HANDLER
// =======================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        if (!formData.name || !formData.email || !formData.message) {
            alert("⚠️ Please fill in all fields before submitting.");
            return;
        }

        // ✅ Use your Render backend URL here:
        const backendURL = "https://my-portfolio1-5bz4.onrender.com/";

        try {
            const response = await fetch("https://my-portfolio1-5bz4.onrender.com", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("✅ Thank you! Your message was sent successfully.");
                contactForm.reset();
            } else {
                alert("❌ Something went wrong. Please try again later.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("⚠️ Failed to connect to the server. Please check your internet connection or try again later.");
        }
    });
}

// =======================
// 🧠 READ MORE BUTTONS
// =======================
document.querySelectorAll('.read-more').forEach(button => {
    button.addEventListener('click', function() {
        const skillCard = this.closest('.skill-card');
        skillCard.classList.toggle('expanded');
        if (skillCard.classList.contains('expanded')) {
            this.innerHTML = 'Read Less <i class="fas fa-chevron-up"></i>';
        } else {
            this.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
        }
    });
});

// =======================
// 📱 MOBILE NAVIGATION
// =======================
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');

const menuButton = document.createElement('button');
menuButton.className = 'mobile-menu-btn';
menuButton.innerHTML = '<i class="fas fa-bars"></i>';
navbar.insertBefore(menuButton, navLinks);

menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
});

const style = document.createElement('style');
style.textContent = `
    .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 1.5rem;
        cursor: pointer;
    }
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: block;
        }
        .nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: var(--bg-color);
            padding: 1rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .nav-links.active {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
    }
`;
document.head.appendChild(style);
