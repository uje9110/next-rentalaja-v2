import { Model } from "mongoose";

export type UserRoleType = {
  roleName: string;
  roleId: string;
  permissions: string[];
};

export type UserRoleStaticsType = {};

export type UserRoleModelType = Model<UserRoleType> & UserRoleStaticsType;
