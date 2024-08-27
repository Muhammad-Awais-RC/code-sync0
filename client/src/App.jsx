import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EditorPage from "./pages/EditorPage";
import { Toaster } from "react-hot-toast";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/editor/:roomId" element={<EditorPage />} />
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
