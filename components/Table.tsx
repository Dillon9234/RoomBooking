"use client"
import React, { useEffect, useState } from "react";

interface DataItem {
    _id: string;
    [key: string]: unknown;
}

interface GenericTableProps<T extends DataItem> {
    data: T[];
    selectedItem: T | null;
    isEditing: boolean;
    excludeFields?: string[];
    onDeleteItem: (item: T) => Promise<void>;
    setSelectedItem: (value: React.SetStateAction<T | null>) => void;
    setIsEditing: (value: React.SetStateAction<boolean>) => void;
    multipleDelete: (items: string[]) => Promise<void>;
    setIsFormOpen: (value: React.SetStateAction<boolean>) => void;
    maxItems:number;
    title?: string;
}

function GenericTable<T extends DataItem>({
    data,
    selectedItem,
    isEditing,
    excludeFields = ['_id', '__v'],
    onDeleteItem,
    setSelectedItem,
    setIsEditing,
    multipleDelete,
    setIsFormOpen,
    maxItems,
    title
}: GenericTableProps<T>): React.JSX.Element {

    const [currentitems, setCurrentitems] = useState<T[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedDeletingItems, setSelectedDeletingItems] = useState<string[]>([]);

    useEffect(() => {
        setCurrentitems(data.slice((currentPage - 1) * maxItems, currentPage * maxItems));
        setSelectedDeletingItems([]);
    }, [currentPage,data,maxItems])  

    const getFieldNames = () => {
        if (data.length === 0) return [];
        return Object.keys(data[0]).filter(key => !excludeFields.includes(key));
    };
    
    const fieldNames = getFieldNames();

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelectedDeletingItems((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const handleAllCheckboxChange = () => {
        if(currentitems.length == selectedDeletingItems.length)
            setSelectedDeletingItems([])
        else
            setSelectedDeletingItems(currentitems.map((cur) => cur._id));
    };

    useEffect(() => {
        if (selectedItem && !isEditing) {
            const handleClickOutside = (event: MouseEvent): void => {
                const dropdownElements = document.querySelectorAll('[data-dropdown-menu]');
                let clickedInsideDropdown = false;
                
                dropdownElements.forEach(element => {
                    if (element.contains(event.target as Node)) {
                        clickedInsideDropdown = true;
                    }
                });
                
                const triggerButtons = document.querySelectorAll('[data-dropdown-trigger]');
                triggerButtons.forEach(button => {
                    if (button.contains(event.target as Node)) {
                        clickedInsideDropdown = true;
                    }
                });
                
                if (!clickedInsideDropdown && !isEditing) {
                    setSelectedItem(null);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [selectedItem, isEditing, setSelectedItem]); 

    const handleEditItem = (item: T): void => {
        setSelectedItem(item);
        setIsEditing(true);
        setIsFormOpen(true);
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-semibold">{title}</div>
                <div className="flex gap-2">
                    {selectedDeletingItems.length > 0 && (
                        <button 
                            className="px-3 py-1 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors"
                            onClick={()=>{
                                setSelectedItem(null)
                                setIsEditing(false);
                                multipleDelete(selectedDeletingItems);
                            }
                            }
                        >
                            Delete Selected ({selectedDeletingItems.length})
                        </button>
                    )}
                    <button 
                        className="px-3 py-1 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => {
                            setSelectedItem(null);
                            setIsEditing(false);
                            setIsFormOpen(true);
                        }}
                    >
                        Create
                    </button>
                </div>
            </div>

            <table className="w-full border-separate border border-[#575757] rounded-lg border-spacing-0">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b border-[#575757] text-left">
                            <input type='checkbox' onChange={handleAllCheckboxChange}></input>
                        </th>
                        {fieldNames.map((fieldName, index) => (
                            <th 
                                key={index} 
                                className="border-b border-[#575757] px-4 py-2 text-left"
                            >
                                {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                            </th>
                        ))}
                        <th className="border-b border-[#575757] px-4 py-2 w-16"></th>
                    </tr>
                </thead>
                <tbody>
                    {currentitems.map((item, rowIndex) => (
                        <tr key={item._id}>
                            <td className={`px-4 py-2 border-[#575757] ${rowIndex !== data.length - 1 ? 'border-b' : ''}`}>
                                <input 
                                    type='checkbox' 
                                    value={item._id} 
                                    onChange={handleCheckboxChange}
                                    checked={selectedDeletingItems.includes(item._id)}
                                ></input>
                            </td>
                            {fieldNames.map((fieldName, colIndex) => (
                                <td 
                                    key={colIndex} 
                                    className={`px-4 py-2 border-[#575757] ${rowIndex !== data.length - 1 ? 'border-b' : ''}`}
                                >
                                    {item[fieldName] as string}
                                </td>
                            ))}
                            <td className={`px-4 py-2 border-[#575757] ${rowIndex !== data.length - 1 ? 'border-b' : ''}`}>
                                <div className="relative inline-block">
                                    <button
                                        data-dropdown-trigger
                                        className="flex items-center justify-center p-2 bg-black hover:bg-gray-900 transition-colors rounded-lg"
                                        onClick={() => setSelectedItem(selectedItem === item ? null : item)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-4 w-4 text-white"
                                        >
                                            <circle cx="12" cy="12" r="1"></circle>
                                            <circle cx="19" cy="12" r="1"></circle>
                                            <circle cx="5" cy="12" r="1"></circle>
                                        </svg>
                                    </button>
                                    {selectedItem === item && !isEditing && (
                                        <div
                                            data-dropdown-menu
                                            role="menu"
                                            className="absolute right-0 mt-2 bg-black text-gray-100 z-50 min-w-[8rem] overflow-hidden rounded-md border border-[#575757] p-1 shadow-md animate-in"
                                        >
                                        <div className="px-2 py-1.5 text-sm font-semibold">Actions</div>
                                            <div
                                                role="menuitem"
                                                className="hover:bg-gray-700 hover:text-gray-200 flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none"
                                                onClick={() => handleEditItem(item)}
                                            >
                                                Edit
                                            </div>
                                            <div
                                                role="menuitem"
                                                className="hover:bg-gray-700 hover:text-gray-200 flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none"
                                                onClick={() => onDeleteItem(item)}
                                            >
                                                Delete
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-end p-5 gap-2">
                <div>

                </div>
                <div className="flex items-center justify-center px-3 py-1">
                    Page {currentPage} of {Math.ceil(data.length/maxItems)}
                </div>
                <button className="flex items-center justify-center px-3 py-1 border border-[#575757] rounded-lg"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                        Previous
                </button>
                <button className="flex items-center justify-center px-3 py-1 border border-[#575757] rounded-lg"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(data.length/maxItems)))}>
                        Next
                </button>
            </div>
        </div>
    );
}

export default GenericTable;
