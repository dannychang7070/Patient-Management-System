/* JS: sidebar button reactions */

globals: $:false; // Ignore JSLint/JSHint error: "$ is not defined"

$(function () {
    
    var navbarID = $("#mainsettingnavBar").attr("navbarID");
    /* Initial functions */
    initButtons1(); // Reset sidebar buttons' style
    
    /* Mark button style corresponded to the current webpage as focused, otherwise, reset */
    function initButtons1() {
        $(".settingnavBarButton").removeClass("focus"); // reset all button styles first
        switch (navbarID) {
            case "1": 
                $("#memberNav").addClass("focus");
                break;
            case "2":
                $("#accessNav").addClass("focus");
                break;
            case "3":
                $("#forgotNav").addClass("focus");
                break;
        }   
    }
    
    /* The action when click a button */
    //$(".navItem").onclick(function () {
        /* Pop an alert window if there are still input forms not finished */
    //});
    
    
});