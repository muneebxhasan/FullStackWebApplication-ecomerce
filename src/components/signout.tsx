import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";
import Link from "next/link";
export default function SignOut() {
  let session = auth();
  if (!session) {
    <Link href="/login">
      <Button>Sign in</Button>
    </Link>;
  }
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button type="submit">Sign out</Button>
    </form>
  );
}
