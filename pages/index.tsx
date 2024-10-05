import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

type BagHandles = {
  kpBagHandles: any[];
  wpBagHandles: any[];
};

type ConnectionStatus = {
  isConnected: boolean;
  bagHandles: BagHandles;
};

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/bags");
    const bagHandles = await res.json();
    return {
      props: { isConnected: true, bagHandles },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false, bagHandles: { kpBagHandles: [], wpBagHandles: [] } },
    };
  }
};

export default function Home({
  isConnected,
  bagHandles,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Pages Router: Get started by editing&nbsp;
          <code className="font-mono font-bold">pages/index.tsx</code>
        </p>
      </div>

      <div className="flex flex-col place-items-center gap-12">
        {isConnected ? (
          <h2 className="text-lg text-green-500">
            You are connected to MongoDB!
          </h2>
        ) : (
          <h2 className="text-lg text-red-500">
            You are NOT connected to MongoDB. Check the <code>README.md</code>{" "}
            for instructions.
          </h2>
        )}
        <div>
          <h3 className="text-xl font-bold">KP Bag Handles</h3>
          <ul>
            {bagHandles.kpBagHandles.map((handle, index) => (
              <li key={index}>{JSON.stringify(handle)}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold">WP Bag Handles</h3>
          <ul>
            {bagHandles.wpBagHandles.map((handle, index) => (
              <li key={index}>{JSON.stringify(handle)}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}