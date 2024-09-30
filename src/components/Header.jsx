import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <nav>
        <ul style={{ listStyle: "none", display: "flex", gap: "15px" }}>
          <li>
            <Link href="/">Home</Link>
          </li>
          {!session && (
            <>
              <li>
                <Link href="/login">Login</Link>
              </li>
              <li>
                <Link href="/register">Register</Link>
              </li>
            </>
          )}
          {session && (
            <>
              <li>
                <button onClick={() => signOut()} style={{ cursor: "pointer" }}>
                  Logout
                </button>
              </li>
              <li>
                <span>{session.user.email}</span>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
