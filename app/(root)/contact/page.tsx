// In your page file (e.g., app/page.tsx or pages/index.tsx)
import ContactSection from '@/components/ContactSection';
import { getSettings } from '@/lib/actions/settings.actions';

export default async function HomePage() {
  const settings = await getSettings();

  if (!settings) return <p>Failed to load settings.</p>;

  return (
    <main>
      {/* Other sections */}
      <ContactSection settings={settings} />
    </main>
  );
}
