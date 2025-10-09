import { Model } from "mongoose";

export type UserRoleType = {
  roleName: string;
  roleId: string;
  permissions: string[];
};

export type UserRoleStaticsType = {
  placeholder: string;
};

export type UserRoleModelType = Model<UserRoleType> & UserRoleStaticsType;
