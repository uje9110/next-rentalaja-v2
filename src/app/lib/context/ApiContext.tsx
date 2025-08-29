"use client";

import React, { createContext, ReactNode, useContext } from "react";

// interfaces
type APIProviderType = {
  children: ReactNode;
};
type APIContextType = {
  ServiceEndpoint: string;
  APIEndpoint: string;
  AuthEndpoint: string;
};

const APIContext = createContext<APIContextType | undefined>(undefined);

const APIContextProvider: React.FC<APIProviderType> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const APIEndpoint = `/api`;
  const AuthEndpoint = `/user`;
  const ServiceEndpoint = `https://service.rentalaja.co.id/service/v1`;

  return (
    <APIContext.Provider
      value={{
        ServiceEndpoint,
        APIEndpoint,
        AuthEndpoint,
      }}
    >
      {children}
    </APIContext.Provider>
  );
};

const useAPIContext = (): APIContextType => {
  const context = useContext(APIContext);
  if (!context) {
    throw new Error("useAPIContext must be used within an APIContextProvider");
  }
  return context;
};

export { APIContext, APIContextProvider, useAPIContext };
