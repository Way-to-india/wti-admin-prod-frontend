'use client';

import { Button } from './button';
import { Input } from './input';
import { Plus, X } from 'lucide-react';

interface DynamicListInputProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  label?: string;
}

export function DynamicListInput({ items, onChange, placeholder, label }: DynamicListInputProps) {
  const addItem = () => {
    onChange([...items, '']);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={placeholder}
          />
          <Button type="button" variant="outline" size="icon" onClick={() => removeItem(index)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addItem} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add {label || 'Item'}
      </Button>
    </div>
  );
}
