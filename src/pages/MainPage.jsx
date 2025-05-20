import { useState, useEffect } from 'react'
import { scaleIngredients } from '../utils/process_ingredients';
import { exportIngredientsAsTextFile } from '../utils/export_ingredients';



function MainPage() {
    const [inputText, setInputText] = useState('');
    const [originalServings, setOriginalServings] = useState(1); // original servings from recipe
    const [newServings, setNewServings] = useState(1); // new new servings
    const [multiplier, setMultiplier] = useState(1)
    const [ingredients, setIngredients] = useState([]) // final list of scaled ingredients


    useEffect(() => {
        setMultiplier(newServings / originalServings);
    }, [originalServings, newServings])

    useEffect(() => {
        setIngredients(scaleIngredients(inputText, multiplier));
    }, [inputText, multiplier])


    return (
        <>
            <div className="p-4 max-w-6xl mx-auto font-mono">
                <div className='flex justify-center'><img src="/reciply.png" alt="Reciply Logo" className="h-[6rem] mb-6" /></div>
                <h1 className="text-xl font-bold mb-4">Reciply</h1>
                
                <p className='text-left italic mb-4'>Write or paste the list of ingredients from your recipe here:</p>
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
                )}
                
            </div>
        </>
    );
}

export default MainPage;