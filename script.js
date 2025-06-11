let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

let selectedVoice = null;

// selecting the female voice
function loadVoices() {
    const voices = window.speechSynthesis.getVoices();
    selectedVoice = voices.find(voice =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("woman") ||
        voice.name.toLowerCase().includes("samantha") || // MacOS
        voice.name.toLowerCase().includes("zira") || // Windows
        voice.name.toLowerCase().includes("google us english") // Chrome
    );

    if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0];
    }
}
window.speechSynthesis.onvoiceschanged = loadVoices;
loadVoices(); 

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.voice = selectedVoice;
    text_speak.rate = 1;
    text_speak.pitch = 1.0; // slightly higher pitch for female tone
    text_speak.volume = 1;
    text_speak.lang = "en-US";
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    let hours = new Date().getHours();
    if (hours > 0 && hours < 12) {
        speak("Good morning sir");
    } else if (hours >= 12 && hours < 16) {
        speak("Good afternoon sir");
    } else {
        speak("Good evening sir");
    }
}

let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();
let isRecognizing = false;

recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = "en-IN";

recognition.onstart = () => {
    console.log("Recognition started");
    isRecognizing = true;
};

recognition.onend = () => {
    console.log("Recognition ended");
    isRecognizing = false;
};

recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    isRecognizing = false;
};

recognition.onresult = (event) => {
    let transcript = event.results[0][0].transcript;
    console.log("Recognized:", transcript);
    content.innerText = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
    if (!isRecognizing) {
        try {
            recognition.start();
        } catch (error) {
            console.error("Recognition start error:", error);
        }
    } else {
        console.log("Already recognizing. Please wait.");
    }
    btn.style.display = "none";
    voice.style.display = "block";
});

function takeCommand(message) {
    btn.style.display = "flex";
    voice.style.display = "none";

    if (message.includes("hello") || message.includes("hey") || message.includes("hi")) {
        speak("Hello sir, what can I help you with?")
    }
    
    else if (message.includes("who are you")) {
        speak("I am a virtual assistant, created by Gopi sir.")
    } 
    
    else if (message.includes("open youtube")) {
        speak("Opening YouTube.");
        window.open("https://www.youtube.com/", "_blank");
    }
    
    else if (message.includes("open instagram")) {
        speak("Opening instagram.");
        window.open("https://www.instagram.com/", "_blank");
    }
    
    else if (message.includes("open whatsapp")) {
        speak("Opening whatsapp.");
        window.open("whatsapp://")
    } 

    else if (message.includes("open calculator")) {
        speak("Opening calculator.");
        window.open("calculator://")
    } 
    
    else if (message.includes("what is time now")|| message.includes("what is current time") ) {
        let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak("The current time is " + time);
    }
    
    else {
        let words=`this is what i found on internet regarding `+ message.replace("tara","")
        speak(words)
        window.open(`https://www.google.com/search?q=${message.replace("tara","")}`, "_blank");
    }
}
