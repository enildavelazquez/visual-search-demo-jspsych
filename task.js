// ============================================================================
// --- SPECIFY RUNTIME PARAMS
// ============================================================================

// --- specify task name and version
const experiment_name = "VisualSearchCircle";
const TASK_VERSION = "0.1a";

const generated_completion_code = Math.floor(Math.random() * 500) + 100;

// ============================================================================
// --- SPECIFY TASK PARAMETERS
// ============================================================================

var constants = {
    target_h_key: "f",
    target_u_key: "j",
    target_h_keycode: 70,
    target_u_keycode: 74,
    fixation_size: 35,
    fixation_image: 'img/fixation.png',
    post_trial_gap: 1000,
    n_blocks: 1,
}

// ============================================================================
// --- DETERMINE USER PLATFORM
// ============================================================================

// t/f - whether participant is on a mobile platform or not
const onMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
document.body.className += onMobile ? "mobile" : "desktop";

// ============================================================================
// --- INITIALIZE JSPSYCH
// ============================================================================

const jsPsych = initJsPsych({

    // send data to server if browser interaction changes (e.g. participant leaves tab)
    on_interaction_data_update: () => {
        console.log("callback: on_interaction_data_update()");
        event_type = "on_interaction_data_update()";

        const curr_data = jsPsych.data.get();
        upload_data(jsPsych.data.get(), 0);
    },
    on_close: () => {
        console.log("callback: on_close()");
        event_type = "on_close()";

        const curr_data = jsPsych.data.get();
        upload_data(jsPsych.data.get(), 0);
    },
    on_timeline_start: function () {
        console.log("callback: on_timeline_start()");
        event_type = "on_timeline_start()";

        console.log('Running on: ${onMobile ? "mobile" : "desktop"}.');
        console.log(jsPsych.data.get());
    },
    on_timeline_finish: function () {
        console.log("callback: on_timeline_finish()");
        event_type = "on_timeline_finish()";

        // --- save data to server
        const final_data = jsPsych.data.get();
        upload_data(jsPsych.data.get(), 0);
    }
});

// ============================================================================
// --- EXTRACT IDs from URL
// ============================================================================

// --- extract participant ID and other params from URL
var participant_id = jsPsych.data.getURLVariable("PARTICIPANT_ID") || 7789;
var study_id = jsPsych.data.getURLVariable("STUDY_ID") || 77897789;
var session_id = jsPsych.data.getURLVariable("SESSION_ID") || 778977897789;
DEBUG = parseInt(jsPsych.data.getURLVariable("DEBUG"));
var session_uuid = create_UUID();

// ============================================================================
// --- TIMING PARAMETERS
// ============================================================================

// --- Durations
var postDur, fixationDur, word_dur;

if (DEBUG) {
    // time in ms for post trial gap duration
    postDur = 0;

    // time in ms for the fixation cross preceding each stimuli
    fixationDur = 0;
    word_dur = 0;
} else {
    // time in ms for post trial gap duration
    postDur = 250;

    // time in ms for the fixation cross preceding each stimuli
    fixationDur = 3000;
    word_dur = 1000;
}

// --- get session start
var timestamp_start = new Date();
timestamp_start = timestamp_start.toISOString();

// --- echo to log
console.log("Participant ID: " + participant_id);
console.log("Study ID: " + study_id);
console.log("Session ID: " + session_id);
console.log("Session UUID: " + session_uuid);
console.log("Timestamp Start: " + timestamp_start);

// ============================================================================
// --- SAVE DATA PROPERTIES TO JSPSYCH DATA COLLECTION
// ============================================================================

// --- save to JsPsych data file
jsPsych.data.addProperties({
    subject_id: participant_id,
    study_id: study_id,
    session_id: session_id,
    session_uuid: session_uuid,
    experiment_name: experiment_name,
    targ_image: '',
    foil_images: '',

    // --- TODO: save the stimulus durations once you are able to double-check
    fixation_duration: fixationDur,

    // --- collect window /screen information
    useragent: navigator.userAgent,
    on_mobile: onMobile,
    window_innerHeight: window.innerHeight,
    window_innerWidth: window.innerWidth,
    screen_availHeight: screen.availHeight,
    screen_availWidth: screen.availWidth,
    screen_width: screen.width,
    screen_height: screen.height,
});

