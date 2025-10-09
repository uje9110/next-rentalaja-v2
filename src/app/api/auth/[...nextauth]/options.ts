import { Session, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/app/lib/connection/dbConnect";
import { JWT } from "next-auth/jwt";

import { SignJWT } from "jose";
import { createGlobalUserModel } from "@/app/lib/model/global_user_model";
import { GlobalStoreType } from "@/app/lib/types/global_store_types";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

/* eslint-disable @typescript-eslint/no-explicit-any */
async function encodeToken(token: Record<string, any>) {
  return await new SignJWT(token)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      telephone: string;
      socialMedia: string;
      address?: {
        city?: string;
        province?: string;
        district?: string;
        address?: string;
      };
      profilePic: {
        link: string;
        title: string;
      };
      membershipId: string;
      isVerified: boolean;
      verificationToken: string | null;
      roleId: string;
      token: string;
      authorizedStore: GlobalStoreType[];
    } & DefaultSession["user"];
    expires: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    socialMedia: string;
    profilePic: {
      link: string;
      title: string;
    };
    address?: {
      city?: string;
      province?: string;
      district?: string;
      address?: string;
    };
    membershipId: string;
    isVerified: boolean;
    verificationToken: string | null;
    roleId: string;
    token: string;
    authorizedStore: GlobalStoreType[];
    exp: number;
  }
}

const authOptions = {
  session: { strategy: "jwt" as const, maxAge: 7 * 24 * 60 * 60 },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email :", type: "text", placeholder: "your_email" },
        password: {
          label: "Password :",
          type: "password",
          placeholder: "your_password",
        },
      },
      async authorize(credentials) {
        try {
          const connection = await dbConnect(null);
          const GlobalUserModel = createGlobalUserModel(connection);
          const User = await GlobalUserModel.findOne({
            email: credentials?.email,
          });

          if (!User) {
            throw new Error("User not found");
          }

          const isPassMatch = await bcrypt.compare(
            credentials?.password as string,
            User.password,
          );
          if (!isPassMatch) {
            throw new Error("Password doesn't match");
          }

          return {
            id: User._id.toString(),
            firstName: User.firstName,
            lastName: User.lastName,
            email: User.email,
            socialMedia: User.socialMedia,
            telephone: User.telephone,
            address: User.address,
            roleId: User.roleId,
            membershipId: User.membershipId,
            isVerified: User.isVerified,
            verificationToken: User.verificationToken,
            profilePic: User.profilePic,
            authorizedStore: User.authorizedStore,
          };
        } catch (error) {
          console.log("Authorize Error:", error);
          throw new Error((error as Error).message || "Unknown error");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.profilePic = user.profilePic;
        token.telephone = user.telephone;
        token.socialMedia = user.socialMedia;
        token.address = user.address;
        token.membershipId = user.membershipId;
        token.isVerified = user.isVerified;
        token.verificationToken = user.verificationToken;
        token.authorizedStore = user.authorizedStore;
        token.roleId = user.roleId;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.email = token.email;
        session.user.profilePic = token.profilePic;
        session.user.telephone = token.telephone;
        session.user.socialMedia = token.socialMedia;
        session.user.address = token.address;
        session.user.membershipId = token.membershipId;
        session.user.isVerified = token.isVerified;
        session.user.verificationToken = token.verificationToken;
        session.user.roleId = token.roleId;
        session.user.authorizedStore = token.authorizedStore;
        session.user.token = await encodeToken(token);
        session.expires = new Date(token.exp * 1000).toISOString();
      }
      return session;
    },
  },
};

export { authOptions };
