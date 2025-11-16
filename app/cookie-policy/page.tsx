import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Learn about how NOWIHT uses cookies and similar technologies to enhance your browsing experience.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-20">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
              Legal Information
            </p>
            <h1 className="text-4xl md:text-5xl font-light mb-6">
              Cookie Policy
            </h1>
            <div className="w-16 h-px bg-black mx-auto mb-6" />
            <p className="text-sm text-gray-600">
              Last updated: November 8, 2025
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12 text-gray-600">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-light text-black mb-4">
                What Are Cookies?
              </h2>
              <p className="leading-relaxed mb-4">
                Cookies are small text files that are placed on your device (computer, smartphone, or tablet)
                when you visit our website. They help us provide you with a better experience by remembering
                your preferences and understanding how you use our site.
              </p>
              <p className="leading-relaxed">
                This Cookie Policy explains what cookies are, how we use them, the types of cookies we use,
                and how you can control or delete them.
              </p>
            </section>

            {/* How We Use Cookies */}
            <section>
              <h2 className="text-2xl font-light text-black mb-4">
                How We Use Cookies
              </h2>
              <p className="leading-relaxed mb-4">
                We use cookies for the following purposes:
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-black font-medium mt-1 min-w-[2rem]">01</span>
                  <div>
                    <strong className="text-black">Essential Website Functions:</strong>
                    <span className="ml-2">To enable core functionality like shopping cart, checkout, and account access.</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-black font-medium mt-1 min-w-[2rem]">02</span>
                  <div>
                    <strong className="text-black">Performance & Analytics:</strong>
                    <span className="ml-2">To understand how visitors interact with our website and improve user experience.</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-black font-medium mt-1 min-w-[2rem]">03</span>
                  <div>
                    <strong className="text-black">Personalization:</strong>
                    <span className="ml-2">To remember your preferences like language, region, and display settings.</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-black font-medium mt-1 min-w-[2rem]">04</span>
                  <div>
                    <strong className="text-black">Marketing & Advertising:</strong>
                    <span className="ml-2">To deliver relevant ads and measure campaign effectiveness.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Types of Cookies */}
            <section>
              <h2 className="text-2xl font-light text-black mb-6">
                Types of Cookies We Use
              </h2>

              {/* Necessary */}
              <div className="mb-8 p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-black mb-3">
                  1. Necessary Cookies (Required)
                </h3>
                <p className="text-sm mb-4">
                  These cookies are essential for the website to function properly. They cannot be disabled.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-black"><strong>Examples:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Shopping cart functionality</li>
                    <li>Secure login and authentication</li>
                    <li>Payment processing</li>
                    <li>Cookie consent preferences</li>
                  </ul>
                </div>
              </div>

              {/* Analytics */}
              <div className="mb-8 p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-black mb-3">
                  2. Analytics Cookies (Optional)
                </h3>
                <p className="text-sm mb-4">
                  These cookies help us understand how visitors use our website so we can improve it.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-black"><strong>What we collect:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Pages visited and time spent</li>
                    <li>Device and browser information</li>
                    <li>Geographic location (city/country level)</li>
                    <li>Traffic sources (how you found us)</li>
                  </ul>
                  <p className="mt-4 text-black"><strong>Tools we use:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Google Analytics 4</li>
                    <li>Hotjar (heatmaps and session recordings)</li>
                  </ul>
                </div>
              </div>

              {/* Marketing */}
              <div className="mb-8 p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-black mb-3">
                  3. Marketing Cookies (Optional)
                </h3>
                <p className="text-sm mb-4">
                  These cookies are used to deliver personalized ads and track their performance.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-black"><strong>What we collect:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Products viewed and purchased</li>
                    <li>Ad interactions and conversions</li>
                    <li>Cross-site tracking for retargeting</li>
                  </ul>
                  <p className="mt-4 text-black"><strong>Platforms we use:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Meta Pixel (Facebook, Instagram)</li>
                    <li>Google Ads</li>
                    <li>TikTok Pixel</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Duration */}
            <section>
              <h2 className="text-2xl font-light text-black mb-4">
                How Long Do Cookies Last?
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-black mb-2">Session Cookies</h3>
                  <p className="text-sm">
                    These are temporary cookies that expire when you close your browser.
                    Used for shopping cart and login sessions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-black mb-2">Persistent Cookies</h3>
                  <p className="text-sm mb-2">
                    These remain on your device for a set period:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                    <li><strong>Accepted/Customized preferences:</strong> 6 months</li>
                    <li><strong>Rejected preferences:</strong> 30 days (we'll ask again)</li>
                    <li><strong>Analytics cookies:</strong> Up to 2 years</li>
                    <li><strong>Marketing cookies:</strong> Up to 1 year</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Your Choices */}
            <section>
              <h2 className="text-2xl font-light text-black mb-4">
                Your Cookie Choices
              </h2>
              <p className="leading-relaxed mb-6">
                You have several options to control cookies:
              </p>

              <div className="space-y-6">
                {/* Banner */}
                <div className="p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-black mb-3">
                    1. Cookie Consent Banner
                  </h3>
                  <p className="text-sm mb-4">
                    When you first visit our site, you can choose to accept, reject, or customize
                    which cookies you allow. To change your preferences, clear your browser's cookies
                    for this site and reload the page.
                  </p>
                </div>

                {/* Browser */}
                <div className="p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-black mb-3">
                    2. Browser Settings
                  </h3>
                  <p className="text-sm mb-3">
                    Most browsers allow you to control cookies through their settings:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                    <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                    <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                    <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-3">
                    Note: Blocking necessary cookies may prevent parts of the website from functioning.
                  </p>
                </div>

                {/* Opt-out */}
                <div className="p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-black mb-3">
                    3. Opt-Out Tools
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                    <li>
                      <a
                        href="https://tools.google.com/dlpage/gaoptout"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-black"
                      >
                        Google Analytics Opt-out
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.youronlinechoices.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-black"
                      >
                        Your Online Choices (EU)
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://optout.aboutads.info/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-black"
                      >
                        Digital Advertising Alliance (US)
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-light text-black mb-4">
                Updates to This Policy
              </h2>
              <p className="leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices
                or legal requirements. We will notify you of any significant changes by posting the new
                policy on this page and updating the "Last updated" date.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-light text-black mb-4">
                Questions or Concerns?
              </h2>
              <p className="leading-relaxed mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="p-6 bg-gray-50 border border-gray-200">
                <p className="text-sm mb-2">
                  <strong className="text-black">Email:</strong>{" "}
                  <a href="mailto:privacy@nowiht.com" className="underline hover:text-black">
                    privacy@nowiht.com
                  </a>
                </p>
                <p className="text-sm">
                  <strong className="text-black">Or visit our:</strong>{" "}
                  <Link href="/contact" className="underline hover:text-black">
                    Contact Page
                  </Link>
                </p>
              </div>
            </section>

            {/* Related */}
            <section className="pt-8 border-t border-gray-200">
              <h3 className="text-lg font-medium text-black mb-4">Related Policies</h3>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/privacy-policy"
                  className="px-6 py-3 border border-gray-300 text-sm tracking-[0.2em] uppercase hover:bg-gray-50 transition-all text-black"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="px-6 py-3 border border-gray-300 text-sm tracking-[0.2em] uppercase hover:bg-gray-50 transition-all text-black"
                >
                  Terms of Service
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}