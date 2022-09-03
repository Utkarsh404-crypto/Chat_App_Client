import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../Context/ChatContext";
import SingleChat from "../SingleChat";
import { ArrowBackIcon, BellIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import "../styles.css";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
	const { selectedchat, setSelectedChat } = ChatState();
	return (
		<>
			<Box
				d={{ base: selectedchat ? "flex" : "none", md: "flex" }}
				alignItems="center"
				flexDir="column"
				p={3}
				bg="white"
				w={{ base: "100%", md: "68%" }}
				borderRadius="lg"
				borderWidth="1px">
				{" "}
				<SingleChat
					fetchAgain={fetchAgain}
					setFetchAgain={setFetchAgain}
				/>
			</Box>
		</>
	);
};

export default ChatBox;
