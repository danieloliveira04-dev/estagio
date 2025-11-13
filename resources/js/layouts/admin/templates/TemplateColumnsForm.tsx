import { useState, useEffect } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import { TaskStatus } from "@/types";

interface Column {
  id: number;
  name: string;
  status: string;
}

interface TemplateColumnsFormProps {
  onChange: (columns: Column[]) => void;
  status: TaskStatus[];
  defaultValue?: Column[]; // 👈 valor inicial opcional
}

interface SortableColumnProps {
  column: Column;
  index: number;
  updateColumn: (id: number, field: keyof Column, value: string) => void;
  removeColumn: (id: number) => void;
  status: TaskStatus[];
}

function SortableColumn({
  column,
  index,
  updateColumn,
  removeColumn,
  status,
}: SortableColumnProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded border shadow-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
          Coluna #{index + 1}
        </div>
        <button
          {...attributes}
          {...listeners}
          type="button"
          className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-700"
          title="Arrastar para reordenar"
        >
          <GripVertical size={18} />
        </button>
      </div>

      {/* Nome */}
      <div className="grid gap-2 mb-3">
        <Label>Nome *</Label>
        <Input
          type="text"
          required
          placeholder="Nome da coluna"
          value={column.name}
          onChange={(e) => updateColumn(column.id, "name", e.target.value)}
        />
        <InputError message={""} className="mt-2" />
      </div>

      {/* Status */}
      <div className="grid gap-2 mb-3">
        <Label>Status</Label>
        <Select
          onValueChange={(value) => updateColumn(column.id, "status", value)}
          value={column.status}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status da tarefa" />
          </SelectTrigger>
          <SelectContent>
            {status.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="w-full"
        onClick={() => removeColumn(column.id)}
      >
        Remover
      </Button>
    </div>
  );
}

export default function TemplateColumnsForm({
  onChange,
  status,
  defaultValue = [],
}: TemplateColumnsFormProps) {
  const [columns, setColumns] = useState<Column[]>(defaultValue);

  useEffect(() => {
    onChange(columns);
  }, [columns]);

  useEffect(() => {
    setColumns(defaultValue);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateColumn = (id: number, field: keyof Column, value: string) => {
    setColumns((cols) =>
      cols.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const removeColumn = (id: number) => {
    setColumns((cols) => cols.filter((c) => c.id !== id));
  };

  const addColumn = () => {
    setColumns((cols) => [...cols, { id: Date.now(), name: "", status: "" }]);
  };

  return (
    <div className="div">
      <Label className="block mb-2">Colunas *</Label>

      <div className="mb-2">
        <Button type="button" size="sm" onClick={addColumn}>
          Adicionar coluna
        </Button>
      </div>

      {columns.length === 0 ? (
        <p className="text-muted-foreground text-sm italic">
          Nenhuma coluna criada
        </p>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={columns.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {columns.map((column, index) => (
                <SortableColumn
                  key={column.id ?? index}
                  column={column}
                  index={index}
                  updateColumn={updateColumn}
                  removeColumn={removeColumn}
                  status={status}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
