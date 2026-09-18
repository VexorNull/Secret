// Text ko Binary mein encrypt karne ka function
function encryptText() {
    let input = document.getElementById("inputText").value;
    if (!input) {
        showToast("Please enter some text to encrypt!");
        return;
    }
    let output = "";

    for (let i = 0; i < input.length; i++) {
        let binaryChar = input.charCodeAt(i).toString(2);
        output += padZero(binaryChar) + " ";
    }

    document.getElementById("outputText").value = output.trim();
    showToast("Successfully Encrypted!");
}

// Binary ko wapas Normal Text mein decrypt karne ka function
function decryptText() {
    let input = document.getElementById("inputText").value.trim();
    if (!input) {
        showToast("Please enter binary code to decrypt!");
        return;
    }
    let output = "";

    try {
        let binaryArray = input.split(/\s+/);
        
        for (let i = 0; i < binaryArray.length; i++) {
            let decimalValue = parseInt(binaryArray[i], 2);
            if (isNaN(decimalValue)) {
                throw new Error("Invalid Binary");
            }
            output += String.fromCharCode(decimalValue);
        }

        document.getElementById("outputText").value = output;
        showToast("Successfully Decrypted!");
    } catch (error) {
        document.getElementById("outputText").value = "";
        showToast("Error: Invalid Binary Format!");
    }
}

// 8 bits maintain karne ke liye zero padding
function padZero(binary) {
    while (binary.length < 8) {
        binary = "0" + binary;
    }
    return binary;
}

// Input character counter update karna
function updateCounters() {
    let input = document.getElementById("inputText").value;
    document.getElementById("inputCounter").innerText = input.length + " chars";
}

// Result copy karne ka function
function copyResult() {
    let outputText = document.getElementById("outputText");
    if (!outputText.value) {
        showToast("Nothing to copy!");
        return;
    }
    outputText.select();
    navigator.clipboard.writeText(outputText.value);
    showToast("Copied to Clipboard!");
}

// Fields reset karne ka function
function clearFields() {
    document.getElementById("inputText").value = "";
    document.getElementById("outputText").value = "";
    updateCounters();
    showToast("Fields Cleared!");
}

// Stylish Toast Notification popup
function showToast(message) {
    let toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
