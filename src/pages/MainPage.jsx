import { useState, useEffect } from 'react'
import { scaleIngredients } from '../utils/process_ingredients';
import { exportIngredientsAsTextFile } from '../utils/export_ingredients';

import { ChefHat, Calculator, Utensils, Copy } from 'lucide-react';
import ThemeDropdown from '../components/theme-dropdown';
import ChefModeToggle from '../components/chefMode-toggle';

const themes = [
  { color: "bg-red-500", attr1: "from-red-50", attr2: "focus-visible:ring-red-500", attr3: "hover:bg-red-400", attr4: "hover:text-red-500", attr5: "border-red-200", text: "text-red-500", value: "0" },
  { color: "bg-orange-500", attr1: "from-orange-50", attr2: "focus-visible:ring-orange-500", attr3: "hover:bg-orange-400", attr4: "hover:text-orange-500", attr5: "border-orange-200", text: "text-orange-500", value: "1" },
  { color: "bg-yellow-500", attr1: "from-yellow-50", attr2: "focus-visible:ring-yellow-500", attr3: "hover:bg-yellow-400", attr4: "hover:text-yellow-500", attr5: "border-yellow-200", text: "text-yellow-500", value: "2" },
  { color: "bg-green-500", attr1: "from-green-50", attr2: "focus-visible:ring-green-500", attr3: "hover:bg-green-400", attr4: "hover:text-green-500", attr5: "border-green-200", text: "text-green-500", value: "3" },
  { color: "bg-blue-500", attr1: "from-blue-50", attr2: "focus-visible:ring-blue-500", attr3: "hover:bg-blue-400", attr4: "hover:text-blue-500", attr5: "border-blue-200", text: "text-blue-500", value: "4" },
  { color: "bg-indigo-500", attr1: "from-indigo-50", attr2: "focus-visible:ring-indigo-500", attr3: "hover:bg-indigo-400", attr4: "hover:text-indigo-500", attr5: "border-indigo-200", text: "text-indigo-500", value: "5" },
  { color: "bg-purple-500", attr1: "from-purple-50", attr2: "focus-visible:ring-purple-500", attr3: "hover:bg-purple-400", attr4: "hover:text-purple-500", attr5: "border-purple-200", text: "text-purple-500", value: "6" },
]

