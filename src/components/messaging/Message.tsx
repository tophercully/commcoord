"use client";
import React from "react";
import { UserProfile } from "@/types/users";
import { ChatMessage } from "@/types/chats";
import { User } from "lucide-react";

interface MessageProps {
  message: ChatMessage;
  handleClickProfile: (userId: string) => void;
  memberProfile: UserProfile;
  contentOnly?: boolean;
}

const Message: React.FC<MessageProps> = ({
  message,
  handleClickProfile,
  memberProfile,
  contentOnly = false,
}) => {
  const date = new Date(message.timestamp);

  if (contentOnly) {
    return (
      <span className="pl-12 hover:bg-base-100">
        {message.content.split(/(\n|`[^`]*`)/g).map((part, index) => {
          if (part.startsWith("`") && part.endsWith("`")) {
            return (
              <React.Fragment key={index}>
                <code>{part}</code>
                <br />
              </React.Fragment>
            );
          }
          return (
            <React.Fragment key={index}>
              {part}
              <br />
            </React.Fragment>
          );
        })}
      </span>
    );
  }

  return (
    <div
      key={message.id}
      className={`flex gap-4 hover:bg-base-100`}
    >
      {memberProfile.photoURL ?
        <img
          src={memberProfile.photoURL}
          onClick={() => handleClickProfile(message.userId)}
          className="mt-1 max-h-8 cursor-pointer rounded-full hover:brightness-90"
        />
      : <User
          onClick={() => handleClickProfile(message.userId)}
          className="mt-1 max-h-8 cursor-pointer hover:brightness-90"
        />
      }
      <div className="flex-col">
        <span className="flex items-center gap-2">
          <button
            onClick={() => handleClickProfile(message.userId)}
            className="font-semibold leading-none hover:underline"
          >
            {memberProfile.displayName}
          </button>
          <span className="text-sm text-base-400">
            {`${date.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}`}
          </span>
        </span>
        <span>
          {message.content.split(/(\n|`[^`]*`)/g).map((part, index) => {
            if (part.startsWith("`") && part.endsWith("`")) {
              return (
                <React.Fragment key={index}>
                  <code>{part}</code>
                  <br />
                </React.Fragment>
              );
            }
            return (
              <React.Fragment key={index}>
                {part}
                <br />
              </React.Fragment>
            );
          })}
        </span>
      </div>
      {message.edited && <span className="edited-indicator">(edited)</span>}
    </div>
  );
};

export default Message;
