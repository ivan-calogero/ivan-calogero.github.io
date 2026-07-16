document.addEventListener("DOMContentLoaded", () => {
    NullStage.configureHints([
        "Il futuro non custodisce sempre ciò che serve: alcune radici restano impigliate nella soglia appena attraversata."
    ]);

    document.querySelector("[data-step-back]").addEventListener("click", () => window.history.back());
    NullStage.bindHashedAnswer({
        selector: "[data-stepback-form]",
        fieldName: "stepbackCode",
        digest: "93ebd5718808087d3d1def9401871950cc73c8c30f2f2efcfabc06582933ad94",
        routeCipher: [227,215,52,216,165,238,254,221,134,79,239],
        storageStage: "9",
        success: "MEMORIA RECUPERATA — fare un passo indietro ha aperto la strada."
    });
});
