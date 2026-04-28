import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MetadataDocument = HydratedDocument<StoreMetadata>;

@Schema({ timestamps: true })
export class StoreMetadata {
  @Prop({ type: [String], default: [] })
  categories!: string[];
  @Prop({ type: [String], default: [] })
  brands!: string[];
  @Prop({ type: [String], default: [] })
  conditions!: string[];
  @Prop({ type: [String], default: [] })
  features!: string[];
}

export const MetadataSchema = SchemaFactory.createForClass(StoreMetadata);
