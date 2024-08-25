'use client';

import React, { useState } from 'react';
import ArrowIcon from '@/components/icons/ArrowIcon';
import CheckCircleIcon from '@/components/icons/CheckCircleIcon';
import XCircleIcon from '@/components/icons/XCircleIcon';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/i18n-config';

type SubmitStatus = 'idle' | 'success' | 'error';

interface GetInTouchProps {
  lang: Locale;
}

function GetInTouch({ lang }: GetInTouchProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const dictionary = getDictionary(lang);
  const { contactSection } = dictionary;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (response.ok) {
        setSubmitStatus('success');
        form.reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contactSection"
      data-aos="fade-up"
      className="flex min-h-screen w-full flex-col items-center justify-center space-y-8 bg-background-primary px-4 py-24 sm:px-8"
    >
      <div className="flex max-w-5xl flex-col items-center space-y-6">
        <div className="mx-auto flex w-full flex-col px-4 sm:px-6 lg:px-8">
          <header data-aos="fade-up" className="flex flex-row items-center font-heading">
            <ArrowIcon className="h-6 w-6 flex-none translate-y-[2px] text-accent-coral" />
            <div className="flex flex-row items-center space-x-2 whitespace-nowrap pr-2">
              <span className="font-tech text-xl text-accent-coral"> 04.</span>
              <h2 className="px-2 font-heading text-lg font-bold tracking-wider text-text-primary opacity-85 md:text-2xl">
                {contactSection.title}
              </h2>
            </div>
            <div className="h-[0.2px] w-full bg-accent-green"></div>
          </header>
        </div>

        <div className="mt-14 text-center text-3xl font-bold tracking-wide text-text-primary sm:text-5xl">
          {contactSection.subtitle}
        </div>

        <p className="text-center font-body text-lg leading-relaxed text-text-secondary md:px-32">
          {contactSection.content}
        </p>

        <form
          name="contactSection"
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-4"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
        >
          <input type="hidden" name="form-name" value="contactSection" />
          <div className="hidden">
            <label>
              Don&apos;t fill this out if you&apos;re human: <input name="bot-field" />
            </label>
          </div>

          <FormField label={contactSection.formLabels.name} name="name" type="text" required />
          <FormField label={contactSection.formLabels.email} name="email" type="email" required />
          <FormField label={contactSection.formLabels.message} name="message" type="textarea" required rows={4} />

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md border-2 border-accent-coral px-6 py-2 font-tech text-sm text-accent-coral
                         transition-all duration-300 ease-in-out
                         hover:bg-accent-coral hover:bg-opacity-10
                         focus:outline-none focus:ring-2 focus:ring-accent-coral focus:ring-opacity-50
                         disabled:opacity-50"
            >
              {isSubmitting ? contactSection.sending : contactSection.sendButton}
            </button>
          </div>
        </form>

        {submitStatus !== 'idle' && <StatusMessage status={submitStatus} lang={lang} />}
      </div>
    </section>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  rows?: number;
}

function FormField({ label, name, type, required, rows }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block font-tech text-sm text-text-secondary">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          id={name}
          required={required}
          rows={rows}
          className="w-full rounded-md border border-neutral-medium-gray bg-transparent px-4 py-2 text-text-primary
                     focus:border-accent-coral focus:outline-none focus:ring-1 focus:ring-accent-coral"
        />
      ) : (
        <input
          type={type}
          name={name}
          id={name}
          required={required}
          className="w-full rounded-md border border-neutral-medium-gray bg-transparent px-4 py-2 text-text-primary
                     focus:border-accent-coral focus:outline-none focus:ring-1 focus:ring-accent-coral"
        />
      )}
    </div>
  );
}

interface StatusMessageProps {
  status: 'success' | 'error';
  lang: Locale;
}

function StatusMessage({ status, lang }: StatusMessageProps) {
  const dictionary = getDictionary(lang);
  const { contactSection } = dictionary;

  const isSuccess = status === 'success';
  const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;
  const message = isSuccess ? contactSection.successMessage : contactSection.errorMessage;

  return (
    <div
      className={`mt-4 flex items-center rounded-md p-4 ${
        isSuccess ? 'bg-success bg-opacity-10' : 'bg-error bg-opacity-10'
      }`}
    >
      <Icon className={`mr-3 h-5 w-5 ${isSuccess ? 'text-success' : 'text-error'}`} />
      <span className={`text-sm ${isSuccess ? 'text-success' : 'text-error'}`}>{message}</span>
    </div>
  );
}

export default GetInTouch;
