"use client";

import { useEffect } from "react";

export default function BuyMeACoffee() {
  useEffect(() => {
    // Check if script or button is already injected
    if (document.getElementById("bmc-wbtn")) return;

    const script = document.createElement("script");
    script.setAttribute("id", "bmc-widget-script");
    script.setAttribute("data-name", "BMC-Widget");
    script.setAttribute("data-cfasync", "false");
    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
    script.setAttribute("data-id", "elmohammadi");
    script.setAttribute("data-description", "Support me on Buy me a coffee!");
    script.setAttribute("data-message", "");
    script.setAttribute("data-color", "#FF813F");
    script.setAttribute("data-position", "Right");
    script.setAttribute("data-x_margin", "18");
    script.setAttribute("data-y_margin", "18");
    script.async = true;

    script.onload = () => {
      // Trigger DOMContentLoaded manually if it already fired
      const evt = document.createEvent("Event");
      evt.initEvent("DOMContentLoaded", false, false);
      window.dispatchEvent(evt);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount if needed
      const btn = document.getElementById("bmc-wbtn");
      if (btn) btn.remove();
      const iframe = document.getElementById("bmc-iframe");
      if (iframe) iframe.remove();
      const closeBtn = document.getElementById("bmc-close-btn");
      if (closeBtn && closeBtn.parentElement) closeBtn.parentElement.remove();
      const scriptTag = document.getElementById("bmc-widget-script");
      if (scriptTag) scriptTag.remove();
    };
  }, []);

  return null;
}
