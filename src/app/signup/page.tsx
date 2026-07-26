
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { AppLogo } from '@/components/app-logo';
import { Loader2, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success', description: 'Account created successfully! Please log in.' });
      router.push('/login');
    } catch (error: any) {
      let description = "An unexpected error occurred. Please try again.";
      switch(error.code) {
        case 'auth/email-already-in-use':
          description = "This email is already registered. Please try logging in.";
          break;
        case 'auth/invalid-email':
          description = "The email address is not valid.";
          break;
        case 'auth/weak-password':
          description = "The password is too weak. Please use at least 6 characters.";
          break;
        default:
          console.error("Firebase Auth Error:", error);
          description = "Could not create account. Please ensure your project configuration is correct.";
      }
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: description,
      });
    } finally {
        setIsLoading(false);
    }
  };
  
  if (loading || user) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full -ml-48 -mb-48 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex justify-center mb-10">
          <div className="bg-white/20 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-2xl border border-white/30">
            <AppLogo className="h-12 w-12 text-white" />
          </div>
        </div>

        <Card className="rounded-[3rem] shadow-2xl border-none glass-card p-4">
          <CardHeader className="text-center pt-8">
            <CardTitle className="text-3xl font-black">Create Account</CardTitle>
            <CardDescription className="text-base pt-2">Join us to start managing your calculations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="m3-input-container">
                <span className="m3-label left-16">Email Address</span>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="m3-input pl-16 border-none font-medium"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="m3-input-container">
                <span className="m3-label left-16">Password</span>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="m3-input pl-16 border-none font-medium"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/20" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
                Sign Up
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pb-8 pt-4">
            <p className="text-sm text-muted-foreground font-medium">
              Already have an account? <Link href="/login" className="text-primary font-black hover:underline">Log in</Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
