// Current date / time. Chose let over Var. 
let currentDateEl = $('#currentDate');
let currentDate;
let currentTime;

// Set-To/Get-From Local Storage (time and text).
let calEntryEventTime;
let calEntryEventTxt;
let timeArr = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

// Save button
let saveBtn = $('.saveBtn');

// Determine color of time block
let calTimeblock;
let timerInterval;
let timeblockID = $("textarea[id*='timeblock']");

// Calls functions to render date and events to the DOM & update the colors accordingly
function init() {
    currentMomentDate();
    renderEvents();
    setBGColors();
};

// Gets current date and renders in jumbotron header
function currentMomentDate() {
    currentDate = moment().format('dddd, LL');
    currentDateEl.text(currentDate);
};

// Renders events pulled from local storage to DOM
function renderEvents() {
    for (let i = 0; i < timeArr.length; i++) { 
        $('[id^=timeblock-]').each(function (i, v) {
            $(v).val(localStorage.getItem(timeArr[i]));
        })
    }
};

// Triggers click handler for save buttons
saveBtn.on('click', saveButtonClickHandler);

// When the save button is clicked, pulls corresponding time and date values
function saveButtonClickHandler(event) {
    // Keeps form from sending
    event.preventDefault();
    // Sets value to the time associated with clicked save button
    calEntryEventTime = $(this).attr('id').split('-')[1];
    // Sets value to the user's input text
    calEntryEventTxt = $(this).siblings('textarea[name^="timeblock"]').val().trim();
    // Calls function to store in local storage
    storeEvents();
};

// Stores the time and text values to local storage where (Time = Key) and (User's Input Text = Value)
function storeEvents() {
    localStorage.setItem(calEntryEventTime, calEntryEventTxt);
};

// Updates timeblock classes/colors as time progresses
function setBGColors() {
    // For each timeblock ID, 
    timeblockID.each(function () {
    // Split it to display the time contained at the end of the ID, 
    calTimeBlock = $(this).attr('id').split('-')[1];
    // And convert it to a Moment.js format, then an integer
    calTimeBlock = parseInt(moment(calTimeBlock, 'H').format('H'));
    // Get Moment.js time & format identically
    currentTime = parseInt(moment().format('H'));
    
    if (currentTime < calTimeBlock) {
        $(this).removeClass('past present');
        $(this).addClass('future');
    } else if (currentTime === calTimeBlock) {
        $(this).removeClass('past future');
        $(this).addClass('present');
    } else if (currentTime > calTimeBlock) {
        $(this).removeClass('present future');
        $(this).addClass('past');
    } else {
        console.log("Time Calculation Error");
    }
    })
};

// Updates date/time and colors once per minute on the minute
function setIntervalOnMinute() {
    var currentDateSeconds = new Date().getSeconds();
    if (currentDateSeconds == 0) {
        setInterval(currentMomentDate, 60000);
        setInterval(setBGColors, 60000);
    } else {
        setTimeout(function () {
            setIntervalOnMinute();
        }, (60 - currentDateSeconds) * 1000);
    }
    currentMomentDate();
    setBGColors();
};

setIntervalOnMinute();

// Initializes the page
init();

