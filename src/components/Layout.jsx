
import Sidebar from './SideBar'
import Navbar from './NavBar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <div className="md:ml-60 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}