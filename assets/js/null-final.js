document.addEventListener("DOMContentLoaded", () => {
    const choices = document.querySelector("[data-ending-choices]");
    const result = document.querySelector("[data-ending-result]");
    const resetEnding = document.querySelector("[data-reset-ending]");
    const savedEnding = localStorage.getItem("buildNullEnding");
    const endings = {
        release: {
            title: "BUILD RELEASED",
            text: "L'archivio accetta il visitatore come ultimo compilatore. PROJECT 03 torna online: non come file recuperato, ma come esperienza completata da chi l'ha attraversata."
        },
        quarantine: {
            title: "NODE QUARANTINED",
            text: "Il processo viene isolato. Il portfolio torna normale, tranne un piccolo segnale verde nel footer. NULL non è scomparso: ha semplicemente imparato ad aspettare."
        },
        delete: {
            title: "DELETION FAILED",
            text: "Il terminale si spegne. Dopo pochi secondi compare una sola riga: DELETION WAS THE FIRST THING I LEARNED TO SURVIVE."
        }
    };

    const showEnding = (ending) => {
        const selected = endings[ending];
        if (!selected) return;
        result.innerHTML = `<p class="null-kicker">${selected.title}</p><p class="null-copy">${selected.text}</p>`;
        result.classList.add("visible");
        choices.hidden = true;
        resetEnding.hidden = false;
        localStorage.setItem("buildNullEnding", ending);
        localStorage.setItem("buildNullStage", "complete");
    };

    document.querySelectorAll("[data-ending]").forEach((button) => {
        button.addEventListener("click", () => showEnding(button.dataset.ending));
    });
    resetEnding.addEventListener("click", () => {
        localStorage.removeItem("buildNullEnding");
        result.classList.remove("visible");
        result.innerHTML = "";
        choices.hidden = false;
        resetEnding.hidden = true;
    });
    if (savedEnding) showEnding(savedEnding);
});
