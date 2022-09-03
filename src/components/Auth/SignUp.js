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

const SignUp = () => {
	const [showPass, setShowPass] = useState(false);
	const [showConfPass, setShowConfPass] = useState(false);
	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [confirmpassword, setConfirmpassword] = useState();
	const [profile_pic, setProfilePic] = useState();
	const [load, setLoad] = useState(false);
	const toast = useToast();
	const history = useHistory();

	const handleClickPass = () => setShowPass(!showPass);
	const handleClickConfPass = () => setShowConfPass(!showConfPass);

	async function handleChangePic(pics) {
		setLoad(true);
		if (pics === undefined) {
			toast({
				title: "Please select an image",
				description: "We've created your account for you.",
				status: "success",
				duration: 3000,
				isClosable: true
			});
			return;
		}

		if (pics.type === "image/jpeg" || pics.type === "image/png") {
			const data = new FormData();
			data.append("file", pics);
			data.append("upload_preset", "CHAT_APP");
			data.append("cloud_name", "dxkxjyop4");
			fetch("https://api.cloudinary.com/v1_1/dxkxjyop4/image/upload", {
				method: "post",
				body: data
			})
				.then((res) => res.json())
				.then((data) => {
					setProfilePic(data.url.toString());
					setLoad(false);
				})
				.catch((err) => {
					console.log(err);
					setLoad(false);
				});
		} else {
			toast({
				title: "Please select image format as jpeg or png!",
				status: "warning",
				duration: 3000,
				isClosable: true,
				position: "bottom"
			});
			setLoad(false);
			return;
		}
	}

	async function handleSubmit() {
		setLoad(true);
		if (!name || !email || !password || !confirmpassword) {
			toast({
				title: "Please fill the details",
				description: "We've created your account for you.",
				status: "warning",
				duration: 3000,
				isClosable: true
			});
			setLoad(false);
			return;
		}

		if (password !== confirmpassword) {
			toast({
				title: "Password do not match",
				description: "We've created your account for you.",
				status: "error",
				duration: 3000,
				isClosable: true
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
				"https://confabmern.herokuapp.com/api/user",
				{ name, email, password, profile_pic },
				config
			);
			toast({
				title: "Registration Successful",
				description: "We've created your account for you.",
				status: "success",
				duration: 3000,
				isClosable: true
			});

			localStorage.setItem("usersInfo", JSON.stringify(data));

			setLoad(false);

			// history.push("/chats");
		} catch (error) {
			toast({
				title: "Error",
				description: error.response.data.message,
				status: "error",
				duration: 3000,
				isClosable: true
			});
			setLoad(false);
		}
	}

	return (
		<VStack
			spacing="5px"
			color="black">
			<FormControl
				id="name"
				isRequired>
				<FormLabel> Name </FormLabel>{" "}
				<Input
					placeholder="Enter Your Name"
					onChange={(e) => setName(e.target.value)}
				/>{" "}
			</FormControl>{" "}
			<FormControl
				id="email"
				isRequired>
				<FormLabel> Email </FormLabel>{" "}
				<Input
					placeholder="Enter Your email"
					onChange={(e) => setEmail(e.target.value)}
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
						onChange={(e) => setPassword(e.target.value)}
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
			<FormControl
				id="confpassword"
				isRequired>
				<FormLabel> Confirm Password </FormLabel>{" "}
				<InputGroup>
					<Input
						type={showConfPass ? "text" : "password"}
						placeholder="Confirm Password"
						onChange={(e) => setConfirmpassword(e.target.value)}
					/>{" "}
					<InputRightElement width="4.5rem">
						<Button
							h="1.75rem"
							size="sm"
							onClick={handleClickConfPass}>
							{" "}
							{showConfPass ? "Hide" : "Show"}{" "}
						</Button>{" "}
					</InputRightElement>{" "}
				</InputGroup>{" "}
			</FormControl>{" "}
			<FormControl id="profile_pic">
				<FormLabel> Upload Profile Picture </FormLabel>{" "}
				<Input
					type="file"
					p={1.5}
					accept="image/*"
					onChange={(e) => handleChangePic(e.target.files[0])}
				/>{" "}
			</FormControl>{" "}
			<Button
				colorScheme="teal"
				width="100%"
				style={{ marginTop: 15 }}
				onClick={handleSubmit}
				isLoading={load}>
				Sign Up{" "}
			</Button>{" "}
		</VStack>
	);
};

export default SignUp;
