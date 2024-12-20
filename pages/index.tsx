// pages/index.tsx
import Link from "next/link";
import { Inter } from "next/font/google";
import NavBar from "./components/NavBar"; // Importar NavBar
import '../styles/styles.css';
import withAuth from '../components/withAuth';

const inter = Inter({ subsets: ["latin"] });

function HomePage() {
  return (
    <div>
      <NavBar />
      <main className={`main ${inter.className}`}>
      <h1 className="text-center text-4xl font-bold text-black">
        Bienvenido a nuestro <br /> Comercio Electrónico
      </h1>

       
      </main>
    </div>
  );
}

export default withAuth(HomePage);