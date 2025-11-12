import React from 'react';
import { RECIPES } from '../data/recipes';
import { RecipeCard } from '../ui/RecipeCard';

export default function Library(){
  return (
    <div className="max-w-[980px] mx-auto p-6">
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold text-peacock">Recipe StoryBook</h1>
        <p className="text-brown/80">All cuisines welcome. First up: <b>Masala & Magnolia</b> 🌙✨</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {RECIPES.map(r => <RecipeCard key={r.id} r={r} />)}
      </div>
    </div>
  );
}
