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
      }
      toast({ variant: 'destructive', title: 'Sign Up Failed', description: description });
    } finally {
        setIsLoading(false);
    }
  };
  
  if (loading || user) return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-6 hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full -mr-64 -mt-64 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent rounded-full -ml-64 -mb-64 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex justify-center mb-10">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="bg-white p-2 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border-4 border-primary/20"
          >
            <AppLogo className="h-[72px] w-[72px]" />
          </motion.div>
        </div>

        <Card className="card-rounded shadow-[0_50px_100px_rgba(0,0,0,0.25)] border-none glass-card p-6 sm:p-10">
          <CardHeader className="text-center pb-8 space-y-4">
            <CardTitle className="text-4xl font-black tracking-tight">Create Account</CardTitle>
            <CardDescription className="text-lg font-medium pt-2">Join thousands of users managing land records</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <form onSubmit={handleSignup} className="space-y-8">
              <div className="m3-input-container">
                <Input
                  type="email"
                  required
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer m3-input pl-16 border-none font-medium"
                  disabled={isLoading}
                />
                <Mail className="m3-icon" />
                <span className="m3-label left-16">Username / Email</span>
              </div>
              <div className="m3-input-container">
                <Input
                  type="password"
                  required
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer m3-input pl-16 border-none font-medium"
                  disabled={isLoading}
                />
                <Lock className="m3-icon" />
                <span className="m3-label left-16">Password</span>
              </div>
              <Button type="submit" className="w-full h-20 rounded-[2rem] text-xl font-black shadow-2xl shadow-primary/20 group hover:scale-[1.02] active:scale-[0.98] transition-all" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <UserPlus className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />}
                Sign Up
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pt-10 pb-4">
            <p className="text-base text-muted-foreground font-semibold">
              Already a member? <Link href="/login" className="text-primary font-black hover:underline underline-offset-4 ml-1">Log in here</Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
