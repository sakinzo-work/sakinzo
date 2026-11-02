import { createContext, useContext } from "react";
export const PageContext = createContext("index");
export const usePageSlug = () => useContext(PageContext);
