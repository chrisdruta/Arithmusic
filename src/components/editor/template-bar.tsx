import { useRef, useState, useEffect } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { ChevronDown } from 'lucide-react';
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
              className="absolute left-0 top-full z-50 mt-px min-w-[140px] border border-[#444] bg-[#1a1a1e] shadow-[2px_2px_0px_#111]"
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
                      className={`flex w-full cursor-grab items-center justify-between gap-4 border-b border-[#2a2a2e] px-3 py-1.5 text-left text-xs last:border-b-0 ${
                        snapshot.isDragging
                          ? 'bg-[#2a2a2c] text-[#33ff66] shadow-[0_0_8px_rgba(51,255,102,0.3)]'
                          : 'text-[#c8c8c0] hover:bg-[#2a2a2c] hover:text-[#33ff66]'
                      }`}
                    >
                      <span className="font-medium">{template.title}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{template.expression}</span>
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
