// Función para obtener datos del servidor

import clientPromise from "@/lib/mongodb";
import type { GetServerSideProps } from "next";
import { ConnectionStatus } from "@/utils/types";

export const getServerSidePropsUtil: GetServerSideProps<ConnectionStatus> = async () => {
  try {
    const client = await clientPromise;
    await client.connect();
    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
};