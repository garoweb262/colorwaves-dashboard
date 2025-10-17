"use client";

import React, { useState } from "react";
import { Button } from "@/amal-ui";
import { 
  Share2, 
  Copy, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Mail,
  Check
} from "lucide-react";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
  hashtags?: string[];
}

export function SocialShare({ url, title, description, imageUrl, hashtags = [] }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');
  const encodedImageUrl = encodeURIComponent(imageUrl || '');
  const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtags.join(',')}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = (platform: string) => {
    const shareUrl = shareLinks[platform as keyof typeof shareLinks];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        leftIcon={<Share2 className="h-4 w-4" />}
      >
        Share
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[200px]">
          <div className="space-y-2">
            {/* Copy Link */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              className="w-full justify-start"
              leftIcon={copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>

            {/* Social Media Links */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('facebook')}
                className="w-full justify-start text-blue-600 hover:bg-blue-50"
                leftIcon={<Facebook className="h-4 w-4" />}
              >
                Facebook
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('twitter')}
                className="w-full justify-start text-blue-400 hover:bg-blue-50"
                leftIcon={<Twitter className="h-4 w-4" />}
              >
                Twitter
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('linkedin')}
                className="w-full justify-start text-blue-700 hover:bg-blue-50"
                leftIcon={<Linkedin className="h-4 w-4" />}
              >
                LinkedIn
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('whatsapp')}
                className="w-full justify-start text-green-600 hover:bg-green-50"
                leftIcon={<MessageCircle className="h-4 w-4" />}
              >
                WhatsApp
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('email')}
                className="w-full justify-start text-gray-600 hover:bg-gray-50 col-span-2"
                leftIcon={<Mail className="h-4 w-4" />}
              >
                Email
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
