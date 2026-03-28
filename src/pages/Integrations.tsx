import { Layout } from "@/components/layout/Layout";

export default function Integrations() {
  return (
    <Layout showSidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Integrations</h1>
        <p className="text-muted-foreground">Stripe, Supabase, GitHub, Webhooks and more.</p>
      </div>
    </Layout>
  );
}
