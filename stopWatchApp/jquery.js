$(function(){
    // Declaration of variables 
    let mode = false;
    let timeCounter = 0;
    let lapCounter = 0;
    let laptime = 0;
    let Timer, lapMinutes, lapSeconds, lapCentiSeconds, timeMinutes, timeSeconds, timeCentiSeconds;

    //Display  Start and Lap Button
    dispBtn("#startBtn","#lapBtn");

    $("#startBtn").click(function(){
        mode = true;
        // Display Stop and Lap Button
        dispBtn("#stopBtn","#lapBtn")
        startTimer();
    })

    function startTimer(){
        Timer = setInterval(()=>{
            timeCounter++;
            if(timeCounter == 100*60*100)
                timeCounter = 0;
            lapCounter++;
            if(lapCounter == 100*60*100)
                lapCounter = 0;
            updateTimer();
        },10);
    }

    function updateTimer()
    {
        // Update Time Counter
        // 600,000 divided by 6,000 = 60 minutes
        timeMinutes = Math.floor(timeCounter / 6000);
        timeSeconds = Math.floor((timeCounter % 6000) / 100);
        timeCentiSeconds = Math.floor((timeCounter % 6000) % 100);

        //Update Time UI
        $("#timeminute").text(format(timeMinutes));
        $("#timesecond").text(format(timeSeconds));
        $("#timecentisecond").text(format(timeCentiSeconds));

        //Update Lap Counter
         // 600,000 divided by 6,000 = 60 minutes
        lapMinutes = Math.floor(lapCounter / 6000);
        lapSeconds = Math.floor((lapCounter % 6000) / 100);
        lapCentiSeconds = Math.floor((lapCounter % 6000) % 100);

        //Update LAP UI
        $("#lapminute").text(format(lapMinutes));
        $("#lapsecond").text(format(lapSeconds));
        $("#lapcentisecond").text(format(lapCentiSeconds));
    }

    $("#stopBtn").click(function(){
        //Display Resume and Reset Button
        dispBtn("#resumeBtn","#resetBtn")
        //stop timer
        clearInterval(Timer);
    })

    $("#resumeBtn").click(function(){
        //Display Stop and Lap Button
        dispBtn("#stopBtn","#lapBtn");
        //start timer
        startTimer();
    })

    $("#resetBtn").click(function(){
        location.reload();
    })

    $("#lapBtn").click(function(){
        //if mode is on
        if(mode){
            //stop timer
            clearInterval(Timer);
            // Reset lap counter and add lap time
            lapCounter = 0;
            addlap();
            //start timer back
            startTimer();
        }
    })

    function addlap(){
        laptime++;
        $(".lapsTime").show();

        let myLapDetails = `<div class="lap">
        <span class="lap-number">${format(laptime)}</span>
        <span class="lap-time">${$("#lapminute").text()}:${$("#lapsecond").text()}:${$("#lapcentisecond").text()}</span>
        <span class="overall-time">${$("#timeminute").text()}:${$("#timesecond").text()}:${$("#timecentisecond").text()}</span>
    </div>`;

    $(".lapdetails").prepend(myLapDetails);

    }

    function format(number){
        if(number < 10){
            return "0"+number
        }
        else
            return number
    }

    function dispBtn(x,y){
        $(".btn").hide();
        $(y).show();
        $(x).show();
    }
})