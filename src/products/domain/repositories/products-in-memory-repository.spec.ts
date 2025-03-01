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

      await expect(sut.findByName("any_name")).rejects.toBeInstanceOf(
        NotFoundError,
      );
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
      await expect(sut.conflictingName("any_name")).rejects.toBeInstanceOf(
        ConflictError,
      );
    });

    it("should not find a product by name", async () => {
      expect.assertions(0);
      await sut.conflictingName("any_name");
    });
  });
});
