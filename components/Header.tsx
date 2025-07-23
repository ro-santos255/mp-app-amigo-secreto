import { Gift, UsersRound } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <Link className="text-2xl font-bold flex items-center gap-2" href="/">
            <Gift className="h-6 w-6 text-red-400" />
            Amigo <span className="font-thin">Secreto</span>
          </Link>
          <nav className="flex items-center space-x-4">
						<Link href="/app/grupos" className="text-foreground text-sm flex gap-2 items-center"><UsersRound className="h-4 w-4" />Meus grupos</Link>
						<Button asChild variant={"outline"}>
							<Link href="/app/grupos/novo">Novo grupo</Link>
						</Button>
					</nav>
        </div>
      </div>
    </header>
  );
}
