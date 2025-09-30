// jquery.js
let playing = false;
let paused = false;   // NEW: flag for pause
let score;
let trialsLeft;
let step;
let action; // used for setInterval
let fruits = [
    'apple', 'banana', 'cherries', 'grape', 'mango',
    'orange', 'pear', 'pineapple', 'peach', 'watermelon'
];

$(function () {
    // initial state
    $("#fruit1").hide();
    $("#pausePlay").hide(); // hide pause button until game starts

    // START/RESET button
    $("#startreset").click(function () {
        if (playing) {
            location.reload(); // reload if already playing
        } else {
            $("#trialsLeft")
                .show()
                .css({
                    display: "flex",
                    "justify-content": "space-evenly",
                    "align-items": "center",
                });
            playing = true;
            paused = false;

            // reset score
            score = 0;
            $("#scorevalue").html(score);

            // reset trials
            trialsLeft = 3;
            addHearts();

            // reset UI
            $("#gameOver").hide();
            $("#startreset").html("Reset Game");

            // show pause button
            $("#pausePlay").show().html("Pause");

            // start fruits
            startAction();
        }
    });

    // PAUSE/PLAY button
    $("#pausePlay").click(function () {
        if (!playing) return; // do nothing if game hasn’t started

        if (!paused) {
            paused = true;
            clearInterval(action); // stop fruit movement
            $("#pausePlay").html("Play");
        } else {
            paused = false;
            startAction(); // resume
            $("#pausePlay").html("Pause");
        }
    });

    // SLICE a fruit
    $("#fruit1").on("mouseover touchstart", function () {
        if (paused || !playing) return; // don’t slice if paused or not playing
        score++;
        $("#scorevalue").html(score);
        $("#slicesound")[0].play();

        clearInterval(action);
        $("#fruit1").hide("explode", 500);

        setTimeout(function () {
            if (!paused && playing) startAction();
        }, 800);
    });

    // FUNCTIONS ----------------------

    function addHearts() {
        $("#trialsLeft").empty();
        for (let i = 0; i < trialsLeft; i++) {
            $("#trialsLeft").append('<div class="heart"></div>');
        }
    }

    function startAction() {
        chooseFruit();
        $("#fruit1").show();

        let containerWidth = $("#fruitsContainer").width();
        let fruitWidth = $("#fruit1").width() || 64;
        let leftPos = Math.round((containerWidth - fruitWidth) * Math.random());
        $("#fruit1").css({ 'left': leftPos, 'top': -50 });

        // adjust speed depending on screen width
        step = (window.innerWidth < 500)
            ? 1 + Math.round(2 * Math.random())
            : 1 + Math.round(5 * Math.random());

        // clear any previous interval before starting a new one
        clearInterval(action);
        action = setInterval(function () {
            $("#fruit1").css('top', $("#fruit1").position().top + step);

            if ($("#fruit1").position().top > $("#fruitsContainer").height()) {
                if (trialsLeft > 1) {
                    chooseFruit();
                    containerWidth = $("#fruitsContainer").width();
                    fruitWidth = $("#fruit1").width() || 64;
                    leftPos = Math.round((containerWidth - fruitWidth) * Math.random());
                    $("#fruit1").css({ 'left': leftPos, 'top': -50 });

                    step = (window.innerWidth < 500)
                        ? 1 + Math.round(2 * Math.random())
                        : 1 + Math.round(5 * Math.random());

                    trialsLeft--;
                    addHearts();
                } else {
                    // GAME OVER
                    playing = false;
                    $("#startreset").html("Start Game");
                    $("#pausePlay").hide(); // hide pause button
                    $("#gameOver").show().html('<p>Game Over!</p><p>Your score is ' + score + '</p>');
                    $("#trialsLeft").hide();
                    stopAction();
                }
            }
        }, 10);
    }

    function chooseFruit() {
        $("#fruit1").attr('src', 'images/' + fruits[Math.round(9 * Math.random())] + '.png');
    }

    function stopAction() {
        clearInterval(action);
        $("#fruit1").hide();
    }
});
