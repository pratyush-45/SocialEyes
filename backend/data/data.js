const chats = [
  {
    isGroupChat: false,
    users: [
      {
        name: "Lionel Messi",
        email: "messi@example.com",
      },
      {
        name: "Pratyush",
        email: "pratyush@example.com",
      },
    ],
    _id: "617a077e18c25468bc7c4dd4",
    chatName: "Lionel Messi",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Guest User",
        email: "guest@example.com",
      },
      {
        name: "Pratyush",
        email: "pratyush@example.com",
      },
    ],
    _id: "617a077e18c25468b27c4dd4",
    chatName: "Guest User",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Cristiano Ronaldo",
        email: "ronaldo@example.com",
      },
      {
        name: "Pratyush",
        email: "pratyush@example.com",
      },
    ],
    _id: "617a077e18c2d468bc7c4dd4",
    chatName: "Cristiano Ronaldo",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Lionel Messi",
        email: "messi@example.com",
      },
      {
        name: "Pratyush",
        email: "pratyush@example.com",
      },
      {
        name: "Guest User",
        email: "guest@example.com",
      },
    ],
    _id: "617a518c4081150716472c78",
    chatName: "Football",
    groupAdmin: {
      name: "Guest User",
      email: "guest@example.com",
    },
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Kylian Mbappe",
        email: "mbappe@example.com",
      },
      {
        name: "Pratyush",
        email: "pratyush@example.com",
      },
    ],
    _id: "617a077e18c25468bc7cfdd4",
    chatName: "Kylian Mbappe",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Cristiano Ronaldo",
        email: "ronaldo@example.com",
      },
      {
        name: "Pratyush",
        email: "pratyush@example.com",
      },
      {
        name: "Lionel Messi",
        email: "messi@example.com",
      },
      {
        name: "Guest User",
        email: "guest@example.com",
      },
    ],
    _id: "617a518c4081150016472c78",
    chatName: "The Goats",
    groupAdmin: {
      name: "Guest User",
      email: "guest@example.com",
    },
  },
];

module.exports = chats;
