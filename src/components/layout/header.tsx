// src/components/layout/header.tsx
'use client';

import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/components/auth-provider';
import { auth } from '@/lib/firebase';
import { Icons } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '../auth-dialog';
import { LogOut } from 'lucide-react';

export function Header() {
  const { user } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex">
            <a href="/" className="mr-6 flex items-center space-x-2">
              <Icons.logo className="h-10 w-auto text-primary" />
            </a>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            {user ? (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button variant="default" size="sm" onClick={() => setIsAuthDialogOpen(true)}>
                Login / Sign Up
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>
      <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
    </>
  );
}
