export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 py-16 border-t border-gray-800 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Server<span className="text-blue-400 dark:text-blue-300">Hub</span></span>
            </div>
            <p className="text-gray-400 dark:text-gray-500 leading-relaxed">
              Your trusted source for certified pre-owned server equipment and networking gear.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white dark:hover:text-blue-300 transition-colors">Dell Servers</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-blue-300 transition-colors">HP Servers</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-blue-300 transition-colors">Lenovo Servers</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-blue-300 transition-colors">Networking</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-blue-300 transition-colors">Storage</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white dark:hover:text-blue-300 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-blue-300 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-blue-300 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-blue-300 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white dark:hover:text-blue-300 transition-colors">Warranty Info</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-blue-300 transition-colors">Returns Policy</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-blue-300 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-blue-300 transition-colors">Shipping Info</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            2024 ServerHub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-blue-300 transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-blue-300 transition-colors text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
