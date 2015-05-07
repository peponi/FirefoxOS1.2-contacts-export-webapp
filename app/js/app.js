'use strict';

// add globaly for debugging on FF console
var d = document;

if(window.navigator.mozContacts)
{

  var accountsArr = [],
      ipField     = d.getElementById("ip"),
      ip;

  window.addEventListener('DOMContentLoaded', function() {

    /*
     * https://developer.mozilla.org/en-US/docs/Web/API/mozContact
     */
    var request = window.navigator.mozContacts.getAll({sortBy: "givenName", sortOrder: "descending"}),
        count = 0; 
    
    request.onsuccess = function () {
      if(this.result) {
        count++;

        // Display the name of the contact
        console.log(this.result.name[0], this.result.tel[0].value);

        // push account to array
        accountsArr.push(this.result);

        // Move to the next contact which will call the request.onsuccess with a new result
        this.continue();

      } else {
        console.log(count + ' contacts found.');
      }
    };

    request.onerror = function () {
      console.log('Could not read contact!');
    };

    // get ip addres while user is typing and check if format is valid
    ipField.addEventListener('keyup',function(e)
    {
      if(ipField.checkValidity())
      {
        ip = e.target.value;
      }
    });  
    
    d.getElementById("export").addEventListener('click',function()
    {
      console.log(accountsArr,ip);
    });
  });
}
else
{
  d.getElementById('app-description').innerHTML = 'NOTE: you are not running FirefoxOS ! ';
  d.getElementById('app-description').classList.add('blink');
  d.getElementById('ip').disabled = true;
}

