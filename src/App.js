import Invoice from "./components/Invoice/invoice";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            component={() => <h1>Hello my friends 👋👋</h1>}
          />
          <Route exact path="/:id" children={<Invoice />} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
