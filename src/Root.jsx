import "./index.css";

function App() {
  /* app will have two things
    1. The side navigation bar
    2. The main outlet
  */
  return (
    <>
      <div id="sidebar">
        <h1>navigation side-bar</h1>
      </div>
      <div id="detail">
        <h2>This is content outlet</h2>
      </div>
    </>
  );
}

export default App;
