System.register([], function (exports, module) {
  'use strict';
  return {
    execute: function () {

      exports('default', main);

      var foo = 'hello world!';

      //  import { version } from '../package.json';
      function main () {
        console.log(foo);
      }

    }
  };
});
