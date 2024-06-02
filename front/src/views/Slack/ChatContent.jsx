import { SlackUsersState } from "../../state/slack-state";
import { useRecoilValue } from "recoil";
import classnames from "classnames";
import {
  isSystemMessage,
  isAdmin
} from "./lib/chat-functions";

const ChatContent = (props) => {
  const { chatCon } = props;

  const users = useRecoilValue(SlackUsersState);

  const getUserImage = (message) => {
    const userId = message.user || message.username;
    let image;
    users.map((user) => {
      //console.log("u-", user);
      if (user.id === userId) {
        image = user.profile.image_32;
      }
    });
    const imageToReturn = image ? (
      // Found backend user
      <img className="rounded" src={image} alt="mentionedUserImg" />
    ) : // Check admin or client user?
    isAdmin(message) ? (
      <img
        className="rounded"
        src={`https://robohash.org/${userId}?set=set2`}
        alt={userId}
      />
    ) : // Check system message or client user?
    isSystemMessage(message) ? (
      <img
        className="rounded"
        src={`https://robohash.org/${userId}?set=set3`}
        alt={userId}
      />
    ) : (
      // Regular browser client user
      <img
        className="rounded"
        src={`https://robohash.org/${userId}`}
        alt={userId}
      />
    );

    return imageToReturn;
  };

  //console.log('chatcon',chatCon);

  return (
    <div
      id="slactChat"
      className="overflow-y-scroll scrollbar-hidden px-5 pt-5 flex-1"
    >
      {chatCon.map((con, index) => {
        return (
          <div
            key={index}
            className={classnames({
              "flex-1 hover:bg-slate-100 cursor-pointer flex items-start  py-2 px-2 -mb-px last:border-b-0": true,
              "z-10 relative bg-slate-100/80 dark:bg-darkmode-400 hover:bg-slate-100/80 dark:hover:bg-darkmode-400": 0,
            })}
          >
            <div className="w-12 h-12 flex-none image-fit mr-1">
              {con && getUserImage(con)}
            </div>
            <div className="ml-2 rounded overflow-hidden  px-5">
              <div className="flex items-center">
                <a href="#" className="font-medium capitalize">
                  sagar
                </a>
                {/* <div className="text-xs text-slate-500 ml-3">2.2am</div> */}
              </div>

              <div className="flex">{con?.text}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatContent;
