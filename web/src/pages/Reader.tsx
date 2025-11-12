import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RECIPES } from '../data/recipes';
import { useCookingSession } from '../hooks/useCookingSession';
import { toSSML } from '../lib/ssml';

export default function Reader(){
  const { id='' } = useParams();
  const recipe = useMemo(()=> RECIPES.find(r => r.id===id) ?? RECIPES[0], [id]);
  const { state, handleUtterance } = useCookingSession(0);

  const step = recipe.steps[state.stepIndex] ?? 'All done!';
  const ssml = toSSML(step, state.pace);

  return (
    <div className="max-w-[980px] mx-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-peacock">{recipe.title}</h1>
          <div className="text-brown/70">{recipe.cuisine} • {recipe.difficulty ?? '–'} • Prep {recipe.prepTime ?? '–'}m • Cook {recipe.cookTime ?? '–'}m</div>
        </div>
        <Link to="/" className="text-peacock underline">← Back to Library</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-soft p-5">
            <h3 className="font-bold text-lg mb-2">Story</h3>
            {recipe.story ? <p className="text-brown/80">{recipe.story}</p> : <p className="text-brown/60">No story provided.</p>}
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-5 mt-4">
            <h3 className="font-bold text-lg mb-2">Ingredients</h3>
            <ul className="list-disc pl-6 text-brown/90">
              {recipe.ingredients.map((it,i)=>(<li key={i}>{it}</li>))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-5 mt-4">
            <h3 className="font-bold text-lg mb-2">Steps</h3>
            <ol className="list-decimal pl-6 text-brown/90">
              {recipe.steps.map((s,i)=>(
                <li key={i} className={i===state.stepIndex ? "font-semibold text-peacock" : ""}>
                  {s}
                </li>
              ))}
            </ol>

            <div className="mt-4 flex flex-wrap gap-2">
              {['Next','Previous','Repeat','Pause','Resume','Step 3','Slower','Faster','2 minute timer'].map(c=>(
                <button key={c} className="px-4 py-2 rounded-full bg-peacock text-white font-semibold hover:bg-teal-600" onClick={()=>handleUtterance(c)}>
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-3 text-xs text-brown/60">SSML preview: <code>{ssml}</code></div>
          </div>

          {recipe.notes && (
            <div className="bg-white rounded-2xl shadow-soft p-5 mt-4">
              <h3 className="font-bold text-lg mb-2">Notes</h3>
              <p className="text-brown/80 whitespace-pre-wrap">{recipe.notes}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="aspect-video bg-cream flex items-center justify-center text-brown">
              {recipe.cover ? <img src={recipe.cover} alt={recipe.title} className="w-full h-full object-cover" /> : <span className="p-4">No cover</span>}
            </div>
            <div className="p-5 space-y-2">
              <div className="text-sm text-brown/80"><b>Author:</b> {recipe.author ?? 'Unknown'}</div>
              {recipe.tags && <div className="flex gap-2 flex-wrap">
                {recipe.tags.map(t => <span key={t} className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">{t}</span>)}
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
