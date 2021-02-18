/*
Treehouse Techdegree:
FSJS Project 3 - Interactive Form
*/
/*jshint esversion: 8*/

// GLOBAL VARIABLES //
// ---------------------
const getForm = document.querySelector("form");
const getName = document.getElementById('name');
const getEmail = document.getElementById('email');
const getOtherJobRole = document.getElementById('other-job-role');
const getJobSelection = document.getElementById('title');
const getColorSelection = document.getElementById('color');
const getDesignSelection = document.getElementById('design');
const getActivitiesSelection = document.getElementById('activities');
const activitiesBox = document.getElementById("activities-box");
const getAllActivities = Array.from(document.querySelectorAll('input[type=checkbox]'));
const getActivitiesTotalCost = document.getElementById('activities-cost');
const getPaymentSelection = document.getElementById('payment');
const creditCardSelection = document.getElementById("credit-card");
const paypalSelection = document.getElementById("paypal");
const bitcoinSelection = document.getElementById("bitcoin");
let activitiesTotalCost = 0;
let activityTracker = 0;
//overall form validity flag
let formValidity = false;
//credit card selection tracker - true if cc selected (default), false if another payment option
let creditCardValidationReq = true;

/*-----------------------*/
//Default displays//
/*-----------------------*/

// Set the name input form field as focus true
getName.focus();

// Hide the job role option and color section
getOtherJobRole.style.display = "none";
getColorSelection.style.display = "none";
getColorSelection.previousElementSibling.style.display = "none";

// Set default payment option to credit card and hide other payment options
const setDefaultPayment = function () {
    Array.from(getPaymentSelection.options).forEach(payment => {
        if (payment.value === "credit-card") {
            payment.selected = true;
            creditCardSelection.style.display = "inherit";
            paypalSelection.style.display = "none";
            bitcoinSelection.style.display = "none";
        }
    });
};
setDefaultPayment();


/*------------------------------------------------------------------------------
----------------------Event listeners ------------------------------------------
--------------------------------------------------------------------------------*/

//
/*--------------------------------------------------//
//------------Job selection listener----------------//
//..................................................*/

getJobSelection.addEventListener('change', e => {
    // Show and focus job role option input field if 'other' selected, hide otherwise
    if (e.target.value === 'other') {
        getOtherJobRole.style.display = "inherit";
        getOtherJobRole.focus();
    } else {
        getOtherJobRole.style.display = "none";
    }
});

/*--------------------------------------------------//
//------------Design selection listener-------------//
//..................................................*/


getDesignSelection.addEventListener('change', e => {
    // Enable color section
    getColorSelection.style.display = "inherit";
    getColorSelection.previousElementSibling.style.display = "inherit";

    // Select color options by design
    //-------------------------------//
    //disable and hide unavailable options.
    /*Note: both disable AND hide, to allow for potential refinement in a subsequent development (e.g. display greyed-out (unavailable) options, which might be more elegant than simply 'turning off' display, or applying 'hidden' attribute)*/

    //reset options fields for each selection change   

    let colorOptionsArray = Array.from(getColorSelection.options);
    colorOptionsArray.forEach(option => {
        option.disabled = false;
        option.hidden = false;
    });

    //check chosen theme and display correct options ('js puns' or 'heart js' themes)
    const firstOption = (select, index, array) => {
        if (e.target.value === 'js puns' && select.dataset.theme === "js puns") {
            colorOptionsArray.forEach(theme => {
                if (theme.dataset.theme !== "js puns") {
                    theme.disabled = true;
                    theme.hidden = true;
                }
            });
            //set theme option as selected
            return array[index].selected = true;

        } else if (e.target.value === 'heart js' && select.dataset.theme === "heart js") {
            colorOptionsArray.forEach(theme => {
                if (theme.dataset.theme !== "heart js") {
                    theme.disabled = true;
                    theme.hidden = true;
                }
            });
            //set theme option as selected
            return array[index].selected = true;
        }
    };
    // find the first matching option
    colorOptionsArray.some(firstOption);
});

/*---------------------------------------------------------//
//--Activities section listener, deconflictor, total cost--//
//.........................................................*/


// the convertTime24 helper function uses a regex (see checkConflict for origin) to convert the stored/displayed format of the time of an event into 24h time, to enable easier time comparison (see compareTimes function)

const convertTime24 = function (time, regex) {
    let checkDay = time.replace(regex, "$1");
    let checkStart = parseInt(time.replace(regex, "$2"));
    let amOrPmStart = time.replace(regex, "$3");
    let checkEnd = parseInt(time.replace(regex, "$4"));
    let amOrPmEnd = time.replace(regex, "$5");
    //convert to 24h time if pm (i.e. add 12 hours!)
    if (amOrPmStart === 'pm' && (checkStart < 12)) {
        checkStart += 12;
    }
    if (amOrPmEnd === 'pm' && (checkEnd < 12)) {
        checkEnd += 12;
    }
    // use object to track day, start time and end time of activity
    const conversionObj = {
        day: checkDay,
        start: checkStart,
        end: checkEnd
    };
    return conversionObj;
};

