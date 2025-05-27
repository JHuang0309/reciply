import { useState, useEffect } from 'react'
import { scaleIngredients } from '../utils/process_ingredients';
import { exportIngredientsAsTextFile } from '../utils/export_ingredients';

import { ChefHat, Calculator, Utensils, Copy } from 'lucide-react';


function MainPage() {
    const [inputText, setInputText] = useState('');
    const [originalServings, setOriginalServings] = useState(1); // original servings from recipe
    const [newServings, setNewServings] = useState(1); // new servings
    const [multiplier, setMultiplier] = useState(1)
    const [ingredients, setIngredients] = useState([]) // final list of scaled ingredients
    const [ingredientsScaled, setIngredientsScaled] = useState(false) // flag for scaled ingredients 


    useEffect(() => {
        setMultiplier(newServings / originalServings);
    }, [originalServings, newServings])

    useEffect(() => {
        setIngredients(scaleIngredients(inputText, multiplier));
    }, [inputText, multiplier])

    useEffect(() => {
        if (ingredients.length == 0 || ingredients[0].original === '') {
            setIngredientsScaled(false);
        }
    }, [ingredients])

    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '2rem',
        marginBottom: '1rem',
    }

    const cardHeaderStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.5rem',
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIngredientsScaled(true);
        setIngredients(scaleIngredients(inputText, multiplier));
    }

    return (
        <>
            <div className='min-h-screen bg-gradient-to-b from-orange-50 to slate-100 dark:from-slate-900 dark:to-slate-800'>
                {/* Header */}
                <header className='bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 backdrop-blur-sm'>
                    <div className='flex items-center space-x-3 h-16 pl-4'>
                        <div className='flex justify-center'><img src="/reciply.png" alt="Reciply Logo" className="h-[2.5rem]" /></div>
                        <p className="text-lg font-bold">Reciply</p>
                    </div>
                </header>
                <main className="p-4 max-w-6xl mx-auto py-16">
                    <h2 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Scale Any <span className="text-orange-500">Recipe</span> Instantly
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-16">
                        Paste your ingredient list, set your servings, and get perfectly scaled measurements in seconds. 
                        Perfect for home cooks who love to adjust recipes for any crowd size.
                    </p>

                    {/* Recipe Scaler */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        {/* Input Section */}
                        <div style={cardStyle} className="p-6 bg-white dark:bg-slate-800 border border-slate-200">
                            <div style={cardHeaderStyle} className="mb-4">
                                <div className="flex items-center gap-2 ">
                                    <Calculator className="h-7 w-7 text-orange-500"></Calculator>
                                    <h3 className='text-2xl font-semibold leadning-none '>Recipe Scaler</h3>
                                </div>
                            </div>
                            <p className='text-left text-gray-500'>Paste your ingredient list and set your desired servings</p>
                            <form onSubmit={handleSubmit}>
                                <div className='text-left py-6'>
                                    <div className="font-semibold mb-4">Ingredient List</div>
                                    <textarea
                                        rows={6}
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder={`2 tablespoons olive oil
1 1/2 cups flour
3/4 cup sugar
2 large eggs
1 teaspoon vanilla extract
1/2 cup milk`}
                                        className="flex min-h-[200px] w-full rounded-md border border-slate-200 bg-gray-50 px-3 py-2 text-sm placeholder:text-muted-foreground placeholder:text-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    />
                                    <div className='grid grid-cols-2 gap-4 my-6'>
                                        <div className='text-md'>
                                            <p className='font-semibold mb-4'>Original Servings</p>
                                            <input
                                                type="number"
                                                value={originalServings == 0 ? '' : originalServings}
                                                placeholder='Enter value'
                                                onChange={(e) => setOriginalServings(+e.target.value)}
                                                className='bg-gray-50 border border-slate-200 rounded-md px-3 py-2 w-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500'/>
                                        </div>
                                        <div className='text-md'>
                                            <p className='font-semibold mb-4'>Desired Servings</p>
                                            <input 
                                                type="number"
                                                value={newServings == 0 ? '' : newServings}
                                                placeholder='Enter value'
                                                onChange={(e) => setNewServings(+e.target.value)}
                                                className='bg-gray-50 border border-slate-200 rounded-md px-3 py-2 w-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500'/>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="flex justify-center w-full bg-orange-500 font-semibold py-2 rounded-md hover:bg-orange-400 transition-colors focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0">
                                        <Calculator className="text-white inline-block h-5 w-5" />
                                        <p className='text-white ml-2'>Scale Recipe</p>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Output Section */}
                        <div style={cardStyle} className="p-6 bg-white dark:bg-slate-800 border border-slate-200">
                            <div style={cardHeaderStyle} className="mb-6">
                                <div className="flex items-center">
                                    <Utensils className="h-7 w-7 mr-3 text-orange-500"></Utensils>
                                    <h3 className='text-2xl font-semibold'>Scaled Recipe</h3>
                                </div>
                            </div>
                            <p className='text-left text-gray-500 mb-4'>Here is your scaled list of ingredients</p>
                            {ingredientsScaled ? (
                                <table>
                                    <tbody className='text-left'>
                                        {ingredients.map((ing, i) => (
                                        <tr key={i}>
                                            <td className="px-1 py-1">
                                            {ing.newQuantity !== null
                                                ? <>
                                                    <span className='font-bold'>{ing.newQuantity}</span>
                                                    <span>{ing.description}</span>
                                                </>
                                                : <span>{ing.description}</span>
                                            }
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                            
                            ) : (
                                <div className="flex flex-col h-full justify-center text-center py-12 text-slate-500 dark:text-slate-400 pb-20">
                                    <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Your scaled recipe will appear here</p>
                                    <p className="text-sm">Paste ingredients and click "Scale Recipe"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    
                    {/* <p className='text-left italic mb-4'>Write or paste the list of ingredients from your recipe here:</p>
                    <textarea
                        rows={6}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Paste ingredients here..."
                        className="w-full border p-2 mb-4"
                    />

                    <div className="flex flex-col gap-4 mb-10 mt-10">
                        <div className='italic text-left mb-4'>
                            Enter the number of servings the original recipe makes, then specify how many servings you'd like to prepare.
                        </div>
                        <div className='flex justify-center'>
                            <label className='mr-8'>
                            Original Servings:
                            <input
                                type="number"
                                value={originalServings == 0 ? '' : originalServings}
                                placeholder='Enter value'
                                onChange={(e) => setOriginalServings(+e.target.value)}
                                className="border ml-2 min-w-4 pl-1"
                            />
                            </label>
                            <label>
                            New Servings:
                            <input
                                type="number"
                                value={newServings == 0 ? '' : newServings}
                                placeholder='Enter value'
                                onChange={(e) => setNewServings(+e.target.value)}
                                className="border ml-2 min-w-4 pl-1"
                            />
                            </label>
                        </div>
                    </div>

                    <table className="w-full border-collapse">
                        <thead>
                        <tr>
                            <th className="border px-2 py-1 text-xl">Original Ingredients</th>
                            <th className="border px-2 py-1 text-xl">Scaled Ingredients</th>
                        </tr>
                        </thead>
                        <tbody className='text-left'>
                            {ingredients.map((ing, i) => (
                                <tr key={i}>
                                <td className="border px-2 py-2">{ing.original}</td>
                                <td className="border px-2 py-2">
                                    {ing.newQuantity !== null
                                    ? <><span className='font-bold'>{ing.newQuantity}</span><span>{ing.description}</span></> 
                                    : <span className='font-bold text-lg'>{ing.description}</span>}
                                </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {inputText && (
                        <>
                            <button
                            className="mt-6 px-4 py-2 text-black border-2 border-black hover:ring-black"
                            onClick={() => exportIngredientsAsTextFile(ingredients)}
                            >
                                Export ingredients list
                            </button>
                            <p className='mt-8 italic text-red-400'>Have fun cooking!</p>
                        </>
                    )} */}
                    
                </main>
            </div>
        </>
    );
}

export default MainPage;