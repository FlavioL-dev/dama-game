import "./App.css";
import HomeFC from "./components/HomeFC";

function App() {
  return (
    <div
    className="table-container"
      onDragStart={(e) => e.preventDefault()}
      onMouseDown={(e) => e.preventDefault()}
    >
      <HomeFC key="home" />
    </div>
  );
}
export default App;
