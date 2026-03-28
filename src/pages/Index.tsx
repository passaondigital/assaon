import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          The platform for <span className="text-primary">animal professionals</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-8">
          No-code tools for veterinarians, breeders, trainers, and wildlife experts. Build, manage, and grow — all in one place.
        </p>
        <div className="flex gap-3">
          <Link to="/auth/login">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/auth/login">
            <Button variant="outline" size="lg">Login</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