function MainPage() {
    const [inputText, setInputText] = useState('');
    const [originalServings, setOriginalServings] = useState(1); // original servings from recipe
    const [newServings, setNewServings] = useState(1); // new servings
    const [multiplier, setMultiplier] = useState(1)
    const [ingredients, setIngredients] = useState([]) // final list of scaled ingredients
    const [ingredientsScaled, setIngredientsScaled] = useState(false) // flag for scaled ingredients 
    const [instructions, setInstructions] = useState("")
    const [theme, setTheme] = useState(themes[1])
    const [isScrolled, setIsScrolled] = useState(false);
    const [isChefMode, setIsChefMode] = useState(false);

    const setAppearance = (t) => {
        setTheme(themes[t])
    }

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

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 60) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const copyToClipboard = () => {
        if (ingredientsScaled) {
            const text = ingredients.map(ing => {
                if (ing.newQuantity !== null) {
                    return `${ing.newQuantity}${ing.description}`;
                } else {
                    return ing.description;
                }
            }).join('\n');
            navigator.clipboard.writeText(text);
            toast({
                title: 'Copied!',
                description: 'Scaled recipe copied to clipboard.',
            });
        }
    };

    return (
        <>
            <div className={`min-h-screen bg-gradient-to-b ${theme.attr1} to slate-100 dark:from-slate-900 dark:to-slate-800`}>
                {/* Header */}
                <header className={`flex justify-between border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 backdrop-blur-sm transition-colors duration-300 ${isScrolled ? 'bg-white/30 dark:bg-slate-900/30' : 'bg-white/95 dark:bg-slate-900/95'}`}>
                    <div className='flex items-center space-x-3 h-16 pl-4'>
                        <div className='flex justify-center'><img src="/reciply.png" alt="Reciply Logo" className="h-[2.5rem]" /></div>
                        <p className="text-lg font-bold">Reciply</p>
                    </div>
                    <div className='flex items-center gap-4'>
                        <ChefModeToggle setChefMode={setIsChefMode} />
                        <ThemeDropdown currentTheme={theme} setTheme={setAppearance} />
                    </div>
                    
                </header>
                <main className="p-4 max-w-6xl mx-auto py-16">
                    <h2 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Scale Any <span className={`${theme.text}`}>Recipe</span> Instantly
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
                                    <Calculator className={`h-7 w-7 ${theme.text}`}></Calculator>
                                    <h3 className='text-2xl font-semibold leadning-none dark:text-slate-800'>Recipe Scaler</h3>
                                </div>
                            </div>
                            <p className='text-left text-gray-500'>Paste your ingredient list and set your desired servings</p>
                            <form onSubmit={handleSubmit}>
                                <div className='text-left py-6'>
                                    <div className="font-semibold mb-4 dark:text-slate-800">Ingredient List</div>
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
                                        className={`flex min-h-[200px] w-full rounded-md border border-slate-200 bg-gray-50 px-3 py-2 text-md placeholder:text-muted-foreground placeholder:text-md focus-visible:outline-none focus-visible:ring-1 ${theme.attr2} disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-800 md:text-md`}
                                    />
                                    <div className='grid grid-cols-2 gap-4 my-6 dark:text-slate-800'>
                                        <div className='text-md'>
                                            <p className='font-semibold mb-4'>Original Servings</p>
                                            <input
                                                type="number"
                                                value={originalServings == 0 ? '' : originalServings}
                                                placeholder='Enter value'
                                                onChange={(e) => setOriginalServings(+e.target.value)}
                                                className={`bg-gray-50 border border-slate-200 rounded-md px-3 py-2 w-full focus-visible:outline-none focus-visible:ring-1 ${theme.attr2}`}/>
                                        </div>
                                        <div className='text-md'>
                                            <p className='font-semibold mb-4'>Desired Servings</p>
                                            <input 
                                                type="number"
                                                value={newServings == 0 ? '' : newServings}
                                                placeholder='Enter value'
                                                onChange={(e) => setNewServings(+e.target.value)}
                                                className={`bg-gray-50 border border-slate-200 rounded-md px-3 py-2 w-full focus-visible:outline-none focus-visible:ring-1 ${theme.attr}`}/>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className={`flex justify-center w-full ${theme.color} font-semibold py-2 rounded-md ${theme.attr3} transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-0`}>
                                        <Calculator className="text-white inline-block h-5 w-5" />
                                        <p className='text-white ml-2'>Scale Recipe</p>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Output Section */}
                        <div style={cardStyle} className="p-6 bg-white dark:bg-slate-800 border border-slate-200">
                            <div style={cardHeaderStyle} className="flex mb-6 justify-between">
                                <div className="flex items-center">
                                    <Utensils className={`h-7 w-7 mr-3 ${theme.text}`}></Utensils>
                                    <h3 className='text-2xl font-semibold dark:text-slate-800'>Scaled Recipe</h3>
                                </div>
                                <div className="flex justify-end">
                                    {ingredientsScaled && (
                                        <button
                                            onClick={() => copyToClipboard()}
                                            className={`flex items-center gap-2 text-sm text-gray-500 ${theme.attr4} transition-colors`}>
                                            <Copy className="h-4 w-4" />
                                            Copy
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className='text-left text-gray-500 mb-4'>Here is your scaled list of ingredients</p>
                            {ingredientsScaled ? (
                                <table>
                                    <tbody className='text-left dark:text-slate-800'>
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
                                <div className="flex flex-col h-full text-center py-12 text-slate-500 dark:text-slate-400 pt-30">
                                    <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Your scaled recipe will appear here</p>
                                    <p className="text-sm">Paste ingredients and click "Scale Recipe"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {!isChefMode ? (
                        <div className="text-center">
                            <ChefHat className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Activate Chef Mode to start cooking with enhanced features</p>
                        </div>
                    ) : (
                        <>
                        <div className="animate-in slide-in-from-bottom duration-500">
                            <div className="text-left mb-6">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Recipe Workspace</h1>
                                <p className="text-gray-600">
                                    Organise your ingredients and instructions for the perfect cooking experience
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Section - Ingredients */}
                            <div className={`bg-white rounded-xl shadow-lg border ${theme.attr5} p-6 lg:col-span-1`}>
                                <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <span className="mr-2">🥘</span>
                                    Ingredients
                                </h2>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Scaled ingredients
                                </span>
                                </div>

                                {/* Ingredients List */}
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                {ingredientsScaled ? (
                                    <table>
                                        <tbody className='text-left dark:text-slate-800'>
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
                                    <div className="flex flex-col h-full text-center py-12 text-slate-500 dark:text-slate-400 pt-30">
                                        <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Your scaled recipe will appear here</p>
                                        <p className="text-sm">Paste ingredients above and click "Scale Recipe"</p>
                                    </div>
                                )}
                                </div>
                            </div>

                            {/* Right Section - Instructions */}
                            <div className={`bg-white rounded-xl shadow-lg border ${theme.attr5} p-6 lg:col-span-2`}>
                                <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <span className="mr-2">📝</span>
                                    Instructions
                                </h2>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Paste from online</span>
                                </div>

                                <textarea
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="Paste your recipe instructions here from any online source...

Example:
1. Preheat oven to 350°F (175°C)
2. Mix dry ingredients in a large bowl
3. In another bowl, whisk together eggs, milk, and melted butter
4. Combine wet and dry ingredients until just mixed
5. Bake for 20-25 minutes until golden brown"
                                className={`w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-1 ${theme.attr2} focus:border-transparent`}
                                />

                                <div className="mt-4 flex justify-end items-center">

                                <button
                                    onClick={() => setInstructions("")}
                                    className="text-sm text-gray-500 hover:text-red-700 transition-colors duration-200"
                                >
                                    Clear all
                                </button>
                                </div>
                            </div>
                            </div>
                        </>
                        
                        
                    )}                    
                </main>
                {/* Footer */}
                <footer className="bg-white border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-4">
                        <div className='flex justify-center'><img src="/reciply.png" alt="Reciply Logo" className="h-[2.5rem]" /></div>
                        <span className="text-xl font-bold text-gray-800">Reciply</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                        Your ultimate cooking companion for delicious recipes and culinary adventures.
                        </p>
                        <div className="flex justify-center space-x-6 text-sm text-gray-500">
                        <a href="#" className={`transition-colors duration-200 ${theme.text} ${theme.attr4}`}>
                            About
                        </a>
                        <a href="#" className={`transition-colors duration-200 ${theme.text} ${theme.attr4}`}>
                            Privacy
                        </a>
                        <a href="#" className={`transition-colors duration-200 ${theme.text} ${theme.attr4}`}>
                            Terms
                        </a>
                        <a href="#" className={`transition-colors duration-200 ${theme.text} ${theme.attr4}`}>
                            Contact
                        </a>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400">© 2025 Reciply. All rights reserved.</p>
                        </div>
                    </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default MainPage;