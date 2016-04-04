'use strict';

var d           = document,
    w           = window,
    urlField    = d.getElementById('url'),
    syncBtn     = d.getElementById('sync-btn'),
    contactList = d.getElementById('contact-list'),
    li          = d.createElement('LI'),
    dbName      = 'ffos_contacts',
    url         = 'http://10.0.0.4:5984/ffos_contacts',
    db          = new PouchDB(dbName);

// check if this app has been executed on firefox os
// else show error text in ui
if(w.navigator.mozContacts) {

    // mozObject is not a standart javascript object
    // https://developer.mozilla.org/en-US/docs/Mozilla/Firefox_OS/API/MozContact
    var convertMozContactToJSON = function(r) {
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
    }

    w.addEventListener('DOMContentLoaded', function() {

        //https://developer.mozilla.org/en-US/docs/Web/API/mozContact
        var request = w.navigator.mozContacts.getAll({sortBy: 'givenName', sortOrder: 'descending'}),
            count = 0; 
        
        request.onsuccess = function () {
            if(this.result) {
                count++;

                // display the name of the contact
                var liClone = li.cloneNode(true);
                liClone.innerHTML = this.result.name[0];
                liClone.id = this.result.id;
                contactList.appendChild(liClone);

                // check if current contact is still in db
                // and mark the contact
                // https://pouchdb.com/api.html#fetch_document
                db.get(this.result.id).then(function (doc) {
                    d.getElementById(doc._id).classList.add('synced');
                }).catch(function (err) {
                    console.error(err);
                });

                // Move to the next contact which will call the request.onsuccess with a new result
                this.continue();

            } else {
                d.getElementById('contact-count').innerHTML = count;
            }
        };

        request.onerror = function () {
            console.error('Could not read contact!');
        };



        // get url while user is typing and check if format is valid
        urlField.addEventListener('keyup',function(e) {
            if(urlField.checkValidity()) {
                url = e.target.value;
            }
        });    
        
        // write all contact to pouchdb and sync to couchdb when clicking the sync button
        syncBtn.addEventListener('click', function() {
            console.log('click sync btn');

            var remoteDB = new PouchDB(url);

            console.log('create remote db');

            // https://github.com/pouchdb/pouchdb/issues/4256
            // https://pouchdb.com/guides/replication.html
            db.sync(remoteDB).on('complete', function () {
                console.log('sync to CouchDB complete');
                db.allDocs({include_docs: true, descending: true}, function(err, docs) {
                    console.log('show local pouchdb:', docs);

                    docs.rows.map(function(row) {
                        console.log(row.doc);
                    });

                });
            }).on('error', function (err) {
                console.log('can not sync to CouchDB', err);
            });

            //https://developer.mozilla.org/en-US/docs/Mozilla/Firefox_OS/API/Contacts_API
            //https://developer.mozilla.org/en-US/docs/Mozilla/Firefox_OS/API/ContactManager/find

            var allContactsRequest = w.navigator.mozContacts.getAll({sortBy: 'givenName', sortOrder: 'descending'}); 
        
            allContactsRequest.onsuccess = function () {
                // if one contact has been found
                if(this.result) {
                    // set pouchdb doc id to same id as mocContact has
                    // and push contact to pouchdb

                    var obj = {
                        '_id': this.result.id,
                        'doc': convertMozContactToJSON(this.result)
                    }
                    console.log(obj);
                    // https://pouchdb.com/api.html#create_document
                    db.put(obj, function callback(err, doc) {
                        if (!err) {
                            console.log('Successfully saved a contact!', doc);
                            d.getElementById(doc._id).classList.add('synced');
                        } else if (err.status === 409) {
                            // https://pouchdb.com/guides/documents.html#updating-documents%E2%80%93correctly
                            // https://pouchdb.com/guides/conflicts.html
                            console.error('error status:', err.status);
                            db.get(obj._id).then(function (doc) {
                                //console.log('get: ', doc);
                                var mozContact = convertMozContactToJSON(obj.doc);
                                mozContact._id = doc._id;
                                mozContact._rev = doc._rev;
                                return db.put(doc);
                            }).then(function (doc) {
                                console.log('updated document: ',doc);
                            });
                        }
                    });

                    // Move to the next contact which will call the request.onsuccess with a new result
                    this.continue();
                }
            };
        });

    });
} else {
    d.getElementById('app-description').innerHTML = 'NOTE: you are not running FirefoxOS ! ';
    d.getElementById('app-description').classList.add('blink');
    d.getElementById('url').disabled = true;
}
