import { Controller, Get, Post, Put, Delete, Body, Param, Req } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  findAll(@Req() req) {
    return this.productService.findAll(req.user.tenantId);
  }

  @Post()
  create(@Req() req, @Body() body) {
    return this.productService.create(req.user.tenantId, body);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() body) {
    return this.productService.update(req.user.tenantId, +id, body);
  }

  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.productService.delete(req.user.tenantId, +id);
  }
}
