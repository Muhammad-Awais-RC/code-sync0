/* eslint-disable react/prop-types */
import Avatar from "react-avatar";

const Client = ({ username }) => {
	return (
		<div className="flex items-center gap-1 ">
			<Avatar name={username} size="50" round="10px" />
			<span>{username}</span>
		</div>
	);
};

export default Client;
