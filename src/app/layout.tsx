import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Prime Calculator',
  description: 'A modern prime number calculator with history tracking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
