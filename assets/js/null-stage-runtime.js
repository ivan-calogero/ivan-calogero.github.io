window.NullStage = (() => {
    const normalize = (value) => value.trim().toUpperCase();

    const digestBytes = async (value) => {
        const bytes = new TextEncoder().encode(value);
        const digest = await crypto.subtle.digest("SHA-256", bytes);
        return new Uint8Array(digest);
    };

    const sha256 = async (value) => {
        const digest = await digestBytes(normalize(value));
        return [...digest]
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join("");
    };

    const decryptRoute = async (cipher, secret) => {
        const key = await digestBytes(`BUILDNULL_ROUTE::${normalize(secret)}`);
        const decoded = cipher.map((byte, index) => byte ^ key[index % key.length]);
        const route = new TextDecoder().decode(new Uint8Array(decoded));
        if (!/^[a-z0-9-]+\.html$/.test(route)) throw new Error("Invalid route token");
        return route;
    };

    const configureHints = (hints) => {
        const button = document.querySelector("[data-hint-button]");
        const output = document.querySelector("[data-hint-output]");
        if (!button || !output || !hints.length) return;
        button.addEventListener("click", () => {
            output.textContent = hints[0];
            button.textContent = "Suggerimento consumato";
            button.disabled = true;
        }, { once: true });
    };

    const bindHashedAnswer = ({
        selector,
        fieldName,
        digest,
        routeCipher,
        storageStage,
        success = "FRAMMENTO CONFERMATO — accesso al nodo successivo...",
        failure = "FRAMMENTO NON VALIDO — riesaminare il supporto.",
        delay = 650
    }) => {
        const form = document.querySelector(selector);
        if (!form) return;
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const status = form.querySelector("[data-status]");
            const candidate = await sha256(form.elements[fieldName].value);
            if (candidate === digest) {
                const route = await decryptRoute(routeCipher, form.elements[fieldName].value);
                status.textContent = success;
                status.classList.add("success");
                localStorage.setItem("buildNullStage", storageStage);
                window.setTimeout(() => window.location.assign(route), delay);
            } else {
                status.textContent = failure;
                status.classList.remove("success");
            }
        });
    };

    document.addEventListener("DOMContentLoaded", () => {
        const progress = document.querySelector(".null-progress");
        const current = Number(document.body.dataset.progress);
        const total = Number(document.body.dataset.progressTotal || 12);
        if (!progress || !current) return;
        progress.replaceChildren(...Array.from({ length: total }, (_, index) => {
            const segment = document.createElement("span");
            if (index < current) segment.className = "active";
            return segment;
        }));
        progress.setAttribute("aria-label", `Progresso: nodo ${current} di ${total}`);
    });

    return { configureHints, bindHashedAnswer, sha256, decryptRoute };
})();
