import { useState, type ChangeEvent, type FormEvent } from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

interface SupplierFormProps {
  className?: string;
}

export const SupplierForm = ({ className }: SupplierFormProps) => {
  const [formData, setFormData] = useState({
    item: '',
    details: '',
    quantity: '',
    unit: 'Pcs',
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className={cn('w-full rounded-md bg-white p-5 shadow-sm', className)}>
      <h2 className="mb-5 text-xl font-semibold text-[#1C1C1C]">Send quote to suppliers</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="item"
          value={formData.item}
          onChange={handleChange}
          placeholder="What item you need?"
          className="h-10 w-full rounded-md border border-[#DEE2E7] px-3 text-base outline-none placeholder:text-[#1C1C1C]"
        />

        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
          placeholder="Type more details"
          rows={3}
          className="min-h-[73px] w-full resize-none rounded-md border border-[#DEE2E7] px-3 py-3 text-base outline-none placeholder:text-[#8B96A5]"
        />

        <div className="grid grid-cols-[1fr_110px] gap-2">
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            min="1"
            className="h-10 w-full rounded-md border border-[#DEE2E7] px-3 text-base outline-none placeholder:text-[#1C1C1C]"
          />
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="h-10 rounded-md border border-[#DEE2E7] bg-white px-3 text-base outline-none"
          >
            <option value="Pcs">Pcs</option>
            <option value="Kg">Kg</option>
            <option value="Boxes">Boxes</option>
            <option value="Liters">Liters</option>
          </select>
        </div>

        <Button type="submit" variant="primary" size="normal" className="!px-6">
          Send inquiry
        </Button>
      </form>
    </div>
  );
};
