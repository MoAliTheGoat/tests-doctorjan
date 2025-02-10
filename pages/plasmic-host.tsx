import * as React from "react";
import { PlasmicCanvasHost } from "@plasmicapp/loader-nextjs";
import Head from "next/head";

// Import fragment registration
import "../fragment/FragmentRegister"; // ✅ Ensure this path is correct

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
