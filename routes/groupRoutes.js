// jshint esversion: 6

import express from "express";
import {
  addMemberGroup,
  allGroups,
  amountPaidByAUserInAGroup,
  averageOfTheGroup,
  changeRemainingBalanceAndStatus,
  createGroup,
  memberInAGroup,
  splitFunction,
} from "../controllers/groupsController.js";
const router = express.Router();

// ROUTE1: receive all the groups of a logged in user by their user_id
router.post("/fetchallgroups", allGroups);

// ROUTE2: receive all members of a group with group_id
router.post("/getallmembers", memberInAGroup);

// ROUTE3: create group with user id, group name
router.post("/creategroup", createGroup);

// ROUTE4: add group members
router.post("/addmembers", addMemberGroup);

// ROUTE5: split amount
router.post("/split", splitFunction);

export default router;
