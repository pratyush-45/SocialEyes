import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
  return (
    <Stack background="#D2DAFF">
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
    </Stack>
  );
};

export default ChatLoading;
