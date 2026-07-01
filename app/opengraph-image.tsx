import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const alt = "VENTRHA – Versand neu gedacht";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Weißes Icon zur Build-Zeit als Data-URL einbetten.
const iconData = fs
  .readFileSync(path.join(process.cwd(), "public", "icon-dark.png"))
  .toString("base64");
const iconSrc = `data:image/png;base64,${iconData}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0b",
          backgroundImage:
            "radial-gradient(circle at 50% 22%, rgba(59,130,246,0.28) 0%, transparent 55%)",
          color: "#fafafa",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSrc} width={128} height={128} alt="" />
        <div
          style={{
            marginTop: 36,
            fontSize: 104,
            fontWeight: 800,
            fontStyle: "italic",
            letterSpacing: "-0.02em",
          }}
        >
          VENTRHA
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 46,
            fontStyle: "italic",
            color: "#3b82f6",
          }}
        >
          Versand neu gedacht.
        </div>
        <div style={{ marginTop: 28, fontSize: 30, color: "#a1a1aa" }}>
          Versandsoftware für Online-Händler
        </div>
      </div>
    ),
    { ...size },
  );
}
