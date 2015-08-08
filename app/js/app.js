'use strict';

var d = document;

if(window.navigator.mozContacts)
{

  // add global for debugging on FF console
  var accountsArr = [],
      contactList = d.getElementById('contact-list'),
      li          = d.createElement('LI'),
      ipField     = d.getElementById('ip'),
      ip          = '127.0.0.1:5984';

  window.addEventListener('DOMContentLoaded', function() {

    /*
     * https://developer.mozilla.org/en-US/docs/Web/API/mozContact
     */
    var request = window.navigator.mozContacts.getAll({sortBy: 'givenName', sortOrder: 'descending'}),
        count = 0; 
    
    request.onsuccess = function () {
      if(this.result) {
        count++;

        // Display the name of the contact
        // console.log(this.result.name[0], this.result.tel[0].value);
        var liClone = li.cloneNode(true);
        liClone.innerHTML = this.result.name[0];
        contactList.appendChild(liClone);

        // push account to array
        accountsArr.push(this.result);

        // Move to the next contact which will call the request.onsuccess with a new result
        this.continue();

      } else {
        d.getElementById('contact-count').innerHTML = count + ' contacts found';
      }
    };

    request.onerror = function () {
      console.log('Could not read contact!');
    };

    // get ip address while user is typing and check if format is valid
    ipField.addEventListener('keyup',function(e)
    {
      if(ipField.checkValidity())
      {
        console.log(e.target.value);
        ip = e.target.value;
      }
    });  
    
    d.getElementById('export').addEventListener('click',function()
    {

      for (var i = accountsArr.length - 1; i >= 0; i--) {     
        console.log('sync: ' + accountsArr[i].name[0]);
        fetch( 'http:' + ip + '/moz_contacts', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(accountsArr[i])
        });
      };
    });
  });
}
else
{
  d.getElementById('app-description').innerHTML = 'NOTE: you are not running FirefoxOS ! ';
  d.getElementById('app-description').classList.add('blink');
  d.getElementById('ip').disabled = true;
}

