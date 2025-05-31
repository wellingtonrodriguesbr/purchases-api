import { randomUUID } from "node:crypto";
import { CommonRepository, FindInput, FindOutput } from "./common-repository";
import { NotFoundError } from "@/common/domain/errors/not-found-error";

export type ModelProps = {
  id?: string;
  [key: string]: any;
};

export type CreateProps = {
  [key: string]: any;
};

export abstract class CommonInMemoryRepository<Model extends ModelProps>
  implements CommonRepository<Model, CreateProps>
{
  items: Model[] = [];
  sortableFields: string[] = [];
  create(data: CreateProps): Model {
    const model = {
      id: randomUUID(),
      created_at: new Date(),
      updated_at: new Date(),
      ...data,
    };

    return model as unknown as Model;
  }

  async insert(model: Model): Promise<Model> {
    this.items.push(model);
    return model;
  }

  async find(data: FindInput): Promise<FindOutput<Model>> {
    const page = data.page ?? 1;
    const per_page = data.per_page ?? 15;
    const sort = data.sort ?? null;
    const sort_dir = data.sort_dir ?? null;
    const filter = data.filter ?? null;

    const filteredItems = await this.applyFilter(this.items, filter);
    const itemsSorted = await this.applySort(filteredItems, sort, sort_dir);
    const itemsPaginated = await this.applyPaginate(itemsSorted, page, per_page);

    return {
      items: itemsPaginated,
      total: filteredItems.length,
      current_page: page,
      per_page,
      sort,
      sort_dir,
      filter,
    };
  }

  protected abstract applyFilter(items: Model[], filter: string | null): Promise<Model[]>;

  protected async applySort(items: Model[], sort: string | null, sort_dir: string | null): Promise<Model[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    return [...items].sort((a, b) => {
      if (a[sort] < b[sort]) return sort_dir === "asc" ? -1 : 1;
      if (a[sort] > b[sort]) return sort_dir === "asc" ? 1 : -1;
      return 0;
    });
  }

  protected async applyPaginate(items: Model[], page: number, per_page: number): Promise<Model[]> {
    const start = (page - 1) * per_page;
    const limit = start + per_page;

    return items.slice(start, limit);
  }

  async findById(id: string): Promise<Model> {
    return this._get(id);
  }

  async update(model: Model): Promise<Model> {
    await this._get(model.id);
    const index = this.items.findIndex(item => item.id === model.id);

    this.items[index] = model;

    return model;
  }

  async delete(id: string): Promise<void> {
    await this._get(id);
    const index = this.items.findIndex(item => item.id === id);

    this.items.splice(index, 1);
  }

  protected async _get(id: string): Promise<Model> {
    const model = this.items.find(item => item.id === id);

    if (!model) {
      throw new NotFoundError(`Model not found using ID ${id}`);
    }

    return model;
  }
}
