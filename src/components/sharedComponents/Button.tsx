export function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...props} className={`rounded ${props.className}`}>
            {children}
        </button>
    )
}
