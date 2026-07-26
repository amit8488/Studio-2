'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { AppLogo } from '@/components/app-logo';
import { Loader2, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { motion } from 'framer-motion';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.73 1.9-3.48 0-6.3-2.88-6.3-6.4s2.82-6.4 6.3-6.4c1.93 0 3.3.73 4.24 1.6l2.4-2.4C17.13 4.58 15.03 3.6 12.48 3.6c-4.97 0-9 4.03-9 9s4.03 9 9 9c2.78 0 4.93-1.02 6.55-2.65 1.7-1.7 2.2-4.2 2.2-6.15 0-.58-.05-1.15-.14-1.7H12.48z" />
    </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) router.push('/');
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success', description: 'Logged in successfully!' });
      router.push('/');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        toast({ title: 'Success', description: 'Logged in successfully!' });
        router.push('/');
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Google Sign-In Failed', description: error.message });
    } finally {
        setIsGoogleLoading(false);
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
            <CardTitle className="text-3xl font-black">Welcome Back</CardTitle>
            <CardDescription className="text-base pt-2">Enter your credentials to access your tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="m3-input-container">
                <span className="m3-label">Email Address</span>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="m3-input pl-14 border-none font-medium"
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              </div>
              <div className="m3-input-container">
                <span className="m3-label">Password</span>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="m3-input pl-14 border-none font-medium"
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/20" disabled={isLoading || isGoogleLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
                Log In
              </Button>
            </form>
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-4 text-muted-foreground font-bold">Or</span></div>
            </div>

            <Button variant="outline" className="w-full h-16 rounded-2xl font-bold border-2 hover:bg-muted" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
                {isGoogleLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5 fill-current" />}
                Continue with Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center pb-8 pt-4">
            <p className="text-sm text-muted-foreground font-medium">
              New here? <Link href="/signup" className="text-primary font-black hover:underline">Create an account</Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}