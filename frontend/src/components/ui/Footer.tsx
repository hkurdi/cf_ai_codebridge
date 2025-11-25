import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-6 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-slate-600">
        <p>
          Built with React, Cloudflare Workers, Durable Objects, Workers AI (Llama 3.3), and ElevenLabs TTS.
          <br />
          For Cloudflare's SWE Internship.
          <br/>
          HLK © 2025.
        </p>
      </div>
    </footer>
  );
};