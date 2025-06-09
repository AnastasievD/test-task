export const columnsConfig = [
    { key: "fullName", label: "Full Name", stickyLeft: true, unselectable: true },
    { key: "birthday", label: "Birthday" },
    { key: "gender", label: "Gender" },
    { key: "email", label: "Email", unselectable: true },
    { key: "phone", label: "Phone" },
    { key: "username", label: "Username", unselectable: true },
    { key: "generalInfo", label: "General Info" },
    { key: "ip", label: "IP" },
    { key: "macAddress", label: "Mac IP" },
    { key: "bank", label: "Bank" },
    { key: "ein", label: "EIN" },
    { key: "ssn", label: "SSN" },
]

export const DEFAULT_COLUMNS = columnsConfig.map((col) => col.key)
export const UNSELECTABLE_COLUMNS = columnsConfig.filter((c) => c.unselectable).map((c) => c.key)

export const itemsPerPage = [10, 20, 50]
