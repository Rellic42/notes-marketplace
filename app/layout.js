import "./globals.css";
import AuthProvider from "../components/AuthProvider";
import Navbar from "../components/Navbar";

export const metadata = { title: "NoteSwap – Student Notes Marketplace" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="page">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
