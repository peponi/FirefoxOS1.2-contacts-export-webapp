# User story

**as a  FFOS1.1 user** i want to export all my contacts  
**so thant** I can upgrade my operating system and import all contacts to the new OS

![Screen Shot](screenshot.png)

### Acceptance criteria:

* contacts can be read from FirefoxOS
  * v1.1 ✔
  * v1.2 ✔
  * v1.3 ✔
* contacts can be send to CouchDB ✔
  * check if contact already exist on CouchDB - by comparing phone or email or name
  * if contact already exist or has been synced update synced contactlist with blue '✔' or red '⨯'
* contacts can be fetch from CouchDB ✔
* contacts can be import in FirefoxOS ✔
  * check if contact already exist on FirefoxOS - by comparing phone or email or name ✔

### FirefoxOS API

* https://developer.mozilla.org/en-US/docs/Mozilla/Firefox_OS/API/Contacts_API
* https://developer.mozilla.org/en-US/Apps/Fundamentals/gather_and_modify_data/Updating_phone_contacts_from_the_web
 
### Firmware upgrade links:

* all you need for for *ZTE Open*, *Alcatel One Touch Fire*, *Keon* & *Flame* on [www.mexmod.com](http://www.mexmod.com)
* all you need for Geekphones on [downloads.geeksphone.com](http://downloads.geeksphone.com)
* all you need for Sony FXP on [fxpblog.co](http://fxpblog.co/firefox/nightly)
*  see a huge list of build for several devices up to FFOS 2.0 on [firefoxosbuilds.org](https://firefoxos.mozilla.community/devices) 
* [upgrade to](https://hacks.mozilla.org/2014/01/upgrading-your-zte-open-to-firefox-1-1-or-1-2-fastboot-enabled/) **FFOS1.2**
* [upgrade to](http://opendirective.net/blog/2014/04/success-firefox-os-1-4-built-and-running-on-zte-open/) **FFOS1.4/FFOS1.5**
* upgrade/reset to FFOS1.1/FFOS1.0  ([firmware for ZTE open](http://www.ztedevice.com/support/smart_phone/b5a2981a-1714-4ac7-89e1-630e93e220f8.html) )

### Info

* find all old, current and upcoming FirefoxOS devices on [firefoxosdevices.org](https://firefoxosdevices.org)
* there is also an npm [cli tool to manage FirefoxOS builds](https://www.npmjs.com/package/fxosbuilds)

## CouchDB setup (if you want to sync your data to your [CouchDB](https://couchdb.apache.org))

you need to enable [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) to sync data fromt your phone to the DB

*CouchDB doesn't come with CORS enabled by default. This is a problem for libraries like PouchDB, which depend on being able to access CouchDB ...*

just do the following in your terminal

```
HOST=http://adminname:password@couchdb_ip_address:5984 # or whatever you got

curl -X PUT $HOST/_config/httpd/bind_address -d '"0.0.0.0"'
curl -X PUT $HOST/_config/httpd/enable_cors -d '"true"'
curl -X PUT $HOST/_config/cors/origins -d '"*"'
curl -X PUT $HOST/_config/cors/credentials -d '"true"'
curl -X PUT $HOST/_config/cors/methods -d '"GET, PUT, POST, HEAD, DELETE"'
curl -X PUT $HOST/_config/cors/headers -d '"accept, authorization, content-type, origin, referer, x-csrf-token"'
```

via: [github.com/pouchdb/add-cors-to-couchdb](https://github.com/pouchdb/add-cors-to-couchdb#what-it-does)
