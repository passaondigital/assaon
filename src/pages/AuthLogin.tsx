import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthLogin() {
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, "");
    navigate("/dashboard");
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 p-6">
          <h1 className="text-2xl font-bold text-center">Sign in to <span className="text-primary">assaon</span></h1>
          <p className="text-sm text-muted-foreground text-center">Enter your email to continue</p>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-accent"
          />
          <Button type="submit" className="w-full">Continue</Button>
          <p className="text-xs text-muted-foreground text-center">
            Demo: use any email. Include "admin" for admin role.
          </p>
        </form>
      </div>
    </Layout>
  );
}
