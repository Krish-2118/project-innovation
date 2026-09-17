"use client";

import React from "react";
import dynamic from "next/dynamic";

const Cinematic3DGallery = dynamic(() => import("./Cinematic3DGallery"), { ssr: false });

export default function Gallery() {
  return <Cinematic3DGallery />;
}
