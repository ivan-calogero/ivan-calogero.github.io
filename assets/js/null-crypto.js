document.addEventListener("DOMContentLoaded", () => {
    NullStage.configureHints([
        "Il nome che ritorna su ogni soglia non è decorazione: a volte un'identità diventa una chiave."
    ]);

    NullStage.bindHashedAnswer({
        selector: "[data-crypto-form]",
        fieldName: "plainText",
        digest: "93ef9e10b804122e6745e3a3533c3799eab60183268d5aefd5dbabdd2642d356",
        routeCipher: [117,170,12,13,8,160,38,154,145,102,164],
        storageStage: "final"
    });
});
