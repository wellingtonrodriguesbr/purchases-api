import { ConflictError } from "@/common/domain/errors/conflict-error";
import { NotFoundError } from "@/common/domain/errors/not-found-error";
import { ProductsInMemoryRepository } from "@/products/domain/repositories/products-in-memory-repository";
import { ProductsDataBuilder } from "@/products/infra/testing/helpers/products-data-builder";

describe("ProductsInMemoryRepository Unit Tests", () => {
  let sut: ProductsInMemoryRepository;

  beforeEach(() => {
    sut = new ProductsInMemoryRepository();
  });

  describe("FindByName", () => {
    it("should throw error when product is not found", async () => {
      await expect(sut.findByName("any_name")).rejects.toThrow(
        new NotFoundError("Product not found using name any_name"),
      );

      await expect(sut.findByName("any_name")).rejects.toBeInstanceOf(NotFoundError);
    });

    it("should return product when product is found", async () => {
      const product = ProductsDataBuilder({ name: "any_name" });

      sut.items.push(product);

      const result = await sut.findByName("any_name");

      expect(result).toStrictEqual(product);
    });
  });

  describe("ConflictingName", () => {
    it("should throw error when product is found", async () => {
      const product1 = ProductsDataBuilder({ name: "any_name" });

      sut.items.push(product1);

      await expect(sut.conflictingName("any_name")).rejects.toThrow(
        new ConflictError("Product with name any_name already exists"),
      );
      await expect(sut.conflictingName("any_name")).rejects.toBeInstanceOf(ConflictError);
    });

    it("should not find a product by name", async () => {
      expect.assertions(0);
      await sut.conflictingName("any_name");
    });
  });

  describe("ApplyFilter", () => {
    it("should no filter items when filter is null", async () => {
      const data = ProductsDataBuilder({});
      sut.items.push(data);

      const spyFilter = jest.spyOn(sut.items, "filter" as any);
      const result = await sut["applyFilter"](sut.items, null);
      expect(result).toStrictEqual(sut.items);
      expect(spyFilter).not.toHaveBeenCalled();
    });

    it("should filter items", async () => {
      const items = [
        ProductsDataBuilder({ name: "Product" }),
        ProductsDataBuilder({ name: "PRODUCT" }),
        ProductsDataBuilder({ name: "product" }),
        ProductsDataBuilder({ name: "test" }),
      ];

      sut.items.push(...items);

      const spyFilter = jest.spyOn(sut.items, "filter" as any);
      let result = await sut["applyFilter"](sut.items, "Product");
      expect(result).toStrictEqual([items[0], items[1], items[2]]);
      expect(spyFilter).toHaveBeenCalledTimes(1);
    });
  });

  describe("ApplySort", () => {
    it("should sort items by created_at when sort is null", async () => {
      const created_at = new Date();

      const items = [
        ProductsDataBuilder({ name: "c", created_at: created_at }),
        ProductsDataBuilder({ name: "b", created_at: new Date(created_at.getTime() + 100) }),
        ProductsDataBuilder({ name: "d", created_at: new Date(created_at.getTime() + 200) }),
      ];

      sut.items.push(...items);

      let result = await sut["applySort"](sut.items, null, null);

      expect(result).toStrictEqual([items[2], items[1], items[0]]);
    });

    it("should sort items by name field", async () => {
      const items = [
        ProductsDataBuilder({ name: "c" }),
        ProductsDataBuilder({ name: "b" }),
        ProductsDataBuilder({ name: "d" }),
      ];

      sut.items.push(...items);

      let result = await sut["applySort"](sut.items, "name", "desc");
      expect(result).toStrictEqual([items[2], items[0], items[1]]);
    });
  });
});
