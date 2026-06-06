'use client'
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  ShoppingCart,
  BookOpen,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <BookOpen className="h-6 w-6" />
          Librería Trinidad
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Catálogo
          </Link>

          {user?.role === "ADMIN" && (
            <Link
              href="/admin/books"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Link>
          )}

          {user ? (
            <>
              {/* Carrito */}
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Link>

              <Link href="/orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Mis órdenes
              </Link>

              {/* Usuario */}
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="h-4 w-4" />
                {user.nombre}
              </span>

              {/* Logout */}
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-1" />
                Salir
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {" "}
                  Iniciar sesión{" "}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm"> Registrarse </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
