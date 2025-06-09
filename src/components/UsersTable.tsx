import { useEffect, useState } from "react"
import { format, differenceInYears } from "date-fns"
import { getUsers } from "../utils/apiClient"
import { loadSettings, saveSettings } from "../utils/localStorageHandler"
import classNames from "classnames"
import { Button } from "./sharedComponents/Button"
import { Input } from "./sharedComponents/Input"
import { Table, TableHeader, TableRow, TableCell, TableBody } from "./sharedComponents/Table"
import { FaMars, FaSearch, FaVenus } from "react-icons/fa"
import { ColumnSelector } from "./sharedComponents/ColumnSelector"
import { User } from "../utils/types"

const columnsConfig = [
    { key: "fullName", label: "Full Name", stickyLeft: true, unselectable: true },
    { key: "birthday", label: "Birthday" },
    { key: "gender", label: "Gender" },
    { key: "email", label: "Email", unselectable: true },
    { key: "phone", label: "Phone" },
    { key: "username", label: "Username", unselectable: true },
    { key: "generalInfo", label: "General Info" },
    { key: "ip", label: "IP" },
    { key: "macAddress", label: "Mac IP" },
]

const DEFAULT_COLUMNS = columnsConfig.map((col) => col.key)
const UNSELECTABLE_COLUMNS = columnsConfig.filter((c) => c.unselectable).map((c) => c.key)

export function UserTable() {
    const [users, setUsers] = useState<User[]>([])
    const [columns, setColumns] = useState<string[]>(DEFAULT_COLUMNS)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const saved = loadSettings()
        if (saved?.columns) setColumns(saved.columns)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await getUsers({ page, limit, search })
            setUsers(res.users)
            setTotalPages(Math.ceil(res.total / limit))
            setLoading(false)
        }
        fetchData()
    }, [page, limit, search])

    const handleColumnChange = (newCols: string[]) => {
        setColumns(newCols)
        saveSettings({ columns: newCols })
    }

    const formatBirthday = (dateStr: string) => {
        const date = new Date(dateStr)
        const formatted = format(date, "dd.MM.yyyy")
        const age = differenceInYears(new Date(), date)
        return `${formatted} (${age} years old)`
    }

    const renderGeneralInfo = (user: User) => {
        return `Bloodgroup "${user.bloodGroup}";Height ${Math.round(user.height)};Weight ${Math.round(user.weight)};Hair color ${
            user.hair.color
        }`
    }

    const renderCell = (user: User, key: string) => {
        switch (key) {
            case "fullName":
                return (
                    <div className='flex items-center gap-2'>
                        <img src={user.image} alt='avatar' className='w-6 h-6 rounded-full' />
                        {user.firstName} {user.lastName}
                    </div>
                )
            case "birthday":
                return formatBirthday(user.birthDate)
            case "gender":
                return (
                    <>
                        {user.gender === "male" ? <FaMars /> : <FaVenus />} {user.gender}
                    </>
                )
            case "email":
                return user.email
            case "phone":
                return user.phone
            case "username":
                return user.username
            case "generalInfo":
                return renderGeneralInfo(user)
            case "ip":
                return user.ip
            case "macAddress":
                return user.macAddress
            default:
                return null
        }
    }

    return (
        <div className='p-4 overflow-auto font-sans font-normal'>
            <Input
                placeholder='Search...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full bg-[#EAEDF0] border-[#EAEDF0] pl-9'
            />
            <div className='overflow-auto max-h-[500px] rounded-t-xl'>
                <Table className='w-full table-auto min-w-[1024px]'>
                    <TableHeader>
                        <TableRow className='h-[28px] sticky top-0 bg-gray-100 h-[28px] z-10'>
                            {columnsConfig
                                .filter((col) => columns.includes(col.key))
                                .map((col) => (
                                    <TableCell
                                        key={col.key}
                                        className={classNames(
                                            "font-bold uppercase text-[10px] text-gray-500",
                                            col.stickyLeft && "sticky left-0 bg-gray-100 z-10"
                                        )}
                                    >
                                        {col.label}
                                    </TableCell>
                                ))}
                            <TableCell className='sticky right-0 bg-gray-100 z-10'>
                                <ColumnSelector
                                    columns={columns}
                                    onChange={handleColumnChange}
                                    defaultColumns={DEFAULT_COLUMNS}
                                    disabledOptions={UNSELECTABLE_COLUMNS}
                                />
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className='h-[460px] text-center bg-[#F8F9F9]'>
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className='h-[460px] text-center bg-[#F8F9F9] font-bold size-xl'>
                                    Not Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    {columnsConfig
                                        .filter((col) => columns.includes(col.key))
                                        .map((col) => (
                                            <TableCell
                                                key={col.key}
                                                className={classNames(
                                                    col.stickyLeft && "sticky left-0 bg-white z-5",
                                                    col.key === "gender" && "flex items-center gap-1 border-0 h-[50px]"
                                                )}
                                            >
                                                {renderCell(user, col.key)}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className='flex justify-between items-center mt-4'>
                <div className='flex items-center gap-2'>
                    <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className='border rounded px-2 py-1'>
                        {[10, 20, 50].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                    <span className='font-bold text-xs text-gray-500'>ITEMS PER PAGE</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-700'>
                    <span>
                        {(page - 1) * limit + 1} - {Math.min(page * limit, totalPages * limit)} of {totalPages * limit}
                    </span>
                    <Button className={page === 1 ? "text-gray-200" : "text-gray-700"} onClick={() => setPage(1)} disabled={page === 1}>
                        {"<<"}
                    </Button>
                    <Button className={page === 1 ? "text-gray-200" : "text-gray-700"} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                        {"<"}
                    </Button>
                    <Input
                        type='number'
                        value={page}
                        min={1}
                        max={totalPages}
                        onChange={(e) => setPage(Math.min(Number(e.target.value), totalPages))}
                        className='w-16'
                    />
                    <Button
                        className={page === totalPages ? "text-gray-200" : "text-gray-700"}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        {">"}
                    </Button>
                    <Button
                        className={page === totalPages ? "text-gray-200" : "text-gray-700"}
                        onClick={() => setPage(totalPages)}
                        disabled={page === totalPages}
                    >
                        {">>"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
