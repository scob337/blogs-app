import AuthNav from "@/Components/NavBars/AuthNavbar";
import  { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
    <AuthNav/>
    {children}
    </>
)
};

export default Layout;
