"use client";
import React from "react";
import { motion } from "framer-motion";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n-config";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { AuroraBackground } from "@/components/ui/aurora-background";

const AnimatedText = ({ delay, children, className }) => (
  <motion.div
    initial={{ y: 10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{
      opacity: { delay, duration: 0.2 },
      y: { delay, duration: 0.2 },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

interface HeroSectionProps {
  finishedLoading: boolean;
  lang: Locale;
}

const HeroSection = ({ finishedLoading, lang }: HeroSectionProps) => {
  const baseDelay = finishedLoading ? 0 : 6.4;
  const dictionary = getDictionary(lang);
  const { heroSection } = dictionary;

  const highlightText = (text: string, terms: string[]) => {
    let highlightedText = text;
    terms.forEach((term) => {
      const regex = new RegExp(`(${term})`, "gi");
      highlightedText = highlightedText.replace(regex, '<span class="text-accent-coral">$1</span>');
    });
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  return (
    <AuroraBackground>
      {/*<WavyBackground className="mx-auto max-w-4xl pb-40">*/}
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="flex h-full flex-col justify-center px-8 py-32 sm:px-8 sm:py-52 md:px-28 lg:px-32 xl:px-56 2xl:px-72"
      >
        <div className="">
          <TextGenerateEffect
            className="font-tech tracking-wider text-accent-coral lg:text-lg"
            words={heroSection.greeting}
          />
          <AnimatedText
            delay={baseDelay + 0.1}
            className="mt-8 font-heading text-3xl font-bold text-text-primary sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {heroSection.name}
          </AnimatedText>
          <AnimatedText
            delay={baseDelay + 0.2}
            className="mt-4 font-sub-heading text-3xl font-light text-text-secondary sm:text-4xl md:text-4xl lg:text-6xl"
          >
            {heroSection.tagline}
          </AnimatedText>
          <AnimatedText
            delay={baseDelay + 0.3}
            className="mt-10 max-w-sm font-body text-base tracking-wider text-text-secondary sm:max-w-md md:text-lg lg:max-w-lg lg:text-xl"
          >
            <p className="text-text-secondary">
              {highlightText(heroSection.paragraphs[0], heroSection.highlightedTerms)}
            </p>
            <br />
            <p className="text-text-secondary">
              {highlightText(heroSection.paragraphs[1], heroSection.highlightedTerms)}
            </p>
          </AnimatedText>

          <AnimatedText delay={baseDelay + 0.4} className="mt-12">
            <a href={heroSection.resumeHref} target="_blank" rel="noreferrer">
              <button className="relative p-[2px]">
                <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary to-secondary" />
                <div className="group relative rounded-[6px] bg-white px-8 py-3 font-heading text-accent-coral transition duration-200 hover:bg-transparent hover:text-white">
                  {heroSection.cta}
                </div>
              </button>
            </a>
          </AnimatedText>
        </div>
      </motion.div>
      {/*</WavyBackground>*/}
    </AuroraBackground>
  );
};

export default HeroSection;
