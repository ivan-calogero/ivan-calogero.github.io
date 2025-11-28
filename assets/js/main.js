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

    // Parallax hero (versione semplice basata su scrollY)
    const hero = document.querySelector(".hero");
    if (hero) {
        const updateHeroParallax = () => {
            const scrollY = window.scrollY || window.pageYOffset || 0;


            // quanto deve muoversi per pixel di scroll
            const factor = 0.95;      // prova 0.25 / 0.3
            const maxOffset = 80;     // massimo spostamento in px

            let offset = scrollY * factor;
            console.log(offset);

            //// limitiamo l'offset per non farla “uscire”
            //if (offset > maxOffset) offset = maxOffset;
            //if (offset < -maxOffset) offset = -maxOffset;

            hero.style.setProperty("--hero-bg-offset", `${offset}px`);
        };

        window.addEventListener("scroll", updateHeroParallax, { passive: true });
        window.addEventListener("resize", updateHeroParallax);
        updateHeroParallax();
    }

});
