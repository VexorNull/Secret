let currentFormat = 'binary';
let isLiveMode = false;
let soundEnabled = true;

// Matrix Background Animation Engine
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const katakana = '0101010101ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const alphabet = katakana.split('');
const fontSize = 14;
let columns = canvas.width / fontSize;
const rainDrops = [];

for (let x = 0; x < columns; x++) {
    rainDrops[x] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(2, 6, 23, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#38bdf8';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
}
setInterval(drawMatrix, 35);

// Format Selector & Audio Toggle
function setFormat(format) {
    currentFormat = format;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    playBeep(600, 0.03);
    showToast(`Switched to ${format.toUpperCase()} mode`);
    if (isLiveMode) handleInput();
}

function toggleAudio() {
    soundEnabled = !soundEnabled;
    let btn = document.getElementById('audioToggleBtn');
    btn.innerHTML = soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
    showToast(soundEnabled ? "Sound FX Enabled" : "Sound FX Muted");
}

function toggleLiveMode() {
    isLiveMode = document.getElementById('liveToggle').checked;
    playBeep(isLiveMode ? 800 : 400, 0.05);
    showToast(isLiveMode ? "Live Auto-Convert Enabled" : "Live Auto-Convert Disabled");
    if (isLiveMode) handleInput();
}

// Input Handler with Entropy Security Meter
function handleInput() {
    let input = document.getElementById("inputText").value;
    let charCount = input.length;
    let wordCount = input.trim() === "" ? 0 : input.trim().split(/\s+/).length;
    document.getElementById("inputCounter").innerText = `${charCount} chars | ${wordCount} words`;

    // Calculate Entropy Strength
    let fill = document.getElementById('meterFill');
    let secText = document.getElementById('securityText');
    if (charCount === 0) {
        fill.style.width = '0%';
        fill.style.background = '#ef4444';
        secText.innerText = 'Entropy: Low';
    } else if (charCount < 6) {
        fill.style.width = '30%';
        fill.style.background = '#f59e0b';
        secText.innerText = 'Entropy: Weak';
    } else if (charCount < 15) {
        fill.style.width = '70%';
        fill.style.background = '#38bdf8';
        secText.innerText = 'Entropy: Secure';
    } else {
        fill.style.width = '100%';
        fill.style.background = '#10b981';
        secText.innerText = 'Entropy: Enterprise';
    }

    if (isLiveMode && input.trim() !== "") {
        executeProcess('encrypt', true);
    } else if (isLiveMode && input.trim() === "") {
        document.getElementById("outputText").value = "";
    }
}

// Main Encryption / Decryption Execution Engine
function executeProcess(action, silent = false) {
    let input = document.getElementById("inputText").value.trim();
    if (!input) {
        if (!silent) showToast("Please input some data first!");
        return;
    }

    let output = "";
    try {
        if (action === 'encrypt') {
            if (currentFormat === 'binary') {
                for (let i = 0; i < input.length; i++) {
                    output += padZero(input.charCodeAt(i).toString(2), 8) + " ";
                }
            } else if (currentFormat === 'hex') {
                for (let i = 0; i < input.length; i++) {
                    output += padZero(input.charCodeAt(i).toString(16), 2).toUpperCase() + " ";
                }
            } else if (currentFormat === 'decimal') {
                for (let i = 0; i < input.length; i++) {
                    output += input.charCodeAt(i) + " ";
                }
            } else if (currentFormat === 'base64') {
                output = btoa(unescape(encodeURIComponent(input)));
            }
            if (!silent) {
                playBeep(880, 0.08);
                showToast("Payload Encrypted Successfully!");
            }
        } else {
            // Decryption Logic
            if (currentFormat === 'base64') {
                output = decodeURIComponent(escape(atob(input)));
            } else {
                let tokens = input.split(/\s+/);
                for (let i = 0; i < tokens.length; i++) {
                    let decimalVal;
                    if (currentFormat === 'binary') {
                        decimalVal = parseInt(tokens[i], 2);
                    } else if (currentFormat === 'hex') {
                        decimalVal = parseInt(tokens[i], 16);
                    } else if (currentFormat === 'decimal') {
                        decimalVal = parseInt(tokens[i], 10);
                    }
                    if (isNaN(decimalVal)) throw new Error("Invalid Format");
                    output += String.fromCharCode(decimalVal);
                }
            }
            if (!silent) {
                playBeep(440, 0.08);
                showToast("Payload Decrypted Successfully!");
            }
        }
        document.getElementById("outputText").value = output.trim();
    } catch (e) {
        if (!silent) {
            playBeep(200, 0.15);
            showToast("Error: Invalid syntax for selected format!");
        }
    }
}

function padZero(str, targetLength) {
    while (str.length < targetLength) {
        str = "0" + str;
    }
    return str;
}

// QR Code Modal Functions
function openQRModal() {
    let content = document.getElementById("outputText").value;
    if (!content) {
        showToast("No output available to generate QR!");
        return;
    }
    document.getElementById("qrcodeContainer").innerHTML = "";
    new QRCode(document.getElementById("qrcodeContainer"), {
        text: content,
        width: 160,
        height: 160,
        colorDark: "#020617",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    document.getElementById("qrModal").style.display = "flex";
    playBeep(950, 0.08);
}

function closeQRModal() {
    document.getElementById("qrModal").style.display = "none";
}

// Copy & Download Functions
function copyResult() {
    let outputText = document.getElementById("outputText");
    if (!outputText.value) {
        showToast("Nothing to copy!");
        return;
    }
    outputText.select();
    navigator.clipboard.writeText(outputText.value);
    playBeep(1046.5, 0.08);
    showToast("Copied to Clipboard!");
}

function downloadFile() {
    let content = document.getElementById("outputText").value;
    if (!content) {
        showToast("No data available to download!");
        return;
    }
    let blob = new Blob([content], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = `BinaryCipher_${currentFormat}_output.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    playBeep(900, 0.1);
    showToast("File Downloaded Successfully!");
}

function clearFields() {
    document.getElementById("inputText").value = "";
    document.getElementById("outputText").value = "";
    handleInput();
    playBeep(300, 0.1);
    showToast("Workspace Cleared!");
}

// Audio Synthesis
function playBeep(freq, duration) {
    if (!soundEnabled) return;
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = freq;
        gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {}
}

function showToast(message) {
    let toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
