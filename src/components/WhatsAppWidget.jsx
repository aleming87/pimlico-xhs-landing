"use client";

import { useState } from 'react';

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  const whatsappNumber = "447961642867";
  const whatsappMessage = encodeURIComponent("Hi! I'm interested in learning more about Pimlico XHS™");
  const emailAddress = "contact@pimlicosolutions.com";
  const linkedinUrl = "https://www.linkedin.com/company/pimlico-xhs";

  const contactOptions = [
    {
      id: 'chat',
      name: 'Start a conversation',
      description: 'Chat with our team',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      ),
      action: () => window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank'),
      color: 'from-[#25D366] to-[#128C7E]'
    },
    {
      id: 'email',
      name: 'Send us an email',
      description: emailAddress,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
      action: () => window.location.href = `mailto:${emailAddress}`,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'linkedin',
      name: 'Connect on LinkedIn',
      description: 'Follow our updates',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      action: () => window.open(linkedinUrl, '_blank'),
      color: 'from-[#0077B5] to-[#005885]'
    }
  ];

  return (
    <>
      {/* Vertical Tab */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-b from-blue-600 to-blue-700 text-white px-3 py-6 rounded-l-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center gap-2 group"
          aria-label="Open contact options"
        >
          <span className="writing-mode-vertical text-sm font-semibold tracking-wider">
            CONTACT US
          </span>
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Popup Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Contact Options Panel */}
          <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 mr-20 animate-slide-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 max-w-[calc(100vw-6rem)] border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Get in touch</h3>
                  <p className="text-sm text-gray-600 mt-1">Choose how you'd like to connect</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contact Options */}
              <div className="space-y-3">
                {contactOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={option.action}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center text-white shadow-sm`}>
                      {option.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {option.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {option.description}
                      </div>
                    </div>
                    <svg 
                      className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={2} 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%) translateY(-50%);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(-50%);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        @media (max-width: 640px) {
          .writing-mode-vertical {
            writing-mode: horizontal-tb;
            text-orientation: unset;
          }
        }
      `}</style>
    </>
  );
}
