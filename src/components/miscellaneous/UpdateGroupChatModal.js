import React from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	IconButton,
	Button,
	useToast,
	Box,
	Input,
	FormControl,
	Spinner
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatContext";
import { useState } from "react";
import { UserBadgeItem } from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fecthAgain, setFetchAgain, fetchMessages }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState();
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [load, setLoad] = useState(false);
	const [renameLoad, setRenameLoad] = useState(false);
	const toast = useToast();
	const [scrollBehavior, setScrollBehavior] = useState("inside");

	const { user, slectedchat, setSelectedChat } = ChatState();

	const handleRemove = async (user1) => {
		if (slectedchat.groupAdmin._id !== user._id && user1._id !== user._id) {
			toast({
				title: "Only admins can remove someone!",
				status: "error",
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
			const { data } = await axios.put(
				`https://confabmern.herokuapp.com/api/chats/groupremove`,
				{
					chatId: slectedchat._id,
					userId: user1._id
				},
				config
			);

			user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
			setFetchAgain(!fecthAgain);
			fetchMessages();
			setLoad(false);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: error.response.data.message,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom"
			});
			setLoad(false);
		}
		setGroupChatName("");
	};

	const handleRename = async () => {
		if (!groupChatName) return;

		try {
			setRenameLoad(true);
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			};
			const { data } = await axios.put(
				"https://confabmern.herokuapp.com/api/chats/rename",
				{ chatId: slectedchat._id, chatName: groupChatName },
				config
			);

			setSelectedChat(data);
			setFetchAgain(!fecthAgain);
			setRenameLoad(false);
		} catch (error) {
			toast({
				title: "Something Went Wrong!",
				description: error.response.data.message,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom"
			});
			setRenameLoad(false);
		}
		setGroupChatName("");
	};

	const handleSearch = async (query) => {
		setSearch(query);
		if (!query) {
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

	const handleAddUser = async (user1) => {
		if (slectedchat.users.find((u) => u._id === user1._id)) {
			toast({
				title: "User Already in group!",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom"
			});
			return;
		}

		if (slectedchat.groupAdmin._id !== user._id) {
			toast({
				title: "Only admins can add someone!",
				status: "error",
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
			const { data } = await axios.put(
				`https://confabmern.herokuapp.com/api/chats/groupadd`,
				{
					chatId: slectedchat._id,
					userId: user1._id
				},
				config
			);

			setSelectedChat(data);
			setFetchAgain(!fecthAgain);
			setLoad(false);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: error.response.data.message,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom"
			});
			setLoad(false);
		}
		setGroupChatName("");
	};
	return (
		<>
			<IconButton
				d={{ base: "flex" }}
				icon={<ViewIcon />}
				onClick={onOpen}
			/>
			<Modal
				scrollBehavior={scrollBehavior}
				isOpen={isOpen}
				onClose={onClose}
				isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize="35px"
						fontFamily="Work sans"
						display="flex"
						justifyContent="center">
						{slectedchat.chatName}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box
							w="100%"
							d="flex"
							flexWrap="wrap"
							pb={3}>
							{" "}
							{slectedchat.users.map((u) => (
								<UserBadgeItem
									key={u._id}
									user={u}
									admin={slectedchat.groupAdmin}
									handleFunction={() => handleRemove(u)}
								/>
							))}
						</Box>
						<FormControl display="flex">
							<Input
								placeholder="Group Name"
								mb={3}
								value={groupChatName}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
							<Button
								variant="solid"
								colorScheme="teal"
								ml={1}
								isLoading={renameLoad}
								onClick={handleRename}>
								Update
							</Button>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add User to group"
								mb={1}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>

						{load ? (
							<Spinner size="lg" />
						) : (
							searchResult?.map((user) => (
								<UserListItem
									key={user._id}
									user={user}
									handleFunction={() => handleAddUser(user)}
								/>
							))
						)}
					</ModalBody>

					<ModalFooter>
						<Button
							onClick={() => handleRemove(user)}
							colorScheme="red">
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateGroupChatModal;
