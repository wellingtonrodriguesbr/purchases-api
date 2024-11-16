import { randomUUID } from "node:crypto";
import { CommonInMemoryRepository } from "./common-in-memory-repository";

type StubModelProps = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
};

export class StubInMemoryRepository extends CommonInMemoryRepository<StubModelProps> {
  constructor() {
    super();
    this.sortableFields = ["name"];
  }
  protected async applyFilter(
    items: StubModelProps[],
    filter: string | null,
  ): Promise<StubModelProps[]> {
    if (!filter) {
      return items;
    }

    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }
}

describe("CommonInMemoryRepository Unit Tests", () => {
  let sut: StubInMemoryRepository;
  let model: StubModelProps;
  let props: any;
  let created_at: Date;
  let updated_at: Date;

  beforeEach(() => {
    sut = new StubInMemoryRepository();
    created_at = new Date();
    updated_at = new Date();
    props = {
      name: "Product 1",
      price: 10.99,
      quantity: 10,
    };
    model = {
      id: randomUUID(),
      created_at,
      updated_at,
      ...props,
    };
  });

  it("should create a new model", async () => {
    const model = sut.create(props);
    expect(model).toEqual(expect.objectContaining(model));
  });

  it("should insert a new model", async () => {
    const model = await sut.insert(props);
    expect(model).toEqual(expect.objectContaining(model));
  });
});
