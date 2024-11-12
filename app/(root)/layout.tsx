import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from 'next/image';
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getLoggedInUser();
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <main className="flex h-screen w-full font-inter">
      {/* Sidebar and other components are rendered only if the user exists */}
      <Sidebar user={user} />
      
      <div className="flex flex-grow flex-col">
        <div className="root-layout flex items-center p-4">
          <Image
            src='/icons/logo.svg'
            width={30}
            height={30}
            alt='menu-icon'
          />
          <MobileNav user={user} />
        </div>
        <div className="flex-grow">
          {children}
        </div>
      </div>
    </main>
  );
}
