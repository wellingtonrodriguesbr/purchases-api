import { CommonRepository, FindInput, FindOutput } from "./common-repository";

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
    throw new Error("Method not implemented.");
  }
  insert(model: Model): Promise<Model> {
    throw new Error("Method not implemented.");
  }
  find(data: FindInput): Promise<FindOutput<Model>> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<Model> {
    throw new Error("Method not implemented.");
  }
  update(id: string, model: Model): Promise<Model> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
