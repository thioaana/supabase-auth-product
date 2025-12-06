import { createClient } from "@/lib/supabase/server";
import { NavBarClient } from "@/components/NavBarClient";

export async function NavBar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <NavBarClient isLoggedIn={!!user} />;
}
