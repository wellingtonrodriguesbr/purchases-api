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
    });

    it("should return product when product is found", async () => {
      const product = ProductsDataBuilder({ name: "any_name" });

      sut.items.push(product);

      const result = await sut.findByName("any_name");

      expect(result).toStrictEqual(product);
    });
  });
});
