import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { ISimpleUser } from "~/type";
import { request } from "~/utils/api";

export const AuthContext = React.createContext<{
  user: ISimpleUser | null;
  setUser: React.Dispatch<React.SetStateAction<ISimpleUser | null>>;
}>({} as any);

export const AuthProvider: React.FC<{
  children?: React.ReactNode;
  user: ISimpleUser | null;
}> = ({ children, user: userProp }) => {
  const [user, setUser] = useState(userProp);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const { user, setUser } = React.useContext(AuthContext);
  const { data, isLoading } = useQuery(["me"], () =>
    request({ url: "/api/me" })
  );
  useEffect(() => {
    if (!isLoading) {
      setUser(data ?? null);
    }
  }, [data, setUser, isLoading]);
  return user;
};
