/** Save elements from HTML for the following:
 *  chatButton, chatContainer - open chat container (chatbot interface) when 
 *      chat button is on "odd" click (1st, 3rd, 5th, etc. click), and hide 
 *      chat container when chat button is on "even" click (2nd, 4th, 6th 
 *      click) using toggle. 
 *  chatBox - add new messages, and allow for scrolling in the chat box.
 *  userInput - text input sent by user. */
const chatButton = document.getElementById("chat-button");
const chatContainer = document.getElementById("chat-container");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

/** Save the following elements:
 *  current date - using the Date() function.
 *  orders - map of orders for testing of different order numbers and estimated 
 *      delivery dates.
 *  step - steps for conversation tracking. */
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
 *  Saves suggestions-container element from HTML to know where to display
 *      suggestion buttons.
 *  Clear's existing suggestion buttons before getting replaced.
 *  For every string in the array of suggestions
 *      A new button is created.
 *      The button is given a className and the string as it's text.
 *  Gives the ability to fill in the user's input text with the button's text
 *      when the button is clicked. Then the user can edit the text or press 
 *      enter. 
 *  Adds the suggestion button to the suggestions container. */
function suggestMessages(updatedSuggestions) {
    const userSuggestions = document.querySelector('.suggestions-container');
    userSuggestions.innerHTML = "";

    updatedSuggestions.forEach(text => {
        const btn = document.createElement('button');
        btn.className = 'suggestion-btn';
        btn.textContent = text;
        btn.onclick = () => {
            document.getElementById('user-input').value = text;
            document.getElementById('user-input').focus();
        };
        userSuggestions.appendChild(btn);
    });
}

/** Function that:
 *  Takes the user's input and removes any whitespace at the ends. 
 *      If an empty message is sent, the conversation does not continue (bot
 *      does not respond).
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

/** Function that:
 *  Checks who is sending the message to set the correct message alignment.
 *  Adds the message to the corresponding message bubble.
 *  Allows for scrolling of the chat box. */
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

/** Function that:
 *  Controls the chatbot's conversation flow using keyword-based
 *      recognition. 
 *  Changes the user's message to all lower caseto handle all strings equally. 
 *  Is initialized at step 0 at beginning of code.
 * 
 *  If a certain keyword is used by the user, the chatbot will know which
 *      problem to address, and will send the corresponding response. 
 *  For every step in the conversation flow, the value of step changes. */
function botMessage(userMessage) {
    const msg = userMessage.toLowerCase();

    /** Problem initializing flow.
     *  Asking for the return policy only involves one step by the 
     *      chatbot, so step does not change. However, problems like tracking
     *      order or return an order would change the step, as the conversation
     *      flow would continue. */
    if (step === 0) {
        if (msg.includes("return policy")) {
            appendMessage("bot", "Yes, of course. Here is our return policy: Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur tenetur facere maiores vel id quos, nisi veniam dolorum? Perspiciatis accusantium laboriosam laudantium earum ex nobis aperiam debitis. Adipisci, deleniti reprehenderit error debitis vitae consectetur, officia alias consequatur aliquid doloremque eveniet, animi qui?");
            setTimeout(() => {
                appendMessage("bot", "Let me know if there is anything else I can help you with!");
            }, 1000);
        } else if (msg.includes("return")) {
            suggestMessages([]);
            appendMessage("bot", "Sorry to here that you're thinking about making a return. I can get the return started for you. Can you please send me the order number?");
        } else if (msg.includes("track") || msg.includes("lost") ||
                msg.includes("missing") || msg.includes("status")) {
            suggestMessages([]);
            appendMessage("bot", "Sure thing! Let's start tracking your package. Can you please send me the order number?");
            step = 1;
        } else if (msg.includes("near") || msg.includes("nearest") ||
                msg.includes("closest") || msg.includes("store") ||
                msg.includes("nearby") || msg.includes("close by") ||
                msg.includes("location")) {
            appendMessage("bot", "We can't wait to have you! Can you please send me the city you're looking to shop at?");
            /* Suggest cities based on user's current location (extra step to
                    ask user for permission to share location), or don't
                    include suggestion buttons. */
            suggestMessages(["Sunnyvale", "Mountain View", "Santa Clara"]);
        }
        return;
    }

    /** Package tracking flow. 
     *  If the user's input is an existing order number, check the estimated
     *      delivery date.
     *      The chatbot will send the order's status whether the estimated
     *          date is earlier, on, or later than the current date. 
     *      If the estimated delivery date is earlier than or on the current 
     *      date (and time), the package should've been delivered. The 
     *      chatbot will double check that it has arrived.
     *          Step will change.
     *      Else, the chatbot will say to wait for the package's delivery.
     *  Else, the chatbot will suggest to double check the digits of user's
     *      input, or send an email the order is a associated with.
     *      
     *  Additional comments added for improvement given more information. */
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
                suggestMessages(["Yes", "No"]);
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
                suggestMessages(["Make a return", "Find a store nearby", "Track my lost package", "Return policy"]);
                step = 0;
            }
        } else if (msg.includes("@")) {
            let userEmail = msg;
            suggestMessages([]);
            appendMessage("bot", `Thanks! Checking our system for orders 
                    associated with the email ${userEmail} ...`);
            // IMPROVE: Continue to find order number in database and help customer 
        } else {
            suggestMessages([]);
            appendMessage("bot", `Thanks! Checking the status of order number 
                    ${userTrackingNum} ...`);
            setTimeout(() => {
                appendMessage("bot", "It looks like the order number is invalid. Make sure you double check all 6 digits! If you need, you can send me the associated email address and I can try to find it for you.");
            }, 1000);
        } 
    }

    /** Potential escalation flow.
     *  If the package has arrived, the bot will send a closing.
     *  Else, the bot will ask if the user wants to return or replace the 
     *      package. */
    if (step === 11) {
        if (msg.includes("yes")) {
            appendMessage("bot", "Great! Enjoy your order!");
            suggestMessages(["Make a return", "Find a store nearby", "Track my lost package", "Return policy"]);
            step = 0;
        } else if (msg.includes("no")) {
            appendMessage("bot", "Oh no! I hope we can make it up to you! Would you like to return or replace this order?");
            suggestMessages(["Return", "Replace"]);
            step = 12;
        }
    }
    // IMPROVE: Continue with replacement or return process 
}

// Starts the conversation when the chat container loads.
window.onload = () => {
  appendMessage("bot", "Oh, hi! My name is Bob Bot, but you can call me Bob. What can I help you with?");
  suggestMessages(["Make a return", "Find a store nearby", "Track my lost package", "Return policy"]);
};