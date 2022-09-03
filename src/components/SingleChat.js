import React from "react";
import { ChatState } from "../Context/ChatContext";
import {
	useToast,
	Box,
	Flex,
	Button,
	Text,
	Spinner,
	FormControl,
	Input
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal2";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../Animations/TypingAnimation.json";

const ENDPOINT = "https://confabmern.herokuapp.com"; //changes
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const [messages, setMessages] = useState([]);
	const [load, setLoad] = useState(false);
	const [newMessage, setNewMessage] = useState();
	const {
		user,
		slectedchat,
		setSelectedChat,
		notifications,
		setNotifications
	} = ChatState();
	const toast = useToast();
	const [socketConnected, setsocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice"
		}
	};

	const fetchMessages = async () => {
		if (!slectedchat) {
			return;
		}

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			};
			setLoad(true);
			const { data } = await axios.get(
				`https://confabmern.herokuapp.com/api/message/${slectedchat._id}`,
				config
			);
			setMessages(data);
			setLoad(false);

			socket.emit("join chat", slectedchat._id);
		} catch (error) {
			toast({
				title: "Error",
				description: error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom"
			});
		}
	};
	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit("setup", user);
		socket.on("connected", () => setsocketConnected(true));
		socket.on("typing", () => setIsTyping(true));
		socket.on("stop typing", () => setIsTyping(false));
	}, []);

	useEffect(() => {
		fetchMessages();

		selectedChatCompare = slectedchat;
	}, [slectedchat]);

	useEffect(() => {
		socket.on("message received", (newMessage) => {
			if (
				!selectedChatCompare ||
				selectedChatCompare._id !== newMessage.chat._id
			) {
				if (!notifications.includes(newMessage)) {
					setNotifications([newMessage, ...notifications]);
					setFetchAgain(!fetchAgain);
				}
			} else {
				setMessages([...messages, newMessage]);
			}
		});
	});

	const sendMessage = async (event) => {
		if (event.key === "Enter" && newMessage) {
			socket.emit("stop typing", slectedchat._id);
			try {
				const config = {
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${user.token}`
					}
				};
				setNewMessage("");
				const { data } = await axios.post(
					"https://confabmern.herokuapp.com/api/message",
					{ content: newMessage, chatId: slectedchat._id },
					config
				);

				console.log(data);

				socket.emit("new message", data);
				setMessages([...messages, data]);
			} catch (error) {
				toast({
					title: "Error",
					description: error.message,
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "bottom"
				});
			}
		}
	};

	const typingHandler = (event) => {
		setNewMessage(event.target.value);

		if (!socketConnected) return;

		if (!typing) {
			setTyping(true);
			socket.emit("typing", slectedchat._id);
		}

		let lastTypingTime = new Date().getTime();
		var timerLength = 2000;

		setTimeout(() => {
			var timeNow = new Date().getTime();
			var timeDiff = timeNow - lastTypingTime;

			if (timeDiff >= timerLength && typing) {
				socket.emit("stop typing", slectedchat._id);
				setTyping(false);
			}
		}, timerLength);
	};

	return (
		<>
			{slectedchat ? (
				<>
					{" "}
					<Text
						fontSize={{ base: "28px", md: "30px" }}
						pb={3}
						px={2}
						w="100%"
						fontFamily="Work sans"
						display="flex"
						justifyContent={{ base: "space-between" }}
						alignItems="center">
						<IconButton
							d={{ base: "flex", md: "none" }}
							icon={<ArrowBackIcon />}
							onClick={() => setSelectedChat("")}
						/>{" "}
						{!slectedchat.isGroupChat ? (
							<>
								{getSender(user, slectedchat.users)}{" "}
								<ProfileModal user={getSenderFull(user, slectedchat.users)} />{" "}
							</>
						) : (
							<>
								{slectedchat.chatName.toUpperCase()}{" "}
								<UpdateGroupChatModal
									fetchAgain={fetchAgain}
									setFetchAgain={setFetchAgain}
									fetchMessages={fetchMessages}
								/>{" "}
							</>
						)}{" "}
					</Text>{" "}
					<Box
						display="flex"
						flexDir="column"
						justifyContent="flex-end"
						p={3}
						bg="#F0F8FF"
						w="100%"
						h="86%"
						borderRadius="lg"
						overflowY="hidden">
						{" "}
						{load ? (
							<Spinner
								size="l"
								w={5}
								h={5}
								alignSelf="bottom"
								margin="auto"
							/>
						) : (
							<div className="messages">
								<ScrollableChat messages={messages} />{" "}
							</div>
						)}{" "}
						<FormControl
							onKeyDown={sendMessage}
							isRequired
							mt={3}>
							{" "}
							{isTyping ? (
								<div>
									<Lottie
										options={defaultOptions}
										width={70}
										style={{ marginBottom: 15, marginLeft: 0 }}
									/>{" "}
								</div>
							) : (
								<></>
							)}{" "}
							<Input
								variant="filled"
								bg="white"
								borderColor={"black"}
								placeholder="Send Message"
								onChange={typingHandler}
								value={newMessage}
							/>{" "}
						</FormControl>{" "}
					</Box>{" "}
				</>
			) : (
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					h="100%">
					<Text
						color={"#0096FF"}
						fontWeight={"extrabold"}
						fontSize="2xl"
						pb={3}
						fontFamily="Work sans">
						CHAT{" "}
					</Text>{" "}
				</Box>
			)}{" "}
		</>
	);
};

export default SingleChat;
