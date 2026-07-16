document.addEventListener("DOMContentLoaded", () => {
    NullStage.configureHints([
        "La profondità nasce nel disaccordo: ciò che un occhio perde, l'altro conserva."
    ]);

    const stage = document.querySelector("[data-stereo-stage]");
    const image = stage.querySelector("img");
    const interferenceButton = document.querySelector("[data-interference]");
    const phaseControl = document.querySelector("[data-phase-control]");
    const phaseFocus = document.querySelector("[data-phase-focus]");
    const phaseValue = document.querySelector("[data-phase-value]");
    const phaseLevels = document.querySelectorAll("[data-phase-level]");
    const inspectedChannels = new Set();

    const updatePhaseFocus = () => {
        const value = Number(phaseFocus.value);
        const threshold = 0.08 + value / 100 * 0.22;
        const intercept = (-14 * threshold).toFixed(2);
        phaseLevels.forEach((level) => level.setAttribute("intercept", intercept));
        phaseValue.textContent = `${value}%`;
    };

    const selectButton = (selected) => {
        document.querySelectorAll("[data-channel]").forEach((button) => {
            const active = button.dataset.channel === selected;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    };

    const showChannel = (channel) => {
        const filters = {
            red: "url(#null-red-channel)",
            cyan: "url(#null-cyan-channel)",
            interference: "url(#null-channel-interference)"
        };
        image.style.filter = filters[channel];
        stage.classList.remove("channel-view");
    };

    document.querySelectorAll("[data-channel]").forEach((button) => {
        button.addEventListener("click", () => {
            const channel = button.dataset.channel;
            selectButton(channel);

            if (channel === "original") {
                image.style.filter = "";
                stage.classList.remove("channel-view");
                phaseControl.hidden = true;
            } else {
                showChannel(channel);
                phaseControl.hidden = channel !== "interference";
                if (channel === "red" || channel === "cyan") {
                    inspectedChannels.add(channel);
                    interferenceButton.disabled = inspectedChannels.size < 2;
                }
            }
        });
    });

    phaseFocus.addEventListener("input", updatePhaseFocus);
    updatePhaseFocus();

    NullStage.bindHashedAnswer({
        selector: "[data-stereo-form]",
        fieldName: "stereoCode",
        digest: "e9bcfa9591df51619731c422c71e6b0686540fb1361df59860156b451e71a26b",
        routeCipher: [120,85,99,58,193,32,243,149,59,61,206],
        storageStage: "7"
    });
});
