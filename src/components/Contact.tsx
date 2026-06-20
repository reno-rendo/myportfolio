import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';

import { fadeUp } from '@/lib/animations';

import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { SectionHeader } from './SectionHeader';
import { AlertCircle } from 'lucide-react';

// Cloudflare Turnstile Site Key - fallback ke Test Key if missing
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'; // Test Key Cloudflare: Always Pass

type ContactFormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

// Declare Turnstile global type
declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement | string, options: {
        sitekey: string;
        callback?: (token: string) => void;
        'error-callback'?: () => void;
        'expired-callback'?: () => void;
        theme?: 'light' | 'dark' | 'auto';
      }) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const form = useForm<ContactFormValues>({
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  // Initialize Turnstile widget
  useEffect(() => {
    let scriptLoaded = false;

    const initTurnstile = () => {
      console.log('[Turnstile] Init called. Ref:', !!turnstileRef.current, 'Window:', !!window.turnstile, 'WidgetID:', widgetIdRef.current);
      if (turnstileRef.current && window.turnstile && !widgetIdRef.current) {
        try {
          console.log('[Turnstile] Rendering widget...');
          widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            callback: (token: string) => {
              console.log('[Turnstile] Success token received');
              setTurnstileToken(token);
              setTurnstileError(null);
            },
            'error-callback': () => {
              console.error('[Turnstile] Verification failed');
              setTurnstileError('Verifikasi gagal. Coba lagi.');
              setTurnstileToken(null);
            },
            'expired-callback': () => {
              console.warn('[Turnstile] Token expired');
              setTurnstileToken(null);
              setTurnstileError('Verifikasi expired. Klik untuk verifikasi ulang.');
            },
            theme: 'dark',
          });
          console.log('[Turnstile] Render called, Widget ID:', widgetIdRef.current);
        } catch (e) {
          console.error('[Turnstile] Render error:', e);
        }
      }
    };

    // Check availability with retries
    if (window.turnstile) {
      initTurnstile();
    } else {
      // Inject script manually if not present (fallback)
      if (!document.querySelector('script[src^="https://challenges.cloudflare.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          scriptLoaded = true;
          setTimeout(initTurnstile, 100);
        };
        document.head.appendChild(script);
      }

      // Polling fallback
      const checkTurnstile = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkTurnstile);
          initTurnstile();
        }
      }, 500);

      // Cleanup timeout after 10s if fails
      setTimeout(() => clearInterval(checkTurnstile), 10000);

      // Explicit cleanup
      return () => clearInterval(checkTurnstile);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // ignore cleanup errors
        }
        widgetIdRef.current = null;
      }
    };
  }, []);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const onSubmit = async (values: ContactFormValues) => {
    if (!turnstileToken) {
      setTurnstileError('Harap selesaikan verifikasi terlebih dahulu');
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send message');
      }

      form.reset();
      setIsSuccess(true);

      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken(null);
      }
    } catch (err) {
      setTurnstileError(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeUp}
      className='mt-30 scroll-mt-10'
      id='contact'
    >
      <SectionHeader
        subtitle='Contact'
        title={"Let's make something great together"}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full mx-auto space-y-4 mt-10'
        >
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {/* Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input
                      placeholder='Name'
                      className='border-2 h-12'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Company */}
            <FormField
              control={form.control}
              name='company'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input
                      placeholder='Company'
                      className='border-2 h-12'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='Email'
                      className='border-2 h-12'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input
                      type='tel'
                      placeholder='Phone Number'
                      className='border-2 h-12'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Message */}
          <FormField
            control={form.control}
            name='message'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder='Write your message...'
                    className='h-36 border-2'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cloudflare Turnstile Widget */}
          <div className='space-y-2'>
            <div
              ref={turnstileRef}
              className='cf-turnstile min-h-[65px]'
              data-theme='dark'
              style={{ minHeight: '65px' }}
            />
            {turnstileError && (
              <div className='flex items-center gap-2 text-red-400 text-sm'>
                <AlertCircle size={16} />
                <span>{turnstileError}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            size='lg'
            disabled={isSubmitting || !turnstileToken}
            className='w-1/3 flex items-center justify-center gap-2'
          >
            {isSubmitting ? (
              <>
                <span className='h-4 w-4 animate-spin rounded-full border-2 border-t-transparent'></span>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </Button>

          {/* Success Message */}
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-center text-sm text-green-400 font-medium mt-2'
            >
              Your message has been sent successfully!
            </motion.div>
          )}
        </form>
      </Form>
    </motion.section>
  );
};
