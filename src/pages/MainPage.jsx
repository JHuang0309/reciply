import { useState, useEffect } from 'react'
import { scaleIngredients } from '../utils/process_ingredients';

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
                <h1 className="text-xl font-bold mb-4">Reciply</h1>
                
                <textarea
                    rows={6}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste ingredients here..."
                    className="w-full border p-2 mb-4"
                />

                <div className="flex gap-4 mb-4">
                    <label>
                    Original Servings:
                    <input
                        type="number"
                        value={originalServings}
                        onChange={(e) => setOriginalServings(+e.target.value)}
                        className="border ml-2 w-16 "
                    />
                    </label>
                    <label>
                    new Servings:
                    <input
                        type="number"
                        value={newServings}
                        onChange={(e) => setNewServings(+e.target.value)}
                        className="border ml-2 w-16 "
                    />
                    </label>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                    <tr>
                        <th className="border px-2 py-1">Original</th>
                        <th className="border px-2 py-1">Scaled Recipe</th>
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
            </div>
        </>
    );
}

export default MainPage;