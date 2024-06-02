import classnames from "classnames";

const ChatContent = (props) => {
  const { chatCon } = props;

  //console.log('chat content',chatCon);

  return (
    <div
      id="whatsAppChat"
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
              <img
                alt=" - HTML Admin Template"
                className="rounded-full"
                src="https://secure.gravatar.com/avatar/2186d8c5888624fb3ee62ffb0104a4a5.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0015-48.png"
              />
            </div>
            <div className="ml-2 rounded overflow-hidden  px-5">
              <div className="flex items-center">
                <a href="#" className="font-medium capitalize">
                  {con?.name}
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
