import { BrowserRouter } from "react-router-dom";
import Header from "./1-Header/Header";
import Main from "./4-Main/Main";
import { Provider } from "react-redux";
import store from "../../store/store";

function App(): JSX.Element {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Header />
          <Main />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;

// main color: rgb(47, 47, 154);
// secondary color: rgb(232, 232, 250);
