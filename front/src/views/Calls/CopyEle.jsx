import { Lucide, Tippy } from "@/base-components";
import { useState } from "react";
const CopyEle = (props) => {
  const [copied, setCopied] = useState(false);

  return (
    <Tippy
      tag="a"
      onClick={() => {
        navigator.clipboard.writeText(props.email);
      }}
      className="btn"
      content="Copied!"
      options={{
        trigger: "click",
      }}
    >
      {props.email}
      <Lucide icon="Copy" className={"ml-2 w-4 h-4 "} />
    </Tippy>
  );
};

export default CopyEle;
