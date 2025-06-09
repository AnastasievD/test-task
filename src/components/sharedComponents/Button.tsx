export function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...props} className={`px-3 py-1 bg-blue-500 text-white rounded ${props.className}`}>
            {children}
        </button>
    )
}
