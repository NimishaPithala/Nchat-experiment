import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import MainPage from "./components/MainPage";

export default function App() {
  const [user,    setUser]    = useState(null);   // null = guest
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes (login / logout / OAuth redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg,#dde8f8,#e8eef8,#eef0fb,#e8e8f5)",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "3px solid rgba(59,91,219,0.15)",
          borderTop: "3px solid #3b5bdb",
          animation: "spin 0.7s linear infinite",
        }}/>
      </div>
    );
  }

  // Always render MainPage — user can be null (guest) or a Supabase user object
  return <MainPage user={user} />;
}