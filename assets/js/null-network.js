document.addEventListener("DOMContentLoaded", () => {
    NullStage.configureHints([
        "Ciò che appare a destinazione è soltanto l'eco: intercetta il viaggio, poi restituisci voce al suo involucro."
    ]);

    const log = document.querySelector("[data-network-log]");
    fetch("../assets/data/archive-packet.json?node=05", { cache: "no-store" })
        .then((response) => response.json())
        .then((packet) => {
            log.innerHTML = [
                "<strong>GET</strong> /assets/data/archive-packet.json?node=05",
                `<strong>200</strong> packet received — request ${packet.requestId}`,
                `<span class="warning">payload hidden by interface — transport: ${packet.encoding}</span>`
            ].join("<br>");
        })
        .catch(() => {
            log.innerHTML = "<span class=\"warning\">NETWORK ERROR — aprire il nodo tramite un server HTTP.</span>";
        });

    NullStage.bindHashedAnswer({
        selector: "[data-network-form]",
        fieldName: "packetCode",
        digest: "136bfc4c4ef0e632fa101443d366027232e3741777e13792b5be9369460ffb98",
        routeCipher: [140,2,30,63,236,25,85,213,150,246,193],
        storageStage: "6"
    });
});
