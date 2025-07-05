// Checkout Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkout-form');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    const submitBtn = document.querySelector('.checkout-btn');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');

    // Card number formatting
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });

    // Expiry date formatting
    expiryDateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });

    // CVV formatting (numbers only)
    cvvInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Trial logic
    const urlParams = new URLSearchParams(window.location.search);
    const isTrial = urlParams.get('trial') === '1';
    const planNameEl = document.getElementById('plan-name');
    const planPriceEl = document.getElementById('plan-price');
    const trialMessage = document.getElementById('trial-message');
    const trialSummary = document.getElementById('trial-summary');
    const cancelTrialGroup = document.getElementById('cancel-trial-group');
    let trialEndDate;
    if (isTrial) {
        // Set Starter plan
        planNameEl.textContent = 'Starter Plan';
        planPriceEl.textContent = '399';
        // Calculate trial end date
        const today = new Date();
        trialEndDate = new Date(today);
        trialEndDate.setDate(today.getDate() + 7);
        const trialEndStr = trialEndDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        // Show trial message
        trialMessage.style.display = 'block';
        trialMessage.innerHTML = `<strong>7-day free trial!</strong> You will not be charged until your trial ends on <strong>${trialEndStr}</strong>. Cancel anytime before then to avoid charges.`;
        // Show trial summary
        trialSummary.style.display = 'block';
        trialSummary.innerHTML = `<span style='color:#51cf66;font-weight:600;'>7-day free trial</span><br>First payment of <strong>$399.00</strong> will be charged on <strong>${trialEndStr}</strong> unless you cancel before then.`;
        // Show cancel option
        cancelTrialGroup.style.display = 'flex';
    }

    // Plan selection logic
    const planParam = urlParams.get('plan');
    let selectedPlan = 'starter';
    let selectedPlanName = 'Starter Plan';
    let selectedPlanPrice = 399;
    if (planParam === 'complete') {
        selectedPlan = 'complete';
        selectedPlanName = 'Complete Plan';
        selectedPlanPrice = 649;
    }
    // If trial is active, always use Starter Plan
    if (isTrial) {
        selectedPlan = 'starter';
        selectedPlanName = 'Starter Plan';
        selectedPlanPrice = 399;
    }
    planNameEl.textContent = selectedPlanName;
    planPriceEl.textContent = selectedPlanPrice;

    // Update plan features for meal count
    const planMealsEl = document.getElementById('plan-meals');
    if (selectedPlan === 'starter') {
        planMealsEl.querySelector('span').textContent = '1 meal per day';
    } else {
        planMealsEl.querySelector('span').textContent = '2 meals per day';
    }

    // Form validation
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field, 'This field is required');
                isValid = false;
            } else {
                clearError(field);
            }
        });

        // Email validation
        const emailField = document.getElementById('email');
        if (emailField.value && !isValidEmail(emailField.value)) {
            showError(emailField, 'Please enter a valid email address');
            isValid = false;
        }

        // Card number validation
        if (cardNumberInput.value && !isValidCardNumber(cardNumberInput.value)) {
            showError(cardNumberInput, 'Please enter a valid card number');
            isValid = false;
        }

        // Expiry date validation
        if (expiryDateInput.value && !isValidExpiryDate(expiryDateInput.value)) {
            showError(expiryDateInput, 'Please enter a valid expiry date (MM/YY)');
            isValid = false;
        }

        // CVV validation
        if (cvvInput.value && !isValidCVV(cvvInput.value)) {
            showError(cvvInput, 'Please enter a valid CVV');
            isValid = false;
        }

        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidCardNumber(cardNumber) {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        return cleanNumber.length >= 13 && cleanNumber.length <= 19;
    }

    function isValidExpiryDate(expiryDate) {
        const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!regex.test(expiryDate)) return false;

        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        const expYear = parseInt(year);
        const expMonth = parseInt(month);

        if (expYear < currentYear) return false;
        if (expYear === currentYear && expMonth < currentMonth) return false;

        return true;
    }

    function isValidCVV(cvv) {
        return cvv.length >= 3 && cvv.length <= 4;
    }

    function showError(field, message) {
        clearError(field);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '1.2rem';
        errorDiv.style.marginTop = '0.4rem';
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#e74c3c';
    }

    function clearError(field) {
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '#ddd';
    }

    // Simulate payment processing
    async function processPayment(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                const isSuccess = Math.random() > 0.1;
                if (isSuccess) {
                    resolve({
                        success: true,
                        transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                        message: 'Payment processed successfully!'
                    });
                } else {
                    reject(new Error('Payment failed. Please try again.'));
                }
            }, 3000); // Simulate 3-second processing time
        });
    }

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        submitBtn.disabled = true;
        // Collect form data
        const formData = new FormData(form);
        const orderData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zipCode: formData.get('zipCode'),
            country: formData.get('country'),
            cardNumber: formData.get('cardNumber'),
            expiryDate: formData.get('expiryDate'),
            cvv: formData.get('cvv'),
            cardholderName: formData.get('cardholderName'),
            newsletter: formData.get('newsletter') === 'on',
            plan: isTrial ? 'Starter Plan (7-day trial)' : selectedPlanName,
            amount: selectedPlanPrice,
            trial: isTrial,
            trialEnd: isTrial ? trialEndDate : null,
            cancelTrial: isTrial ? formData.get('cancel-trial') === 'on' : false
        };
        try {
            if (isTrial && orderData.cancelTrial) {
                showTrialCancelledMessage(orderData);
            } else if (isTrial) {
                showTrialSuccessMessage(orderData);
            } else {
                const result = await processPayment(orderData);
                showSuccessMessage(result);
            }
        } catch (error) {
            showErrorMessage(error.message);
        } finally {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });

    function showSuccessMessage(result) {
        // Create success modal
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="success-icon animated-tick">
                    <ion-icon name="checkmark-circle-outline"></ion-icon>
                </div>
                <h2>Payment Successful!</h2>
                <p>Thank you for choosing Omnifood. Your order has been confirmed.</p>
                <div class="order-details-box">
                    <p><strong>Transaction ID:</strong> ${result.transactionId}</p>
                    <p><strong>Plan:</strong> ${selectedPlanName}</p>
                    <p><strong>Amount:</strong> $${selectedPlanPrice}.00</p>
                </div>
                <p class="delivery-info">
                    You will receive your first meal within 2-3 business days.<br>
                    We'll send you an email confirmation with delivery details.
                </p>
                <button class="btn btn--full" onclick="window.location.href='success.html'">
                    View Order Details
                </button>
            </div>
        `;
        // Add modal styles and tick animation
        const style = document.createElement('style');
        style.textContent = `
            .success-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
            .modal-content { background-color: #fff; padding: 4.8rem; border-radius: 11px; text-align: center; max-width: 50rem; margin: 2rem; }
            .success-icon { font-size: 6.4rem; color: #51cf66; margin-bottom: 2.4rem; display: flex; align-items: center; justify-content: center; }
            .success-icon ion-icon { width: 100%; height: 100%; }
            .animated-tick { animation: tick-pop 0.7s cubic-bezier(0.23, 1.12, 0.32, 1) both; }
            @keyframes tick-pop {
                0% { transform: scale(0.2) rotate(-30deg); opacity: 0; }
                60% { transform: scale(1.2) rotate(10deg); opacity: 1; }
                80% { transform: scale(0.95) rotate(-3deg); }
                100% { transform: scale(1) rotate(0); opacity: 1; }
            }
            .order-details-box { background: #fdf2e9; border-radius: 9px; padding: 2rem; margin: 2rem 0; text-align: left; }
            .order-details-box p { margin: 0.5rem 0; font-size: 1.6rem; }
            .delivery-info { font-size: 1.6rem; color: #666; margin-bottom: 3.2rem; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);
    }

    function showErrorMessage(message) {
        // Create error modal
        const modal = document.createElement('div');
        modal.className = 'error-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="error-icon">
                    <ion-icon name="close-circle-outline"></ion-icon>
                </div>
                <h2>Payment Failed</h2>
                <p>${message}</p>
                <p>Please check your payment details and try again.</p>
                <button class="btn btn--full" onclick="this.closest('.error-modal').remove()">
                    Try Again
                </button>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .error-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .modal-content {
                background-color: #fff;
                padding: 4.8rem;
                border-radius: 11px;
                text-align: center;
                max-width: 50rem;
                margin: 2rem;
            }
            .error-icon {
                font-size: 6.4rem;
                color: #e74c3c;
                margin-bottom: 2.4rem;
            }
            .error-icon ion-icon {
                width: 100%;
                height: 100%;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);
    }

    function showTrialSuccessMessage(orderData) {
        // Show modal for trial started
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        const trialEndStr = orderData.trialEnd.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        modal.innerHTML = `
            <div class="modal-content">
                <div class="success-icon">
                    <ion-icon name="checkmark-circle-outline"></ion-icon>
                </div>
                <h2>Free Trial Started!</h2>
                <p>Your 7-day free trial for the Starter Plan is now active.</p>
                <div class="order-details">
                    <p><strong>Trial Ends:</strong> ${trialEndStr}</p>
                    <p><strong>First Payment:</strong> $${selectedPlanPrice}.00 (charged after trial unless canceled)</p>
                </div>
                <p class="delivery-info">
                    You can cancel anytime before the trial ends to avoid charges.<br>
                    We'll send you a reminder before your trial ends.
                </p>
                <button class="btn btn--full" onclick="window.location.href='index.html'">
                    Return to Home
                </button>
            </div>
        `;
        // Add modal styles (reuse existing)
        const style = document.createElement('style');
        style.textContent = `
            .success-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
            .modal-content { background-color: #fff; padding: 4.8rem; border-radius: 11px; text-align: center; max-width: 50rem; margin: 2rem; }
            .success-icon { font-size: 6.4rem; color: #51cf66; margin-bottom: 2.4rem; }
            .success-icon ion-icon { width: 100%; height: 100%; }
            .order-details { background-color: #fdf2e9; padding: 2.4rem; border-radius: 9px; margin: 2.4rem 0; text-align: left; }
            .order-details p { margin-bottom: 0.8rem; font-size: 1.6rem; }
            .delivery-info { font-size: 1.6rem; color: #666; margin-bottom: 3.2rem; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);
    }

    function showTrialCancelledMessage(orderData) {
        // Show modal for trial cancelled
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="success-icon">
                    <ion-icon name="close-circle-outline" style="color:#e74c3c;"></ion-icon>
                </div>
                <h2>Trial Cancelled</h2>
                <p>Your free trial has been cancelled. You will not be charged.</p>
                <button class="btn btn--full" onclick="window.location.href='index.html'">
                    Return to Home
                </button>
            </div>
        `;
        // Add modal styles (reuse existing)
        const style = document.createElement('style');
        style.textContent = `
            .success-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
            .modal-content { background-color: #fff; padding: 4.8rem; border-radius: 11px; text-align: center; max-width: 50rem; margin: 2rem; }
            .success-icon { font-size: 6.4rem; color: #e74c3c; margin-bottom: 2.4rem; }
            .success-icon ion-icon { width: 100%; height: 100%; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);
    }

    // Real-time validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                showError(this, 'This field is required');
            } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                showError(this, 'Please enter a valid email address');
            } else {
                clearError(this);
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim()) {
                clearError(this);
            }
        });
    });
}); 