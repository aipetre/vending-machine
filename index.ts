async function helloWorld() {
  console.log("Hello, World!");
}

(async () => {
  await helloWorld();
})();