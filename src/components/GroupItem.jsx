import React, { useState } from "react";
import { CogIcon } from "@heroicons/react/24/solid";
import GroupDetails from "./GroupDetails";

const GroupItem = ({ group }) => {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);

    if (modal === false) {
      localStorage.setItem(
        "group",
        JSON.stringify({
          group_id: group.group_id,
          group_name: group.group_name,
        })
      );
    }

    if (modal === true) {
      localStorage.removeItem("group");
    }
  };

  return (
    <>
      <div className="groupContainer">
        <h4>{group.group_name}</h4>
        <span className={"crud-icons"} onClick={() => toggleModal()}>
          <CogIcon width={25} style={{ color: "white" }} />
        </span>
      </div>
      {modal && (
        <div key={group.group_id} className="displayModal">
          <GroupDetails key={group.group_id} group={group} />
        </div>
      )}
    </>
  );
};

export default GroupItem;
