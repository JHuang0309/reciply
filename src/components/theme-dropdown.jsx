import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
const themes = [
  { color: "bg-red-500", attr1: "from-red-50", attr2: "focus-visible:ring-red-500", attr3: "hover:bg-red-400", attr4: "hover:text-red-500", attr5: "border-red-200", text: "text-red-500", value: "0" },
  { color: "bg-orange-500", attr1: "from-orange-50", attr2: "focus-visible:ring-orange-500", attr3: "hover:bg-orange-400", attr4: "hover:text-orange-500", attr5: "border-orange-200", text: "text-orange-500", value: "1" },
  { color: "bg-yellow-500", attr1: "from-yellow-50", attr2: "focus-visible:ring-yellow-500", attr3: "hover:bg-yellow-400", attr4: "hover:text-yellow-500", attr5: "border-yellow-200", text: "text-yellow-500", value: "2" },
  { color: "bg-green-500", attr1: "from-green-50", attr2: "focus-visible:ring-green-500", attr3: "hover:bg-green-400", attr4: "hover:text-green-500", attr5: "border-green-200", text: "text-green-500", value: "3" },
  { color: "bg-blue-500", attr1: "from-blue-50", attr2: "focus-visible:ring-blue-500", attr3: "hover:bg-blue-400", attr4: "hover:text-blue-500", attr5: "border-blue-200", text: "text-blue-500", value: "4" },
  { color: "bg-indigo-500", attr1: "from-indigo-50", attr2: "focus-visible:ring-indigo-500", attr3: "hover:bg-indigo-400", attr4: "hover:text-indigo-500", attr5: "border-indigo-200", text: "text-indigo-500", value: "5" },
  { color: "bg-purple-500", attr1: "from-purple-50", attr2: "focus-visible:ring-purple-500", attr3: "hover:bg-purple-400", attr4: "hover:text-purple-500", attr5: "border-purple-200", text: "text-purple-500", value: "6" },
  { color: "bg-pink-500", attr1: "from-pink-50", attr2: "focus-visible:ring-pink-500", attr3: "hover:bg-pink-400", attr4: "hover:text-pink-500", attr5: "border-pink-200", text: "text-pink-500", value: "7" },
]

export default function ThemeDropdown({ currentTheme, setTheme }) {
    const [currTheme, setCurrTheme] = useState(currentTheme)
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(e) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false)
        }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleThemeSelect = (theme) => {
        setCurrTheme(theme)
        setTheme(theme.value)
        setIsOpen(false)
    }

    return (
        <div className="flex items-center pr-6">
            <div className="relative" ref={dropdownRef}>
                {/* Circular Theme Button */}
                <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    relative w-10 h-10 rounded-full border-2 border-gray-400
                    ${currTheme.color}
                    hover:border-gray-500 hover:scale-105
                    transition-all duration-200 ease-in-out
                    shadow-lg hover:shadow-xl
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
                `}
                >
                <ChevronDown
                    className={`
                    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    w-3 h-3 text-white drop-shadow-sm
                    transition-transform duration-200
                    ${isOpen ? "rotate-180" : ""}
                    `}
                />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                <div className="absolute top-0 right-0 mt-12 z-10">
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-max">
                    <div className="grid grid-cols-4 gap-2">
                        {themes.map((theme) => (
                        <button
                            key={theme.value}
                            onClick={() => handleThemeSelect(theme)}
                            className={`
                            w-8 h-8 rounded-full border-2
                            ${theme.color}
                            ${
                                currentTheme.value === theme.value
                                ? "border-gray-800 ring-2 ring-gray-300"
                                : "border-gray-300 hover:border-gray-500"
                            }
                            hover:scale-110 transition-all duration-150 ease-in-out
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
                            `}
                        />
                        ))}
                    </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    )

}