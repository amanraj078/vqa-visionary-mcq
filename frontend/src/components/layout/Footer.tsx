
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 pt-16 pb-8 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 text-xl font-semibold mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span>Visionary</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Advanced AI-powered Visual Question Answering platform that understands and answers questions about video content.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Github className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Mail className="w-5 h-5" />} />
            </div>
          </div>
          
          <div className="hidden md:block">
            <h3 className="font-medium text-lg mb-5">Product</h3>
            <FooterLinks 
              links={[
                { name: 'Demo', href: '/demo' },
                { name: 'Use Cases', href: '#use-cases' },
                { name: 'Analytics', href: '/analytics' },
                { name: 'Quiz', href: '/quiz' },
              ]} 
            />
          </div>
          
          <div className="hidden md:block">
            <h3 className="font-medium text-lg mb-5">Resources</h3>
            <FooterLinks 
              links={[
                { name: 'Documentation', href: '#' },
                { name: 'API Reference', href: '#' },
                { name: 'Blog', href: '#' },
                { name: 'Tutorials', href: '#' },
              ]} 
            />
          </div>
          
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-medium text-lg mb-5">Subscribe</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get the latest news and updates
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-lg flex-grow focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="bg-accent text-white px-4 py-2 rounded-r-lg hover:bg-accent/90 transition duration-200">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} Visionary. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6 text-sm">
            <Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent">
              Terms
            </Link>
            <Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent">
              Privacy
            </Link>
            <Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer" 
      className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white transition-colors duration-200"
    >
      {icon}
    </a>
  );
}

function FooterLinks({ links }: { links: { name: string, href: string }[] }) {
  return (
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.name}>
          <Link 
            to={link.href}
            className="text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors duration-200"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
