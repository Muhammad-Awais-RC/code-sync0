import { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import { toast } from "react-hot-toast";
import { useLocation, useParams, useNavigate } from "react-router-dom";
const EditerPage = () => {
	const [clients, setClients] = useState([]);
	const codeRef = useRef("");
	const socketRef = useRef();
	const location = useLocation();
	const navigate = useNavigate();
	const { roomId } = useParams();

	if (!location.state) {
		navigate("/");
	}
	async function copyHandler() {
		try {
			await navigator.clipboard.writeText(roomId);
			toast.success("RoomID copied successfully");
		} catch (error) {
			toast.error(error.message);
		}
	}

	function leaveHandler() {
		navigate("/");
	}

	useEffect(() => {
		function handleError(err) {
			console.log("Socket error: " + err);
			toast.error("Socket error: " + err);
			navigate("/");
		}

		(async () => {
			socketRef.current = await initSocket();
			socketRef.current.on("connect_error", (err) => handleError(err));
			socketRef.current.on("connect_failed", (err) => handleError(err));
			socketRef.current.emit("join", {
				roomId,
				username: location.state?.username,
			});
			socketRef.current.on("joined", ({ clients, username, socketId }) => {
				if (username !== location.state.username)
					toast.success(username + " joined");
				setClients(clients);

				socketRef.current.emit("code-sync", {
					socketId,
					code: codeRef.current,
				});
			});

			socketRef.current.on("disconnected", ({ socketId, username }) => {
				toast.success(username + " left");
				setClients((prev) => prev.filter((c) => c.socketId !== socketId));
			});
		})();
		return () => {
			socketRef.current.disconnect();
			socketRef.current.off("joined");
			socketRef.current.off("disconnected");
		};
	}, []);

	return (
		<div className="min-h-screen">
			<div className="flex gap-2 ">
				<div className="w-2/12 bg-slate-950 text-white flex flex-col p-2 py-3 gap-5 items-center h-svh sticky top-0">
					<img
						src="https://img.freepik.com/premium-psd/psd-sparkling-neon-radiance-code-text-with-bright-neon-peach-y2k-sale-effect-tshirt-clipart-ink_655090-3371427.jpg?size=626&ext=jpg&ga=GA1.1.1994968941.1723479654&semt=ais_hybrid"
						alt=""
						className=" max-w-24 h-16 rounded-full shadow shadow-white "
					/>
					<hr className="w-full" />
					<div className="flex flex-wrap  gap-2 md:gap-4">
						{clients.map((c) => (
							<Client
								key={c.socketId}
								socketId={c.socketId}
								username={c.username}
							/>
						))}
					</div>

					<div className="mt-auto flex flex-wrap gap-3 justify-center ">
						<hr className="w-full" />
						<button
							className="bg-green-600 py-2 px-3 rounded transition-all hover:scale-105"
							onClick={copyHandler}
						>
							Copy Room ID
						</button>
						<button
							className="bg-red-600 py-2 px-3 rounded transition-all hover:scale-105"
							onClick={leaveHandler}
						>
							Leave Room
						</button>
					</div>
				</div>
				{/* Editor  */}
				<div className="flex-1 bg-gray-950">
					<Editor
						socketRef={socketRef}
						roomId={roomId}
						onCodeChange={(code) => (codeRef.current = code)}
					/>
				</div>
			</div>
		</div>
	);
};

export default EditerPage;
