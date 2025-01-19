if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then((registration) => {
                console.log(
                    "Service Worker registered with scope:",
                    registration.scope
                );
            })
            .catch((error) => {
                console.log("Service Worker registration failed:", error);
            });
    });
}

let deferredPrompt;
const installPromptDiv = document.getElementById("installPrompt");
const installButton = document.getElementById("installButton");

window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent the default install prompt
    e.preventDefault();
    // Store the event so it can be triggered later
    deferredPrompt = e;

    // Show the install prompt div
    installPromptDiv.style.display = "block";

    // When the user clicks the install button inside the div
    installButton.addEventListener("click", () => {
        // Show the native install prompt
        deferredPrompt.prompt();

        // Wait for the user's choice
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                console.log("User accepted the install prompt");
            } else {
                console.log("User dismissed the install prompt");
            }

            // Remove the install prompt div after the user has responded
            installPromptDiv.style.display = "none";

            // Clear the deferredPrompt to free up resources
            deferredPrompt = null;
        });
    });
});
