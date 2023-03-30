import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const SignUp = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    pic: "",
  });
  const [show, setShow] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "socialeyes");
      data.append("cloud_name", "pratyush45");
      fetch("https://api.cloudinary.com/v1_1/pratyush45/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUser((prevUser) => {
            return {
              ...prevUser,
              pic: data.url.toString(),
            };
          });
          // console.log(data);
          // console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!user.name || !user.email || !user.password || !confirmPassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (user.password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      // Setting headers for our request
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      let params = {
        name: user.name,
        email: user.email,
        password: user.password,
        pic: user.pic
          ? user.pic
          : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      };

      const { data } = await axios.post(
        "https://socialeyes-server.onrender.com/api/user",
        params,
        config
      );

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleSignUp = (event) => {
    if (event.key === "Enter") {
      submitHandler();
    }
  };

  function handleChange(event) {
    setUser((prevUserData) => {
      return {
        ...prevUserData,
        [event.target.name]: event.target.value,
      };
    });
  }

  return (
    <VStack spacing="5px" color="black">
      <FormControl isRequired onKeyDown={handleSignUp}>
        <FormLabel>Name</FormLabel>
        <Input
          id="signUpName"
          name="name"
          placeholder="Enter Your Name"
          value={user.name}
          onChange={handleChange}
        />

        <FormLabel>Email</FormLabel>
        <Input
          id="signUpEmail"
          name="email"
          placeholder="Enter Your Email"
          value={user.email}
          onChange={handleChange}
        ></Input>

        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            id="signUpPassword"
            name="password"
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            value={user.password}
            onChange={handleChange}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button
              height="1.75rem"
              size="sm"
              backgroundColor={"#D2DAFF"}
              onClick={handleClick}
            >
              {show ? <ViewIcon /> : <ViewOffIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>

        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button
              height="1.75rem"
              size="sm"
              backgroundColor={"#D2DAFF"}
              onClick={handleClick}
            >
              {show ? <ViewIcon /> : <ViewOffIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          padding={1.5}
          accept="image/"
          onChange={(e) => postDetails(e.target.files[0])}
        ></Input>

        <Button
          colorScheme="purple"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </FormControl>
    </VStack>
  );
};

export default SignUp;
