import { CommonRepository } from "@/common/domain/repositories/common-repository";
import { ProductModel } from "@/products/domain/models/products-model";

export type ProductId = {
  id: string;
};

export type CreateProductProps = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
};

export interface ProductsRepository extends CommonRepository<ProductModel, CreateProductProps> {
  findByName(name: string): Promise<ProductModel>;
  findAllByIds(productIds: ProductId[]): Promise<ProductModel[]>;
  conflictingName(name: string): Promise<void>;
}
