/*
Treehouse Techdegree:
FSJS Project 3 - Interactive Form
*/
/*jshint esversion: 8*/
// GLOBAL VARIABLES //
// ---------------------
const getName = document.getElementById('name');
const getOtherJobRole = document.getElementById('other-job-role');
const getJobSelection = document.getElementById('title');
const getColorSelection = document.getElementById('color');
const getDesignSelection = document.getElementById('design');
const getActivitiesSelection = document.getElementById('activities');
const getActivitiesTotalCost = document.getElementById('activities-cost');
let activitiesTotalCost = 0;

// Set the name input form field as focus true
getName.focus();

// Hide the job role option and color section
getOtherJobRole.style.display = "none";
getColorSelection.style.display = "none";
getColorSelection.previousElementSibling.style.display = "none";

/*-----------------------------
------- Event listeners -------
------------------------------*/

//Job selection listener

getJobSelection.addEventListener('change', e => {
    // Show and focus job role option input field if 'other' selected, hide otherwise
    if (e.target.value === 'other') {
        getOtherJobRole.style.display = "inherit";
        getOtherJobRole.focus();
    } else {
        getOtherJobRole.style.display = "none";
    }
});

//Design selection listener

getDesignSelection.addEventListener('change', e => {
    // Enable color section
    getColorSelection.style.display = "inherit";
    getColorSelection.previousElementSibling.style.display = "inherit";

    // Select color options by design
    //-------------------------------//
    //disable and hide unavailable options.
    /*Note: both disable AND hide, to allow for potential refinement in a subsequent development (e.g. display greyed out unavailable options, which might be more elegant than simply 'turning off' display, or applying 'hidden' attribute)*/

    //reset options fields for each selection change   

    for (let i = 0; i < getColorSelection.options.length; i++) {
        getColorSelection.options[i].disabled = false;
        getColorSelection.options[i].hidden = false;
        getColorSelection.options[0].selected = true;
    }

    //check chosen theme and display options ('js puns' or 'heart js' themes)

    if (e.target.value === 'js puns') {
        for (let i = 0; i < getColorSelection.options.length; i++) {
            if (getColorSelection.options[i].dataset.theme !== "js puns") {
                getColorSelection.options[i].disabled = true;
                getColorSelection.options[i].hidden = true;
                getColorSelection.options[1].selected = true;
            }
        }
    } else if (e.target.value === 'heart js') {
        for (let i = 0; i < getColorSelection.options.length; i++) {
            if (getColorSelection.options[i].dataset.theme !== "heart js") {
                getColorSelection.options[i].disabled = true;
                getColorSelection.options[i].hidden = true;
                getColorSelection.options[4].selected = true;
            }
        }
    }
});

//Activities registration listener

getActivitiesSelection.addEventListener('change', e => {
    // Sum the costs of selected activities
    if (e.target.checked){
        activitiesTotalCost += parseInt(e.target.dataset.cost);
    } else if (!e.target.checked){
        activitiesTotalCost -= parseInt(e.target.dataset.cost); 
    }
   
   getActivitiesTotalCost.textContent =`Total: $${ activitiesTotalCost}`;
});

//