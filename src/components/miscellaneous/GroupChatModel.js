import React from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import {
	Button,
	FormControl,
	Input,
	Spinner,
	useToast,
	Box
} from "@chakra-ui/react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatContext";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import { UserBadgeItem } from "../UserAvatar/UserBadgeItem";

const GroupChatModel = ({ children }) => {
	const { user, chats, setChats } = ChatState();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState();
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [load, setLoad] = useState(false);
	const toast = useToast();

	const handleDelete = (deleteUser) => {
		setSelectedUsers(selectedUsers.filter((sel) => sel._id !== deleteUser._id));
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
	const handleSubmit = async () => {
		if (!groupChatName || !selectedUsers) {
			toast({
				title: "Please fill all the fields",
				status: "warning",
				duration: 3000,
				isClosable: true,
				position: "bottom"
			});
			return;
		}
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			};

			const { data } = await axios.post(
				`https://confabmern.herokuapp.com/api/chats/group`,
				{
					name: groupChatName,
					users: JSON.stringify(selectedUsers.map((u) => u._id))
				},
				config
			);
			setChats([data, ...chats]);
			onClose();
			toast({
				title: "New Group Chat Created!",
				status: "success",
				duration: 3000,
				isClosable: true,
				position: "bottom"
			});
		} catch (error) {
			toast({
				title: "Failed to Create the Chat!",
				description: error.response.data,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom"
			});
		}
	};

	const handleGroup = (userAdd) => {
		if (selectedUsers.includes(userAdd)) {
			toast({
				title: "User already added",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "top"
			});
			return;
		}
		setSelectedUsers([...selectedUsers, userAdd]);
	};

	return (
		<>
			<span onClick={onOpen}>{children}</span>

			<Modal
				isOpen={isOpen}
				onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize="35px"
						fontFamily="Work sans"
						display="flex"
						justifyContent="center">
						Create Group Chat
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display="flex"
						flexDir="column"
						alignItems="center">
						<FormControl>
							<Input
								placeholder="Group Name"
								mb={3}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
						</FormControl>

						<FormControl>
							<Input
								placeholder="Chat Name"
								mb={3}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>
						<Box
							w="100%"
							d="flex"
							flexWrap="wrap">
							{selectedUsers.map((u) => (
								<UserBadgeItem
									key={u._id}
									user={u}
									handleFunction={() => handleDelete(u)}
								/>
							))}
						</Box>
						{load ? (
							<Spinner
								ml="auto"
								d="flex"
							/>
						) : (
							searchResult?.slice(0, 4).map((user) => (
								<UserListItem
									key={user._id}
									user={user}
									handleFunction={() => handleGroup(user)}
								/>
							))
						)}
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="blue"
							onClick={handleSubmit}>
							Chat
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default GroupChatModel;
