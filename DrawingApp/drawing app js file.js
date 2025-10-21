$(function(){
    $("#slider").slider({
        min: 3,
        max: 30,
        slide: function(event, ui) {
            // $("#brushSizeValue").text(ui.value);
            $("#circle").css({"width": ui.value + "px", "height": ui.value + "px"});
            context.lineWidth = ui.value;
        }
    });


    //delacration of variables
    var paint = false;
    var paintErase = "paint";
    var canvas = document.getElementById("paint");
    var context = canvas.getContext("2d");
    var container = $("#container");
    var mouse = {x: 0, y: 0};

    //set drawing parameters (lineWidth, lineJoin, lineCap)
    context.lineWidth = $("#slider").slider("value");
    context.lineJoin = "round";
    context.lineCap = "round";

    //click inside container
    container.mousedown(function(e){
        paint = true;
        context.beginPath();
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        context.moveTo(mouse.x, mouse.y);

        
    });

    //move the mouse while holding down the button
    container.mousemove(function(e){
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;

        if(paint) {
            if(paintErase == "paint") {
                //get color input
                context.strokeStyle = $("#paintColor").val();
            } else {
                //white color
                context.strokeStyle = "white";
            }
            context.lineTo(mouse.x, mouse.y);
            context.stroke();
        }
    });

    container.mouseup(function(){
        paint = false;
    });

    // container.mouseleave(function(){
    //     paint = false;
    // });

    //click on the reset button
    $("#reset").click(function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        paintErase = "paint";
        $("#erase").removeClass("eraseMode");
    });

    // click on the save button
    $("#save").click(function(){
        if(typeof(localStorage) != null) {  
            localStorage.setItem("drawing", canvas.toDataURL());
        }
    });
    
    //load saved drawing from local storage
    if(typeof(localStorage) != null) {
        if(localStorage.getItem("drawing") != null) {
            var img = new Image();
            img.src = localStorage.getItem("drawing");
            img.onload = function(){
                context.drawImage(img, 0, 0);
            };
        }
    }

    //click on the erase button
    $("#erase").click(function(){
        if(paintErase == "paint") {
            paintErase = "erase";
        } else {
            paintErase = "paint";
        }
        $(this).toggleClass("eraseMode");
    });

    //change color input
    $("#paintColor").change(function(){
        $("#circle").css("background-color", $(this).val());
    });






















    // var canvas = document.getElementById("paint");
    // var context = canvas.getContext("2d");

    // //draw a line
    // //begin new path
    // context.beginPath();
    // //set line width
    // context.lineWidth = 40;
    // //set line color
    // context.strokeStyle = "blue";
    // //give a cap to the line
    // context.lineCap = "round";
    // //add line join
    // context.lineJoin = "round";
    // //position the context point
    // context.moveTo(50, 50);
    // //draw a line from the starting point to the new point
    // context.lineTo(200, 200);
    // //draw another line
    // context.lineTo(-300, 100);
    // //make line visible
    // context.stroke();
});