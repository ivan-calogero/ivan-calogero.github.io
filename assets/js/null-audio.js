document.addEventListener("DOMContentLoaded", () => {
    NullStage.configureHints([
        "Tra mille voci, una sola smette di fuggire quando la insegui alla sua frequenza."
    ]);

    const playButton = document.querySelector("[data-audio-play]");
    const frequency = document.querySelector("[data-radio-frequency]");
    const frequencyValue = document.querySelector("[data-frequency-value]");
    const wave = document.querySelector("[data-wave]");
    const lockPoint = 87.5 + (0x1cb8 % 206) / 10;
    let audioContext;
    let noiseSource;
    let signalSource;
    let noiseGain;
    let signalGain;

    const trace = atob("MTAzMTMxMDExMTEwMzMzMDExMTEzMDExMzMz").split("").map(Number);

    const buildSignalBuffer = (context) => {
        const unit = 0.18;
        const events = [];
        trace.forEach((length) => {
            if (length === 0) {
                events.push({ active: false, duration: unit * 3 });
                return;
            }
            events.push({ active: true, duration: unit * length });
            events.push({ active: false, duration: unit });
        });

        const duration = events.reduce((sum, event) => sum + event.duration, 0) + 1;
        const buffer = context.createBuffer(1, Math.ceil(duration * context.sampleRate), context.sampleRate);
        const samples = buffer.getChannelData(0);
        let cursor = Math.floor(context.sampleRate * 0.4);

        events.forEach((event) => {
            const eventSamples = Math.floor(event.duration * context.sampleRate);
            if (event.active) {
                for (let index = 0; index < eventSamples && cursor + index < samples.length; index += 1) {
                    const envelope = Math.min(1, index / 80, (eventSamples - index) / 80);
                    samples[cursor + index] = Math.sin(2 * Math.PI * 660 * (cursor + index) / context.sampleRate) * envelope;
                }
            }
            cursor += eventSamples;
        });
        return buffer;
    };

    const buildNoiseBuffer = (context, duration) => {
        const buffer = context.createBuffer(1, Math.ceil(duration * context.sampleRate), context.sampleRate);
        const samples = buffer.getChannelData(0);
        let previous = 0;
        for (let index = 0; index < samples.length; index += 1) {
            const white = Math.random() * 2 - 1;
            previous = previous * 0.72 + white * 0.28;
            samples[index] = previous;
        }
        return buffer;
    };

    const updateTuning = () => {
        const tunedFrequency = Number(frequency.value);
        const distance = Math.abs(tunedFrequency - lockPoint);
        const lock = Math.exp(-Math.pow(distance / 0.28, 2));
        frequencyValue.textContent = `${tunedFrequency.toFixed(1)} MHz`;

        if (audioContext && noiseGain && signalGain) {
            const now = audioContext.currentTime;
            signalGain.gain.setTargetAtTime(lock * 0.4, now, 0.035);
            noiseGain.gain.setTargetAtTime(0.19 - lock * 0.14, now, 0.035);
        }
    };

    const stopReceiver = () => {
        [noiseSource, signalSource].forEach((source) => {
            if (!source) return;
            try { source.stop(); } catch { /* The source may already be silent. */ }
        });
        noiseSource = null;
        signalSource = null;
    };

    frequency.addEventListener("input", updateTuning);
    updateTuning();

    playButton.addEventListener("click", async () => {
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) return;
        if (!audioContext) audioContext = new Context();
        await audioContext.resume();
        stopReceiver();

        const signalBuffer = buildSignalBuffer(audioContext);
        const noiseBuffer = buildNoiseBuffer(audioContext, signalBuffer.duration);
        const master = audioContext.createGain();
        noiseSource = audioContext.createBufferSource();
        signalSource = audioContext.createBufferSource();
        noiseGain = audioContext.createGain();
        signalGain = audioContext.createGain();

        noiseSource.buffer = noiseBuffer;
        signalSource.buffer = signalBuffer;
        noiseSource.loop = true;
        signalSource.loop = true;
        noiseSource.connect(noiseGain).connect(master);
        signalSource.connect(signalGain).connect(master);
        master.gain.value = 0.8;
        master.connect(audioContext.destination);
        updateTuning();
        noiseSource.start();
        signalSource.start();
        wave.classList.add("playing");
        playButton.textContent = "Riavvia ricevitore";
    });

    NullStage.bindHashedAnswer({
        selector: "[data-audio-form]",
        fieldName: "audioCode",
        digest: "7dee45af5ce55d6855c5a46c373900058adbc648bce1e60ec3bf35670bf7a7b8",
        routeCipher: [238,11,6,6,10,203,150,57,24,108,37],
        storageStage: "8"
    });
});
