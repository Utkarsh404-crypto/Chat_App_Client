import React, { createContext, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
	const [ref, setRef] = useState(false);
	const [user, setUser] = useState();
	const [slectedchat, setSelectedChat] = useState();
	const [chats, setChats] = useState([]);
	const [notifications, setNotifications] = useState([]);
	const history = useHistory();

	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem("userInfo"));
		setUser(userInfo);
		if (!userInfo) history.push("/");
	}, [history]);

	return (
		<ChatContext.Provider
			value={{
				user,
				setUser,
				slectedchat,
				setSelectedChat,
				chats,
				setChats,
				ref,
				setRef,
				notifications,
				setNotifications
			}}>
			{" "}
			{children}{" "}
		</ChatContext.Provider>
	);
};

export const ChatState = () => {
	return useContext(ChatContext);
};

export default ChatProvider;
