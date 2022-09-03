import "./App.css";
import { Route } from "react-router-dom";
import Home from "./components/Home";
import Chats from "./components/Chats";

function App() {
	return (
		<div className="App">
			<Route
				exact
				path="/"
				component={Home}
			/>{" "}
			<Route
				exact
				path="/chats"
				component={Chats}
			/>{" "}
		</div>
	);
}

export default App;
