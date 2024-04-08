import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Product } from '@prisma/client';

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

  async findAll(): Promise<Product[]> {
    return await this.prismaService.product.findMany({
      include: {
        productImages: {
          take: 1
        }
      }
    })
  }

  async findOne(id: string): Promise<Product> {
    if (!id) {
      throw new ForbiddenException("Error Id:")
    }
    const product = await this.prismaService.product.findUnique({
      where: {
        id: id
      },

    })
    if (!product) {
      throw new ForbiddenException("Error category")
    }
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = this.findOne(id)
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
