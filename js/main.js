document.addEventListener('DOMContentLoaded', () => {

    // 2.1. Маніпуляція елементами: Змінити стиль
    const productNames = document.querySelectorAll('.product-name');
    productNames.forEach(name => {
        name.classList.add('product-name-highlight');
    });

    // 2.1. Додати новий елемент (<p>) у кінець <main>
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
        const newParagraph = document.createElement('p');
        newParagraph.textContent = 'Thank you for visiting our online bakery! We are working on expanding our range.';
        newParagraph.style.textAlign = 'center';
        newParagraph.style.padding = '20px';
        newParagraph.style.backgroundColor = '#f0f0f0';
        newParagraph.style.color = '#7B4AE2';
        newParagraph.style.fontWeight = 'bold';
        mainContainer.appendChild(newParagraph); 
    }

    // 2.2. Динамічна зміна контенту: Поточна дата у футері
    const dateSpan = document.getElementById('current-date');
    if (dateSpan) {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateSpan.textContent = now.toLocaleDateString('uk-UA', options) + ' | ';
    }

    // 2.2. Акордеон "Показати більше" (для index.html)
    const toggleButton = document.getElementById('toggle-about');
    const accordionContent = document.querySelector('.accordion-content');

    if (toggleButton && accordionContent) {
        toggleButton.addEventListener('click', () => {
            accordionContent.classList.toggle('open');
            if (accordionContent.classList.contains('open')) {
                toggleButton.textContent = 'Show less';
                accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
            } else {
                toggleButton.textContent = 'Show more';
                accordionContent.style.maxHeight = null;
            }
        });
    }

    // 5. Робота з локальним сховищем: Ключ
    const THEME_STORAGE_KEY = 'sweetart-theme';
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'dark-theme') {
        body.classList.add('dark-theme');
    }

    // 3.1. Робота з кліками: Зміна теми (Dark Theme)
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                localStorage.setItem(THEME_STORAGE_KEY, 'light-theme');
            } else {
                body.classList.add('dark-theme');
                localStorage.setItem(THEME_STORAGE_KEY, 'dark-theme');
            }
        });
    }
    
    // 3.2. Події миші: Підсвітка меню навігації 
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.classList.add('highlight'); 
        });
        link.addEventListener('mouseleave', () => {
            link.classList.remove('highlight');
        });
    });

    // 3.2. Події клавіатури: Зміна розміру шрифту (ArrowUp/ArrowDown)
    const root = document.documentElement;
    let currentFontSize = parseFloat(getComputedStyle(root).fontSize); 

    document.addEventListener('keydown', (event) => {
        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA' && event.target.tagName !== 'SELECT') {
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                if (currentFontSize < 24) {
                    currentFontSize += 1;
                    root.style.fontSize = `${currentFontSize}px`;
                }
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                if (currentFontSize > 10) {
                    currentFontSize -= 1;
                    root.style.fontSize = `${currentFontSize}px`;
                }
            }
        }
    });

    const orderForm = document.getElementById('order-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const notesInput = document.getElementById('notes');
    const validationMessage = document.getElementById('validation-message');


    function validateFieldLive(inputElement, errorId, validationType) {
        const errorElement = document.getElementById(errorId);
        
        if (errorElement) errorElement.textContent = '';
        inputElement.style.borderLeft = '';
        
        const value = inputElement.value.trim();
        let errorMessage = '';

        if (value.length === 0) {
            return; 
        }

        if (validationType === 'name' && value.length < 3) {
            errorMessage = "The name must contain at least 3 characters.";
        } else if (validationType === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = "Please enter a valid email address.";
            }
        } else if (validationType === 'notes' && value.length < 10) {
            errorMessage = "Messages or notes must be at least 10 characters long.";
        }

        if (errorMessage) {
            if (errorElement) errorElement.textContent = errorMessage;
            inputElement.style.borderLeft = '5px solid #CC0000';
        }
    }


    if (nameInput) {
        nameInput.addEventListener('blur', () => {
            validateFieldLive(nameInput, 'name-error', 'name');
        });
    }

    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            validateFieldLive(emailInput, 'email-error', 'email');
        });
    }

    if (notesInput) {
        notesInput.addEventListener('blur', () => {
            validateFieldLive(notesInput, 'notes-error', 'notes');
        });
    }

    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            resetValidation();

            let isValid = true;
            const errors = {};

            if (nameInput && nameInput.value.trim().length < 3) {
                isValid = false;
                errors.name = "The name must contain at least 3 characters.";
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput && !emailRegex.test(emailInput.value.trim())) {
                isValid = false;
                errors.email = "Please enter a valid email address.";
            }

            if (notesInput && notesInput.value.trim().length > 0 && notesInput.value.trim().length < 10) {
                isValid = false;
                errors.notes = "Messages or notes must be at least 10 characters long.";
            }
            
            
            if (isValid) {
                console.log("The form has been successfully submitted. Order details:");
                const formData = new FormData(orderForm);
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}: ${value}`);
                }

                showValidationMessage("The form has been successfully submitted! We will contact you shortly.", 'success');
                
                orderForm.reset();
            } else {
                showValidationMessage("Please correct the errors highlighted in red.", 'error');

                displayErrors(errors);
            }
        });
    }


    function resetValidation() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.textContent = '');
        
        const validatedInputs = [nameInput, emailInput, notesInput, document.getElementById('phone')];
        validatedInputs.forEach(input => {
            if (input) input.style.borderLeft = ''; 
        });

        if (validationMessage) {
            validationMessage.style.display = 'none';
            validationMessage.textContent = '';
            validationMessage.classList.remove('success', 'error');
        }
    }

    function displayErrors(errors) {
        for (const field in errors) {
            const errorElement = document.getElementById(`${field}-error`);
            const inputElement = document.getElementById(field);

            if (errorElement) {
                errorElement.textContent = errors[field];
            }
            if (inputElement) {
                inputElement.style.borderLeft = '5px solid #CC0000'; 
            }
        }
    }

    function showValidationMessage(message, type) {
        if (validationMessage) {
            validationMessage.textContent = message;
            validationMessage.classList.add(type);
            validationMessage.style.display = 'block';
            setTimeout(() => {
                validationMessage.style.display = 'none';
                validationMessage.classList.remove(type);
                validationMessage.textContent = '';
            }, 5000);
        }
    }
});