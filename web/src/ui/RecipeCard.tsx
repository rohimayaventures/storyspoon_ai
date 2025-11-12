import React from 'react';
import { Link } from 'react-router-dom';
import type { Recipe } from '../data/recipes';

export function RecipeCard({ r }:{ r: Recipe }){
  return (
    <Link to={`/recipe/${encodeURIComponent(r.id)}`} className="block bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-lg transition">
      <div className="aspect-video bg-cream flex items-center justify-center text-brown">
        {r.cover ? <img src={r.cover} alt={r.title} className="w-full h-full object-cover" /> : <span className="p-4">No cover</span>}
      </div>
      <div className="p-4">
        <div className="font-bold text-lg">{r.title}</div>
        <div className="text-sm text-brown/70">{r.cuisine} • {r.difficulty ?? '–'}</div>
        {r.story && <p className="mt-2 text-brown/80 line-clamp-2">{r.story}</p>}
      </div>
    </Link>
  );
}
