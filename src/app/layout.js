import "./globals.css";


export const metadata = {
    title: 'Mortgage Calculator',
    description: 'Calculate your mortgage payments',
  };

  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }
