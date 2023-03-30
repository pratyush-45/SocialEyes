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
import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if (!user.email || !user.password) {
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

    try {
      // Setting headers for our request
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      let params = {
        email: user.email,
        password: user.password,
      };

      const { data } = await axios.post(
        "https://socialeyes-server.onrender.com/api/user/login",
        params,
        config
      );

      toast({
        title: "Login Successful",
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

  const handleLogin = (event) => {
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
      <FormControl isRequired onKeyDown={handleLogin}>
        <FormLabel>Email</FormLabel>
        <Input
          id="email"
          name="email"
          placeholder="Enter Your Email"
          value={user.email}
          onChange={handleChange}
          //autoComplete="off"
        />

        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            value={user.password}
            onChange={handleChange}
          />
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

      <Button
        colorScheme="purple"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>

      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={() => {
          setUser((prevUser) => {
            return {
              ...prevUser,
              email: "guest@example.com",
              password: "123456",
            };
          });
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
