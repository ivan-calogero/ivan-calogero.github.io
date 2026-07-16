document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const stage = document.querySelector("[data-depth-stage]");
    const intro = document.querySelector("[data-depth-intro]");
    const gauge = document.querySelector("[data-depth-gauge]");
    const reading = document.querySelector("[data-depth-reading]");
    const index = document.querySelector("[data-depth-index]");
    const title = document.querySelector("[data-depth-title]");
    const copy = document.querySelector("[data-depth-copy]");
    const status = document.querySelector("[data-depth-status]");
    const coherenceLabel = document.querySelector("[data-depth-coherence]");
    const wordContainer = document.querySelector("[data-depth-word]");
    const farGrid = document.querySelector('[data-depth-layer="far"]');
    const nearGrid = document.querySelector('[data-depth-layer="near"]');
    const shards = [...document.querySelectorAll("[data-shard]")];
    const targetDepth = 0.715;
    const stripCount = 7;
    const drifts = [-1.18, 0.82, -0.58, 0.34, -0.76, 1.04, -0.42];
    const recoveredWord = [80, 69, 82, 83, 73, 83, 84, 69, 78, 90, 65]
        .map((value) => String.fromCharCode(value))
        .join("");
    const memories = [
        { at: 0, index: "STRATO 00", title: "SUPERFICIE", copy: "Ogni scelta sembra isolata finché viene osservata da troppo vicino." },
        { at: 0.16, index: "STRATO 01", title: "ORIGINE", copy: "Una pagina costruita a mano, quindici anni fa. Prima del mestiere esisteva già la curiosità." },
        { at: 0.34, index: "STRATO 02", title: "RECUPERO", copy: "Dati danneggiati, percorsi interrotti, sistemi da comprendere prima di poterli salvare." },
        { at: 0.51, index: "STRATO 03", title: "STRUTTURA", copy: "Il codice divenne lavoro: .NET, web, servizi e responsabilità abbastanza concrete da sostenere altre persone." },
        { at: 0.65, index: "STRATO 04", title: "BIFORCAZIONE", copy: "NivaZGameS costruiva. UglyGames disturbava. Sembravano direzioni opposte soltanto perché vivevano a profondità diverse." },
        { at: 0.82, index: "STRATO 05", title: "OLTRE", copy: "Il frammento è passato. Ciò che hai intravisto non tornerà identico risalendo." }
    ];

    for (let stripIndex = 0; stripIndex < stripCount; stripIndex += 1) {
        const strip = document.createElement("span");
        const top = stripIndex / stripCount * 100;
        const bottom = 100 - (stripIndex + 1) / stripCount * 100;
        strip.className = "depth-word-strip";
        strip.textContent = recoveredWord;
        strip.style.clipPath = `inset(${top}% -12% ${bottom}% -12%)`;
        strip.dataset.strip = String(stripIndex);
        wordContainer.appendChild(strip);
    }

    const strips = [...document.querySelectorAll("[data-strip]")];
    let ticking = false;
    let currentMemory = -1;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const updateMemory = (progress) => {
        let memoryIndex = 0;
        memories.forEach((memory, candidate) => {
            if (progress >= memory.at) memoryIndex = candidate;
        });
        if (memoryIndex === currentMemory) return;
        currentMemory = memoryIndex;
        const memory = memories[memoryIndex];
        index.textContent = memory.index;
        title.textContent = memory.title;
        copy.textContent = memory.copy;
    };

    const render = () => {
        ticking = false;
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = clamp(window.scrollY / maxScroll, 0, 1);
        const delta = progress - targetDepth;
        const coherence = Math.exp(-Math.pow(delta / 0.035, 2));
        const depthMeters = Math.round(progress * 4096);
        const viewportWidth = window.innerWidth;

        root.style.setProperty("--depth-progress", progress.toFixed(4));
        root.style.setProperty("--depth-coherence", coherence.toFixed(4));
        gauge.style.height = `${(progress * 100).toFixed(2)}%`;
        reading.textContent = `${String(depthMeters).padStart(4, "0")} m`;
        coherenceLabel.textContent = `COERENZA ${Math.round(coherence * 100).toString().padStart(2, "0")}%`;
        intro.classList.toggle("dismissed", progress > 0.025);
        stage.classList.toggle("coherent", coherence > 0.91);
        status.textContent = coherence > 0.91
            ? "STRATI COINCIDENTI // MANTENERE LA QUOTA"
            : progress < targetDepth
                ? "DISCESA ARCHIVIO IN CORSO"
                : "IL SEGNALE SI ALLONTANA";

        farGrid.style.transform = `translate3d(0, ${progress * 70}px, 0) rotate(${progress * 1.4}deg)`;
        nearGrid.style.transform = `translate3d(0, ${progress * -150}px, 0) rotate(${progress * -2.2}deg) scale(${1 + progress * 0.08})`;

        strips.forEach((strip, stripIndex) => {
            const horizontal = delta * drifts[stripIndex] * viewportWidth * 2.35;
            const vertical = delta * (stripIndex - 3) * 34;
            const rotation = delta * drifts[stripIndex] * 16;
            strip.style.transform = `translate(calc(-50% + ${horizontal}px), calc(-50% + ${vertical}px)) rotate(${rotation}deg)`;
        });

        shards.forEach((shard, shardIndex) => {
            const direction = shardIndex % 2 === 0 ? 1 : -1;
            const travel = (progress - 0.5) * (70 + shardIndex * 22) * direction;
            shard.style.transform = `translate3d(${travel}px, ${travel * -0.42}px, 0)`;
            shard.style.opacity = String(0.18 + Math.abs(Math.sin(progress * Math.PI * (1.2 + shardIndex * 0.13))) * 0.54);
        });

        updateMemory(progress);
    };

    const requestRender = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(render);
    };

    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);
    render();
});
