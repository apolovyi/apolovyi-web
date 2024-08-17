"use client";

import React, { useState } from "react";
import ArrowIcon from "@/components/icons/ArrowIcon";

export default function GetInTouch() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (response.ok) {
        setSubmitStatus("success");
        form.reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="GetInTouchSection"
      data-aos="fade-up"
      className="flex min-h-screen w-full flex-col items-center justify-center space-y-8 bg-primary px-4 py-24 sm:px-8"
    >
      <div className="flex max-w-2xl flex-col items-center space-y-6">
        {/* Section Number and Title */}
        <div className="flex items-center space-x-2">
          <ArrowIcon className="h-5 w-5 text-secondary" />
          <span className="font-tech text-sm text-secondary sm:text-xl">04.</span>
          <h2 className="px-3 font-heading text-lg font-bold tracking-wider text-heading opacity-85 md:text-2xl">
            What&apos;s Next?
          </h2>
        </div>

        {/* Main Heading */}
        <h1 className="text-center text-4xl font-bold tracking-wide text-heading sm:text-5xl">Let&apos;s Connect</h1>

        {/* Description */}
        <p className="text-center font-body text-lg leading-relaxed text-scd">
          I&apos;m always excited about new opportunities and collaborations. Whether you have a project in mind, a
          question about my work, or just want to say hello, I&apos;d love to hear from you. Let&apos;s start a
          conversation and explore how we can create something amazing together!
        </p>

        {/* Netlify Form with Honeypot */}
        <form
          name="contact"
          onSubmit={handleSubmit}
          className="w-full max-w-md"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
        >
          <input type="hidden" name="form-name" value="contact" />

          {/* Honeypot field  */}
          <p className="hidden">
            <label>
              Don&apos;t fill this out if you&apos;re human: <input name="bot-field" />
            </label>
          </p>

          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block font-tech text-sm text-scd">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="w-full rounded-md border border-gray-700 bg-transparent px-4 py-2 text-scd-light focus:border-secondary focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block font-tech text-sm text-scd">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full rounded-md border border-gray-700 bg-transparent px-4 py-2 text-scd-light focus:border-secondary focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="mb-2 block font-tech text-sm text-scd">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              required
              rows={4}
              className="w-full rounded-md border border-gray-700 bg-transparent px-4 py-2 text-scd-light focus:border-secondary focus:outline-none"
            ></textarea>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md border-2 border-secondary px-6
                               py-2 font-tech text-sm text-secondary
                               transition-all duration-300 ease-in-out
                               hover:bg-secondary hover:bg-opacity-10
                               focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50
                               disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>

        {submitStatus === "success" && <p className="mt-4 text-success">Message sent successfully!</p>}
        {submitStatus === "error" && <p className="mt-4 text-error">Failed to send message. Please try again.</p>}
      </div>
    </div>
  );
}
