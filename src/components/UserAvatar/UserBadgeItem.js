import { CloseIcon } from "@chakra-ui/icons";
import { Badge, Box } from "@chakra-ui/react";
import React from "react";

export const UserBadgeItem = ({ user, handleFunction }) => {
	return (
		<Badge
			px={2}
			py={1}
			borderRadius="lg"
			m={1}
			mb={2}
			variant="solid"
			fontSize={12}
			backgroundColor="#DE3163"
			color="white"
			fontWeight="bold"
			cursor="pointer"
			onClick={handleFunction}>
			{" "}
			{user.name} <CloseIcon pl={1} />{" "}
		</Badge>
	);
};
