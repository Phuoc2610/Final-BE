import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Product } from '@prisma/client';
import { PaginationResult } from 'src/common/helper/paginationResult.interface';

@Injectable()
export class ProductService {
  constructor(
    private prismaService: PrismaService,

  ) {
  }
  async create(createProductDto: CreateProductDto): Promise<Product> {
    return await this.prismaService.product.create({
      data: {
        ...createProductDto
      }
    })
  }

  async findAll(page:number, perPage:number): Promise<PaginationResult<Product>> {
    const totalItems = await this.prismaService.product.count();
    const totalPages = Math.ceil(totalItems / perPage);
    const skip = (page - 1) * perPage;
    const take = parseInt(String(perPage), 10);

    const data= await this.prismaService.product.findMany({
      skip,
      take,
      include: {
        productImages: {
          take: 1
        }
      }
    })

    const meta = { page, perPage, totalItems, totalPages };

    return { data, meta };
  }

  async findOne(id: string): Promise<Product> {
    if (!id) {
      throw new ForbiddenException("Error Id:")
    }
    const product = await this.prismaService.product.findUnique({
      where: {
        id: id
      },
      include:{
        productImages:true,
        store:true
      }

    })
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id)
    if (!product) {
      throw new ForbiddenException("Error id")
    }
    return await this.prismaService.product.update({
      where: {
        id: id
      },
      data: {
        ...updateProductDto
      }
    })

  }

  async remove(id: string): Promise<void> {
    await this.prismaService.product.delete({
      where: {
        id: id
      }
    })

  }
}
