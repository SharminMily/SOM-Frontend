import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-7xl font-bold">404</h1>

        <h2 className="text-2xl font-semibold">
          Page Not Found
        </h2>

        <p className="text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>

        <Button asChild>
          <Link href="/dashboard">
            Back To Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}