import { In, Repository } from "typeorm";
import { dataSource } from "@/common/infra/typeorm";

import { ProductModel } from "@/products/domain/models/products-model";
import { ProductEntity } from "@/products/infra/typeorm/entities/products.entity";
import { FindInput, FindOutput } from "@/common/domain/repositories/common-repository";
import { CreateProductProps, ProductId, ProductsRepository } from "@/products/domain/repositories/products-repository";
import { NotFoundError } from "@/common/domain/errors/not-found-error";

export class TypeormProductsRepository implements ProductsRepository {
  sortableFields: string[] = ["name", "created_at"];
  productsRepository: Repository<ProductEntity>;

  constructor() {
    this.productsRepository = dataSource.getRepository(ProductEntity);
  }

  create(data: CreateProductProps): ProductModel {
    return this.productsRepository.create(data);
  }

  async insert(model: ProductModel): Promise<ProductModel> {
    return this.productsRepository.save(model);
  }

  find(data: FindInput): Promise<FindOutput<ProductModel>> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<ProductModel> {
    return this._get(id);
  }

  async update(model: ProductModel): Promise<ProductModel> {
    await this._get(model.id);

    await this.productsRepository.update(model.id, model);

    return model;
  }

  async delete(id: string): Promise<void> {
    await this._get(id);
    await this.productsRepository.delete({ id });
  }

  async findByName(name: string): Promise<ProductModel> {
    const product = await this.productsRepository.findOneBy({ name });

    return product;
  }

  async findAllByIds(productIds: ProductId[]): Promise<ProductModel[]> {
    const products = await this.productsRepository.findBy({
      id: In(productIds.map(id => id.id)),
    });

    return products;
  }

  async conflictingName(name: string): Promise<void> {
    await this.findByName(name);
  }

  protected async _get(id: string): Promise<ProductModel> {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundError(`Product not found using ID ${id}`);
    }

    return product;
  }
}
