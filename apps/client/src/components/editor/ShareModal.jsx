import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Copy, Check, Code, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { cn } from '../../utils/cn';

const ShareModal = ({ isOpen, onClose, penId, title }) => {
  const [activeTab, setActiveTab] = useState('link');
  const [copied, setCopied] = useState(false);

  const penUrl = `${window.location.origin}/dashboard/user/editor/${penId}`;
  const embedCode = `<iframe height="300" style="width: 100%;" scrolling="no" title="${title}" src="${penUrl}?embed=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="${penUrl}">${title}</a> by CodeLab User.
</iframe>`;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialShare = (platform) => {
    let shareUrl = '';
    const text = `Check out this project "${title}" on CodeLab!`;
    const encodedUrl = encodeURIComponent(penUrl);
    const encodedText = encodeURIComponent(text);

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const tabs = [
    { id: 'link', label: 'Link', icon: <Share2 className="w-4 h-4" /> },
    { id: 'embed', label: 'Embed', icon: <Code className="w-4 h-4" /> },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Project">
      <div className="flex space-x-1 mb-6 bg-black/20 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center space-x-2 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'link' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Project Link</label>
              <div className="flex space-x-2">
                <input
                  readOnly
                  value={penUrl}
                  className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  onClick={() => handleCopy(penUrl)}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center min-w-[44px]"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <label className="block text-xs font-medium text-gray-400 mb-3">Share on Social</label>
              <div className="flex space-x-3">
                <SocialButton 
                    icon={<Twitter className="w-4 h-4" />} 
                    label="Twitter" 
                    color="hover:bg-[#1DA1F2]" 
                    onClick={() => handleSocialShare('twitter')}
                />
                <SocialButton 
                    icon={<Facebook className="w-4 h-4" />} 
                    label="Facebook" 
                    color="hover:bg-[#4267B2]" 
                    onClick={() => handleSocialShare('facebook')}
                />
                <SocialButton 
                    icon={<Linkedin className="w-4 h-4" />} 
                    label="LinkedIn" 
                    color="hover:bg-[#0077b5]" 
                    onClick={() => handleSocialShare('linkedin')}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'embed' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Iframe Code</label>
              <div className="relative">
                <textarea
                  readOnly
                  value={embedCode}
                  rows={4}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors resize-none font-mono"
                />
                <button
                  onClick={() => handleCopy(embedCode)}
                  className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Paste this code into any HTML page to embed your project.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

const SocialButton = ({ icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className={cn(
    "flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg text-sm text-gray-300 transition-all hover:text-white hover:scale-105",
    color
  )}>
    {icon}
    <span>{label}</span>
  </button>
);

export default ShareModal;
