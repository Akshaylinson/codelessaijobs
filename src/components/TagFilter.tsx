import React from 'react';
import { Tag, X, Check } from 'lucide-react';

interface TagFilterProps {
  availableTags: { tag: string; count: number }[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  availableTags,
  selectedTags,
  onToggleTag,
  onClearTags,
}) => {
  const selectedSet = new Set(selectedTags.map((t) => t.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-blue-600" />
          <span>Filter by Tags</span>
        </h3>
        {selectedTags.length > 0 && (
          <button
            type="button"
            onClick={onClearTags}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 focus:outline-hidden"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear ({selectedTags.length})</span>
          </button>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Combine multiple tags to narrow down results (matches jobs with all selected tags).
      </p>

      {/* Tags list */}
      <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
        {availableTags.map(({ tag, count }) => {
          const isSelected = selectedSet.has(tag.toLowerCase());

          return (
            <button
              key={tag}
              type="button"
              onClick={() => onToggleTag(tag)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'bg-white text-blue-600 border-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
                <span className="truncate">{tag}</span>
              </div>
              <span
                className={`ml-2 text-[11px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200/70 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        {availableTags.length === 0 && (
          <div className="text-xs text-slate-500 py-3 text-center">
            No tags available.
          </div>
        )}
      </div>
    </div>
  );
};
