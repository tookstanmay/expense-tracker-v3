import React, { useContext, useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
import groupContext from "../../context/groups/groupContext";
import { useNavigate } from "react-router-dom";
import GroupItem from "./GroupItem";
import { UserPlusIcon } from "@heroicons/react/24/solid";

const ShowAllGroups = () => {
  const context = useContext(groupContext);
  const { groups, getGroups, createGroup } = context;

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      if (localStorage.getItem("user_details")) {
        await getGroups();
      } else {
        navigate("/login");
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [groupname, setGroupname] = useState("");

  return (
    <div>
      <div>
        <h2>Create New Group</h2>
        <form
          className="form-wrapper"
          style={{ marginTop: "10px" }}
          onSubmit={() => {
            createGroup(groupname);
          }}
        >
          <input
            type="text"
            name="groupname"
            required
            value={groupname}
            onChange={(e) => {
              setGroupname(e.target.value);
            }}
            placeholder="Group Name?"
            aria-label="group name"
            autoComplete="off"
          />
          <button className="btn btn--dark" type="submit">
            <span>Create Group</span>
            <UserPlusIcon width={20} />
          </button>
        </form>
      </div>
      <h2 style={{ marginTop: "60px" }}>All Groups</h2>
      <div style={{ marginTop: "40px" }}>
        {!groups || groups.length === 0 && "Nothing to display. 🙄"}
      </div>
      {groups && groups.length > 0 && (
        <div>
          {groups.map((group) => {
            return <GroupItem key={group.group_id} group={group} />;
          })}
        </div>
      )}
    </div>
  );
};

export default ShowAllGroups;
