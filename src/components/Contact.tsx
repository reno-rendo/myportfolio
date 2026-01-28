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

// Cloudflare Turnstile Site Key - ganti dengan key Anda
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAAAA-placeholder';

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
    const initTurnstile = () => {
      if (turnstileRef.current && window.turnstile && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => {
            setTurnstileToken(token);
            setTurnstileError(null);
          },
          'error-callback': () => {
            setTurnstileError('Verifikasi gagal. Coba lagi.');
            setTurnstileToken(null);
          },
          'expired-callback': () => {
            setTurnstileToken(null);
            setTurnstileError('Verifikasi expired. Klik untuk verifikasi ulang.');
          },
          theme: 'dark',
        });
      }
    };

    // Check if turnstile is already loaded
    if (window.turnstile) {
      initTurnstile();
    } else {
      // Wait for script to load
      const checkTurnstile = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkTurnstile);
          initTurnstile();
        }
      }, 100);

      return () => clearInterval(checkTurnstile);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
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
    // Check Turnstile token
    if (!turnstileToken) {
      setTurnstileError('Harap selesaikan verifikasi terlebih dahulu');
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);

    const formUrl =
      'https://docs.google.com/forms/d/e/1FAIpQLSe9Sv48rk9Az-yztqHirvHKI6c2JRwZpSrInYiNukrOCwU3_w/viewform?usp=dialog';

    const formData = new FormData();
    formData.append('entry.504361379', values.name);
    formData.append('entry.1061438495', values.company);
    formData.append('entry.591074169', values.email);
    formData.append('entry.1382094980', values.phone);
    formData.append('entry.1046213113', values.message);

    try {
      await fetch(formUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });

      form.reset();
      setIsSuccess(true);

      // Reset Turnstile after successful submission
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken(null);
      }
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
              className='cf-turnstile'
              data-theme='dark'
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
