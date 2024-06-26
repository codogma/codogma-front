import * as React from "react";
import {useState} from "react";
import "../../app/globals.css";
import {MoreHorizontal, Tags, Trash} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ListItem = {
    id: number;
    value: string;
};

type DropdownComboboxProps<T extends ListItem> = {
    items: T[];
    defaultItems?: T[];
    onAddItem: (item: T) => void;
    onRemoveItem: (itemId: number) => void;
    onRemoveAllItems: () => void
    menuSubTriggerText?: string
    searchPlaceholder?: string
    inputText?: string
    notFoundText?: string
};

export const DropdownCombobox = <T extends ListItem>({
                                                         items,
                                                         defaultItems = [],
                                                         menuSubTriggerText = "Выбрать пункт",
                                                         searchPlaceholder = "Filter label...",
                                                         inputText = "Добавьте пункты или элементы",
                                                         notFoundText = "Пункт не найден.",
                                                         onAddItem, onRemoveItem, onRemoveAllItems,
                                                     }: DropdownComboboxProps<T>) => {
    const [selectedItems, setSelectedItems] = useState<T[]>([...defaultItems]);
    const [open, setOpen] = useState(false);

    const handleAddItem = (selectedItem: T): void => {
        if (selectedItem && !selectedItems.find((item) => item.id === selectedItem.id)) {
            setSelectedItems([...selectedItems, selectedItem]);
            onAddItem(selectedItem);
        }
    };

    const handleRemoveItem = (itemId: number): void => {
        const updatedItems = selectedItems.filter((item) => item.id !== itemId);
        setSelectedItems(updatedItems);
        onRemoveItem(itemId);
    };

    const handleRemoveAllItems = (): void => {
        setSelectedItems([]);
        onRemoveAllItems();
    };

    return (
        <div
            className="flex w-full flex-col items-left justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center"
        >
            <p className="flex items-center text-sm font-medium leading-none flex-wrap">
                {selectedItems.length > 0 &&
                    selectedItems.map((item) => (
                        <span
                            key={item.id}
                            className="relative mr-2 mb-1 mt-1 rounded-lg bg-gray-200 px-2 py-1 text-xl text-primary flex flex-row items-center"
                        >
                    {item.value}
                            <Trash
                                className="ml-2 h-4 w-4 text-red-600"
                                onClick={() => handleRemoveItem(item.id)}
                            />
                  </span>
                    ))}
                {selectedItems.length === 0 && (
                    <span className="text-muted-foreground">{inputText}</span>
                )}
            </p>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <MoreHorizontal/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Действия</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Tags className="mr-2 h-4 w-4"/>
                                {menuSubTriggerText}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="p-0">
                                <Command>
                                    <CommandInput placeholder={searchPlaceholder} autoFocus={true}/>
                                    <CommandList>
                                        <CommandEmpty>{notFoundText}</CommandEmpty>
                                        <CommandList>
                                            {items.map((item) => (
                                                <CommandItem
                                                    key={item.id}
                                                    value={item.value}
                                                    onSelect={() => {
                                                        handleAddItem(item);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {item.value}
                                                </CommandItem>
                                            ))}
                                        </CommandList>
                                    </CommandList>
                                </Command>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className="text-red-600" onClick={handleRemoveAllItems}>
                            <Trash className="mr-2 h-4 w-4"/>
                            Удалить все
                            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};