import { Playground } from "./components/Playground";
import { ReactFlowProvider } from "@xyflow/react";

function App() {
  return (
    <ReactFlowProvider>
      <Playground />
    </ReactFlowProvider>
  );
}

export default App;
