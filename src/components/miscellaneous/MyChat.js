import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatContext";
import axios from "axios";
import { useToast, Box, Flex, Button, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../ChatLoading";
import { Stack } from "@chakra-ui/layout";
import { getSender } from "../../config/ChatLogics";
import GroupChatModel from "./GroupChatModel";

const MyChat = ({ fetchAgain }) => {
	// const [loggedUser, setLoggedUser] = useState();
	const { user, slectedchat, setSelectedChat, chats, setChats } = ChatState();
	const toast = useToast();

	const fetchChats = async () => {
		try {
			console.log("hello", slectedchat);
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			};

			const { data } = await axios.get(
				"https://confabmern.herokuapp.com/api/chats",
				config
			);

			setChats(data);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: "Failed to Load the chats",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left"
			});
		}
	};

	useEffect(() => {
		fetchChats();
	}, [fetchAgain]);

	return (
		<Box
			display={{ base: slectedchat ? "none" : "flex", md: "flex" }}
			flexDir="column"
			alignItems="center"
			p={3}
			bg="#F5F5F5"
			w={{ base: "100%", md: "31%" }}
			borderRadius="lg"
			borderWidth="1px">
			<Box
				pb={3}
				px={3}
				fontSize={{ base: "28px", md: "30px" }}
				fontFamily="Work Sans"
				display="flex"
				w="100%"
				justifyContent="space-between"
				alignItems="center">
				{" "}
				Chats{" "}
				<GroupChatModel>
					<Button
						d="flex"
						fontSize={{ base: "17px", md: "10px", lg: "17px" }}
						rightIcon={<AddIcon />}>
						New Group Chat{" "}
					</Button>{" "}
				</GroupChatModel>{" "}
			</Box>{" "}
			<Box
				d="flex"
				flexDir="column"
				p={3}
				bg="#F8F8F8"
				w="100%"
				h="100%"
				borderRadius="lg"
				overflowY="hidden">
				{" "}
				{chats ? (
					<Stack overflowY="scroll">
						{" "}
						{chats.map((chat) => (
							<Box
								onClick={() => setSelectedChat(chat)}
								cursor="pointer"
								bg={slectedchat === chat ? "#0096FF" : "#E8E8E8"}
								color={slectedchat === chat ? "white" : "black"}
								px={3}
								py={2}
								borderRadius="lg"
								key={chat._id}>
								<Text>
									{" "}
									{!chat.isGroupChat
										? getSender(user, chat.users)
										: chat.chatName}{" "}
								</Text>{" "}
							</Box>
						))}{" "}
					</Stack>
				) : (
					<ChatLoading />
				)}{" "}
			</Box>{" "}
		</Box>
	);
};

export default MyChat;
