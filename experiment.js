// initialize jsPsych 
var jsPsych = initJsPsych({
    on_finish: function () {
        jsPsych.data.displayData();
    },
    override_safe_mode: true,
});

// define empty timeline array 
var timeline = [];

//preload
var preload = {
    type: jsPsychPreload,
    images: [`img/c.png`, `img/e.png`, `img/p.png`, `img/u.png`, `img/p.png`, `img/s.png`, `img/l.png`, `img/fixation.png`]
};
timeline.push(preload);

//welcome 
var welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>Welcome to the <strong>Visual Search Demo</strong></p> 
    <div>
    <p>Press any key to begin.</p>`
};
timeline.push(welcome);

//instructions
var instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p> Press <strong>F</strong> if the letter <strong>"H"</strong> appears in the group.</p>
    <p>Press <strong>J</strong> if the letter <strong>"U"</strong> appears in the group.</p>
    <div>
    <p>Press any key to continue</p>`
};
timeline.push(instructions);

//timeline variable function that isn't working :)
var test_stimuli = [
    { stimulus: 'img/c.png' },
    { stimulus: `img/e.png` },
    { stimulus: `img/p.png` },
    { stimulus: `img/u.png` },
    { stimulus: `img/l.png` },
    { stimulus: `img/s.png` },
];

var trial_h = {
    type: jsPsychVisualSearchCircle,
    target: `img/h.png`,
    foil: jsPsych.timelineVariable('stimulus'),
    fixation_image: `img/fixation.png`,
    target_present_key: 'f',
    target_absent_key: 'j',
    target_present: true,
    set_size: 5
}

var trial_u = {
    type: jsPsychVisualSearchCircle,
    target: `img/j.png`,
    foil: jsPsych.timelineVariable('stimulus'),
    fixation_image: `img/fixation.png`,
    target_present_key: 'j',
    target_absent_key: 'f',
    target_present: true,
    set_size: 5
}

var trial_procedure = {
    timeline: [trial_h, trial_u],
    timeline_variables: test_stimuli,
    randomize_order: true,
    repetitions: 5
};
timeline.push(trial_procedure);

// debrief 
var debrief = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p> You've completed the visual search demo, thanks for playing! </p>
    <div>
    <p>Press any key to continue and see your data (it will make no sense but it's kind of cool anyways!)</p>`
};
timeline.push(debrief);

//start experiment 
jsPsych.run(timeline);
