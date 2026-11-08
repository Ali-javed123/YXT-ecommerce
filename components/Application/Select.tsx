"use client";

import * as React from "react";
import { useState } from "react";
import { CheckIcon, ChevronDown, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  options: SelectOption[];
  selected: string | string[] | null;
  setSelected: (value: any) => void;
  placeholder?: string;
  isMulti?: boolean;
  invalid?: boolean;
};

function Select({
  options,
  selected,
  setSelected,
  placeholder = "Select options",
  isMulti = false,
  invalid = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);

  const hasValue = Array.isArray(selected) ? selected.length > 0 : !!selected;

  const handleSelect = (option: SelectOption) => {
    if (isMulti) {
      const current = Array.isArray(selected) ? selected : [];
      if (current.includes(option.value)) {
        setSelected(current.filter((s) => s !== option.value));
      } else {
        setSelected([...current, option.value]);
      }
    } else {
      setSelected(option.value);
      setOpen(false);
    }
  };


  const handleRemove = (value: string) => {
    if (Array.isArray(selected)) {
      setSelected(selected.filter((s) => s !== value));
    }
  };

  const handleClearAll = () => {
    setSelected(isMulti ? [] : "");
  };

  const isChecked = (value: string) =>
    Array.isArray(selected) ? selected.includes(value) : selected === value;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={invalid}
            className="w-full justify-between font-normal dark:bg-card h-auto min-h-9"
          />
        }
      >
        <div className="flex flex-wrap gap-1 text-left">
          {Array.isArray(selected) && selected.length > 0 ? (
            selected.map((value) => {
              const option = options.find((o) => o.value === value);
              return (
                <Badge key={value} variant="secondary" className="gap-1">
                  {option?.label ?? value}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(value);
                    }}
                  >
                    <XIcon className="h-3 w-3 cursor-pointer" />
                  </span>
                </Badge>
              );
            })
          ) : typeof selected === "string" && selected ? (
            options.find((o) => o.value === selected)?.label ?? placeholder
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasValue && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
            >
              <XIcon className="h-4 w-4 shrink-0 opacity-50" />
            </span>
          )}
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-(--anchor-width) min-w-48 p-0"
      >
        <Command>
          <CommandInput placeholder="Search options..." />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option)}
                >
                  {option.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      isChecked(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default Select;