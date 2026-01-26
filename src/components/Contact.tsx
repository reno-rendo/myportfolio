import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';

import { fadeUp } from '@/lib/animations';

import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { SectionHeader } from './SectionHeader';

type ContactFormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

export const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormValues>({
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      message: '',
    },
  });

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

          {/* Submit Button */}
          <Button
            type='submit'
            size='lg'
            disabled={isSubmitting}
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
