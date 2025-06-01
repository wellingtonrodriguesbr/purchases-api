import { randomUUID } from "node:crypto";

import { testDataSource } from "@/common/infra/typeorm/testing/data-source";
import { NotFoundError } from "@/common/domain/errors/not-found-error";
import { TypeormProductsRepository } from "@/products/infra/typeorm/repositories/typeorm-products-repository";
import { ProductEntity } from "@/products/infra/typeorm/entities/products.entity";
import { ProductsDataBuilder } from "@/products/infra/testing/helpers/products-data-builder";

describe("[TypeormProductsRepository]: Integration Tests", () => {
  let typeormRepository: TypeormProductsRepository;

  beforeAll(async () => {
    await testDataSource.initialize();
  });

  beforeEach(async () => {
    await testDataSource.manager.query("DELETE FROM products");
    typeormRepository = new TypeormProductsRepository();
    typeormRepository.productsRepository = testDataSource.getRepository(ProductEntity);
  });

  afterAll(async () => {
    await testDataSource.destroy();
  });

  describe("[TypeormProductsRepository]: Create", () => {
    it("should be able to create a new product object", async () => {
      const data = ProductsDataBuilder({
        name: "Product 1",
      });

      const result = typeormRepository.create(data);

      expect(result).toBeInstanceOf(ProductEntity);
      expect(result.name).toStrictEqual(data.name);
    });
  });

  describe("[TypeormProductsRepository]: Insert", () => {
    it("should be able to insert a new product", async () => {
      const data = ProductsDataBuilder({});
      const product = typeormRepository.create(data);

      const result = await typeormRepository.insert(product);

      expect(result.id).toStrictEqual(product.id);
      expect(result.name).toStrictEqual(product.name);
    });
  });

  describe("[TypeormProductsRepository]: FindById", () => {
    it("should be able to find product by id", async () => {
      const data = ProductsDataBuilder({});
      const product = testDataSource.manager.create(ProductEntity, data);

      await testDataSource.manager.save(product);

      const result = await typeormRepository.findById(product.id);

      expect(result.id).toStrictEqual(product.id);
      expect(result.name).toStrictEqual(product.name);
    });

    it("should generate an error when product is not found", async () => {
      const productId = randomUUID();
      await expect(typeormRepository.findById(productId)).rejects.toThrow(
        new NotFoundError(`Product not found using ID ${productId}`),
      );
    });
  });

  // describe("Update", () => {});

  // describe("Delete", () => {});

  // describe("ApplyFilter", () => {});

  // describe("ApplySort", () => {});

  // describe("ApplyPaginate", () => {});

  // describe("Find", () => {});
});
