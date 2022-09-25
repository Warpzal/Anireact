export function useHelpers() {
    /**
     * @param {String} word
     * @returns {String}
     */
    const capitalize = (word) => {
        const arr = [...word]
        for (const [index, letter] of arr.entries()) {
            if (index == 0) arr[index] = letter.toUpperCase()
            else arr[index] = letter.toLowerCase()
        }
        return arr.join('')
    }

    return { capitalize }
}
