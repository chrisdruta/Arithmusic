import { useRef, useState, useEffect } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TEMPLATE_CATEGORIES, getTemplatesByCategory, type TemplateCategory } from '../../lib/templates';

function TemplateDropdown({
  category,
  label,
  openCategory,
  setOpenCategory,
}: {
  category: TemplateCategory;
  label: string;
  openCategory: TemplateCategory | null;
  setOpenCategory: (c: TemplateCategory | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = openCategory === category;
  const templates = getTemplatesByCategory(category);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenCategory(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, setOpenCategory]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpenCategory(isOpen ? null : category)}
        className="calc-button flex items-center gap-1 bg-secondary px-2.5 py-1.5 text-xs font-medium text-secondary-foreground"
      >
        {label}
        <ChevronDown className={`size-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <Droppable
          droppableId={`templates-${category}`}
          isDropDisabled={true}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="absolute left-0 top-full z-50 mt-px min-w-[140px] border border-border bg-background shadow-[1px_1px_0px_#111]"
            >
              {templates.map((template, index) => (
                <Draggable
                  key={template.id}
                  draggableId={template.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={provided.draggableProps.style}
                      className={cn(
                        "flex w-full cursor-grab items-center justify-between gap-4 border-b border-border px-3 py-1.5 text-left text-xs transition-colors duration-75 last:border-b-0",
                        snapshot.isDragging
                          ? "bg-secondary text-highlight glow-lcd"
                          : "text-foreground hover:bg-secondary hover:text-highlight"
                      )}
                    >
                      <span className="font-medium">{template.title}</span>
                      <span className="font-mono text-xs text-muted-foreground">{template.expression}</span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
}

export default function TemplateDropdowns() {
  const [openCategory, setOpenCategory] = useState<TemplateCategory | null>(null);

  return (
    <div className="flex items-center gap-1">
      {TEMPLATE_CATEGORIES.map(({ key, label }) => (
        <TemplateDropdown
          key={key}
          category={key}
          label={label}
          openCategory={openCategory}
          setOpenCategory={setOpenCategory}
        />
      ))}
    </div>
  );
}
