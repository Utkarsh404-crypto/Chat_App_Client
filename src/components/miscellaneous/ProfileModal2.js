import React from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { IconButton, Button, Text, Image, Flex } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			{children ? (
				<span onClick={onOpen}> {children} </span>
			) : (
				<IconButton
					d={{ base: "flex" }}
					icon={<ViewIcon />}
					onClick={onOpen}
				/>
			)}{" "}
			<Modal
				size="lg"
				isCentered
				isOpen={isOpen}
				onClose={onClose}>
				<ModalOverlay />
				<ModalContent h="375px">
					<ModalHeader
						fontSize="40px"
						fontFamily="Work sans"
						display="flex"
						justifyContent="center">
						{" "}
						{user.name}{" "}
					</ModalHeader>{" "}
					<ModalCloseButton />
					<ModalBody
						display="flex"
						flexDirection="column"
						alignItems="center"
						justifyContent="space-between">
						{" "}
						<Image
							borderRadius="full"
							boxSize="110px"
							src={user.profile_pic}
							alt={user.name}
						/>{" "}
						<Text
							fontSize={{ base: "28px", md: "30px" }}
							fontFamily="Work sans">
							Email: {user.email}{" "}
						</Text>{" "}
					</ModalBody>{" "}
					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={onClose}>
							Close{" "}
						</Button>{" "}
					</ModalFooter>{" "}
				</ModalContent>{" "}
			</Modal>{" "}
		</>
	);
};

export default ProfileModal;
