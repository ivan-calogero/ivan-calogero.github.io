document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    const validRoles = new Set(["nivaz", "ugly"]);
    const launcher = document.querySelector("[data-launcher]");
    const fragment = document.querySelector("[data-fragment]");
    const channel = "BroadcastChannel" in window
        ? new BroadcastChannel("build-null-dual-window-prototype")
        : null;
    const childWindows = { nivaz: null, ugly: null };
    const states = new Map();

    const relay = (packet, source) => {
        Object.values(childWindows).forEach((child) => {
            if (child && !child.closed && child !== source) child.postMessage(packet, "*");
        });
    };

    const openFragment = (targetRole) => {
        const url = new URL(window.location.href);
        url.searchParams.set("role", targetRole);
        const width = Math.min(620, Math.floor(screen.availWidth * 0.44));
        const height = Math.min(760, Math.floor(screen.availHeight * 0.82));
        const offset = targetRole === "nivaz" ? 60 : width + 150;
        const features = `popup=yes,width=${width},height=${height},left=${offset},top=80,resizable=yes,scrollbars=no`;
        childWindows[targetRole] = window.open(url.toString(), `build-null-${targetRole}`, features);
        const status = document.querySelector("[data-launch-status]");
        status.textContent = childWindows[targetRole]
            ? `${targetRole === "nivaz" ? "PROCESSO A" : "PROCESSO B"} avviato. Apri anche il gemello e osserva i loro bordi.`
            : "Il browser ha bloccato la finestra. Abilita temporaneamente i popup e riprova.";
    };

    if (!validRoles.has(role)) {
        document.querySelectorAll("[data-open-role]").forEach((button) => {
            button.addEventListener("click", () => openFragment(button.dataset.openRole));
        });
        window.addEventListener("message", (event) => {
            const packet = event.data;
            if (!packet || packet.scope !== "build-null-dual") return;
            relay(packet, event.source);
            if (channel) channel.postMessage(packet);
        });
        return;
    }

    launcher.hidden = true;
    fragment.hidden = false;
    document.body.classList.add("fragment-mode");
    document.body.dataset.dualRole = role;

    const roleContent = {
        nivaz: {
            code: "PROCESSO A // STRUTTURA",
            name: "NivaZGameS",
            memory: "Ho imparato a costruire sistemi abbastanza solidi da sopravvivere alle mie idee. Ma ogni struttura conservava un bordo incompleto."
        },
        ugly: {
            code: "PROCESSO B // ENTROPIA",
            name: "UglyGames",
            memory: "Ho continuato a rompere le regole per ricordare perché avevo iniziato. Ma ogni deviazione terminava contro un bordo incompleto."
        }
    };
    const content = roleContent[role];
    document.querySelector("[data-role-code]").textContent = content.code;
    document.querySelector("[data-role-name]").textContent = content.name;
    document.querySelector("[data-role-memory]").textContent = content.memory;
    document.querySelector("[data-seam-word]").textContent = [67, 79, 78, 86, 69, 82, 71, 69, 78, 90, 65]
        .map((value) => String.fromCharCode(value))
        .join("");

    const syncFill = document.querySelector("[data-sync-fill]");
    const syncLabel = document.querySelector("[data-sync-label]");
    let stableSince = 0;
    let resolved = false;

    const ownState = () => ({
        scope: "build-null-dual",
        type: "state",
        role,
        x: window.screenX,
        y: window.screenY,
        width: window.outerWidth,
        height: window.outerHeight,
        time: Date.now()
    });

    const evaluate = () => {
        const nivaz = states.get("nivaz");
        const ugly = states.get("ugly");
        if (!nivaz || !ugly || Date.now() - nivaz.time > 800 || Date.now() - ugly.time > 800) {
            stableSince = 0;
            syncFill.style.width = "0%";
            syncLabel.textContent = "RICERCA PROCESSO GEMELLO...";
            return;
        }

        const seamDistance = Math.abs((nivaz.x + nivaz.width) - ugly.x);
        const verticalDistance = Math.abs(nivaz.y - ugly.y);
        const heightDistance = Math.abs(nivaz.height - ugly.height);
        const score = Math.max(0, Math.min(100, 100 - seamDistance * 0.85 - verticalDistance * 0.75 - heightDistance * 0.22));
        const aligned = seamDistance <= 28 && verticalDistance <= 24 && heightDistance <= 54;
        syncFill.style.width = `${score.toFixed(0)}%`;

        if (!aligned) {
            stableSince = 0;
            syncLabel.textContent = `SINCRONIA ${score.toFixed(0)}% // RIDURRE LA DISTANZA`;
            return;
        }

        if (!stableSince) stableSince = performance.now();
        const held = performance.now() - stableSince;
        syncLabel.textContent = held < 1300 ? "BORDI AGGANCIATI // STABILIZZAZIONE..." : "FRAMMENTO STABILE";
        if (held >= 1300 && !resolved) {
            resolved = true;
            document.body.classList.add("resolved");
        }
    };

    const receive = (packet) => {
        if (!packet || packet.scope !== "build-null-dual" || packet.type !== "state") return;
        states.set(packet.role, packet);
        evaluate();
    };

    if (channel) channel.addEventListener("message", (event) => receive(event.data));
    window.addEventListener("message", (event) => receive(event.data));

    window.setInterval(() => {
        const packet = ownState();
        receive(packet);
        if (channel) channel.postMessage(packet);
        if (window.opener && !window.opener.closed) window.opener.postMessage(packet, "*");
    }, 120);
});
