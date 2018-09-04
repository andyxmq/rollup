System.register([], function (exports, module) {
  'use strict';
  return {
    execute: function () {

      exports('default', main2);

      function main2 () {
        return module.import("./main.js").then(( main ) => {
          main();
        });
      }

    }
  };
});
