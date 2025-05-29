import { useState } from "react"
import { ChefHat, Flame } from "lucide-react"

export default function ChefModeToggle({ setChefMode }) {
    const [isChefMode, setIsChefMode] = useState(false)

    const toggleChefMode = () => {
        setIsChefMode(!isChefMode)
        setChefMode(!isChefMode)
    }

    return (
        <>
            {isChefMode ? (
                <p className="text-sm text-orange-600 font-medium">Chef Mode Active 🔥</p>
            ) : (
                <p className="text-sm text-gray-400">Chef Mode Inactive</p>
            )}
            <button
                onClick={toggleChefMode}
                className={`
                relative inline-flex items-center w-14 h-7 rounded-full
                transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-offset-1
                ${
                    isChefMode
                    ? "bg-gradient-to-r from-orange-500 to-red-500 focus:ring-orange-300"
                    : "bg-gray-300 focus:ring-gray-300"
                }
                shadow-lg hover:shadow-xl
                `}
                aria-label={`Chef mode is ${isChefMode ? "on" : "off"}`}
            >
                {/* Toggle Circle */}
                <div
                className={`
                    absolute top-0.4 w-5 h-5 bg-white rounded-full
                    shadow-md transition-all duration-300 ease-in-out
                    flex items-center justify-center
                    ${isChefMode ? "translate-x-8" : "translate-x-1"}
                `}
                >
                {isChefMode ? (
                    <Flame className="w-3 h-3 text-orange-500" />
                ) : (
                    <ChefHat className="w-3 h-3 text-gray-500" />
                )}
                </div>

                {/* Background Icons */}
                <div className="absolute inset-1 flex items-center justify-between px-1">
                <ChefHat
                    className={`
                    w-3 h-3 transition-opacity duration-300
                    ${isChefMode ? "opacity-30 text-white" : "opacity-0"}
                    `}
                />
                <Flame
                    className={`
                    w-3 h-3 transition-opacity duration-300
                    ${isChefMode ? "opacity-30 text-white" : "opacity-0"}
                    `}
                />
                </div>
            </button>
        </>
        
    )
}