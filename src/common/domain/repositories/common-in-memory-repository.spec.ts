import { randomUUID } from "node:crypto";
import { CommonInMemoryRepository } from "./common-in-memory-repository";
import { NotFoundError } from "@/common/domain/errors/not-found-error";

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

  describe("Create", () => {
    it("should create a new model", async () => {
      const model = sut.create(props);
      expect(model).toEqual(expect.objectContaining(model));
    });
  });

  describe("Insert", () => {
    it("should insert a new model", async () => {
      const model = await sut.insert(props);
      expect(model).toEqual(expect.objectContaining(model));
    });
  });

  describe("FindById", () => {
    it("should find by id a model", async () => {
      const data = await sut.insert(model);
      const result = await sut.findById(data.id);
      expect(model).toEqual(expect.objectContaining(result));
    });

    it("should throw an error when model not found", async () => {
      await expect(sut.findById("fake-id")).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });
  });

  describe("Update", () => {
    it("should update a model", async () => {
      const data = await sut.insert(model);
      const result = await sut.update({
        ...data,
        name: "Product 1 Updated",
        price: 20.99,
      });
      expect(result.name).toEqual("Product 1 Updated");
      expect(result.price).toEqual(20.99);
    });

    it("should not update a model when not found", async () => {
      const model = {
        id: "fake-id",
        name: "Product 1 Updated",
        price: 20.99,
        quantity: 10,
        created_at,
        updated_at,
      };
      await expect(sut.update(model)).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("Delete", () => {
    it("should delete a model", async () => {
      const data = await sut.insert(model);
      await sut.delete(data.id);
      expect(sut.items).toHaveLength(0);
    });

    it("should not delete a model when not found", async () => {
      await expect(sut.delete("fake-id")).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("ApplyFilter", () => {
    it("should no filter items when filter is null", async () => {
      const items = [model];
      const spyFilter = jest.spyOn(items, "filter" as any);
      const result = await sut["applyFilter"](items, null);
      expect(result).toStrictEqual(items);
      expect(spyFilter).not.toHaveBeenCalled();
    });

    it("should filter items", async () => {
      const items = [
        {
          id: randomUUID(),
          name: "Product 1",
          price: 10.99,
          quantity: 10,
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          name: "PRODUCT 2",
          price: 20.99,
          quantity: 20,
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          name: "test",
          price: 1.99,
          quantity: 1,
          created_at,
          updated_at,
        },
      ];
      const spyFilter = jest.spyOn(items, "filter" as any);
      let result = await sut["applyFilter"](items, "Product");
      expect(result).toStrictEqual([items[0], items[1]]);
      expect(spyFilter).toHaveBeenCalledTimes(1);

      result = await sut["applyFilter"](items, "PRODUCT");
      expect(result).toStrictEqual([items[0], items[1]]);
      expect(spyFilter).toHaveBeenCalledTimes(2);

      result = await sut["applyFilter"](items, "test");
      expect(result).toStrictEqual([items[2]]);
      expect(spyFilter).toHaveBeenCalledTimes(3);

      result = await sut["applyFilter"](items, "no-filter");
      expect(result).toHaveLength(0);
      expect(spyFilter).toHaveBeenCalledTimes(4);
    });
  });

  describe("ApplySort", () => {
    it("should no sort items when sort is null or not in sortable fields", async () => {
      const items = [model];
      const spySort = jest.spyOn(items, "sort" as any);
      let result = await sut["applySort"](items, null, null);
      expect(result).toStrictEqual(items);
      expect(spySort).not.toHaveBeenCalled();

      result = await sut["applySort"](items, "id", "asc");
      expect(result).toStrictEqual(items);
      expect(spySort).not.toHaveBeenCalled();
    });

    it("should sort items", async () => {
      const items = [
        {
          id: randomUUID(),
          name: "ATest",
          price: 10.99,
          quantity: 10,
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          name: "BTest",
          price: 20.99,
          quantity: 20,
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          name: "CTest",
          price: 1.99,
          quantity: 1,
          created_at,
          updated_at,
        },
      ];
      let result = await sut["applySort"](items, "name", "asc");
      expect(result).toStrictEqual([items[0], items[1], items[2]]);

      result = await sut["applySort"](items, "name", "desc");
      expect(result).toStrictEqual([items[2], items[1], items[0]]);
    });
  });

  describe("ApplyPaginate", () => {
    it("should paginate items", async () => {
      const items = [
        {
          id: randomUUID(),
          name: "Product 1",
          price: 10.99,
          quantity: 10,
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          name: "Product 2",
          price: 20.99,
          quantity: 20,
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          name: "Product 3",
          price: 1.99,
          quantity: 1,
          created_at,
          updated_at,
        },
      ];
      let result = await sut["applyPaginate"](items, 1, 2);
      expect(result).toStrictEqual([items[0], items[1]]);

      result = await sut["applyPaginate"](items, 2, 2);
      expect(result).toStrictEqual([items[2]]);
    });
  });
});
