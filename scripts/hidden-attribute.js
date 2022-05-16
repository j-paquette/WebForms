/* document.getElementById("okButton")
        .addEventListener("click", function() {
  document.getElementById("welcome").hidden = true;
  document.getElementById("awesome").hidden = false;
}, false); */

function warningaa(obj) {
  if(obj.value == "yes") {
      document.getElementById("hiddenField").hidden = false;  
  }
  else 
    document.getElementById("hiddenField").hidden = true;  
}
