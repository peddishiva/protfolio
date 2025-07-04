import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shiva Peddi - Portfolio',
  description: 'B.Tech Student | Software Developer | ML Enthusiast - Portfolio website showcasing projects and skills in software development, machine learning, and automation.',
  keywords: 'Shiva Peddi, Software Developer, Machine Learning, B.Tech, Portfolio, Web Development, Python, JavaScript, React',
  authors: [{ name: 'Shiva Peddi' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}