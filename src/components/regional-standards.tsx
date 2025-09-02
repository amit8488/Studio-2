'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lightbulb, LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/language-context';
import { suggestRegionalStandard, type RegionalStandardSuggestionInput } from '@/ai/flows/regional-standard-suggestion';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  location: z.string().min(2, { message: 'Location must be at least 2 characters.' }),
});

export function RegionalStandards({ areaValue, areaUnit }: { areaValue: string, areaUnit: string }) {
  const { t } = useLanguage();
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { location: '' },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setSuggestion('');
    try {
      const input: RegionalStandardSuggestionInput = {
        area: `${areaValue} ${areaUnit}`,
        location: data.location,
      };
      const result = await suggestRegionalStandard(input);
      setSuggestion(result.suggestion);
    } catch (error) {
      console.error('AI suggestion failed:', error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not fetch suggestion. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-primary">
          <Lightbulb />
          {t('regionalStandards')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('enterLocation')}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Saurashtra, Ahmedabad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading || !areaValue || parseFloat(areaValue) <= 0} className="w-full rounded-full bg-accent hover:bg-accent/90">
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                t('getSuggestion')
              )}
            </Button>
          </form>
        </Form>
        {suggestion && (
          <Alert className="mt-4 border-primary/50 text-primary bg-primary/5">
            <Lightbulb className="h-4 w-4 !text-primary" />
            <AlertTitle className="font-bold">{t('aiSuggestion')}</AlertTitle>
            <AlertDescription className="text-foreground">
              {suggestion}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
