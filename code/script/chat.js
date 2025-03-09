let isTyping = false;
let typingInterval;
let currentMessage = '';

document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
document.getElementById('stopButton').addEventListener('click', stopTyping);

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value;
    if (message.trim() === '') return;

    displayMessage('', message);
    userInput.value = '';

    if (isTyping) return; // If bot is already typing, ignore new input

    const aiResponse = await getAIResponse(message);
    displayMessageGradually('', aiResponse);
}

async function getAIResponse(userMessage) {
    const prompt = userMessage + "simple answer";
    try {
        const response = await fetch("http://localhost:3000/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.content;  // Return the bot's response content

    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, I encountered an error.';
    }
}

function displayMessage(sender, message) {
    const chatbox = document.getElementById('chatbox');
    const messageElement = document.createElement('p');
    messageElement.textContent = `${sender} ${message}`;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;
}


function formatTextWithMarkdown(text) {
    // Bold: **bold** or __bold__
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italic: *italic* or _italic_
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.*?)_/g, '<em>$1</em>');

    // Strikethrough: ~~strikethrough~~
    text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');

    // Code block: `code`
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');

    return text;
}


// Gradual message display with typing effect
function displayMessageGradually(sender, message) {
    const chatbox = document.getElementById('chatbox');
    const messageElement = document.createElement('p');
    messageElement.textContent = `${sender} `;  // Start with the sender's name

    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;

    let index = 0;
    isTyping = true;
    typingInterval = setInterval(() => {
        // Format the message and append each character
        messageElement.innerHTML = `${sender} ` + formatTextWithMarkdown(message.slice(0, index + 1));

        index++;

        // When the entire message has been typed, stop the typing effect
        if (index === message.length) {
            clearInterval(typingInterval);
            isTyping = false;
        }
    }, 30);  // Speed of typing effect (milliseconds between each character)
}

// Stop typing if the stop button is pressed
function stopTyping() {
    if (isTyping) {
        clearInterval(typingInterval);
        isTyping = false;
        document.getElementById('chatbox').lastChild.textContent += " (Stopped)";
    }
}
