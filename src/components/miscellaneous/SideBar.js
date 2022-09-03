import { Avatar, Button, position, Spinner, Tooltip } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatContext";
import React, { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuItemOption,
	MenuGroup,
	MenuOptionGroup,
	MenuDivider
} from "@chakra-ui/react";
import {
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Input
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import Effect from "react-notification-badge/lib/components/Effect";

const SideBar = () => {
	const [search, setSearch] = useState("");
	const [searchresult, setSearchResult] = useState([]);
	const [load, setLoad] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);
	const {
		user,
		slectedchat,
		setSelectedChat,
		chats,
		setChats,
		notifications,
		setNotifications
	} = ChatState();
	const history = useHistory();
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const logOut = () => {
		localStorage.removeItem("userInfo");
		history.push("/");
	};

	const handleSearch = async () => {
		if (!search) {
			toast({
				title: "Nothing To Search",
				status: "warning",
				duration: 3000,
				isClosable: true,
				position: "bottom"
			});
			return;
		}

		try {
			setLoad(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			};

			const { data } = await axios.get(
				`https://confabmern.herokuapp.com/api/user?search=${search}`,
				config
			);

			setLoad(false);
			setSearchResult(data);
		} catch (error) {
			toast({
				title: "Something Went Wrong",
				description: "Failed",
				status: "Error",
				duration: 3000,
				isClosable: true,
				position: "top"
			});
		}
	};

	const accessChat = async (userId) => {
		try {
			setLoadingChat(true);
			const config = {
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${user.token}`
				}
			};
			const { data } = await axios.post(
				`https://confabmern.herokuapp.com/api/chats`,
				{ userId },
				config
			);

			if (!chats.find((c) => c._id === data._id)) setChats([...chats, data]);
			setSelectedChat(data);
			setLoadingChat(false);
			onClose();
		} catch (error) {
			toast({
				title: "Error fetching the chat",
				description: error.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left"
			});
		}
	};

	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				bg="transparent"
				width="100%"
				p="5px 10px 5px 10px"
				borderWidth="3px">
				<Tooltip
					label="Search chats"
					hasArrow
					placement="bottom-end">
					<Button
						variant="ghost"
						onClick={onOpen}>
						<i className="fas fa-search"></i>
						<Text display={{ base: "none", md: "flex" }}>Search</Text>
					</Button>
				</Tooltip>

				<Text
					fontSize="3xl"
					fontFamily="Work sans"
					color="whitesmoke"
					fontWeight="bold">
					CONFAB
				</Text>
				<div>
					<Menu>
						<MenuButton p={1}>
							<NotificationBadge
								count={notifications.length}
								effect={Effect.SCALE}
							/>
							<BellIcon
								color="#fffacd"
								fontSize="2xl"
								m={1}
							/>
						</MenuButton>
						{
							<MenuList pl={2}>
								{!notifications.length && "No New Messages"}
								{notifications.map((notif) => (
									<MenuItem
										key={notif._id}
										onClick={() => {
											setSelectedChat(notif.chat);
											setNotifications(
												notifications.filter((n) => n !== notif)
											);
										}}>
										{notif.chat.isGroupChat
											? `Message in ${notif.chat.chatName}`
											: `Message from ${getSender(user, notif.chat.users)}`}
									</MenuItem>
								))}
							</MenuList>
						}
					</Menu>
					<Menu>
						<MenuButton
							as={Button}
							rightIcon={<ChevronDownIcon />}
							variant=""
							textColor="white">
							<Avatar
								bg="#ffffe0"
								size="sm"
								cursor="pointer"
								name={user.name}
								src={user.pic}
							/>
						</MenuButton>
						<MenuList>
							<ProfileModal user={user}>
								<MenuItem>My Profile</MenuItem>{" "}
							</ProfileModal>
							<MenuItem onClick={logOut}>Logout</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>

			<Drawer
				isOpen={isOpen}
				placement="left"
				onClose={onClose}>
				{" "}
				<DrawerOverlay />
				<DrawerContent>
					{" "}
					<DrawerHeader fontWeight={"bold"}>Search</DrawerHeader>
					<DrawerBody>
						<Box
							display="flex"
							pb={2}>
							<Input
								mr={4}
								placeholder="Search By Name or Email"
								onChange={(e) => {
									setSearch(e.target.value);
								}}
							/>
							<Button onClick={handleSearch}>Go</Button>
						</Box>

						{load ? (
							<ChatLoading />
						) : (
							searchresult?.map((user) => (
								<UserListItem
									key={user._id}
									user={user}
									handleFunction={() => accessChat(user._id)}
								/>
							))
						)}

						{loadingChat && (
							<Spinner
								ml="auto"
								d="flex"
							/>
						)}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default SideBar;
