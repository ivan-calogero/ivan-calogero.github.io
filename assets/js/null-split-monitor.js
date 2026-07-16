document.addEventListener("DOMContentLoaded", () => {
    const channel = "BroadcastChannel" in window
        ? new BroadcastChannel("build-null-split-process")
        : null;
    const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight"];
    const exposedCode = [84, 87, 73, 78, 45, 67, 79, 82, 69].map((value) => String.fromCharCode(value)).join("");
    const log = document.querySelector("[data-process-log]");
    const code = document.querySelector("[data-process-code]");
    const lines = ["RX READY", "EXPECTED INPUTS: 8", "PATTERN PROFILE: CLASSIC / TRUNCATED"];
    let position = 0;

    const send = (message) => {
        if (channel) channel.postMessage(message);
        else window.parent.postMessage({ buildNullSplit: message }, window.location.origin);
    };
    const render = () => {
        log.innerHTML = lines.slice(-9).join("<br>");
    };
    const receive = (message) => {
        if (!message || message.type !== "key") return;
        const readable = message.key.replace("Arrow", "").toUpperCase();
        if (message.key === sequence[position]) {
            position += 1;
            lines.push(`RX ${readable} — MATCH ${position}/8`);
        } else {
            position = message.key === sequence[0] ? 1 : 0;
            lines.push(`RX ${readable} — DESYNC / RESTART ${position}/8`);
        }
        if (position === sequence.length) {
            code.textContent = exposedCode;
            lines.push("SYNC COMPLETE — CORE KEY EXPOSED");
            send({ type: "unlocked", code: exposedCode });
            position = 0;
        }
        render();
    };

    if (channel) channel.addEventListener("message", (event) => receive(event.data));
    window.addEventListener("message", (event) => {
        if (event.origin === window.location.origin && event.data?.buildNullSplit) receive(event.data.buildNullSplit);
    });
    render();
});
