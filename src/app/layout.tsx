import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "你的命定城市", description: "一份关于你和城市关系的生活方式观察", robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-CN"><body>{children}</body></html>; }
