import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

interface FooterSectionProps {
  title: string;
  links: Array<{ label: string; href: string }>;
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, links }) => {
  return (
    <div>
      <h4 className="font-semibold mb-4 text-[#2c3e50]">{title}</h4>
      <ul className="space-y-2 text-[#5a6c7d]">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="hover:text-[#FF6B35] transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export function Footer() {
  const footerSections = [
    {
      title: "Produk",
      links: [
        { label: "Fitur Peta", href: "#" },
        { label: "Kategori UMKM", href: "#" },
        { label: "Daftar Bisnis", href: "#" },
      ],
    },
    {
      title: "Perusahaan",
      links: [
        { label: "Tentang Kami", href: "#about" },
        { label: "Blog", href: "#" },
        { label: "Kontak", href: "#" },
      ],
    },
    {
      title: "Dukungan",
      links: [
        { label: "Pusat Bantuan", href: "#" },
        { label: "Dokumentasi", href: "#" },
        { label: "FAQ", href: "#faq" },
      ],
    },
  ];

  return (
    <footer className="relative bg-white py-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/logo.png"
                alt="Jelajahkita Logo"
                width={180}
                height={120}
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-[#5a6c7d] text-sm leading-relaxed">
              Platform digital yang menghubungkan Anda dengan UMKM lokal di
              sekitar. Dukung lokal, cinta Indonesia.
            </p>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <FooterSection
              key={index}
              title={section.title}
              links={section.links}
            />
          ))}
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#5a6c7d] text-sm">
              &copy; 2025 Jelajahkita. Hak cipta dilindungi.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="text-[#5a6c7d] hover:text-[#FF6B35] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-[#5a6c7d] hover:text-[#FF6B35] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-[#5a6c7d] hover:text-[#FF6B35] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
