import { useEffect, useState } from "react"
import { format, differenceInYears } from "date-fns"
import { FaMars, FaVenus } from "react-icons/fa"
import classNames from "classnames"

import { getUsers } from "../utils/apiClient"
import { loadSettings, saveSettings } from "../utils/localStorageHandler"

import { Input } from "./sharedComponents/Input"
import { Table, TableHeader, TableRow, TableCell, TableBody } from "./sharedComponents/Table"

import { ColumnSelector } from "./sharedComponents/ColumnSelector"
import { User } from "../utils/types"
import { columnsConfig, DEFAULT_COLUMNS, UNSELECTABLE_COLUMNS } from "../constants/constants"
import { Pagination } from "./Pagination"

export function UserTable() {
    const [users, setUsers] = useState<User[]>([])
    const [columns, setColumns] = useState<string[]>(DEFAULT_COLUMNS)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [debouncedSearch, setDebouncedSearch] = useState(search)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const saved = loadSettings()
        if (saved?.columns) setColumns(saved.columns)
    }, [])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500) // add debounce on search for API

        return () => clearTimeout(handler)
    }, [search])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await getUsers({ page, limit, search: debouncedSearch })
                setUsers(res.users)
                setTotalPages(Math.ceil(res.total / limit))
            } catch (err) {
                console.error(err)
                setError("Opps, something went wrong")
                setUsers([]) // if we got error we have to stash all users preloaded before
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [page, limit, debouncedSearch])

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
            case "bank":
                return user.bank.cardType
            case "ein":
                return user.ein
            case "ssn":
                return user.ssn

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
            <div className='overflow-auto max-h-[450px] rounded-t-xl'>
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
                            <TableCell className='sticky right-0 bg-gray-100 z-10 w-[48px]'>
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
                        ) : error ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + 1}
                                    className='h-[460px] text-center bg-[#F8F9F9] bg-red-100 text-red-500 font-bold'
                                >
                                    {error}
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
            <Pagination
                page={page}
                limit={limit}
                totalPages={totalPages}
                onPageChange={setPage}
                onLimitChange={(newLimit) => {
                    setLimit(newLimit)
                    setPage(1) // Reset page when limit changes
                }}
            />
        </div>
    )
}
