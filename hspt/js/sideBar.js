/* JS: sidebar button reactions */

globals: $:false; // Ignore JSLint/JSHint error: "$ is not defined"

$(function () {
    
    var pageID = $("#bodyContainer").attr("pageID");
    // DEBUG
    // window.alert("pageID = "+pageID);
    
    /* Initial functions */
    initButtons(); // Reset sidebar buttons' style
    
    /* Mark button style corresponded to the current webpage as focused, otherwise, reset */
    function initButtons() {
        $(".navButton").removeClass("focus"); // reset all button styles first
        switch (pageID) {
            case "1": 
                $("#examNav").addClass("focus");
                break;
            case "3":
                $("#treatmentsNav").addClass("focus");
                break;
            case "4":
                $("#merchandisesNav").addClass("focus");
                break;
            case "5":
                $("#reportsNav").addClass("focus");
                break;
        }   
    }
    
    /* The action when click a button */
    //$(".navItem").onclick(function () {
        /* Pop an alert window if there are still input forms not finished */
    //});
    
    
});