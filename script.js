// Text ko Binary (0101) mein encrypt karne ka function
function encryptText() {
    let input = document.getElementById("inputText").value;
    let output = "";

    for (let i = 0; i < input.length; i++) {
        // Har character ka ASCII code nikal kar binary mein convert karein (8-bit format)
        let binaryChar = input.charCodeAt(i).toString(2);
        output += padZero(binaryChar) + " ";
    }

    document.getElementById("outputText").value = output.trim();
}

// Binary ko wapas Normal Text mein decrypt karne ka function
function decryptText() {
    let input = document.getElementById("inputText").value.trim();
    let output = "";

    try {
        // Binary codes ko space ke hisaab se alag karein
        let binaryArray = input.split(" ");
        
        for (let i = 0; i < binaryArray.length; i++) {
            // Binary string ko decimal mein aur phir character mein badlein
            let decimalValue = parseInt(binaryArray[i], 2);
            output += String.fromCharCode(decimalValue);
        }

        document.getElementById("outputText").value = output;
    } catch (error) {
        document.getElementById("outputText").value = "Invalid Binary Code!";
    }
}

// 8 bits poora karne ke liye leading zeros add karna
function padZero(binary) {
    while (binary.length < 8) {
        binary = "0" + binary;
    }
    return binary;
}

// Fields clear karne ka function
function clearFields() {
    document.getElementById("inputText").value = "";
    document.getElementById("outputText").value = "";
}
