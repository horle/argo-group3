/**
 * Thermometer Progress meter.
 * This function will update the progress element in the "thermometer"
 * to the updated percentage.
 * If no parameters are passed in it will read them from the DOM
 *
 * @param {Number} goalAmount The Goal amount, this represents the 100% mark
 * @param {Number} progressAmount The progress amount is the current amount
 * @param {Boolean} animate Whether to animate the height or not
 *
 */
function thermometer(goalAmount, progressAmount, rank, nextAmount, nextRank, animate) {
    "use strict";

    var $thermo = $("#thermometer"),
        $progress = $(".progress", $thermo),
		  $next = $(".next-goal", $thermo),
        $goal = $(".goal", $thermo),
        percentageAmount,nextPercentage;

    percentageAmount =  Math.min( Math.round(progressAmount / goalAmount * 1000) / 10, 100); //make sure we have 1 decimal point
    nextPercentage =  Math.min( Math.round(nextAmount / goalAmount * 1000) / 10, 100); //make sure we have 1 decimal point

    //let's format the numbers and put them back in the DOM
    $goal.find(".amount").text("Konsul ("+goalAmount+" XP)" );
	 $next.find(".amount").text(nextRank+" ("+nextAmount+" XP)");
    $progress.find(".amount").text( rank+" (" + progressAmount +" XP)" );


    //let's set the progress indicator
    $progress.find(".amount").hide();
    if (animate !== false) {
        $progress.animate({
            "height": percentageAmount + "%"
        }, 1200, function(){
            $(this).find(".amount").fadeIn(500);
        });
		  $next.animate({
            "height": nextPercentage + "%"
        }, 1200, function(){
            $(this).find(".amount").fadeIn(500);
        });

    }
    else {
        $progress.css({
            "height": percentageAmount + "%"
        });
        $progress.find(".amount").fadeIn(500);
    }
}
