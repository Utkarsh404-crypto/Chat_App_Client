import React, { useEffect } from "react";
import { Container, Box, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import { useHistory } from "react-router-dom";

const Home = () => {
	const history = useHistory();

	useEffect(() => {
		const user = localStorage.getItem("userInfo");
		if (user) {
			history.push("/chats");
		}
	}, [history]);

	return (
		<Container
			maxW="xl"
			centerContent>
			<Box
				d="flex"
				justifyContent="center"
				bg={"#E4F8F0"}
				p={2}
				m="40px 0 15px 0"
				w="100%"
				borderRadius="lg"
				borderWidth="2px">
				<Text
					textAlign="center"
					fontSize="4xl"
					fontFamily="Work sans"
					color="teal">
					{" "}
					CONFAB{" "}
				</Text>{" "}
			</Box>{" "}
			<Box
				bg="white"
				p={3}
				width="100%"
				borderRadius="lg"
				borderWidth="1px">
				{" "}
				<Tabs
					variant="soft-rounded"
					colorScheme="teal">
					<TabList mb="1em">
						<Tab width="50%"> Sign Up </Tab> <Tab width="50%"> Login </Tab>{" "}
					</TabList>{" "}
					<TabPanels>
						<TabPanel>
							<SignUp />{" "}
						</TabPanel>{" "}
						<TabPanel>
							{" "}
							<Login />{" "}
						</TabPanel>{" "}
					</TabPanels>{" "}
				</Tabs>{" "}
			</Box>{" "}
		</Container>
	);
};

export default Home;
