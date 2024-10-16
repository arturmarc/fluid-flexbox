import "./App.css";
import { ExampleSelector } from "./usage/ExampleSelector";
import { Resizer } from "./usage/Resizer";
import { UsageList } from "./usage/UsageList";
import { AdaptingContentExample } from "./usage/examples/AdaptingContentExample";
import { ConditionallyNestedExample } from "./usage/examples/ConditionallyNestedExample";
import { DeepNestingExample } from "./usage/examples/DeepNestingExample";
import { NestedExample } from "./usage/examples/NestedExample";
import { SingleChildExample } from "./usage/examples/SingleChildExample";

function App() {
  // return (
  //   <Resizer>
  //     <SingleChildExample />
  //   </Resizer>
  // );
  return <ExampleSelector />;
}

export default App;
