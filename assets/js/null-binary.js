document.addEventListener("DOMContentLoaded", () => {
    NullStage.configureHints([
        "Otto passi formano una voce; lo zero e l'uno ricordano una lingua più antica dello schermo."
    ]);

    NullStage.bindHashedAnswer({
        selector: "[data-binary-form]",
        fieldName: "binaryCode",
        digest: "f4d172eef8532dfcf652c0b7c526715cb898ad61b87d068949b15739613ef3ae",
        routeCipher: [41,142,76,44,205,33,195,122,114,238,32],
        storageStage: "1",
        success: "ORIGINE RICONOSCIUTA — il primo archivio risponde..."
    });
});