// A function which uses 24h time to compare the day, start and end times (selected param) of a selected/deselected activity (activity param), with all other activities (siblingActivity from getAllActivities collection), then checks for temporal conflicts using a regex key (regex param) to extract and compare components of dayAndTime dataset from each siblingActivity. Conflicting events are disabled/enabled when activity selected/deselected
// this function is designed to be sufficiently flexible to respond correctly to new activities being added to event/or activities being modified (minimal hard coding)

const compareTimes = function (selected, activity, regex) {
    getAllActivities.forEach(siblingActivity => {
        let eachActivityTime = siblingActivity.dataset.dayAndTime;
        //check that the activity element to be compared is valid and not the selected activity
        if (eachActivityTime && siblingActivity.name !== activity.name) {
            let eachActivityTimeConverted = convertTime24(eachActivityTime, regex);
            //check day/ then start/end time overlaps between selected activity and every other activity           
            if (eachActivityTimeConverted.day === selected.day) {
                if ((eachActivityTimeConverted.start >= selected.start && eachActivityTimeConverted.start < selected.end) ||
                    (selected.end > eachActivityTimeConverted.start && selected.start < eachActivityTimeConverted.end)) {
                    //if conflict/deconflict, disable/enable activity checkboxes and apply appropriate styles
                    if (siblingActivity.disabled) {
                        siblingActivity.disabled = false;
                        siblingActivity.parentNode.classList.remove("disabled");
                    } else {
                        siblingActivity.disabled = true;
                        siblingActivity.parentNode.classList.add("disabled");
                    }
                }
            }
        }
    });
};

// The checkConflict function is the control for the activities registration section. The function uses two helper functions (convertTime24 to convert selected activity time to 24h time, and compareTimes to check for overlaps). The regex key extracts relevant day/time information from the activity dataset, and is isolated within this function (rather than embedded within one of the helper functions) to allow for easy modification in the event of changes to activities' dataset syntax

const checkConflict = function (activity) {
    let selectedActivityTime = activity.dataset.dayAndTime;
    if (selectedActivityTime) {
        let regexTime = /^(\w+)\s(\d+)(\w+)\-(\d+)(\w+)$/i;
        let selectedActivityTimeConverted = convertTime24(selectedActivityTime, regexTime);
        //call the compareTimes function to check for activity overlap
        compareTimes(selectedActivityTimeConverted, activity, regexTime);
    }
};

// activities section listener which calls the conflict-checker, and tracks accumulated cost of activity registration

getActivitiesSelection.addEventListener('change', e => {
    // Check for timing conflict and sum the costs of selected activities
    checkConflict(e.target);
    if (e.target.checked) {
        activitiesTotalCost += parseInt(e.target.dataset.cost);
        activityTracker += 1;

    } else if (!e.target.checked) {
        activitiesTotalCost -= parseInt(e.target.dataset.cost);
        activityTracker -= 1;
    }
    //validate changes
    activitiesValidate();
    //paint accumulated cost to display   
    getActivitiesTotalCost.textContent = `Total: $${ activitiesTotalCost}`;
});


/*--------------------------------------------------//
//-----------Payments section listener--------------//
//..................................................*/

// enable/disable appropriate payment methods as called by user
getPaymentSelection.addEventListener('change', e => {
    //reset validity warning if payment method changed
    let novalid = getForm.querySelector(".payment-methods");
    novalid.classList.remove("not-valid");
    novalid.classList.add("valid");
    // set visibility of payment sections
    if (e.target.value === "credit-card") {
        setDefaultPayment();
        creditCardValidationReq = true;
    } else if (e.target.value === "paypal") {
        e.target.selected = true;
        paypalSelection.style.display = "inherit";
        creditCardSelection.style.display = "none";
        bitcoinSelection.style.display = "none";
        creditCardValidationReq = false;
    } else if (e.target.value === "bitcoin") {
        e.target.selected = true;
        paypalSelection.style.display = "none";
        creditCardSelection.style.display = "none";
        bitcoinSelection.style.display = "inherit";
        creditCardValidationReq = false;
    }

});

/*--------------------------------------------------//
//-----------Accessibility listener--------------//
//..................................................*/

//improve accessibility of form registration options by modifying css

getAllActivities.forEach(box => {
    box.addEventListener('focus', e => {
        e.target.parentNode.classList.add("focus");
    });
    box.addEventListener('blur', e => {
        e.target.parentNode.classList.remove("focus");
    });
});


/*--------------------------------------------------//
//----Registration submit form validation---//
//..................................................*/


//handle the css changes for valid/invalid field input for elements other than credit card fields
const formFieldsCSSinvalidNotCreditCard = function (element) {
    element.parentNode.classList.add("not-valid");
    element.parentNode.classList.remove("valid");
    element.parentNode.lastElementChild.style.display = "inherit";
    element.parentNode.scrollIntoView();
    formValidity = false;
};

