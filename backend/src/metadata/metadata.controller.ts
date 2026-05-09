/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UpdateMetadataDto } from '../product/dto/update-metadata.dto';
import { ProductService } from '../product/product.service';
import { AdminRoute } from '../auth/auth.decorator';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('metadata')
export class MetadataController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getMetadata() {
    return this.productService.getMetadata();
  }

  @AdminRoute()
  @UseGuards(JwtAuthGuard)
  @Patch()
  updateMetadata(@Body() updateDto: UpdateMetadataDto) {
    return this.productService.updateMetadata(updateDto);
  }
}
