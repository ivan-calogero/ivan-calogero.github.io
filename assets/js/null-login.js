document.addEventListener("DOMContentLoaded", () => {
    NullStage.configureHints([
        "Le pareti parlano soltanto a chi guarda dietro l'intonaco."
    ]);

    const form = document.querySelector("[data-login-form]");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = form.querySelector("[data-status]");
        const operatorValid = form.elements.username.value.trim().toLowerCase() === "auditor";
        const passwordDigest = await NullStage.sha256(form.elements.password.value);
        const passwordValid = passwordDigest === "8675869061e8f4eaa289ee103c7a069afd0ad39c220d4b9b3c6f6b860186441f";

        if (operatorValid && passwordValid) {
            const route = await NullStage.decryptRoute([165,137,250,149,224,57,62,252,230,113,176], form.elements.password.value);
            status.textContent = "ACCESSO CONCESSO — apertura del frammento 03...";
            status.classList.add("success");
            localStorage.setItem("buildNullStage", "2");
            window.setTimeout(() => window.location.assign(route), 650);
        } else {
            status.textContent = "ACCESSO NEGATO — il dato richiesto non è visibile sullo schermo.";
            status.classList.remove("success");
        }
    });
});
