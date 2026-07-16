document.addEventListener("DOMContentLoaded", () => {
    NullStage.configureHints([
        "Due stanze attendono lo stesso rito; le mani ricordano combinazioni che i giochi non hanno dimenticato."
    ]);

    const channel = "BroadcastChannel" in window
        ? new BroadcastChannel("build-null-split-process")
        : null;
    const state = document.querySelector("[data-split-state]");
    const monitorFrame = document.querySelector("[data-monitor-frame]");

    const receive = (message) => {
        if (!message) return;
        if (message.type === "unlocked") {
            state.textContent = `PROCESSI SINCRONIZZATI — chiave ${message.code}`;
            state.classList.add("success");
        } else if (!channel && message.type === "key") {
            monitorFrame.contentWindow.postMessage({ buildNullSplit: message }, window.location.origin);
        }
    };
    if (channel) channel.addEventListener("message", (event) => receive(event.data));
    window.addEventListener("message", (event) => {
        if (event.origin === window.location.origin && event.data?.buildNullSplit) receive(event.data.buildNullSplit);
    });
    window.addEventListener("keydown", (event) => {
        if (!event.key.startsWith("Arrow")) return;
        event.preventDefault();
        const message = { type: "key", key: event.key };
        if (channel) channel.postMessage(message);
        else monitorFrame.contentWindow.postMessage({ buildNullSplit: message }, window.location.origin);
    });

    NullStage.bindHashedAnswer({
        selector: "[data-split-form]",
        fieldName: "splitCode",
        digest: "97fb5a3da7e213c8bf3298e5b0b984ddd3fbc02a3b1c00995e597863a0cf039e",
        routeCipher: [171,32,122,67,208,87,36,187,216,16,43],
        storageStage: "9",
        success: "CORE GEMELLO STABILE — accesso al cifrario finale...",
        failure: "CHIAVE NON VALIDA — sincronizzare i due processi."
    });
});