const formFieldsCSSvalidNotCreditCard = function (element) {
    element.parentNode.classList.remove("not-valid");
    element.parentNode.classList.add("valid");
    element.parentNode.lastElementChild.style.display = "none";
    formValidity = true;
};

//use nameRegex to test name input validation
const nameValidate = function () {
    let nameRegex = /^(\s+)?[A-Z]+(\s+)?((\w+)?(\s)?)+?$/i;
    let nameHintRegex = /\d/;
    // additional hint to exclude numbers in name field
    if (nameHintRegex.test(getName.value)) {
        formFieldsCSSinvalidNotCreditCard(getName);
        document.getElementById('name-hint').textContent = "Name field cannot contain a number";
    // name validation check
    } else if (!nameRegex.test(getName.value)) {
        formFieldsCSSinvalidNotCreditCard(getName);
        document.getElementById('name-hint').textContent = "Name field cannot be blank";

    } else {
        formFieldsCSSvalidNotCreditCard(getName);
    }

};

//use emailRegex to test email input validation
const emailValidate = function () {
    let emailRegex = /^(\w+)@([A-Z]+).com$/i;

    if (!emailRegex.test(getEmail.value)) {
        formFieldsCSSinvalidNotCreditCard(getEmail);
    } else {
        formFieldsCSSvalidNotCreditCard(getEmail);
    }
};

// check at least 1 activity selected
const activitiesValidate = function () {
    if (activityTracker === 0) {
        formFieldsCSSinvalidNotCreditCard(activitiesBox);
    } else {
        formFieldsCSSvalidNotCreditCard(activitiesBox);
    }
};

//----------- credit card validation---------------------------//

const creditCardValidate = function () {
    formValidity = false; //false until proven true - catches late cc field changes after fields previously validated
    //use cardNumberRegex (13-16 digits), zipNumberRegex(5 digits) and cvvNumberRegex (3 digits) to test credit card fields input validation - only if credit card is selected payment method (controlled by creditCardValidationReq flag)
    let cardNumberRegex = /^\d{13,16}$/;
    let zipNumberRegex = /^\d{5,5}$/;
    let cvvNumberRegex = /^\d{3,3}$/;
    let getCardNumber = document.getElementById('cc-num');
    let getZipNumber = document.getElementById('zip');
    let getCVVNumber = document.getElementById('cvv');
    // adapt css to indicate valid/invalid fields
    const cssManipulationInvalidCC = function (element) {
        creditCardSelection.parentNode.classList.add("not-valid");
        creditCardSelection.parentNode.classList.remove("valid");
        element.nextElementSibling.style.display = "inherit";
        creditCardSelection.parentNode.scrollIntoView();
        formValidity = false;
    };
    const cssManipulationValidCC = function (element) {
        creditCardSelection.parentNode.classList.remove("not-valid");
        creditCardSelection.parentNode.classList.add("valid");
        element.nextElementSibling.style.display = "none";
        formValidity = true;
    };

    // test credit card, zip and cvv numbers sequentially
    const checkZipNumber = function () {
        if (!zipNumberRegex.test(getZipNumber.value)) {
            cssManipulationInvalidCC(getZipNumber);
        } else {
            cssManipulationValidCC(getZipNumber);
            checkCVVNumber();
        }
    };
    const checkCVVNumber = function () {
        if (!cvvNumberRegex.test(getCVVNumber.value)) {
            cssManipulationInvalidCC(getCVVNumber);
        } else {
            cssManipulationValidCC(getCVVNumber);
        }
    };

    //validate credit card number (then call check zip and check cvv)
    if (!cardNumberRegex.test(getCardNumber.value)) {
        cssManipulationInvalidCC(getCardNumber);
    } else {
        cssManipulationValidCC(getCardNumber);
        checkZipNumber();
    }
    return formValidity;
};

/*--------------------------------------------------//
//-----------------Form validator Helpers------------------//
//..................................................*/

// add live validation helper for name input field
getName.addEventListener('keyup', () => {
    nameValidate();
});
//add blur validation for email input field 
getEmail.addEventListener('blur', () => {
    emailValidate();
});
//add live validation for credit card number, zip code and cvv
creditCardSelection.addEventListener('keyup', () => {
    creditCardValidationReq = true;
    creditCardValidate();
});
//----------------------------------------------------------------------------//
//----- Main form validator submit listener and helper function calls---------//
//............................................................................//

// Form listener calls formfield helper functions 
getForm.addEventListener('submit', e => {
    // if any formfield is invalid (formValidity not true), the function prevents default submit functionality
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

    //ensure credit card validation only if credit card is selected payment method, using creditCardValidationReq flag (true = validation required, false = no validation required)
    if (creditCardValidationReq) {
        creditCardValidate();
        preventDefault();
    }
});

////END CODE