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
import { Loader2, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { motion } from 'framer-motion';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    <path fill="none" d="M0 0h48v48H0z" />
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
      toast({ title: 'Success', description: 'Welcome back! Logged in successfully.' });
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
        toast({ title: 'Success', description: 'Logged in with Google successfully.' });
        router.push('/');
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Google Sign-In Failed', description: error.message });
    } finally {
        setIsGoogleLoading(false);
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
        <div className="flex justify-center mb-12">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="bg-white/25 backdrop-blur-3xl p-5 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-white/40"
          >
            <AppLogo className="h-14 w-14 text-white" />
          </motion.div>
        </div>

        <Card className="card-rounded shadow-[0_50px_100px_rgba(0,0,0,0.25)] border-none glass-card p-6 sm:p-10">
          <CardHeader className="text-center pb-8 space-y-4">
            <CardTitle className="text-4xl font-black tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-lg font-medium pt-2">Login to sync your land utility tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="m3-input-container">
                <Input
                  type="email"
                  required
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer m3-input has-icon"
                  disabled={isLoading || isGoogleLoading}
                />
                <Mail className="m3-icon" />
                <span className="m3-label">Username / Email</span>
              </div>
              <div className="m3-input-container">
                <Input
                  type="password"
                  required
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer m3-input has-icon"
                  disabled={isLoading || isGoogleLoading}
                />
                <Lock className="m3-icon" />
                <span className="m3-label">Password</span>
              </div>
              <Button type="submit" className="w-full h-20 rounded-[2rem] text-xl font-black shadow-2xl shadow-primary/20 group hover:scale-[1.02] active:scale-[0.98] transition-all" disabled={isLoading || isGoogleLoading}>
                {isLoading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <ShieldCheck className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />}
                Sign In
              </Button>
            </form>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 text-muted-foreground font-black tracking-widest">Secure Access</span></div>
            </div>

            <Button 
                variant="outline" 
                className="w-full h-18 rounded-[1.75rem] font-black text-lg border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all premium-shadow flex items-center justify-center gap-4" 
                onClick={handleGoogleSignIn} 
                disabled={isLoading || isGoogleLoading}
            >
                {isGoogleLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <GoogleIcon className="h-6 w-6" />}
                Continue with Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center pt-10 pb-4">
            <p className="text-base text-muted-foreground font-semibold">
              No account? <Link href="/signup" className="text-primary font-black hover:underline underline-offset-4 ml-1">Create free account</Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}