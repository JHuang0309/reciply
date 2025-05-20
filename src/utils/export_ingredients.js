export function exportIngredientsAsTextFile(ingredients) {
    const textContent = ingredients
    .map(item =>
        item.newQuantity !== null
            ? `${item.newQuantity} ${item.description || ''}`.trim()
            : item.original
    )
    .join('\n');

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'scaled-ingredients.txt';
    anchor.click();

    URL.revokeObjectURL(url);
}
