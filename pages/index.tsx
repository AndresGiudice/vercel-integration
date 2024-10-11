// pages/index.tsx
import Link from "next/link";
import { Inter } from "next/font/google";
import NavBar from "./components/NavBar"; // Importar NavBar
import '../styles/styles.css';


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <NavBar />
      <main className={`main ${inter.className}`}>
      <h1 className="text-center text-4xl font-bold ">
        Bienvenidos a nuestro <br /> Comercio Electrónico
      </h1>

       
      </main>
    </div>
  );
}