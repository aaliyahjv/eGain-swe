/** Save elements from HTML for the following:
 *  chatButton, chatContainer - open chat container (chatbot interface) when 
 *      chat button is on "odd" click (1st, 3rd, 5th, etc. click), and hide 
 *      chat container when chat button is on "even" click (2nd, 4th, 6th 
 *      click) using toggle. 
 *  chatBox - add new messages, and allow for scrolling in the chat box.
 *  userInput - text input sent by user.
 */
const chatButton = document.getElementById("chat-button");
const chatContainer = document.getElementById("chat-container");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

/** Save the following elements:
 * current date.
 * map of orders for testing of different order numbers and estimated 
 *      delivery dates.
 * steps for conversation tracking.
 */
const currentDate = new Date();
const currDateString = currentDate.toString();
const orders = new Map([
    ["123456", ["August 6th, 2024 5:00 PM", "mailbox"]],
    ["789012", [currDateString, "mailbox"]],
    ["345678", ["August 6th, 2026 5:00 PM", "front door"]]
]);
let step = 0;

/* Opens and closes chat container when chat button is pressed using 
        event listener. */
chatButton.addEventListener("click", () => {
    chatContainer.classList.toggle("hidden");
});

/** Function that:
 *  Takes the user's input and removes any whitespace at the ends. If an
 *      empty message is sent, the conversation does not continue (bot does
 *      not respond).
 *  Clears the user's input value after displaying message to chat (appending
 *      done in appendMessage function). 
 *  Waits 500ms for the bot to send a response. */
function sendMessage() {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  userInput.value = "";

  setTimeout(() => {
    botMessage(userMessage);
  }, 500);
}

/** Function that
 *  Checks who is sending the message to set the correct message alignment.
 *  Adds the message to the corresponding message bubble.
 *  Allows for scrolling of the chat box.
*/
function appendMessage(sender, message) {
    const wrapperDiv = document.createElement("div");
    wrapperDiv.className = sender === "user" ? "message-wrapper user-align" : 
        "message-wrapper bot-align";
  
    const messageDiv = document.createElement("div");
    messageDiv.className = sender;
    messageDiv.textContent = message;
  
    wrapperDiv.appendChild(messageDiv);
    chatBox.appendChild(wrapperDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}

/** Function that controls the chatbot's conversation flow using keyword-based
 *      recognition. */
function botMessage(userMessage) {
    const msg = userMessage.toLowerCase();

    // Problem initializing flow
    if (step === 0) {
        if (msg.includes("return policy")) {
            appendMessage("bot", "Yes, of course. Here is our return policy: Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur tenetur facere maiores vel id quos, nisi veniam dolorum? Perspiciatis accusantium laboriosam laudantium earum ex nobis aperiam debitis. Adipisci, deleniti reprehenderit error debitis vitae consectetur, officia alias consequatur aliquid doloremque eveniet, animi qui?");
            setTimeout(() => {
                appendMessage("bot", "Let me know if there is anything else I can help you with!");
            }, 1000);
        } else if (msg.includes("return")) {
            appendMessage("bot", "Sorry to here that you're thinking about making a return. If you've changed your mind, we'll do our best to make things right!, Otherwise, I can get the return started for you. Can you please send me the order number?");
            // EXAMPLE: step = 2;
        } else if (msg.includes("track") || msg.includes("lost") ||
                msg.includes("missing") || msg.includes("status")) {
            appendMessage("bot", "Sure thing! Let's start tracking your package. Can you please send me the order number?");
            step = 1;
        } else if (msg.includes("near") || msg.includes("nearest") ||
                msg.includes("closest") || msg.includes("store") ||
                msg.includes("location")) {
            appendMessage("bot", "We can't wait to have you! Can you please send me the city you're looking to shop at?");
            // EXAMPLE: step = 3; 
        }
        return;
    }

    /**Package tracking flow 
     * Additionally comments added for improvement with more information.
    */
    if (step === 1) {
        const userTrackingNum = msg;
        if ((orders.has(userTrackingNum))) {
            let estDeliveryString = orders.get(userTrackingNum)[0];
            estDeliveryString = estDeliveryString.replace(/(\d+)(st|nd|rd|th)/, '$1');
            const estDeliveryDate = new Date(estDeliveryString);        
            if (estDeliveryDate <= currentDate) {
                appendMessage("bot", `Thanks! Checking the status of order 
                        number ${userTrackingNum} ...`);
                setTimeout(() => {
                    appendMessage("bot", `It looks like the order was delivered
                        on ${estDeliveryString} at the 
                        ${orders.get(userTrackingNum)[1]}. Has it arrived?`);
                }, 1000);
                step = 11;
            } else {
                appendMessage("bot", `Thanks! Checking the status of order 
                        number ${userTrackingNum} ...`);
                setTimeout(() => {
                    appendMessage("bot", `It looks like the estimated delivery 
                            date is ${estDeliveryString}. Be aware that there 
                            could be delays in both the delivery and tracking 
                            page updates. If the order does not come by the 
                            following morning, please feel free to check in 
                            with me again!`);
                }, 1000);
                step = 0;
            }
        } else if (msg.includes("@")) {
            let userEmail = msg;
            appendMessage("bot", `Thanks! Checking our system for orders 
                    associated with the email ${userEmail} ...`);
            // Continue to find order number in database and help customer 
        } else {
            appendMessage("bot", `Thanks! Checking the status of order number 
                    ${userTrackingNum} ...`);
            setTimeout(() => {
                appendMessage("bot", "It looks like the order number is invalid. Make sure you double check all 6 digits! If you need, you can send me the associated email address and I can try to find it for you.");
            }, 1000);
        } 
    }

    // Potential escalation flow.
    if (step === 11) {
        if (msg.includes("yes")) {
            appendMessage("bot", "Great! Enjoy your order!");
            step = 1;
        } else if (msg.includes("no")) {
            appendMessage("bot", "Oh no! I hope we can make it up to you! Would you like to return or replace this order?");
        }
    }
    // Continue with replacement or return process 
}

// Starts the conversation when the chat container loads.
window.onload = () => {
  appendMessage("bot", "Oh, hi! My name is Bob Bot, but you can call me Bob. What can I help you with?");
};