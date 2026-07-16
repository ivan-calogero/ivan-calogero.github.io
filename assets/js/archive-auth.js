/*
 * BUILD//NULL legacy client authentication module
 * WARNING: this is deliberately insecure. It is an enigma, not real authentication.
 */
const ARCHIVE_OPERATOR = "root";
const PASSPHRASE_PARTS = ["third", "build"];
const ARCHIVE_PASSPHRASE = PASSPHRASE_PARTS.join("-");

document.addEventListener("DOMContentLoaded", () => {
    NullStage.configureHints([
        "La serratura vive nella stessa macchina che tenta di proteggere."
    ]);

    const form = document.querySelector("[data-archive-form]");
    const continueButton = document.querySelector("[data-archive-continue]");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = form.querySelector("[data-status]");
        const complete = document.querySelector("[data-complete]");
        const operator = form.elements.operator.value.trim().toLowerCase();
        const passphrase = form.elements.passphrase.value.trim().toLowerCase();

        if (operator === ARCHIVE_OPERATOR && passphrase === ARCHIVE_PASSPHRASE) {
            const route = await NullStage.decryptRoute(
                [82,178,250,106,92,90,113,131,230,108,194],
                `${operator}:${passphrase}`
            );
            status.textContent = "BUILD RIPRISTINATA — prototipo completato.";
            status.classList.add("success");
            complete.classList.add("visible");
            localStorage.setItem("buildNullStage", "prototype-complete");
            continueButton.onclick = () => window.location.assign(route);
            complete.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else {
            status.textContent = "CREDENZIALI NON VALIDE — il client conosce la risposta.";
            status.classList.remove("success");
            complete.classList.remove("visible");
        }
    });
});
