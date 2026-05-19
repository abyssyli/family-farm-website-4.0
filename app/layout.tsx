import "./globals.css"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { UserMenu } from "@/components/auth/UserMenu"
import { BackgroundMusic } from "@/components/ui/BackgroundMusic"

export const metadata: Metadata = {
  title: "Paula’s Farm Family Marketplace",
  description:
    "Explore chicken and eggs, handmade woodcraft, and Lisa’s skincare—rooted in a Texas family farm story."
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4">
          <header className="flex items-center justify-between py-6">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-farm-700 text-white">
                PF
              </span>
              <span className="font-semibold tracking-tight">
                Paula’s Farm Family Marketplace
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/products" className="group inline-flex items-center gap-2 hover:text-farm-700">
                <span className="relative h-6 w-6 overflow-hidden rounded-lg ring-1 ring-zinc-200">
                  <Image
                    src="/photos/egg.jpg"
                    alt="Products" [modified]
                    fill
                    className="object-cover"
                    sizes="24px"
                  />
                </span>
                <span>Products</span>
              </Link>
              <Link href="/journal" className="hover:text-farm-700">
                Journal
              </Link>
              <Link href="/account" className="hover:text-farm-700">
                Account
              </Link>
              <BackgroundMusic />
              <UserMenu />
            </nav>
          </header>
          <main className="flex-1 pb-16">{children}</main>
          <footer className="border-t border-zinc-200 py-10 text-sm text-zinc-600">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>Made in Amarillo, Texas.</p>
              <p>© {new Date().getFullYear()} Paula’s Farm Family Marketplace</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}