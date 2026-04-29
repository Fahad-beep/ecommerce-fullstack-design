/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Patch,
} from '@nestjs/common';
import { UpdateMetadataDto } from 'src/product/dto/update-metadata.dto';
import { ProductService } from 'src/product/product.service';

@Controller('metadata')
export class MetadataController {
  constructor(
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  @Get()
  getMetadata() {
    return this.productService.getMetadata();
  }

  @Patch()
  updateMetadata(@Body() updateDto: UpdateMetadataDto) {
    return this.productService.updateMetadata(updateDto);
  }
}
