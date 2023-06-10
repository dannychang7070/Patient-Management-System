//Problem: Users input word, then search the data, just show the result.
//Solution: Add interactivty so the user can search it.

//First, users type word in "query-bar"
$(function() {
    //$("#searchbarInput").keydown(function(){
        //$("#searchbarInput").css("background-color", "yellow");
    //});
    $("#searchbarInput").keyup(function() {
		$(".hospitalSect").show();	

		var count=0;
        //$("#searchbarInput").css("background-color", "pink");
		var query=$("#searchbarInput").val();
		
		 $(".hospitalSect").each(function(){
			var result = $(".hospitalSect").text();
			if(result.indexOf(query) != -1) {
				$(".hospitalSect").children(".hospitalSectContent").children(".patientItemBlock").children(".patientItem").each(function(){
				var result2 = $(this).text();
				if(result2.indexOf(query) != -1) {
					$(this).show();
				}
				else {
					$(this).hide();	
				}				
				});
			}
			else {
				$(this).hide();
				count=count+1;				
			}
		 });
		 
		if (count==4){
			alert("沒有相符的搜尋結果!! 甜心寶貝祝你新年快樂!!!");
		}
		
    });
});