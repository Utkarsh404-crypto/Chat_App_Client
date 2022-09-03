import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	VStack
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatContext";

const Login = () => {
	const { user, setUser } = ChatState();
	const [showPass, setShowPass] = useState(false);
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [load, setLoad] = useState(false);
	const toast = useToast();
	const history = useHistory();

	const handleClickPass = () => setShowPass(!showPass);

	const handleSubmit = async () => {
		setLoad(true);
		if (!email || !password) {
			toast({
				title: "Please fill the details",
				status: "warning",
				duration: 3000,
				isClosable: true,
				position: "bottom"
			});
			setLoad(false);
			return;
		}

		try {
			const config = {
				headers: {
					"Content-type": "application/json"
				}
			};

			const { data } = await axios.post(
				"https://confabmern.herokuapp.com/api/user/login",
				{ email, password },
				config
			);

			toast({
				title: "Login Successful",
				status: "success",
				duration: 3000,
				isClosable: true,
				position: "bottom"
			});
			localStorage.setItem("userInfo", JSON.stringify(data));
			setUser(JSON.parse(localStorage.getItem("userInfo")));
			setLoad(false);
			history.push("/chats");
		} catch (error) {
			toast({
				title: "Error!",
				description: error.response.data.message,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom"
			});
			setLoad(false);
		}
	};

	return (
		<VStack
			spacing="5px"
			color="black">
			<FormControl
				id="email"
				isRequired>
				<FormLabel> Email </FormLabel>{" "}
				<Input
					placeholder="Enter Your email"
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>{" "}
			</FormControl>{" "}
			<FormControl
				id="password"
				isRequired>
				<FormLabel> Password </FormLabel>{" "}
				<InputGroup>
					<Input
						type={showPass ? "text" : "password"}
						placeholder="Enter Your Password"
						onChange={(e) => {
							setPassword(e.target.value);
						}}
					/>{" "}
					<InputRightElement width="4.5rem">
						<Button
							h="1.75rem"
							size="sm"
							onClick={handleClickPass}>
							{" "}
							{showPass ? "Hide" : "Show"}{" "}
						</Button>{" "}
					</InputRightElement>{" "}
				</InputGroup>{" "}
			</FormControl>{" "}
			<Button
				colorScheme="teal"
				width="100%"
				style={{ marginTop: 15 }}
				onClick={handleSubmit}
				isLoading={load}>
				Login{" "}
			</Button>{" "}
		</VStack>
	);
};

export default Login;
