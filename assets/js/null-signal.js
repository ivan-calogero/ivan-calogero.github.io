document.addEventListener("DOMContentLoaded", () => {
    NullStage.configureHints([
        "Nell'ombra non manca l'inchiostro: manca distanza tra luce e buio."
    ]);

    const image = document.querySelector("[data-signal-image]");
    const contrast = document.querySelector("[data-contrast]");
    const brightness = document.querySelector("[data-brightness]");
    const updateSignal = () => {
        image.style.filter = `contrast(${contrast.value}%) brightness(${brightness.value}%)`;
    };
    contrast.addEventListener("input", updateSignal);
    brightness.addEventListener("input", updateSignal);
    updateSignal();

    NullStage.bindHashedAnswer({
        selector: "[data-signal-form]",
        fieldName: "signalCode",
        digest: "e89b89103d80035060836c6b1f1d1cea30bffe7d40e34702c1b57ea554c1d2dc",
        routeCipher: [27,42,11,7,119,98,195,227,215,57,78],
        storageStage: "3",
        success: "SEGNALE DECODIFICATO — archivio JavaScript individuato.",
        failure: "STRINGA NON RICONOSCIUTA — calibrare nuovamente il frame.",
        delay: 750
    });
});
