const link = document.getElementById("phone-link");
const phone = "+393276823951";

link.addEventListener("click", function (e) {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    if (!isMobile) {
        e.preventDefault();

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(phone);
        } else {
            const tempInput = document.createElement("input");
            tempInput.value = phone;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Animazione reveal on scroll per elementi con class .reveal
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        revealElements.forEach((el) => observer.observe(el));
    } else {
        // Fallback semplice se IntersectionObserver non è disponibile
        revealElements.forEach((el) => el.classList.add("visible"));
    }
    // Parallax sfondo globale (page-bg-image)
    const pageBg = document.querySelector(".page-bg-image");
    if (pageBg) {
        const updatePageBgParallax = () => {
            const scrollY = window.scrollY || window.pageYOffset || 0;

            const factor = 0.1;    // quanto si muove rispetto allo scroll
            const maxOffset = 120;  // limite massimo in px

            let offset = scrollY * factor * -1; // verso opposto allo scroll

            //if (offset > maxOffset) offset = maxOffset;
            //if (offset < -maxOffset) offset = -maxOffset;

            pageBg.style.setProperty("--page-bg-offset", `${offset.toFixed(1)}px`);
        };

        window.addEventListener("scroll", updatePageBgParallax, { passive: true });
        window.addEventListener("resize", updatePageBgParallax);
        updatePageBgParallax();
    }
    // Menu mobile (hamburger)
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelectorAll(".site-nav a");

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            document.body.classList.toggle("nav-open");
        });
    }

    // Chiudi il menu quando clicchi un link (su mobile)
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (document.body.classList.contains("nav-open")) {
                document.body.classList.remove("nav-open");
            }
        });
    });
});
