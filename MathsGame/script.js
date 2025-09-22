// DOM Element

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
// const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
// const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");



import { quizQuestions } from './questionbank.js';

// QUIZ STATE VARS 

let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

// totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// Adding event listeners 

startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

function startQuiz()
{
  // reset variables 
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;

  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  showQuestions();

}

function showQuestions()
{
  //reset state
  answersDisabled = false;

  // Generate Question 
    var x = 1+ Math.round(9*Math.random());
    var y = 1+ Math.round(9*Math.random());
    var correctAnswer = x*y;

  currentQuestionSpan.textContent = currentQuestionIndex + 1;
  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";

  questionText.textContent = x + "x" + y;

    var correctPosition = 1+ Math.round(3*Math.random());
    document.getElementById("box"+correctPosition).innerHTML = correctAnswer; //fill one box with the correct answer
    
    //fill other boxes with wrong answers
    
    var answers = [correctAnswer];
    
    for(var i=1; i<5; i++){
        if(i != correctPosition) {
            var wrongAnswer;
            do{
                wrongAnswer = (1+ Math.round(9*Math.random()))*(1+ Math.round(9*Math.random())); //a wrong answer
            }while(answers.indexOf(wrongAnswer)>-1)
            document.getElementById("box"+i).innerHTML = wrongAnswer;
            answers.push(wrongAnswer);
        }
    }
}

//Clicking on an answer box

for(var i=1; i<5; i++){
    document.getElementById("box"+i).onclick = function(){
    //check if we are playing     
    if(playing == true){//yes
        if(this.innerHTML == correctAnswer){
        //correct answer
            
            //increase score by 1
            score++;
            scoreSpan.textContent = score;
            //hide wrong box and show correct box
            hide("wrong");
            show("correct");
            setTimeout(function(){
                hide("correct");   
            }, 1000);
            
            //Generate new Q&A
            
            showQuestions();
        }else{
        //wrong answer
            hide("correct");
            show("wrong");
            setTimeout(function(){
                hide("wrong");   
            }, 1000);
        }
    }
}   
}
function hide(Id){
    document.getElementById(Id).classList.add("incorrect");   
}

//show an element

function show(Id){
    document.getElementById(Id).classList.add("correct");  
}
function selectAnswer(event)
{
  // optimization check
  if(answersDisabled) return 

  answersDisabled = true;

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  Array.from(answersContainer.children).forEach(button => {
    if(button.dataset.correct === "true")
    {
      button.classList.add("correct");
    }
    else if(button === selectedButton){
      button.classList.add("incorrect");
    }
  });
  if(isCorrect)
  {
    score++
    scoreSpan.textContent = score;
  }

  setTimeout(()=>{
    currentQuestionIndex++;
    // check if there are more questions or the quiz is over
    if(currentQuestionIndex < quizQuestions.length)
    {
      showQuestions();
    }
    else
    {
      showResults()
    }
  }, 1000)
}

function showResults()
{
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");
  finalScoreSpan.textContent = score;
  const percentage = (score/quizQuestions.length)*100;

  if(percentage == 100)
  {
    resultMessage.textContent = "Perfect! You are Genius!";
  }
  else if(percentage >= 80)
  {
    resultMessage.textContent = "Great Job! You know your stuff!";
  }
  else if(percentage >= 60)
  {
    resultMessage.textContent = "Good effort! Keep Learning!";
  }
  else if(percentage >= 40)
  {
    resultMessage.textContent = "Not bad! Try again to improve!"
  }
  else
  {
    resultMessage.textContent = "Keep Studying! You will get better!"
  }
}

function restartQuiz()
{
  resultScreen.classList.remove("active");
  // quizScreen.classList.add("active");
  startQuiz();
}