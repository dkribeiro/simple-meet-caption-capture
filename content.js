// Initialize an array to store captions
let captions = [];

// Function to process and store new captions
function processCaption(text) {
    captions.push(text);
    console.log('Caption:', text); // For debugging purposes
}

// Function to observe caption changes
function observeCaptions() {
    console.log("Observing captions");

    // Select the caption container using 'aria-live' attribute
    const captionContainer = document.querySelector('.iOzk7.XDPoIe');
    console.log('Caption container:', captionContainer);

    if (captionContainer) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    // Get the latest captions from the mutation
                    const text = Array.from(captionContainer.querySelectorAll('span'))
                        .map(span => span.innerText.trim())
                        .join(' ');
                    if (text) {
                        processCaption(text);
                    }
                }
            });
        });
        observer.observe(captionContainer, { childList: true, subtree: true });
        console.log('Caption observer initialized');
    } else {
        console.warn('Caption container not found');
    }
}

// Function to check if the user has entered the meeting
function hasEnteredMeeting() {
    // The presence of the 'Leave call' button indicates the user is in a meeting
    return document.querySelector('button[aria-label="Leave call"]') !== null;
}

// Function to enable captions
function enableCaptions() {
    // Use a partial match for 'captions' in the aria-label
    const captionButton = document.querySelector('button[aria-label*="captions"]');

    if (captionButton) {
        // Check if captions are already enabled to avoid unnecessary clicks
        if (captionButton.getAttribute('aria-pressed') === 'false') {
            captionButton.click();
            console.log('Captions enabled');
        } else {
            console.log('Captions are already enabled');
        }
    } else {
        console.log('Caption button not found');
    }
}

// Wait until the user has entered the meeting
function waitForMeeting() {
    const checkInterval = setInterval(() => {
        if (hasEnteredMeeting()) {
            clearInterval(checkInterval);
            console.log('User has entered the meeting');

            // Enable captions
            enableCaptions();

            // Start observing captions
            observeCaptions();
        }
    }, 1000); // Check every second
}

// Start the process when the DOM is fully loaded
window.addEventListener('load', () => {
    waitForMeeting();
});

// Listen for messages from the popup to download the captions
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'downloadCaptions') {
        if (captions.length > 0) {
            const blob = new Blob([captions.join('\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            sendResponse({ url });
            // Optionally, reset captions after downloading
            captions = [];
        } else {
            sendResponse({ url: null });
        }
    }
});