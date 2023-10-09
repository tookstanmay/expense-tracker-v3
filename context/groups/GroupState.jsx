import React, { useState } from "react";
import groupContext from "./groupContext";

const GroupState = (props) => {
  const host = "http://localhost:5000";

  const groupsInitial = [];
  const membersInitial = [];

  const [groups, setGroups] = useState(groupsInitial);
  const [members, setMembers] = useState(membersInitial);

  // get all groups
  const getGroups = async () => {
    const user_details = await JSON.parse(localStorage.getItem("user_details"));
    const user_id = await user_details.id;
    const body = { user_id };
    const url = `${host}/api/groups/fetchallgroups`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();

    setGroups(json.groupDetails);
  };

  // get all members
  const getMembers = async () => {
    const group = await JSON.parse(localStorage.getItem("group"));
    const group_id = await group.group_id;
    const body = { group_id };
    const url = `${host}/api/groups/getallmembers`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();

    setMembers(json.members);
  };

  // create a group
  const createGroup = async (group_name) => {
    const user_details = await JSON.parse(localStorage.getItem("user_details"));
    const user_id = await user_details.id;
    const body = { user_id, group_name };
    const url = `${host}/api/groups/creategroup`;
    console.log(body);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  // create a group
  const addMembers = async (group_id, email, group_name) => {
    const body = { group_id, email, group_name };
    const url = `${host}/api/groups/addmembers`;
    console.log(body);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();

    console.log(json);
  };

  return (
    <groupContext.Provider
      value={{
        groups,
        getGroups,
        members,
        getMembers,
        createGroup,
        addMembers,
      }}
    >
      {props.children}
    </groupContext.Provider>
  );
};

export default GroupState;
