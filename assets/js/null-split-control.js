document.addEventListener("DOMContentLoaded", () => {
    const channel = "BroadcastChannel" in window
        ? new BroadcastChannel("build-null-split-process")
        : null;

    const transmit = (key) => {
        const message = { type: "key", key };
        if (channel) channel.postMessage(message);
        else window.parent.postMessage({ buildNullSplit: message }, window.location.origin);
        document.querySelector("[data-control-state]").textContent = `TX ${key.replace("Arrow", "").toUpperCase()}`;
    };

    document.querySelectorAll("[data-key]").forEach((button) => {
        button.addEventListener("click", () => transmit(button.dataset.key));
    });
    window.addEventListener("keydown", (event) => {
        if (!event.key.startsWith("Arrow")) return;
        event.preventDefault();
        transmit(event.key);
    });
});
