document.addEventListener("DOMContentLoaded", () => {
    const meter = document.querySelector("[data-viewport-meter]");
    const display = document.querySelector("[data-responsive-fragment]");
    const slots = [...document.querySelectorAll("[data-fragment-slot]")];
    const lab = document.querySelector(".null-lab");
    const resizeHandle = document.querySelector("[data-mobile-resize-handle]");
    const mobileQuery = window.matchMedia("(max-width: 800px)");
    const touchDevice = navigator.maxTouchPoints > 0
        || "ontouchstart" in window
        || Boolean(navigator.userAgentData && navigator.userAgentData.mobile)
        || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const fragments = ["NODE", "RESIZE", "42"];
    const found = new Set();
    let mobileMode = mobileQuery.matches && touchDevice;
    let dragStartX = 0;
    let dragStartWidth = 0;

    NullStage.configureHints([
        mobileMode
            ? "A volte la stanza non è lo schermo intero: anche un confine interno può essere spostato."
            : "La stessa memoria cambia forma quando la stanza si stringe o si allarga."
    ]);

    const recordFragment = (fragmentIndex, measurement) => {
        meter.textContent = measurement;
        display.textContent = fragments[fragmentIndex];
        found.add(fragmentIndex);
        slots.forEach((slot, slotIndex) => {
            if (!found.has(slotIndex)) return;
            slot.textContent = fragments[slotIndex];
            slot.classList.add("found");
        });
    };

    const revealDesktop = () => {
        const width = window.innerWidth;
        const fragmentIndex = width < 700 ? 2 : width < 1000 ? 1 : 0;
        recordFragment(fragmentIndex, `${Math.round(width)} px`);
    };

    const revealMobile = () => {
        const availableWidth = lab.parentElement.clientWidth;
        const width = lab.getBoundingClientRect().width;
        const ratio = width / availableWidth;
        const fragmentIndex = ratio < 0.62 ? 2 : ratio < 0.81 ? 1 : 0;
        lab.dataset.widthRatio = ratio.toFixed(4);
        recordFragment(fragmentIndex, `${Math.round(ratio * 100)}%`);
    };

    const configureMode = () => {
        mobileMode = mobileQuery.matches && touchDevice;
        lab.classList.toggle("touch-resizable", mobileMode);
        resizeHandle.hidden = !mobileMode;
        if (!mobileMode) {
            lab.style.width = "";
            revealDesktop();
            return;
        }

        const availableWidth = lab.parentElement.clientWidth;
        const previousRatio = Number(lab.dataset.widthRatio || 1);
        lab.style.width = `${availableWidth * Math.min(1, Math.max(0.46, previousRatio))}px`;
        revealMobile();
    };

    resizeHandle.addEventListener("pointerdown", (event) => {
        if (!mobileMode) return;
        dragStartX = event.clientX;
        dragStartWidth = lab.getBoundingClientRect().width;
        resizeHandle.setPointerCapture(event.pointerId);
    });

    resizeHandle.addEventListener("pointermove", (event) => {
        if (!mobileMode || !resizeHandle.hasPointerCapture(event.pointerId)) return;
        const availableWidth = lab.parentElement.clientWidth;
        const nextWidth = Math.min(availableWidth, Math.max(availableWidth * 0.46, dragStartWidth + event.clientX - dragStartX));
        lab.style.width = `${nextWidth}px`;
        revealMobile();
    });

    resizeHandle.addEventListener("keydown", (event) => {
        if (!mobileMode || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
        event.preventDefault();
        const availableWidth = lab.parentElement.clientWidth;
        const direction = event.key === "ArrowLeft" ? -1 : 1;
        const nextWidth = Math.min(availableWidth, Math.max(availableWidth * 0.46, lab.getBoundingClientRect().width + direction * 18));
        lab.style.width = `${nextWidth}px`;
        revealMobile();
    });

    window.addEventListener("resize", configureMode);
    if (typeof mobileQuery.addEventListener === "function") mobileQuery.addEventListener("change", configureMode);
    configureMode();

    NullStage.bindHashedAnswer({
        selector: "[data-responsive-form]",
        fieldName: "responsiveCode",
        digest: "2c024a5328a9bdb4498d10afa4b9249ceaa5cbf5d8079364d7b2a5fc3798ce4a",
        routeCipher: [142,236,157,106,142,226,212,77,201,120,71],
        storageStage: "5"
    });
});
