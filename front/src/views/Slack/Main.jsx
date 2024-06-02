import {
  Lucide
} from "@/base-components";
import { filter } from "lodash";

import classnames from "classnames";
import { useState, useEffect } from "react";
import SlackB from "slack";
import { useRecoilStateLoadable } from "recoil";
import { SlackConvrsionList } from "../../state/slack-state";
import ChatContent from "./ChatContent";
function applySortFilters(array) {
  return filter(array, (_items) => {
    return _items.is_archived === false;
  });
}

function Main() {
  var bot = new SlackB({ token: process.env.token });

  const [slackConList, setData] = useRecoilStateLoadable(SlackConvrsionList);

  let channelData = applySortFilters(slackConList.contents);
  const [conId, setConID] = useState("");
  const [conTitle, setConTitle] = useState("");

  const [chatCon, setChatCon] = useState([]);

  const [message, setMessage] = useState("");

  const [push, setPush] = useState(false);

  const get_history = async (conID) => {
    return await bot.conversations.history({
      channel: conID,
    });
  };

  

  useEffect(() => {
  //  console.log("loading...");

    if (conId !== "") {
      const interval = setInterval(async () => {
       // console.log("call to server");

        var con = await get_history(conId);

        con.ok && setChatCon(con.messages.reverse());
        setScrolbar();

        //setConID("C026ZU32CV8");
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [conId]);

  const setScrolbar = () => {
    setTimeout(function () {
      const chatMessages = document.getElementById("slactChat");
      chatMessages.scrollTop = chatMessages.scrollHeight + 800;
    }, 500);

    // const chatMessages = document.getElementById("slactChat");

    // chatMessages.scrollTop =1600;

    //  chatMessages.scrollTop = chatMessages.scrollHeight;
    // chatMessages.scrollHeight < chatMessages.scrollTop + 600 ||
    // message.length ==""
    //   ? chatMessages.scrollHeight
    //   : chatMessages.scrollTop;
  };
  const postMessage = async () => {
    if (message !== "") {
      setChatCon([
        ...chatCon,
        {
          bot_id: "2",
          type: "message",
          text: message,
          user: "U02764LEWJ0",
          ts: "1673700585.983529",
          app_id: "A04H37BQQSE",
          bot_profile: {},
          team: {},
          blocks: {},
        },
      ]);

      document.getElementById("text-input").value = "";
      let res = await bot.chat.postMessage({
        channel: conId,
        text: message,
      });

      if (res.ok) {
        var msg = res.message;
        setScrolbar();
      }

      setMessage("");
    }
  };

  const setConv = async (conId) => {
    setConID(conId);
    var con = await get_history(conId);
    con.ok && setChatCon(con.messages.reverse());
    setScrolbar();
  };

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">Chat </h2>
        <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
          <button className="btn btn-primary shadow-md mr-2">
            <Lucide icon="UserPlus" className="w-4 h-4 mr-2" /> Users
          </button>
          <button className="btn box">
            <Lucide icon="Settings" className="w-4 h-4 mr-2" /> Channels
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5 mt-5">
        {/* BEGIN: Chat Side Menu */}
        <div className="col-span-12 xl:col-span-4 2xl:col-span-3">
          <div className="box intro-y">
            <div className="flex items-center px-5 pt-5">
              {/* <div className="w-5 h-5 flex items-center justify-center text-xs text-white rounded-full bg-primary font-medium">
                7
              </div> */}
              <div className="font-medium ml-2">Channel</div>
              {/* <Lucide icon="Edit" className="w-4 h-4 text-slate-500 ml-auto" /> */}
            </div>
            <div className="pb-5 px-5 mt-5">
              <div className="relative">
                <input
                  type="text"
                  className="form-control py-3 px-4 pl-10"
                  placeholder="Search for messages or users..."
                />
                <Lucide
                  icon="Search"
                  className="w-5 h-5 absolute inset-y-0 left-0 my-auto text-slate-400 ml-3"
                />
              </div>
            </div>
            <div className="h-[642px] overflow-y-auto scrollbar-hidden">
              {slackConList.state === "hasValue" &&
                channelData.map((data, index) => (
                  <div
                    key={index}
                    className={classnames({
                      "cursor-pointer flex items-start border-b border-t border-slate-200/60 dark:border-darkmode-400 hover:bg-slate-50 dark:hover:bg-darkmode-400/50 py-5 px-5 -mb-px last:border-b-0": true,
                      "z-10 relative bg-slate-100/80 dark:bg-darkmode-400 hover:bg-slate-100/80 dark:hover:bg-darkmode-400": 0,
                    })}
                    onClick={() => {
                      setConID(data.id);
                      setConTitle(data.name);
                      setConv(data.id);
                    }}
                  >
                    <div className="w-12 h-12 flex-none image-fit mr-1">
                      <img
                        alt=" - HTML Admin Template"
                        className="rounded-full"
                        src="https://secure.gravatar.com/avatar/2186d8c5888624fb3ee62ffb0104a4a5.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0015-48.png"
                      />

                      <div className="w-3 h-3 bg-success absolute right-0 bottom-0 rounded-full border-2 border-white dark:border-darkmode-600"></div>
                    </div>
                    <div className="ml-2 overflow-hidden flex-1">
                      <div className="flex items-center">
                        <a href="#" className="font-medium capitalize">
                          {data.name}
                        </a>
                        {/* <div className="text-xs text-slate-500 ml-auto">
                          2-8-2022
                        </div> */}
                      </div>
                      {/* <div className="w-full truncate text-xs text-slate-500 mt-0.5">
                        user name
                      </div> */}
                      {/* <div className="flex mt-2">
                        <div className="flex-1 mr-3 truncate">shortcut</div>

                        <div className="w-5 h-5 flex items-center justify-center text-xs text-white rounded-full bg-primary font-medium -mt-1">
                          notification
                        </div>
                      </div> */}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* END: Chat Side Menu */}
        {/* BEGIN: Chat Content */}
        <div className="col-span-12 xl:col-span-8 2xl:col-span-9">
          <div className="box intro-y">
            {/* BEGIN: Chat Active */}
            <div className="h-[768px] flex flex-col">
              <div className="flex flex-col sm:flex-row border-b border-slate-200/60 dark:border-darkmode-400 px-5 py-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex-none image-fit relative">
                    <img
                      alt=" - HTML Admin Template"
                      className="rounded-full"
                      src="https://secure.gravatar.com/avatar/2186d8c5888624fb3ee62ffb0104a4a5.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0015-48.png"
                    />
                  </div>
                  <div className="ml-3 mr-auto">
                    <div className="flex items-center">
                      <div className="font-medium text-base capitalize">
                        {conTitle}
                      </div>
                      <div className="flex items-center px-2 py-0.5 text-xs ml-2 bg-success/20 border border-success/20 text-success rounded-md">
                        <div className="w-1.5 h-1.5 bg-success rounded-full mr-1.5"></div>
                        Online
                      </div>
                    </div>
                    {/* <div className="mt-0.5 text-slate-500 text-xs sm:text-sm">
                      Project Manager
                    </div> */}
                  </div>
                </div>
                <div className="flex items-center sm:ml-auto mt-5 sm:mt-0 border-t sm:border-0 border-slate-200/60 pt-3 sm:pt-0 -mx-5 sm:mx-0 px-5 sm:px-0">
                  {/* <a href="#" className="w-5 h-5 text-slate-500">
                    <Lucide icon="Search" className="w-5 h-5" />
                  </a> */}
                  <a href="#" className="w-5 h-5 text-slate-500 ml-5">
                    <Lucide icon="UserPlus" className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {conId !== "" && (
                <>
                  {chatCon.length > 0 && <ChatContent chatCon={chatCon} />}

                  <div className="pt-4 pb-10 sm:py-4 flex items-center border-t border-slate-200/60 dark:border-darkmode-400">
                    <textarea
                      id="text-input"
                      onChange={(e) => setMessage(e.target.value)}
                      className="h-[46px] form-control dark:bg-darkmode-600 h-16 resize-none border-transparent px-5 py-3 shadow-none focus:border-transparent focus:ring-0"
                      rows="1"
                      placeholder="Type your message..."
                    ></textarea>
                  
                    <button
                      onClick={postMessage}
                      className="w-8 h-8 sm:w-10 sm:h-10 block bg-primary text-white rounded-full flex-none flex items-center justify-center mr-5"
                    >
                      <Lucide icon="Send" className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
            {/* END: Chat Active */}
          </div>
        </div>
        {/* END: Chat Content */}
      </div>
    </>
  );
}

export default Main;
