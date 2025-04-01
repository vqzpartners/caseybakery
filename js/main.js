document.addEventListener('DOMContentLoaded', function() {
    // Render all drops
    renderDrops();
    
    // Modal functionality
    const modal = document.getElementById("waitlistModal");
    const closeButton = document.querySelector(".close-button");
    
    // Close modal when clicking X
    closeButton.addEventListener("click", function() {
        modal.style.display = "none";
    });
    
    // Close modal when clicking outside
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
    
    // Timer functionality - only update timers that exist
    updateTimers();
    setInterval(updateTimers, 1000);
    
    // Setup newsletter form handlers
    setupNewsletterForms();
});

// Function to render all drops from the data file
function renderDrops() {
    const container = document.getElementById('drops-container');
    
    bakeryDrops.forEach(drop => {
        // Determine image source based on status
        const imageSrc = drop.status === 'coming-soon' ? 'img/casey/mistery.jpg' : drop.image;
        
        // Determine button text and action
        let buttonType, buttonText;
        if (drop.status === 'available' && drop.url) {
            // Available with URL - direct link
            buttonType = 'link';
            buttonText = 'Order Now';
        } else {
            // Coming soon or available without URL - waitlist
            buttonType = 'waitlist';
            buttonText = drop.status === 'coming-soon' ? 'NOTIFY ME' : 'Join Waitlist';
        }
        
        // Create the HTML for this drop
        const dropHTML = `
            <div class="drop-item">
                <div class="drop-image-container">
                    <img src="${imageSrc}" alt="${drop.title}" class="drop-image">
                    <div class="drop-label">${drop.status === 'available' ? 'AVAILABLE' : 'COMING SOON'}</div>
                    ${drop.releaseDate ? `<div class="drop-timer" data-countdown="${drop.releaseDate}">Loading...</div>` : ''}
                </div>
                <div class="drop-content">
                    <h3 class="drop-title">${drop.title}</h3>
                    ${buttonType === 'link' 
                        ? `<a href="${drop.url}" class="drop-button">${buttonText}</a>`
                        : `<button class="drop-button waitlist-trigger" data-drop="${drop.title}">${buttonText}</button>`
                    }
                </div>
            </div>
        `;
        
        // Add the drop to the container
        container.innerHTML += dropHTML;
    });
    
    // Add event listeners for waitlist buttons after they're created
    const waitlistTriggers = document.querySelectorAll(".waitlist-trigger");
    waitlistTriggers.forEach(button => {
        button.addEventListener("click", function() {
            const dropName = this.getAttribute('data-drop');
            document.getElementById('dropNameField').value = dropName;
            document.getElementById('waitlistModal').style.display = "flex";
        });
    });
}

// Function to update countdown timers
function updateTimers() {
    const timers = document.querySelectorAll('.drop-timer');
    
    timers.forEach(timer => {
        const targetDate = new Date(timer.getAttribute('data-countdown')).getTime();
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            timer.innerHTML = "Coming soon!";
        } else {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            timer.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
        }
    });
}

// Newsletter form functionality
function setupNewsletterForms() {
    function submitHandler(event) {
        event.preventDefault();
        var container = event.target.parentNode;
        var form = container.querySelector(".newsletter-form");
        var formInputs = container.querySelectorAll(".newsletter-form-input");
        var success = container.querySelector(".newsletter-success");
        var errorContainer = container.querySelector(".newsletter-error");
        var errorMessage = container.querySelector(".newsletter-error-message");
        var backButton = container.querySelector(".newsletter-back-button");
        var submitButton = container.querySelector(".newsletter-form-button");
        var loadingButton = container.querySelector(".newsletter-loading-button");
        
        const rateLimit = () => {
            errorContainer.style.display = "flex";
            errorMessage.innerText = "Too many signups, please try again in a little while";
            submitButton.style.display = "none";
            formInputs.forEach(input => {
                input.style.display = "none";
            });
            backButton.style.display = "block";
        }
        
        // Compare current time with time of previous sign up
        var time = new Date();
        var timestamp = time.valueOf();
        var previousTimestamp = localStorage.getItem("loops-form-timestamp");
        
        // If last sign up was less than a minute ago, display error
        if (previousTimestamp && Number(previousTimestamp) + 60000 > timestamp) {
            rateLimit();
            return;
        }
        localStorage.setItem("loops-form-timestamp", timestamp);
        
        submitButton.style.display = "none";
        loadingButton.style.display = "flex";
        
        const formData = new FormData(form);
        const firstName = formData.get('firstName');
        const email = formData.get('email');
        const mailingLists = formData.get('mailingLists');
        
        var formBody = "userGroup=&firstName=" + encodeURIComponent(firstName) + 
            "&email=" + encodeURIComponent(email) +
            "&mailingLists=" + encodeURIComponent(mailingLists);
        
        fetch(event.target.action, {
            method: "POST",
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
        .then((res) => [res.ok, res.json(), res])
        .then(([ok, dataPromise, res]) => {
            if (ok) {
                // If response successful, display success
                success.style.display = "flex";
                form.reset();
            } else {
                // If response unsuccessful, display error message or response status
                dataPromise.then(data => {
                    errorContainer.style.display = "flex";
                    errorMessage.innerText = data.message
                        ? data.message
                        : res.statusText;
                });
            }
        })
        .catch(error => {
            // Check for cloudflare error
            if (error.message === "Failed to fetch") {
                rateLimit();
                return;
            }
            // If error caught, display error message if available
            errorContainer.style.display = "flex";
            if (error.message) errorMessage.innerText = error.message;
            localStorage.setItem("loops-form-timestamp", '');
        })
        .finally(() => {
            formInputs.forEach(input => {
                input.style.display = "none";
            });
            loadingButton.style.display = "none";
            backButton.style.display = "block";
        });
    }
    
    function resetFormHandler(event) {
        var container = event.target.parentNode;
        var formInputs = container.querySelectorAll(".newsletter-form-input");
        var success = container.querySelector(".newsletter-success");
        var errorContainer = container.querySelector(".newsletter-error");
        var errorMessage = container.querySelector(".newsletter-error-message");
        var backButton = container.querySelector(".newsletter-back-button");
        var submitButton = container.querySelector(".newsletter-form-button");
        
        success.style.display = "none";
        errorContainer.style.display = "none";
        errorMessage.innerText = "Oops! Something went wrong, please try again";
        backButton.style.display = "none";
        formInputs.forEach(input => {
            input.style.display = "flex";
        });
        submitButton.style.display = "flex";
    }
    
    var formContainers = document.getElementsByClassName("newsletter-form-container");
    
    for (var i = 0; i < formContainers.length; i++) {
        var formContainer = formContainers[i];
        var handlersAdded = formContainer.classList.contains('newsletter-handlers-added');
        if (handlersAdded) continue;
        formContainer
            .querySelector(".newsletter-form")
            .addEventListener("submit", submitHandler);
        formContainer
            .querySelector(".newsletter-back-button")
            .addEventListener("click", resetFormHandler);
        formContainer.classList.add("newsletter-handlers-added");
    }
}
