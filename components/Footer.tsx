import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-800 py-8 border-t border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 flex items-center justify-center space-x-2 flex-wrap">
            <span>© 2025 Shiva Peddi. Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>and All rights are reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}