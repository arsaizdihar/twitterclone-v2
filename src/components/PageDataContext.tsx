import { createContext, ReactNode, useContext } from "react";

const PageDataContext = createContext<unknown>({});

if (process.env.NODE_ENV === "development") {
  PageDataContext.displayName = "PageDataContext";
}

export function PageDataProvider({
  children,
  data,
}: {
  children: ReactNode;
  data: unknown;
}) {
  return (
    <PageDataContext.Provider value={data}>{children}</PageDataContext.Provider>
  );
}

export function usePageData<T>() {
  return useContext(PageDataContext) as T;
}
