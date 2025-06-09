import { FaSearch } from "react-icons/fa"

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className='bg-white z-10 mb-4 relative'>
            <span className='absolute inset-y-0 left-3 flex items-center text-gray-400'>
                <FaSearch />
            </span>
            <input {...props} className={`border rounded px-2 py-1 ${props.className}`} />
        </div>
    )
}
