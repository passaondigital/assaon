import { Layout } from "@/components/layout/Layout";

export default function Billing() {
  return (
    <Layout showSidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Billing & Revenue</h1>
        <p className="text-muted-foreground">Subscriptions, invoices, and revenue analytics.</p>
      </div>
    </Layout>
  );
}
