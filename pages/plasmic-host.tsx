import * as React from "react";
import { PlasmicCanvasHost } from "@plasmicapp/loader-nextjs";
import { PLASMIC } from "@/plasmic-init";
import Head from "next/head";

// Import fragment registration
import "@/fragment";

export default function PlasmicHost() {
  return (
    <>
      <Head>
        <title>Plasmic Host</title>
      </Head>
      <PlasmicCanvasHost />
    </>
  );
}
