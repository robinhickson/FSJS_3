# interactive-form
 FSJS Project 3


An interactive registration form for a conference.
--------------------------------------------------
INPUT FIELDS:

Name 
Email
T-shirt selection (options per theme)
Job Role (including hidden option to add 'other')
Activity registration (with automatic event deconfliction)
Payment information:
    Paypal
    Bitcoin
    Credit Card - requires credit card field validation for CC number, zip and cvv

--------------------------------------------------
FORMFIELD ERROR HANDLING:

Form uses live checks on specific fields for validation
i.e. Name field helper function

// add live validation helper for name input field//

getName.addEventListener('keyup', () => {
    nameValidate();
});

including additional error message hinting on validation attempt 
i.e. Name field hints after name field input validation with regex 

//use nameRegex to test name input validation//

const nameValidate = function () {
    let nameRegex = /^(\s+)?[A-Z]+(\s+)?((\w+)?(\s)?)+?$/i;
    let nameHintRegex = /\d/;
    // additional hint to exclude numbers in name field//
    if (nameHintRegex.test(getName.value)) {
        formFieldsCSSinvalidNotCreditCard(getName);
        document.getElementById('name-hint').textContent = "Name field cannot contain a number";
    // name validation check//
    } else if (!nameRegex.test(getName.value)) {
        formFieldsCSSinvalidNotCreditCard(getName);
        document.getElementById('name-hint').textContent = "Name field cannot be blank";

    } else {
        formFieldsCSSvalidNotCreditCard(getName);
    }

};

--------------------------------------------------

SUBMIT VALIDATION:

Form uses multi-stage final validation on form 'submit', preventing default submit function until all fields confirmed as valid - and only calls credit card validation if credit card is selected payment method
i.e.

// Form listener calls formfield helper functions//

getForm.addEventListener('submit', e => {
    // if any formfield is invalid (formValidity not true), the function prevents default submit functionality//

    const preventDefault = function () {
        if (formValidity === false) {
            e.preventDefault();
        }
    };
    activitiesValidate();
    preventDefault();

    emailValidate();
    preventDefault();

    nameValidate();
    preventDefault();

    //ensure credit card validation only if credit card is selected payment method, using creditCardValidationReq flag (true = validation required, false = no validation required)//

    if (creditCardValidationReq) {
        creditCardValidate();
        preventDefault();
    }
});
