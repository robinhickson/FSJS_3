/*
Treehouse Techdegree:
FSJS Project 3 - Interactive Form
*/
/*jshint esversion: 8*/
// GLOBAL VARIABLES //
// ---------------------
const getNameFocus = document.getElementById('name');
const getOtherJobRole = document.getElementById('other-job-role');
const getSelection = document.getElementById('title');

// Set the name input form field as focus true
getNameFocus.focus();

//Hide the job role option
getOtherJobRole.style.display = "none";

//Show and focus job role option input field if 'other' selected, hide otherwise
getSelection.addEventListener('change', e => {
if (e.target.value === 'other'){
    getOtherJobRole.style.display = "inherit";
    getOtherJobRole.focus();
} else {
    getOtherJobRole.style.display = "none";
}
});

//
