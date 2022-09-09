import React, { useEffect, useRef, useState } from "react";
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
  const fetched = useRef(false);
  useEffect(() => {
    if (!user && !fetched.current) {
      fetched.current = true;
      request({ url: "/api/me" }).then((user) => setUser(user));
    }
  }, [user, setUser]);
  return user;
};
