"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("a5ecf057-0032-42e3-88f9-7180efcf258e");
  }, []);

  return null;
};
