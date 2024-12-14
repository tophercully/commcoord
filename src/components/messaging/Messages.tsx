import React from "react";
import Message from "./Message";
import { UserProfile } from "@/types/users";

interface MessagesProps {
  messages: { [key: string]: any };
  handleClickProfile: (userId: string) => void;
  members: UserProfile[];
}

const Messages: React.FC<MessagesProps> = ({
  messages,
  handleClickProfile,
  members,
}) => {
  return (
    <div
      id="messages"
      className="mt-auto flex h-full flex-col justify-end gap-2"
    >
      {Object.values(messages).map((message, index) => {
        const lastMessageAuthor = Object.values(messages)[index - 1]?.userId;
        const minuteSent = Math.floor(message.timestamp / 60000);
        const lastMessageSent = Math.floor(
          Object.values(messages)[index - 1]?.timestamp / 60000,
        );
        return (
          <Message
            key={message.id}
            message={message}
            handleClickProfile={() => handleClickProfile(message.userId)}
            memberProfile={
              members.find((m) => m.uid === message.userId) as UserProfile
            }
            contentOnly={
              message.userId == lastMessageAuthor &&
              minuteSent == lastMessageSent
            }
          />
        );
      })}
    </div>
  );
};

export default Messages;
