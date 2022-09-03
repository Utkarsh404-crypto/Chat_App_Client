import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatContext";
import { Box, Flex } from "@chakra-ui/react";
import SideBar from "../components/miscellaneous/SideBar";
import MyChat from "./miscellaneous/MyChat";
import ChatBox from "./miscellaneous/ChatBox";
import { useHistory } from "react-router-dom";

const Chats = () => {
	const { user, setUser } = ChatState();
	const [fetchAgain, setFetchAgain] = useState(false);
	const history = useHistory();

	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem("userInfo"));
		setUser(userInfo);
		if (!userInfo) history.push("/");
	}, [history]);

	if (!user) {
		return <span> Loading... </span>;
	} else {
		return (
			<div style={{ width: "100%" }}>
				{" "}
				{user && <SideBar />}{" "}
				<Box
					display="flex"
					justifyContent="space-between"
					w="100%"
					h="91.5vh"
					p="10px">
					{" "}
					{user && <MyChat fetchAgain={fetchAgain} />}{" "}
					{user && (
						<ChatBox
							fetchAgain={fetchAgain}
							setFetchAgain={setFetchAgain}
						/>
					)}{" "}
				</Box>{" "}
			</div>
		);
	}
};

export default Chats;
