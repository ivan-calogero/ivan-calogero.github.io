document.addEventListener("DOMContentLoaded", () => {
    NullStage.configureHints([
        "La stessa memoria cambia forma quando la stanza si stringe o si allarga."
    ]);

    const meter = document.querySelector("[data-viewport-meter]");
    const display = document.querySelector("[data-responsive-fragment]");
    const slots = [...document.querySelectorAll("[data-fragment-slot]")];
    const fragments = ["NODE", "RESIZE", "42"];
    const found = new Set();

    const reveal = (width) => {
        const index = width < 700 ? 2 : width < 1000 ? 1 : 0;
        meter.textContent = `${Math.round(width)} px`;
        display.textContent = fragments[index];
        found.add(index);
        slots.forEach((slot, slotIndex) => {
            if (!found.has(slotIndex)) return;
            slot.textContent = fragments[slotIndex];
            slot.classList.add("found");
        });
    };

    window.addEventListener("resize", () => {
        reveal(window.innerWidth);
    });
    reveal(window.innerWidth);

    NullStage.bindHashedAnswer({
        selector: "[data-responsive-form]",
        fieldName: "responsiveCode",
        digest: "2c024a5328a9bdb4498d10afa4b9249ceaa5cbf5d8079364d7b2a5fc3798ce4a",
        routeCipher: [142,236,157,106,142,226,212,77,201,120,71],
        storageStage: "5"
    });
});
