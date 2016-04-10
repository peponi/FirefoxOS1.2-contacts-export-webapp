'use strict';

var d = document,
    w = window;

var ContactsSyncApp = function() {
    var self = this,
        syncStatusNode              = d.getElementById('sync-status'),
        urlField                    = d.getElementById('url'),
        syncBtn                     = d.getElementById('sync-btn'),
        localContactListNode        = d.getElementById('local-contact-list'),
        remoteContactListNode       = d.getElementById('remote-contact-list'),
        onOffSwitchCbx              = d.getElementById('onoffswitch-cbx'),
        contactCount                = d.getElementById('contact-count'),
        li                          = d.createElement('LI'),

        dbName  = 'ffos_contacts',
        url     = 'http://192.168.0.3:5984/' + dbName,
        db      = new PouchDB(dbName),
        payload = w.location.protocol === "app:" ? { mozSystem: true, mozAnon: true } : { mozSystem: false, mozAnon: false },

        state               = {isCurrentVisibleListLocal: true},
        allLocalContacts    = [],
        allPouchDBContacts  = [];

    var appXHR = function () {
        return new XMLHttpRequest(payload);
    }

    var opts = {
        ajax: {
            xhr: appXHR,
            headers: { cookie: 'no' }
        }
    };

    // ============= HELPER =================

    /**
     * will convert a MozContact object to a standard javascript object
     * @param  {object} r result object, contains all attributes of a contact
     * @return {object}   will return a contact object
     */
    self.convertMozContactToJSON = function(r) {
        // mozObject is not a standart javascript object
        // https://developer.mozilla.org/en-US/docs/Mozilla/Firefox_OS/API/MozContact
        return {
            id: r.id,
            published: r.published,
            updated: r.updated,
            name: r.name,
            honorificPrefix: r.honorificPrefix,
            givenName: r.givenName,
            additionalName: r.additionalName,
            familyName: r.familyName,
            honorificSuffix: r.honorificSuffix,
            nickname: r.nickname,
            email: r.email,
            photo: r.photo,
            url: r.url,
            category: r.category,
            adr: r.adr,
            tel: r.tel,
            org: r.org,
            jobTitle: r.jobTitle,
            bday: r.bday,
            note: r.note,
            impp: r.impp,
            anniversary: r.anniversary,
            sex: r.sex,
            genderIdentity: r.genderIdentity,
            key: r.key,
        };
    };

    self.showErrorMessage = function() {
        d.getElementById('app-description').innerHTML = 'NOTE: you are not running FirefoxOS ! ';
        d.getElementById('app-description').classList.add('blink');
        d.getElementById('url').disabled = true;
    };

    // https://gist.github.com/Mte90/11087561
    // var ffosVersion = parseFloat(self.getFireFoxOSVersion());
    // if(ffosVersion > 1.2) {
    // }
    // self.getFireFoxOSVersion = function() {
        //     if (navigator.userAgent.match(/(mobile|tablet)/i)) {
        //         var ffVersionArray = (navigator.userAgent.match(/Firefox\/([\d]+\.[\w]?\.?[\w]+)/));
                
        //         if (ffVersionArray.length === 2) {
        //             //Check with the gecko version the Firefox OS version
        //             //Table https://developer.mozilla.org/en-US/docs/Gecko_user_agent_string_reference
        //             var hashVersion = {
        //                 '18.0': '1.0.1',
        //                 '18.1': '1.1',
        //                 '26.0': '1.2',
        //                 '28.0': '1.3',
        //                 '30.0': '1.4',
        //                 '32.0': '1.5'
        //             },
        //             rver = ffVersionArray[1],
        //             sStr = ffVersionArray[1].substring(0, 4);
                    
        //             if (hashVersion[sStr]) {
        //                 rver = hashVersion[sStr];
        //             }

        //             return rver;
        //         }
        //     }

        //     //Return the version of Firefox OS or null if not Firefox OS
        //     //The simulator use the gecko version of the browser!
        //     return false; 
    // };

    // ============= GETTER =================
    
    self.getAllLocalContacts = function() {

        // check if this app has been executed on firefox os
        // else show error text in ui
        if(w.navigator.mozContacts) {

            allLocalContacts = [];

            //https://developer.mozilla.org/en-US/docs/Web/API/mozContact
            //https://developer.mozilla.org/en-US/docs/Mozilla/Firefox_OS/API/Contacts_API
            //https://developer.mozilla.org/en-US/docs/Mozilla/Firefox_OS/API/ContactManager/find
            var request = w.navigator.mozContacts.getAll({sortBy: 'givenName', sortOrder: 'descending'}); 
            
            request.onsuccess = function () {
                // if one contact has been found
                if(this.result) {
                    var json = self.convertMozContactToJSON(this.result);
                    allLocalContacts.push(json);
                    // Move to the next contact which will call the request.onsuccess with a new result
                    this.continue();
                } else {
                    console.log('allLocalContacts:', allLocalContacts);
                }
            };

            request.onerror = function () {
                console.error('Could not read contact!');
            };

            return true;

        // add implementation for Android via Cordova here
        // https://cordova.apache.org/docs/en/2.0.0/cordova/contacts/contacts.find.html
        // } else if (navigator.contacts) {
        } else {
            return false;
        }
    };

    self.getAllPouchDBContacts = function() {
        allPouchDBContacts = [];

        db.allDocs({include_docs: true, descending: true}, function(err, docs) {
            docs.rows.map(function(row) {
                allPouchDBContacts.push(row.doc.doc);
            });

            console.log('allPouchDBContacts:', allPouchDBContacts);
        });
    };

    // ============= GETTER =================

    self.saveLocalContactToPouchDB = function(contactData) {

        // set pouchdb doc id to same id as mocContact has
        // and push contact to pouchdb
        var obj = {
            '_id': contactData.id,
            'doc': contactData
        }

        // https://pouchdb.com/api.html#create_document
        db.put(obj, function callback(err, doc) {
            if (!err) {
                console.log('Successfully saved a contact!', doc);
                d.getElementById(doc.id).className = 'synced';
            } else if (err.status === 409) {
                // https://pouchdb.com/guides/documents.html#updating-documents%E2%80%93correctly
                // https://pouchdb.com/guides/conflicts.html
                console.error('error status:', err.status);
                // db.get(obj._id).then(function (doc) {
                //     //console.log('get: ', doc);
                //     var mozContact = convertMozContactToJSON(obj.doc);
                //     mozContact._id = doc._id;
                //     mozContact._rev = doc._rev;
                //     return db.put(doc);
                // }).then(function (doc) {
                //     console.log('updated document: ',doc);
                // });
            }
        });
    };

    self.savePouchDBContactToLocalContacts = function(contactData) {
        // https://developer.mozilla.org/en-US/docs/Mozilla/Firefox_OS/API/Contacts_API
        var contact = new mozContact(contactData); // Firefox OS 1.3 takes a parameter to initialize the object
        if ("init" in contact) {
            // Firefox OS 1.2 and below uses a "init" method to initialize the object
            contact.init(contactData);
        }

        // save the new contact
        var saving = navigator.mozContacts.save(contact);

        saving.onsuccess = function() {
            console.log('new contact saved');
            // This update the person as it is stored
            // It includes its internal unique ID
            // Note that saving.result is null here
        };

        saving.onerror = function(err) {
            console.error(err);
        };
    };    

    // ============= EVENT ACTIONS =================

    self.drawContactList = function(list, domNode, conterList) {

        domNode.innerHTML = '';

        list.map(function(contact) {

            // display the name of the contact
            var liClone = li.cloneNode(true);
            liClone.innerHTML = contact.name[0];
            liClone.id = contact.id;
            
            // check if current contact is in local and remote db
            // and mark the contact if so          
            var currentContactIsSync = conterList.some(function(conterContact) {
                return conterContact.id === contact.id;
            });

            if(currentContactIsSync) {
                liClone.className = 'synced';                
            } else {
                liClone.className = 'notsynced';
                liClone.onclick = self.clickOnContactListItem;
            }

            domNode.appendChild(liClone);
        }); 
    };

    self.initializeDBSync = function() {

        var remoteDB = new PouchDB(url, opts);

        // https://github.com/pouchdb/pouchdb/issues/4256
        // https://pouchdb.com/guides/replication.html
        db.sync(remoteDB).on('complete', function () {
            console.log('sync to CouchDB complete');
            syncStatusNode.innerHTML = ': connected';
            syncStatusNode.className = '';
        }).on('error', function (err) {
            syncStatusNode.innerHTML = ': connection error';
            syncStatusNode.className = 'error';
        });
    };

    // ============= VIEW ACTIONS =================

    // ============= EVENT LISTENER =================
    
    self.clickOnContactListItem = function(e) {
        var id = e.target.id,
            parentId = e.target.parentNode.id,
            contactData;

        if(parentId === 'local-contact-list') {
            allLocalContacts.map(function(contact) {
                if (contact.id === id) {
                    contactData = contact;
                }
            });

            self.saveLocalContactToPouchDB(contactData);

        } else if(parentId === 'remote-contact-list') {
            allPouchDBContacts.map(function(contact) {
                if (contact.id === id) {
                    contactData = contact;
                }
            });
            console.log('contactData',contactData);
            self.savePouchDBContactToLocalContacts(contactData);
        }
    };
    
    self.addAllEventListener = function() {
        // get url while user is typing and check if format is valid
        urlField.onkeyup = function(e) {
            if(urlField.checkValidity()) {
                url = e.target.value;
            }
        };

        // sync all pouchdb contact with couchdb
        syncBtn.onclick = function() {
            self.initializeDBSync();
        };

        onOffSwitchCbx.onclick = function() {

            if(state.isCurrentVisibleListLocal) {
                localContactListNode.style.display = 'block';
                remoteContactListNode.style.display = 'none';
                contactCount.innerHTML = allLocalContacts.length;

                self.drawContactList(allLocalContacts, localContactListNode, allPouchDBContacts);
            } else {
                localContactListNode.style.display = 'none';
                remoteContactListNode.style.display = 'block';
                contactCount.innerHTML = allPouchDBContacts.length;

                self.drawContactList(allPouchDBContacts, remoteContactListNode, allLocalContacts);
            }

            self.getAllPouchDBContacts();
            self.getAllLocalContacts();               
            state.isCurrentVisibleListLocal = !state.isCurrentVisibleListLocal;
        };
    };

    // ============= INIT =================

    self.init = function() {
        if( self.getAllLocalContacts() ) {
            self.getAllPouchDBContacts();
            self.addAllEventListener();
        } else {            
            self.showErrorMessage();
        }
    };    
}

w.addEventListener('DOMContentLoaded', function() {
    var app = new ContactsSyncApp();
    app.init();
});

// offline handeling
w.addEventListener('load', function(e) {

  w.applicationCache.addEventListener('updateready', function(e) {
    if (w.applicationCache.status == w.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      if (confirm('A new version of this App is available. Load it?')) {
        w.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);

}, false);
