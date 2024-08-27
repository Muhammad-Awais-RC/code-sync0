import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";

const HomePage = () => {
	const [roomID, setRoomID] = useState("");
	const [username, setUsername] = useState("");

	const navigate = useNavigate();

	function genRoomID() {
		const id = v4();
		setRoomID(id);
		toast.success("Room ID has been created");
	}

	function joinRoom() {
		if (!roomID) {
			toast.error("Please enter a room ID or create a new one");
			return;
		}
		if (!username) {
			toast.error("Please enter username");
			return;
		}

		navigate("/editor/" + roomID, {
			state: { username },
		});
		toast.success("Successfully joined");
	}

	return (
		<div className="min-h-screen flex justify-center items-center">
			<div className="bg-slate-950 md:w-[45%]  md:mx-3 p-2 md:p-10 flex flex-col gap-4 md:gap-6 rounded justify-center items-center shadow-sm shadow-black">
				<img
					src="https://img.freepik.com/premium-psd/psd-sparkling-neon-radiance-code-text-with-bright-neon-peach-y2k-sale-effect-tshirt-clipart-ink_655090-3371427.jpg?size=626&ext=jpg&ga=GA1.1.1994968941.1723479654&semt=ais_hybrid"
					alt=""
					className=" h-24 rounded-full bg-green-500 p-0.5"
				/>
				<h2 className="text-white font-bold text-xl sm:2xl md:text-3xl text-center ">
					Create Room or Join Room{" "}
					<span className="text-green-500">{"< /> "}</span>
				</h2>

				<input
					type="text"
					placeholder="Enter the Room ID"
					value={roomID}
					onChange={(e) => setRoomID(e.target.value)}
					className="w-full p-2 px-4 rounded outline-none outline-offset-0 outline-green-500 "
				/>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Enter the Username"
					className="w-full p-2 px-4 rounded outline-none outline-offset-0 outline-green-500 "
				/>
				<button
					onClick={joinRoom}
					className="bg-green-500 py-2 px-5 rounded-sm font-semibold text-xl transition-all hover:scale-105"
				>
					Join
				</button>

				<p className="text-white md:text-lg ">
					{"Don't"} have a room ID ? create{" "}
					<span
						onClick={genRoomID}
						className="text-green-500 cursor-pointer p-2"
					>
						New Room
					</span>{" "}
				</p>
			</div>
		</div>
	);
};

export default HomePage;
