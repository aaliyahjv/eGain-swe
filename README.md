# eGain SWE
This repository contains my solution to the eGain SWE Take-Home Assignment. \
**Scenario**: Helping a customer track a lost package. \
**Languages**: HTML/CSS/JavaScript (basic web interface). \
**Overview:** Chatbot that uses keyword-based recognition and "steps" for tracking chat progression. Includes text input and suggestion bubbles for users to send messages, and error handling for unexpected user inputs.

## Setup/installation instructions
No setup or installation required. \
Live link to the page using GitHub Pages: [Click here](https://www.google.com "Sharp Point Coffee")

## Brief explanation of your approach
**Goal:** Implement a chatbot that addresses users' problems quickly and easily in a more natural language than other AI bots.

**Implementation and design steps:**
1. Research - experience a chatbot of another company, and ask it to find a lost package.
2. Design simple chatbot conversation flow using research and interests of self and others.
3. Start coding!
    - HTML: add DOCTYPE, head with meta, title, and links, body with chat container (including chat box and input row), chat button, and suggestion buttons (very last thing added as it was of less importance compared to other components), in that order.
    - CSS: style to get a sense of what the chatbot looks like before testing with input. Ended with styling after making sure Javascript code was functioning correctly.
    - JavaScript: save elements from HTML, create variables, create sendMessage function that uses user input, create appendMessage function that displays messages correctly, create botMessage function that controls the chatbot's conversation flow, add code that starts the conversation, add event listener for chat button, and add suggestMessage function and suggestion button arrays, in that order.

## Screenshots/examples of the chatbot in action
Chat button displayed on website \
![alt text](img/display-chat-button.png "Viewing chat button")

Opening the chatbot \
![alt text](img/opening-chat.png "Opening the chatbot")

Sending a message that doesn't contain a keyword \
![alt text](img/without-keyword.png "Sending message without keyword")

Using suggestion buttons to fill user's text input \
![alt text](img/suggest-button.png "Fill input with suggestion button") 

Sending a message that contains keyword "track" or "lost" (conversation starts to flow) \
![alt text](img/with-keyword.png "Sending message with keyword")

Sending an invalid order number (less than 6 digits, and 6 digits but not in list of orders) \
![alt text](img/invalid-order-num3.png "Sending 3-digit order number") \
![alt text](img/invalid-order-num6.png "Sending invalid 6-digit order number")

Sending a valid order number (6 digits and contained in list of orders) \
![alt text](img/valid-order-num.png "Sending valid order number")