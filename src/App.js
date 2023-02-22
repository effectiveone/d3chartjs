import LineChartComponent from "./components/LineChart";
import data from "./data";
function App() {
  console.log("data", data);
  return (
    <>
      <LineChartComponent
        data={data}
        width="500px"
        height="500px"
        margin="20px"
      />
    </>
  );
}

export default App;
