import { BrowserRouter as Router } from "react-router-dom";
import GetRouters from "./router";

export function App() {
  // 创建Context对象
  return (
    <Router>
      <GetRouters />
    </Router>
  );
}
