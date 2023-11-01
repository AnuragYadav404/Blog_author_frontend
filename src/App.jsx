function App() {
  /* app will have two things
    1. The side navigation bar
    2. The main outlet
  */
  return (
    <>
      <div id="navigation_sidebar" className="text-3xl font-bold underline">
        <h1>This is the app page</h1>
      </div>
      <div id="content_outlet">
        <h2>This is content outlet</h2>
      </div>
    </>
  );
}

export default App;
