# User story

**as a  FFOS1.2 user** i want to export all my contacts  
**so thant** I can upgrade my operating system and import all contacts to the new OS

### Acceptance criteria:

* contacts can be read from FirefoxOS
  * v1.1 ✔
  * v1.2 ✔
  * v1.3 ✔
* contacts can be send to CouchDB ✔
  * check if contact already exist on CouchDB - by comparing phone or email or name
  * if contact already exist or has been synced update synced contactlist with blue '✔' or red '⨯'
* contacts can be fetch from CouchDB
* contacts can be import in FirefoxOS
  * check if contact already exist on FirefoxOS - by comparing phone or email or name
  * v1.2
  * v1.3
 
### Firmware upgrade links:

1.  **FFOS1.3** image for *ZTE Open* & *Alcatel One Touch Fire* on [firefoxosbuilds.org](http://firefoxosbuilds.org) 
2. [upgrade to](https://hacks.mozilla.org/2014/01/upgrading-your-zte-open-to-firefox-1-1-or-1-2-fastboot-enabled/) **FFOS1.2**
3. [upgrade to](http://opendirective.net/blog/2014/04/success-firefox-os-1-4-built-and-running-on-zte-open/) **FFOS1.4/FFOS1.5**
4. upgrade/reset to FFOS1.1/FFOS1.0  ([firmware for ZTE open](http://www.ztedevice.com/support/smart_phone/b5a2981a-1714-4ac7-89e1-630e93e220f8.html) )

### Info

* find all old, current and upcoming FirefoxOS devices on [firefoxosdevices.org](https://firefoxosdevices.org)
* there is also an npm [cli tool to manage FirefoxOS builds](https://www.npmjs.com/package/fxosbuilds)