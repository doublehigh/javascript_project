// jquery.js
let playing = false;
let score;
let trialsLeft;
let step;
let action; //used for setInterval
let fruits = [
  "apple",
  "banana",
  "cherries",
  "grape",
  "mango",
  "orange",
  "pear",
  "pineapple",
  "peach",
  "watermelon",
];

$(function () {
  // Ensure the fruit is hidden on initial load
  $("#fruit1").hide();

  // Start/Reset button
  $("#startreset").click(function () {
    if (playing) {
      // reload page if already playing
      location.reload();
    } else {
      playing = true;
      score = 0;
      $("#scorevalue").html(score);

      // Show lives
      $("#trialsLeft").show().css({
        display: "flex",
        "justify-content": "space-evenly",
        "align-items": "center",
      });
      trialsLeft = 3;
      addHearts();

      // Hide game over
      $("#gameOver").hide();

      // Change button text
      $("#startreset").html("Reset Game");

      // Start sending fruits
      startAction();
    }
  });

  // Slice a fruit
  $("#fruit1").on("mouseover touchstart", function () {
    score++;
    $("#scorevalue").html(score);

    // Play sound
    $("#slicesound")[0].play();

    // Stop fruit & hide with animation
    clearInterval(action);
    $("#fruit1").hide("explode", 500);

    // New fruit after short delay
    setTimeout(startAction, 800);
  });

  // ================== FUNCTIONS ===================

  // Add hearts for lives
  function addHearts() {
    $("#trialsLeft").empty();
    for (let i = 0; i < trialsLeft; i++) {
      $("#trialsLeft").append('<div class="heart"></div>');
    }
  }

  // Start fruit dropping
  function startAction() {
    resetFruit(); // <- pick ONE fruit and drop it

    action = setInterval(function () {
      $("#fruit1").css("top", $("#fruit1").position().top + step);

      // Check if fruit is too low
      if ($("#fruit1").position().top > $("#fruitsContainer").height()) {
        if (trialsLeft > 1) {
          trialsLeft--;
          addHearts();
          resetFruit(); // new fruit only when old one is gone
        } else {
          // Game over
          playing = false;
          $("#startreset").html("Start Game");
          $("#gameOver")
            .show()
            .html(`<p>Game Over!</p><p>Your score is ${score}</p>`);
          $("#trialsLeft").hide();
          stopAction();
        }
      }
    }, 10);
  }

  // Reset fruit for a new drop
  function resetFruit() {
    let fruitName = chooseFruit(); // pick once
    $("#fruit1")
      .attr("src", "images/" + fruitName + ".png")
      .show();

    // Random left position inside container
    let containerWidth = $("#fruitsContainer").width();
    let fruitWidth = $("#fruit1").width() || 64;
    let leftPos = Math.round((containerWidth - fruitWidth) * Math.random());
    $("#fruit1").css({ left: leftPos, top: -50 });

    // Set fruit speed
    setStep();
  }

  // Choose a random fruit and return its name
  function chooseFruit() {
    let index = Math.floor(Math.random() * fruits.length);
    return fruits[index];
  }

  // Set fruit speed (slower on mobile)
  function setStep() {
    if (window.innerWidth < 500) {
      step = 1 + Math.round(4 * Math.random());
    } else {
      step = 1 + Math.round(5 * Math.random());
    }
  }

  // Stop dropping fruits
  function stopAction() {
    clearInterval(action);
    $("#fruit1").hide();
  }
});
