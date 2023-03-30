import React, { useEffect, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import ProfileModel from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import "./styles.css";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animation/typing.json";
import SendIcon from "@mui/icons-material/Send";

// const ENDPOINT = "http://localhost:5000";
const ENDPOINT = "https://socialeyes-server.onrender.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [allMessages, setAllMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `https://socialeyes-server.onrender.com/api/message/${selectedChat._id}`,
        config
      );
      // console.log(data);
      setLoading(false);
      setAllMessages(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    // Keep a backup of the currant chat state in selectedChatCompare
    // To decide if we need to emit the message or give a notification to user
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);
  // console.log(notification, "----------------");

  // to moniter our socket, and if we recieve any new messages, we put it in our chat
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // Give Notification
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setAllMessages([...allMessages, newMessageRecieved]);
      }
    });
  });

  const handleClick = () => {
    const sendEvent = {
      key: "Enter",
    };
    sendMessage(sendEvent);
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const params = {
          content: newMessage.trim(),
          chatId: selectedChat._id,
        };

        setNewMessage("");

        const { data } = await axios.post(
          "https://socialeyes-server.onrender.com/api/message",
          params,
          config
        );
        // console.log(data);

        socket.emit("new message", data);
        setAllMessages([...allMessages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // Typing Indicator Logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    // creating a Throttle like function to decide when to stop typing
    // 3 seconds after user has stopped typing
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
              bg="#EEF1FF"
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                ></UpdateGroupChatModal>
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            padding={3}
            bg="#E8E8E8"
            width="100%"
            height="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                width={20}
                height={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat allMessages={allMessages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div
                  style={{
                    display: "flex",
                    // justifyContent: "center",
                    // alignItems: "center",
                  }}
                >
                  {/* <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    // name={m.sender.name}
                    src={selectedChat.users[0].pic}
                  ></Avatar> */}
                  <Lottie
                    display="block"
                    options={defaultOptions}
                    height={40}
                    width={60}
                    style={{
                      marginBottom: 12,
                      marginLeft: 0,
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
              <div style={{ display: "flex" }}>
                <Input
                  variant="filled"
                  bg="#EEF1FF"
                  placeholder="Enter a message..."
                  onChange={typingHandler}
                  value={newMessage}
                  autoComplete={"off"}
                />
                <IconButton
                  // display={{ base: "flex", md: "none" }}
                  ml={1}
                  aria-label="Send"
                  icon={<SendIcon />}
                  bg="#B1B2FF"
                  onClick={handleClick}
                  // isDisabled={newMessage ? "" : "disabled"}
                />
              </div>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a User to start Chating
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
