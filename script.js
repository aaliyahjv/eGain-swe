//import './style.css'; // import css file
/*
const formInline = document.getElementById(form-inline);
const userInput = document.getElementById(form-control);

let state = "greeting"; 

function sendMessage() {
    // const message = 
    if (!userInput) return;

    setTimeout(() => {
        botResponse(userInput);
    }, 500);
}

function botResponse(userInput) {

    // Simulated conversation flow
    if (state = "lostPackage") {
        botResponse("Oh no! I'm sory to hear that " {user-name} " Let's start finding your order. Do you have the order number? If so, feel free to send it to me.");
    } else if (state === "noOrderNum") {
        botResponse("No worries! I can look it up in our system. Can you send me the email associated with the order please?");
    } else if (state === "yesOrderNumber") {
        if (orderStatus === processing || orderStatus === inTransit) {
            botResponse("Thanks! I checked the tracking on the order and it says it should be " {orderStatus} " The expected delivery date is " {expectedDate} ". If it does not come by then, please feel free to check in with me again! Thank you for your patience.";
        } else if (orderStatus === delivered) {
            botResponse("Thanks! I checked the tracking on the order and it says it should have been " {orderStatus} ". If it is not there, we can proceed ";
        }
}

// Start conversation
botResponse("Oh, hi! My name is Bob Bot. What's your name and how can I help you?");

*/
const chatButton = document.getElementById("chat-button");
const chatContainer = document.getElementById("chat-container");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

let step = 0;
let trackingNumber = "";
let address = "";

chatButton.addEventListener("click", () => {
    chatContainer.classList.toggle("hidden");
});

function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";

  setTimeout(() => {
    botResponse(message);
  }, 500);
}

function appendMessage(sender, text) {
    const wrapper = document.createElement("div");
    wrapper.className = sender === "user" ? "message-wrapper user-align" : "message-wrapper bot-align";
  
    const msgDiv = document.createElement("div");
    msgDiv.className = sender;
    msgDiv.textContent = text;
  
    wrapper.appendChild(msgDiv);
    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

function botResponse(userMsg) {
  switch (step) {
    case 0:
      appendMessage("bot", "Hi! I'm here to help you track your lost package. Can you please provide your tracking number?");
      step++;
      break;
    case 1:
      trackingNumber = userMsg;
      appendMessage("bot", "Thanks! Now, could you confirm your delivery address?");
      step++;
      break;
    case 2:
      address = userMsg;
      appendMessage("bot", `Got it. Checking status for tracking number ${trackingNumber}...`);
      setTimeout(() => {
        appendMessage("bot", `✅ Your package was last scanned near your address (${address}) and is expected to arrive within 2 business days.`);
        appendMessage("bot", "Is there anything else I can help you with?");
      }, 1000);
      step++;
      break;
    default:
      appendMessage("bot", "Feel free to ask anything else or refresh to start over.");
  }
}

// Start the conversation
window.onload = () => {
  botResponse("");
};