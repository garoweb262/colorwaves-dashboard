"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HeroProps } from "../types";
import { Button } from "./forms/Button";
import { ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "../utilities";
import Link from "next/link";
import { Container } from "./layout/Container";
import { Flex } from "./layout/Flex";
import { Typography } from "./Typography";
import { animationPresets } from "../animations";

export const Hero: React.FC<HeroProps> = ({
  variant = "level1",
  title,
  subtitle,
  description,
  tagline,
  cta,
  secondaryCta,
  background,
  layout = "left",
  size = "lg",
  animation = "fadeIn",
  animationDelay = 0,
  showBreadcrumbs = false,
  breadcrumbs = [],
  stats = [],
  className,
  ...props
}) => {
  const { scrollY } = useScroll();

  // Parallax scroll effect for the image
  const imageScale = useTransform(scrollY, [0, 500], [1, 1.2]);
  const imageY = useTransform(scrollY, [0, 500], [0, -100]);

  // Size variants
  const sizeVariants = {
    sm: "py-12 lg:py-16",
    md: "py-16 lg:py-20",
    lg: "py-20 lg:py-24",
    xl: "py-24 lg:py-32",
  };

  // Layout variants
  const layoutVariants = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    split: "text-left",
  };

  // Animation variants
  const animationVariants = {
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay: animationDelay },
    },
    slideUp: {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, delay: animationDelay },
    },
    slideLeft: {
      initial: { opacity: 0, x: 40 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.6, delay: animationDelay },
    },
    slideRight: {
      initial: { opacity: 0, x: -40 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.6, delay: animationDelay },
    },
    zoomIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.6, delay: animationDelay },
    },
    none: {
      initial: {},
      animate: {},
      transition: {},
    },
  };

  // Background rendering
  const renderBackground = () => {
    if (!background) return null;

    switch (background.type) {
      case "image":
        return (
          <div className="absolute inset-0 z-0">
            <img
              src={background.src}
              alt={background.alt || ""}
              className="w-full h-full object-cover"
            />
            {background.overlay && (
              <div
                className={`absolute inset-0 ${
                  background.overlayColor || "bg-black/40"
                }`}
              />
            )}
          </div>
        );
      case "gradient":
        return (
          <div
            className={`absolute inset-0 z-0 ${
              background.gradient ||
              "bg-gradient-to-br from-blue-600 to-purple-600"
            }`}
          />
        );
      case "solid":
        return (
          <div
            className="absolute inset-0 z-0"
            style={{ backgroundColor: background.color }}
          />
        );
      case "video":
        return (
          <div className="absolute inset-0 z-0">
            <video autoPlay muted loop className="w-full h-full object-cover">
              <source src={background.src} type="video/mp4" />
            </video>
            {background.overlay && (
              <div
                className={`absolute inset-0 ${
                  background.overlayColor || "bg-black/40"
                }`}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Level 1 variant (Homepage super hero)
  if (variant === "level1") {
    return (
      <>
        <Container
          padding="none"
          centered={false}
          className="grid grid-cols-1 lg:grid-cols-3 relative pt-12"
        >
          <Flex
            direction="column"
            className="col-span-2 space-y-4 px-3 md:px-6"
          >
            {/* Tagline */}
            {tagline && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...animationPresets.spring,
                  delay: animationDelay + 0.2,
                }}
              >
                <Flex direction="row" alignItems="center" className="gap-2">
                  <Typography
                    variant="body"
                    weight="normal"
                    className="text-amaltech-orange"
                  >
                    /
                  </Typography>
                  <Typography variant="caption" weight="normal">
                    {tagline}
                  </Typography>
                </Flex>
              </motion.div>
            )}

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...animationPresets.spring,
                delay: animationDelay + 0.4,
              }}
            >
              <Typography
                variant="h1"
                weight="medium"
                className="text-amaltech-blue uppercase"
              >
                {title}
              </Typography>
            </motion.div>
          </Flex>
        </Container>

        <div className="relative">
          {/* Button */}
          {(cta || secondaryCta) && (
            <Container
              padding="none"
              centered={false}
              className="w-full grid grid-cols-1 lg:grid-cols-3 relative z-50"
            >
              <div className="flex-1 col-span-2"></div>
              <motion.div
                className="col-span-1 relative -mb-[8rem] bottom-[-1.87rem]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  ...animationPresets.spring,
                  delay: animationDelay + 0.6,
                }}
              >
                {cta && (
                  <Link href={cta.href}>
                    <Button
                      variant={cta.variant || "primary"}
                      size="lg"
                      fullWidth={true}
                      rightIcon={cta.icon || <ArrowRight className="w-4 h-4" />}
                    >
                      {cta.text}
                    </Button>
                  </Link>
                )}
              </motion.div>
            </Container>
          )}

          {/* Full-width Hero Image with Clip Path and Scroll Effects */}
          <div className="w-screen mt-8 -z-1">
            <div
              className="w-full h-[420px] md:h-[475px] lg:h-[660px] relative overflow-hidden"
              style={{
                clipPath:
                  "polygon(0 0, 75% 0, 75% 9.5%, 100% 9.5%, 100% 100%, 0 100%)",
              }}
            >
              {background?.type === "image" ? (
                <motion.img
                  src={background.src}
                  alt={background.alt || "Hero Background"}
                  className="w-full h-full object-cover"
                  style={{
                    scale: imageScale,
                    y: imageY,
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    ...animationPresets.smooth,
                    delay: animationDelay + 0.2,
                    duration: 2,
                  }}
                />
              ) : background?.type === "video" ? (
                <motion.video
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                  style={{
                    scale: imageScale,
                    y: imageY,
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    ...animationPresets.smooth,
                    delay: animationDelay + 0.2,
                    duration: 2,
                  }}
                >
                  <source src={background.src} type="video/mp4" />
                </motion.video>
              ) : (
                <motion.div
                  className="w-full h-full bg-gradient-to-br from-amaltech-blue to-amaltech-orange"
                  style={{
                    scale: imageScale,
                    y: imageY,
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    ...animationPresets.smooth,
                    delay: animationDelay + 0.2,
                    duration: 2,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Default variant (other levels)
  return (
    <section
      className={cn(
        "relative py-20 lg:py-32 overflow-hidden",
        sizeVariants[size],
        className
      )}
      {...props}
    >
      {/* Full-width Background - breaks out of container */}
      <div className="absolute inset-0 w-screen left-1/2 transform -translate-x-1/2">
        {renderBackground()}
      </div>

      {/* Content - stays within layout wrapper */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className={cn("max-w-4xl mx-auto", layoutVariants[layout])}>
          {/* Breadcrumbs */}
          {showBreadcrumbs && breadcrumbs.length > 0 && (
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: animationDelay }}
              className="mb-8"
            >
              <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <ChevronRight className="h-4 w-5 mx-2" />}
                    <a
                      href={crumb.href}
                      className="hover:text-amaltech-orange transition-colors"
                    >
                      {crumb.name}
                    </a>
                  </li>
                ))}
              </ol>
            </motion.nav>
          )}

          {/* Main Content */}
          <motion.div className="space-y-6" {...animationVariants[animation]}>
            {/* Tagline */}
            {tagline && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: animationDelay + 0.1 }}
                className="inline-flex items-center px-4 py-2 bg-amaltech-orange/10 text-amaltech-orange text-sm font-medium rounded-full"
              >
                {tagline}
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: animationDelay + 0.2 }}
              className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: animationDelay + 0.3 }}
                className="text-xl lg:text-2xl text-gray-600 leading-relaxed"
              >
                {subtitle}
              </motion.p>
            )}

            {/* Description */}
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: animationDelay + 0.4 }}
                className="text-lg text-gray-500 leading-relaxed max-w-3xl"
              >
                {description}
              </motion.p>
            )}

            {/* CTA Buttons */}
            {(cta || secondaryCta) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: animationDelay + 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {cta && (
                  <Link href={cta.href}>
                    <Button size="lg" variant={cta.variant || "primary"}>
                      {cta.text}
                      {cta.icon || <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>
                  </Link>
                )}
                {secondaryCta && (
                  <Link href={secondaryCta.href}>
                    <Button
                      size="lg"
                      variant={secondaryCta.variant || "outline"}
                    >
                      {secondaryCta.text}
                      {secondaryCta.icon || (
                        <ChevronRight className="ml-2 h-5 w-5" />
                      )}
                    </Button>
                  </Link>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Stats */}
          {stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: animationDelay + 0.6 }}
              className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-amaltech-orange mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
