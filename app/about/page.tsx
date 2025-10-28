"use client";

import {
  AnimatedSection,
  AnimatedHeading,
  AnimatedDivider,
  AnimatedCard,
} from "@/components/ui/animated-section";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Award, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#004987] to-[#0070b8] text-white">
        <div className="container px-4 md:px-6">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <AnimatedHeading className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              About Blockchain Pioneer Student Club
            </AnimatedHeading>
            <AnimatedDivider className="w-24 h-1 bg-white mx-auto mb-8" />
            <p className="text-lg md:text-xl text-white/90 mb-8">
              A pioneering student club advancing Blockchain in Vietnam
            </p>
            <AnimatedSection delay={0.3}>
              <Link href="/join">
                <Button
                  size="lg"
                  className="bg-white text-[#004987] hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  Join us
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </AnimatedSection>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <AnimatedHeading className="text-2xl md:text-3xl font-bold text-[#004987] mb-4">
                Our mission
              </AnimatedHeading>
              <AnimatedDivider />
              <p className="text-gray-600 mb-6">
                We are committed to building a high-quality learning and
                hands-on environment for students to master Blockchain. Through
                diverse activities, we aim to foster a vibrant, creative student
                community ready to embrace emerging technologies.
              </p>
              <ul className="space-y-3">
                {[
                  "Training from fundamentals to advanced Blockchain",
                  "Organizing events and practical workshops",
                  "Connecting with businesses and industry experts",
                  "Creating internship and job opportunities",
                ].map((item, index) => (
                  <AnimatedSection key={index} delay={0.2 * index}>
                    <li className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-[#004987] rounded-full mr-3" />
                      {item}
                    </li>
                  </AnimatedSection>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <AnimatedHeading className="text-2xl md:text-3xl font-bold text-[#004987] mb-4">
                Vision
              </AnimatedHeading>
              <AnimatedDivider />
              <p className="text-gray-600 mb-6">
                To become a leading Blockchain club in Vietnam&apos;s student
                community, nurturing young talents in Blockchain and Web3.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { number: "100+", label: "Members" },
                  { number: "50+", label: "Events" },
                  { number: "20+", label: "Partners" },
                  { number: "20+", label: "Projects" },
                ].map((stat, index) => (
                  <AnimatedCard
                    key={index}
                    index={index}
                    className="bg-gray-50 p-4 rounded-lg text-center"
                  >
                    <div className="text-2xl font-bold text-[#004987] mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </AnimatedCard>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <AnimatedSection className="text-center mb-12">
            <AnimatedHeading className="text-2xl md:text-3xl font-bold text-[#004987] mb-4">
              Core values
            </AnimatedHeading>
            <AnimatedDivider />
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Learning",
                description:
                  "Continuous learning and updating knowledge of Blockchain & Web3",
              },
              {
                icon: Users,
                title: "Community",
                description:
                  "Building a supportive and collaborative environment",
              },
              {
                icon: Award,
                title: "Creativity",
                description:
                  "Encouraging innovative thinking and creative solutions",
              },
            ].map((value, index) => (
              <AnimatedCard
                key={index}
                index={index}
                className="bg-white p-6 rounded-lg text-center"
              >
                <div className="w-16 h-16 bg-[#004987]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-[#004987]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#004987]">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <AnimatedSection className="text-center mb-12">
            <AnimatedHeading className="text-2xl md:text-3xl font-bold text-[#004987] mb-4">
              Our journey
            </AnimatedHeading>
            <AnimatedDivider />
          </AnimatedSection>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#004987]/20" />
            {[
              {
                year: "04/2024",
                title: "Club founded",
                description: "Blockchain UTC Club officially founded",
              },
              {
                year: "06/2024",
                title: "Seminar",
                description: "Student entrepreneurship on Blockchain",
              },
              {
                year: "06/2024",
                title: "Workshop",
                description: "Web3 technology and Decentralized Identity (DID)",
              },
              {
                year: "07/2024",
                title: "Cardano Blockchain Hackathon 2024",
                description:
                  "The club's first hackathon co-organized with experts from the Cardano community",
              },
              {
                year: "10/2024",
                title: "Course organized",
                description:
                  "Intensive Cardano Blockchain course — grasp Blockchain in 9 sessions",
              },
              {
                year: "03/2025",
                title: "Cardano Blockchain Hackathon 2025",
                description:
                  "Hackathon for developers and students with 350,000,000 VND in prizes — a playground for creativity where ideas become reality",
              },
            ].map((milestone, index) => (
              <AnimatedSection
                key={index}
                direction={index % 2 === 0 ? "left" : "right"}
                delay={0.2 * index}
                className="relative mb-12"
              >
                <div
                  className={`flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="md:w-1/2">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="text-sm text-[#004987] font-semibold mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#004987] to-[#0070b8] text-white">
        <div className="container px-4 md:px-6">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <AnimatedHeading className="text-2xl md:text-3xl font-bold mb-4">
              Ready to join us?
            </AnimatedHeading>
            <p className="text-lg mb-8 text-white/90">
              Become part of the Blockchain UTC community and help us build the
              future of Blockchain technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-[#004987] hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  Join the club
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-[#004987] hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  Contact us
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
