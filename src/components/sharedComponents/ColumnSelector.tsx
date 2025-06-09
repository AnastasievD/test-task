import * as Popover from "@radix-ui/react-popover";
import { FaSearch, FaCheck, FaCog } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";

interface ColumnSelectorProps {
    columns: string[];
    onChange: (columns: string[]) => void;
    defaultColumns: string[];
    disabledOptions?: string[];
  }
  
  export function ColumnSelector({
    columns,
    onChange,
    defaultColumns,
    disabledOptions = [],
  }: ColumnSelectorProps) {
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState<string[]>(defaultColumns);
  
    useEffect(() => {
      const result = defaultColumns.filter(c =>
        c.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(result);
    }, [search, defaultColumns]);
  
    const toggle = (col: string) => {
      if (disabledOptions.includes(col)) return;
      if (columns.includes(col)) {
        onChange(columns.filter(c => c !== col));
      } else {
        onChange([...columns, col]);
      }
    };
  
    return (
      <Popover.Root>
        <Popover.Trigger asChild>
          <div className="sticky right-0 top-0 z-30 flex items-center justify-center">
            <Button
              className="p-0"
            >
              <FaCog color="#687684" className="rounded-full hover:bg-gray-200 p-[4px] w-[26px] h-[26px]"/>
            </Button>
          </div>
        </Popover.Trigger>
        <Popover.Portal>
        <Popover.Content
          className="w-64 rounded-xl border bg-white shadow-xl p-2 z-50"
          sideOffset={8}
          align="end"
        >
          <div className="flex items-center gap-2 p-2">
            <FaSearch className="text-gray-500" />
            <Input
              className="w-full text-sm"
              placeholder="Search columns"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-auto px-2 py-1">
            {filtered.map((col) => (
              <div
                key={col}
                onClick={() => toggle(col)}
                className={`flex items-center justify-between px-2 py-1 text-sm rounded cursor-pointer hover:bg-gray-100
                  ${disabledOptions.includes(col) ? "text-gray-400 cursor-not-allowed" : "text-gray-800"}`}
              >
                <span className="capitalize">{col}</span>
                {columns.includes(col) && <FaCheck color="#1a559f"/>}
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
      </Popover.Root>
    );
  }