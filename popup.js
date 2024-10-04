document.getElementById('download').addEventListener('click', () => {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        // Send a message to the content script to get the captions
        chrome.tabs.sendMessage(tabs[0].id, { action: 'downloadCaptions' }, response => {
            if (response && response.url) {
                // Use the Downloads API to save the file
                chrome.downloads.download({
                    url: response.url,
                    filename: 'captions.txt',
                    saveAs: true
                });
            } else {
                alert('No captions available to download.');
            }
        });
    });
});