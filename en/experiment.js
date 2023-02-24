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
    images: [`img/c.png`, `img/e.png`, `img/h.png`, `img/l.png`, `img/p.png`, `img/s.png`, `img/u.png`, `img/fixation.png`]
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