// ============================================================================
// --- SPECIFY INSTRUCTIONS
// ============================================================================

const instructions = {
    type: jsPsychInstructions,
    css_classes: ["instructions"],
    pages: ["<p>Welcome to the <strong>Visual Search Demo</strong></p> <div><p>Press any key to begin.</p>",
        '<p> Press <strong>F</strong> if the letter <strong>"H"</strong> appears in the group.</p> <p>Press <strong>J</strong> if the letter <strong>"U"</strong> appears in the group.</p> <div> <p>Press any key to continue</p>'
    ],
    show_clickable_nav: true,
};

const msg_exp_complete = {
    type: jsPsychInstructions,
    css_classes: ["instructions"],
    pages: [`<p> You've completed the visual search demo, thanks for playing! </p> <div> <p>Press any key to continue and see your data (it will make no sense but it's kind of cool anyways!)</p>`],
    show_clickable_nav: true,
    button_label_next: "Close Task",
    on_finish: function (data) {
        jsPsych.data.displayData('json');
        var lasttrialdata = jsPsych.data.getLastTrialData();
        console.log(lasttrialdata);
    }
};

// ============================================================================
// --- SPECIFY TASK PROCEDURE
// ============================================================================

//preload
var preload = {
    type: jsPsychPreload,
    images: ['img/c.png', 'img/e.png', 'img/h.png', 'img/l.png', 'img/p.png', 'img/s.png', 'img/u.png', 'img/fixation.png']
};

var fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: "NO_KEYS",
    trial_duration: fixationDur,
};


// ============================================================================
// --- SPECIFY EXPERIMENTAL PROCEDURE
// ============================================================================

// CREATE FACTORIAL DESIGN
// ------------------------------------------------------------

// degrees of eccentricity - radius of the circle
var DIAMETER_CHOICES = [300, 450, 600];

var factor_levels = {
    diameter: DIAMETER_CHOICES,
    targ_image: ['img/h.png', 'img/u.png'],
    foil_images: [
        ['img/c.png', 'img/e.png', 'img/l.png', 'img/p.png', 'img/s.png'],
        ['img/e.png', 'img/c.png', 'img/l.png', 'img/p.png', 'img/s.png'],
        ['img/e.png', 'img/c.png', 'img/l.png', 'img/s.png', 'img/p.png'],
        ['img/e.png', 'img/l.png', 'img/c.png', 'img/s.png', 'img/p.png']]
};

// generate factorial design
print("About to create factorial design");
var full_design = jsPsych.randomization.factorial(factor_levels, 1);
print(full_design);

// test trials - long form (timeline function issues)
// var trial_procedure = {
//     type: jsPsychVisualSearchCircle,
//     stimuli: [jsPsych.timelineVariable('targ_image'),jsPsych.timelineVariable('foil_images')],
//     fixation_image: constants.fixation_image,
//     fixation_size: [constants.fixation_size, constants.fixation_size],
//     target_present_key: constants.target_h_key,
//     target_absent_key: constants.target_h_key,
//     target_present: true,
//     post_trial_gap: constants.post_trial_gap,
//     timeline_variables: full_design,
//     sample: {type: 'with-replacement', size: constants.n_blocks},
//     on_finish: function (data) {
//         console.log("About to finish trial...")
//         data.targ_image = data.targ_image;
//         data.foil_images = data.foil_images;
//         data.correct = (data.key_press == constants.target_h_keycode & data.targ_image == 'img/h.png') | 
//                 (data.key_press == constants.target_u_keycode & data.targ_image == 'img/u.png');
//       }
// };

// ============================================================================
// --- SPECIFY SEQUENCE AND RUN TIMELINE
// ============================================================================

// --- create timeline
var tl = [
    preload,
    instructions,
    //trial_procedure,
    msg_exp_complete
];

// jspsych event timeline
jsPsych.run(tl);