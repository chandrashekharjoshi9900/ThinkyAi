
// src/components/auth-dialog.tsx
'use client';

import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const blockedDomains = [
  'mailinator.com',
  'temp-mail.org',
  'yopmail.com',
  '10minutemail.com',
  'guerrillamail.com',
];

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAuth = async (isSignUp: boolean) => {
    setIsLoading(true);
    setError(null);

    // Client-side validation for temporary emails
    if (isSignUp) {
      const domain = email.split('@')[1];
      if (blockedDomains.includes(domain)) {
        setError('Kripya ek temporary email ka upyog na karein. Dusra email chunein.');
        setIsLoading(false);
        return;
      }
    }

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: 'Success', description: 'Account created successfully!' });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Success', description: 'Logged in successfully!' });
      }
      onOpenChange(false);
    } catch (err: any) {
      // Catch specific Firebase error for blocked emails from the Cloud Function
      if (err.code === 'auth/invalid-argument') {
         setError('Kripya ek temporary email ka upyog na karein. Email se sign up karein.');
      } else {
         setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetState = () => {
      setEmail('');
      setPassword('');
      setError(null);
      setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        if(!isOpen) resetState();
        onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unlock Unlimited Access</DialogTitle>
          <DialogDescription>
            Create an account or log in to generate unlimited explanations, quizzes, and flashcards.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" onClick={resetState}>Login</TabsTrigger>
            <TabsTrigger value="signup" onClick={resetState}>Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={() => handleAuth(false)} className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="signup" className="pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="6+ characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={() => handleAuth(true)} className="w-full" disabled={isLoading}>
                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
