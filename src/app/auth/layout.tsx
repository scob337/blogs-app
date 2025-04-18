import AuthNav from "@/Components/NavBars/AuthNavbar"

export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <>
        <AuthNav/>
        {children}
        
        </>
  }