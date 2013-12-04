Slim-RedBeanPHP-KnockoutJS
==========================

Knockout.JS with Minimal PHP Demo.  This is the source code which goes with the talk described at
http://www.meetup.com/GTA-PHP-User-Group-Toronto/events/151672182/ - the slides are available at
http://www.slideshare.net/zymsys/slim-red-beanphp-and-knockout.

To build the requirements from source will require Composer, Bower, NPM and Grunt:

  * http://getcomposer.org/
  * http://bower.io/
  * https://npmjs.org/
  * http://gruntjs.com/

Once you've got those prerequisites, the following commands should install / build the required libraries:

```
  composer install
  bower install
  cd bower_components/sinon
  ./build
  cd ../sinon-qunit/
  ./build
  cd ../knockout
  npm install
  grunt
```  
  
