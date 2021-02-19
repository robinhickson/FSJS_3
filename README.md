# interactive-form
 FSJS Project 3


An interactive registration form for a conference.
--------------------------------------------------
**INPUT FIELDS:**

* Name 
* Email
* T-shirt selection (options per theme)
* Job Role (including hidden option to add 'other')
* Activity registration (with automatic event deconfliction)
* Payment information:
    * Paypal
    * Bitcoin
    * Credit Card - requires credit card field validation for CC number, zip and cvv

--------------------------------------------------
**FORMFIELD ERROR HANDLING:**

Form uses live checks on specific fields for validation
i.e. CC fields helper function

```
//add live validation for credit card number, zip code and cvv
creditCardSelection.addEventListener('keyup', () => {
    creditCardValidationReq = true;
    creditCardValidate();
});
```

including additional error message-hinting on validation attempt 
i.e. CC number field hints to user to avoid spaces and dashes, and then checks that cc number is one sequence between 13-16 digits 

```
 (function () {
        // additional hint to exclude spaces or dashes in cc number field
        if (cardNumberHintRegex.test(getCardNumber.value)) {
            cssManipulationInvalidCC(getCardNumber);
            document.getElementById('cc-hint').textContent = "Numbers only - spaces and/or dashes not required";
        } else if (!cardNumberRegex.test(getCardNumber.value)) {
            cssManipulationInvalidCC(getCardNumber);
            document.getElementById('cc-hint').textContent = "Credit card number must be between 13 - 16 digits";
        } else {
            cssManipulationValidCC(getCardNumber);
            creditCardValidity = true;
        }
    })();
```

--------------------------------------------------

**SUBMIT VALIDATION:**

Form uses multi-stage final validation on form 'submit', preventing default submit function until all fields confirmed as valid - and only calls credit card validation if credit card is selected payment method
i.e.

```
// Form listener calls formfield helper functions//

getForm.addEventListener('submit', e => {
    /* if any formfield is invalid (formValidity not true), the function prevents default submit functionality*/

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

    /*ensure credit card validation only if credit card is selected payment method, using creditCardValidationReq flag (true = validation required, false = no validation required)*/

    if (creditCardValidationReq) {
        creditCardValidate();
        preventDefault();
    }
});
```
