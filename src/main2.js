export default function () {
  return import('./main.js').then(( main ) => {
    main();
  });
}