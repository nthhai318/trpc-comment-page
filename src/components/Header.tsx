import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <nav className="flex bg-black text-white">
      <div className="flex-1 pl-5 text-3xl font-bold">
        {sessionData?.user?.name ? `Blog of ${sessionData.user.name}` : ""}
      </div>
      <div className="flex-none gap-2">
        <div>
          {sessionData?.user ? (
            <label onClick={() => void signOut()}>
              <div className="w-10 rounded-full">
                <Image
                  className="w-10 rounded-full p-1"
                  width={100}
                  height={100}
                  src={sessionData.user.image ?? ""}
                  alt={sessionData.user.name ?? ""}
                />
              </div>
            </label>
          ) : (
            <button onClick={() => void signIn()}>Sign in</button>
          )}
        </div>
      </div>
    </nav>
  );
};
