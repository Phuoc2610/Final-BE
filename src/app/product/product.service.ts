import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Product } from '@prisma/client';
import { PaginationResult } from 'src/common/helper/paginationResult.interface';
import { OptionEnum } from 'src/common/enums/option.enum';

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

  async findAll(page:number, perPage:number, name:string, categoryId:string, storeId:string): Promise<PaginationResult<Product>> {
    console.log(name)
    const totalItems = await this.prismaService.product.count();
    const totalPages = Math.ceil(totalItems / perPage);
    const skip = (page - 1) * perPage;
    const take = parseInt(String(perPage), 10);

    const data= await this.prismaService.product.findMany({
      where: {
        AND: [
          {
            name: {
              contains: name,
              mode: 'insensitive' // This sets the search to be case-insensitive
            }
          },
          {
            categoryid: categoryId // Assuming 'categoryid' is the correct field name
          },
          {
            storeId: storeId
          }
        ]
      },
      // orderBy:[
      //   {
      //     price: orderBy || 'asc'
      //   }
      // ],
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
        store:true,
        feedback:{
          include:{
            user:
            {
              include:{
                profile:true
              }
            }
          }
        },
        
        
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
