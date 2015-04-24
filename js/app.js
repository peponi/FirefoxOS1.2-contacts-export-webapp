// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded
window.addEventListener('DOMContentLoaded', function() {

  // We'll ask the browser to use strict code to help us catch errors earlier.
  // https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
  'use strict';


  var request = window.navigator.mozContacts.getAll();
  var count = 0;

  request.onsuccess = function () {
    if(this.result) {
      count++;
      
      // Display the name of the contact
      console.log(this.result.name[0]);

      // Move to the next contact which will call the request.onsuccess with a new result
      this.continue();

    } else {
      console.log(count + ' contacts found.');
    }
  }

  request.onerror = function () {
    console.log('Something goes wrong!');
  }
  
  
  document.getElementById("reload").addEventListener('click',function()
  {
    location.reload();
  })
});

