export interface FilterState {
  search: string;
  category: string;
  selectedTags: string[];
}

// Result counts per facet value, given the other active filters
export interface FacetCounts {
  categories: Record<string, number>;
  tags: Record<string, number>;
}
