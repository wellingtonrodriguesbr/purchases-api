export type SearchInput = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: string | null;
  filter?: string | null;
};

export type SearchOutput<Model> = {
  items: Model[];
  per_page: number;
  total: number;
  current_page: number;
  sort: string | null;
  sort_dir: string | null;
  filter: string | null;
};

export interface BaseRepository<Model, CreateProps> {
  create(data: CreateProps): Model;
  insert(model: Model): Promise<Model>;
  find(data: SearchInput): Promise<SearchOutput<Model>>;
  findById(id: string): Promise<Model>;
  update(id: string, model: Model): Promise<Model>;
  delete(id: string): Promise<void>;
}
