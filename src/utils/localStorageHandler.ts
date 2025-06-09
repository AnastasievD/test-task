export function saveSettings(settings: { columns: string[] }) {
    localStorage.setItem("user_table_settings", JSON.stringify(settings))
}

export function loadSettings(): { columns: string[] } | null {
    const raw = localStorage.getItem("user_table_settings")
    return raw ? JSON.parse(raw) : null
}
