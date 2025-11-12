import React from 'react';
import { Link } from 'react-router-dom';

export function Navbar(){
  return (
    <div className="bg-white shadow-soft">
      <div className="max-w-[980px] mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-extrabold text-peacock text-xl">🦚 StorySpoon</Link>
        <div className="text-brown/80">Where the Phoenix rises and the Peacock dances.</div>
      </div>
    </div>
  );
}
