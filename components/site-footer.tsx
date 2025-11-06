import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  MessageCircle,
  Linkedin,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-[#004987] text-white">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 w-full bg-[#004987] pt-4 pb-0">
              <Image
                src="/logo2.png"
                alt="Blockchain Pioneer Student Logo"
                width={180}
                height={0}
                style={{ height: "auto" }}
              />
            </div>
            <p className="text-white/80 text-sm">
              A pioneering student club advancing Blockchain in Vietnam.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://www.facebook.com/bpsclub.utc"
                target="_blank"
                className="hover:text-white/80"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://www.linkedin.com/company/106421064/"
                target="_blank"
                className="hover:text-white/80"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" target="_blank" className="hover:text-white/80">
                <MessageCircle className="h-5 w-5" />
                <span className="sr-only">Telegram</span>
              </Link>

              <Link
                href="https://x.com/bps_club"
                target="_blank"
                className="hover:text-white/80"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1200 1227"
                  className="h-4 w-4 mt-0.5 fill-current"
                >
                  <path d="M1101 0H891L600 428 309 0H0l480 678L0 1227h309l291-428 291 428h309L720 678z" />
                </svg>
                <span className="sr-only">X (Twitter)</span>
              </Link>

              <Link
                href="https://www.youtube.com/@BlockchainPioneerStudent"
                target="_blank"
                className="hover:text-white/80"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">Youtube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-white/80 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-white/80 hover:text-white">
                  Events
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-white">
                  News (Coming Soon)
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-white">
                  Media (Coming Soon)
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-white">
                  Partners (Coming Soon)
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-white/80 hover:text-white">
                  Team
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Join</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/join" className="text-white/80 hover:text-white">
                  Member
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-white">
                  FAQ (Coming Soon)
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/80 hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="text-white/80">
                  Blockchain Labs, University of Transport and Communications,
                  03 Cau Giay, Lang Ward, Hanoi, Vietnam
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <Link
                  href="mailto:blockchainutc@gmail.com"
                  className="text-white/80 hover:text-white"
                >
                  blockchainutc@gmail.com
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <Link
                  href="tel:+84325045633"
                  className="text-white/80 hover:text-white"
                >
                  +84325045633
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 text-sm">
          <p>
            © {new Date().getFullYear()} Blockchain Pioneer Student. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
