'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { AppLogo } from '@/components/app-logo';
import { Loader2 } from 'lucide-react';

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success', description: 'Logged in successfully!' });
      router.push('/');
    } catch (error: any) {
        let description = "An unexpected error occurred. Please try again.";
  
        switch(error.code) {
          case 'auth/api-key-not-valid':
            description = "Your Firebase API key is not valid. Please check your Firebase configuration in src/lib/firebase.ts.";
            break;
          case 'auth/invalid-email':
            description = "The email address is not valid.";
            break;
          case 'auth/user-disabled':
            description = "This user account has been disabled.";
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            description = "Invalid email or password. Please check your credentials and try again.";
            break;
          default:
            console.error("Firebase Auth Error:", error);
            description = "Could not log in. Please ensure you have enabled Email/Password sign-in in your Firebase project and that your project configuration is correct.";
        }
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        toast({ title: 'Success', description: 'Logged in successfully with Google!' });
        router.push('/');
    } catch (error: any) {
        let description = "An unexpected error occurred during Google Sign-In.";
        switch (error.code) {
            case 'auth/api-key-not-valid':
                description = "Your Firebase API key is not valid. Please check your Firebase configuration in src/lib/firebase.ts.";
                break;
            case 'auth/popup-closed-by-user':
                description = 'The sign-in popup was closed before completion. Please try again.';
                break;
            case 'auth/account-exists-with-different-credential':
                description = 'An account already exists with the same email address but different sign-in credentials.';
                break;
            default:
                console.error("Google Auth Error:", error);
                description = "Could not log in with Google. Please ensure you have enabled Google sign-in in your Firebase project.";
        }
        toast({
            variant: 'destructive',
            title: 'Google Sign-In Failed',
            description: description,
        });
    } finally {
        setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-4">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <AppLogo className="h-10 w-10" />
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Log In</CardTitle>
            <CardDescription>Enter your credentials or use Google to sign in.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isGoogleLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isGoogleLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log In
              </Button>
            </form>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
                {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <GoogleIcon className="mr-2 h-4 w-4 fill-current" />
                )}
                Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
